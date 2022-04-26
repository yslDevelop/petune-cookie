import "./App.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Dropzone from "react-dropzone-uploader";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import {
  collection,
  addDoc,
  getDocs,
  limit,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Player } from "video-react";

function App({ db, storage }) {
  const [hideTodayButton, sethideTodayButton] = useState(false);
  const [isAdding, setisAdding] = useState(false);
  const [uploader, setuploader] = useState("");
  const [files, setFiles] = useState([]);
  const [fortune, setfortune] = useState("");
  const [content, setcontent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndexVertical, setloadingIndexVertical] = useState(0);
  const [loadingTextListIndex, setloadingTextListIndex] = useState(1);
  const [loadingTextList, setloadingTextList] = useState([
    `두구두구두구두구`,
    `언제까지 어깨 춤을 추게 할거야~
내 어깨를 봐~ 아 탈골 됐잖아~
아 탈골 탈골 탈골탈골타골~`,
  ]);
  Modal.setAppElement("#root");

  useEffect(() => {
    if (isLoading) {
      // setloadingTextListIndex(0);
      changeloadingTextIndex();
    }
  }, [isLoading, changeloadingTextIndex]);

  function changeloadingTextIndex() {
    setTimeout(() => {
      if (
        loadingTextListIndex <
        loadingTextList[loadingIndexVertical].length - 1
      ) {
        setloadingTextListIndex(loadingTextListIndex + 1);
      } else {
        setloadingTextListIndex(1);
      }
    }, 50);
  }

  async function loadRandomFortune() {
    sethideTodayButton(true);
    setIsLoading(true);
    setTimeout(() => {
      setloadingIndexVertical(1);
    }, 3000);
    let rand = Math.random();
    let fortuneRef = collection(db, "Fortunes");
    let q = query(
      fortuneRef,
      where("randomId", "<=", rand),
      orderBy("randomId", "desc"),
      limit(1)
    );
    let querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      getDownloadURL(ref(storage, `images/${doc.data().fileName}`)).then(
        (url) => {
          let img = new Image();
          img.src = url;
          setcontent(
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: 16, fontWeight: "bold" }}>
                {doc.data().uploader}
              </p>
              <img
                style={{
                  width: "65%",
                  height: "65%",
                  maxWidth: 700,
                  maxHeight: 700,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
                src={img.src}
              />
              <p style={{ fontSize: 20, fontWeight: "bold" }}>
                {doc.data().fortune}
              </p>
              <button
                onClick={() => {
                  sethideTodayButton(false);
                  setloadingIndexVertical(0);
                }}
              >
                돌아가기
              </button>
            </div>
          );
          setTimeout(() => {
            setIsLoading(false);
            setloadingTextListIndex(0);
          }, 3000);
        }
      );
    });
  }

  async function addFortune(fileName) {
    try {
      const docRef = await addDoc(collection(db, "Fortunes"), {
        // file: files[0],
        fortune: fortune,
        randomId: Math.random(),
        fileName: fileName,
        uploader: uploader,
      });
      setisAdding(false);
      setIsLoading(false);
      setloadingTextListIndex(0);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function uploadImage(image) {
    setIsLoading(true);
    const storageRef = ref(storage, `/images/${image.name}${Math.random()}`);

    uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        addFortune(snapshot.metadata.name);
      })
      .catch((e) => console.log(e));
  }

  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  const onFileChange = ({ meta, file }, status) => {
    // console.log(status, file);
  };
  const onSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove());
  };
  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };
  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    return (
      <button
        onClick={() => {
          document.getElementById("inputFile").click();
          console.log("2125641513");
        }}
        className="uploadButton"
      >
        페페 고르기
        <input
          id="inputFile"
          style={{ display: "none" }}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            getFilesFromEvent(e).then((chosenFiles) => {
              onFiles(chosenFiles);
              setFiles(chosenFiles);
              console.log(files);
            });
          }}
        />
      </button>
    );
  };
  const previewImg = (props) => {
    return (
      <img
        style={{
          width: "90%",
          marginLeft: "5%",
          borderRadius: 15,
          borderWidth: 10,
        }}
        src={props.meta.previewUrl}
      />
    );
  };

  return (
    <div className="App">
      <div className="TopNav">
        {!hideTodayButton && (
          <>
            <button className="mainButton" onClick={() => setisAdding(true)}>
              페페 추가하기
            </button>
            <button className="mainButton">페페 모음</button>
          </>
        )}
      </div>
      <div className="MainContent">
        {hideTodayButton ? (
          <>
            {content}
            <Modal
              isOpen={isLoading}
              style={{
                overlay: {
                  position: "fixed",
                  width: "100%",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 15,
                  backgroundColor: "beige",
                },
                content: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "beige",
                  borderWidth: 0,
                },
              }}
            >
              <video
                style={{ borderRadius: 15 }}
                width={"100%"}
                height={"100%"}
                controls
                autoPlay={true}
              >
                <source src="loading.mp4" type="video/mp4" />
              </video>
              <p style={{ fontSize: 30, fontWeight: "bold" }}>
                {loadingTextList[loadingIndexVertical].slice(
                  0,
                  loadingTextListIndex
                )}
              </p>
            </Modal>
          </>
        ) : (
          <button
            className="mainButton"
            disabled={hideTodayButton}
            onClick={() => {
              loadRandomFortune();
            }}
          >
            오늘의 페페는?
          </button>
        )}
      </div>
      <Modal
        isOpen={isAdding}
        onRequestClose={() => {
          setisAdding(false);
        }}
        style={{
          overlay: {
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: "beige",
          },
          content: {
            borderRadius: 15,

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          },
        }}
      >
        {isLoading ? (
          <div>
            <img
              style={{
                width: "65%",
                height: "65%",
                maxWidth: 700,
                maxHeight: 700,
                borderRadius: 10,
                overflow: "hidden",
              }}
              src={"./images/upload_pepe.gif"}
            />

            <p style={{ fontSize: 30, fontWeight: "bold" }}>
              {loadingTextList[loadingIndexVertical].slice(
                0,
                loadingTextListIndex
              )}
            </p>
          </div>
        ) : (
          <>
            <input
              style={{
                width: "80%",
                padding: 10,
                resize: "none",
                borderRadius: 10,
                borderWidth: 1,
                marginBottom: 10,
              }}
              type="text"
              placeholder="작성자 이름"
              value={uploader}
              onChange={(e) => setuploader(e.target.value)}
            />
            <Dropzone
              onSubmit={onSubmit}
              onChangeStatus={onFileChange}
              InputComponent={selectFileInput}
              getUploadParams={fileParams}
              getFilesFromEvent={getFilesFromEvent}
              SubmitButtonComponent={null}
              PreviewComponent={previewImg}
              accept="image/*"
              maxFiles={1}
              styles={{
                dropzone: {
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  textAlign: "center",
                },
                preview: {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <textarea
                style={{
                  width: "80%",
                  padding: 10,
                  resize: "none",
                  borderRadius: 10,
                }}
                placeholder="운세를 적어주세요"
                cols="40"
                rows="5"
                onChange={(e) => {
                  setfortune(e.target.value);
                }}
                value={fortune}
              />
              <div style={{ marginTop: 10 }}>
                <button
                  className="mainButton"
                  onClick={() => {
                    uploadImage(files[0]);
                    setfortune("");
                  }}
                >
                  저장
                </button>
                <button
                  className="mainButton"
                  onClick={() => {
                    setisAdding(false);
                    setfortune("");
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;
