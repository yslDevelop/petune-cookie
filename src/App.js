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
import "react-dropzone-uploader/dist/styles.css";
import TodayFortune from "./components/TodayFortune";
import store from "./redux/store";
import { useSelector } from "react-redux";

function App({ db, storage }) {
  const {
    comment,
    openCommentForm,
    hideTodayButton,
    isAdding,
    uploader,
    files,
    fortune,
    content,
    isRibbonTitleDown,
    isLoading,
    loadingIndexVertical,
    loadingTextListIndex,
    loadingTextList,
    loadingTextListSecond,
  } = useSelector((state) => ({
    comment: state.GlobalStates.comment,
    openCommentForm: state.GlobalStates.openCommentForm,
    hideTodayButton: state.GlobalStates.hideTodayButton,
    isAdding: state.GlobalStates.isAdding,
    uploader: state.GlobalStates.uploader,
    files: state.GlobalStates.files,
    fortune: state.GlobalStates.fortune,
    content: state.GlobalStates.content,
    isRibbonTitleDown: state.GlobalStates.isRibbonTitleDown,
    isLoading: state.GlobalStates.isLoading,
    loadingIndexVertical: state.GlobalStates.loadingIndexVertical,
    loadingTextListIndex: state.GlobalStates.loadingTextListIndex,
    loadingTextList: state.GlobalStates.loadingTextList,
    loadingTextListSecond: state.GlobalStates.loadingTextListSecond,
  }));

  //   const [comment, setComment] = useState("");
  //   const [openCommentForm, setopenCommentForm] = useState(false);
  //   const [hideTodayButton, sethideTodayButton] = useState(false);
  //   const [isAdding, setisAdding] = useState(false);
  //   const [uploader, setuploader] = useState("");
  //   const [files, setFiles] = useState([]);
  //   const [fortune, setfortune] = useState("");
  //   const [content, setcontent] = useState(null);
  //   const [isRibbonTitleDown, setIsRibbonTitleDown] = useState("");

  //   const [isLoading, setIsLoading] = useState(false);
  //   const [loadingIndexVertical, setLoadingIndexVertical] = useState(0);
  //   const [loadingTextListIndex, setLoadingTextListIndex] = useState(1);
  //   const [loadingTextList, setloadingTextList] = useState([
  //     `두구두구두구두구`,
  //     `언제까지 어깨 춤을 추게 할거야~
  // 내 어깨를 봐~ 아 탈골 됐잖아~
  // 아 탈골 탈골 탈골탈골타골~`,
  //   ]);
  //   const [loadingTextListSecond, setloadingTextListSecond] = useState([
  //     `업로드 중....💚.....💚.....
  // 조금만 기다려줘잉💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`,
  //     `언제까지 어깨 춤을 추게 할거야~
  // 내 어깨를 봐~ 아 탈골 됐잖아~
  // 아 탈골 탈골 탈골탈골타골~`,
  //   ]);

  Modal.setAppElement("#root");

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        store.dispatch({ type: "setLoadingIndexVertical", payload: 1 });
      }, 3000);
      changeloadingTextIndex();
    }
  }, [isAdding, isLoading, changeloadingTextIndex]);
  useEffect(() => {
    setTimeout(() => {
      store.dispatch({ type: "setIsRibbonTitleDown", payload: "startFadeOut" });
    }, 3500);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function changeloadingTextIndex() {
    setTimeout(() => {
      if (
        isLoading &&
        loadingTextListIndex < loadingTextList[loadingIndexVertical].length - 1
      ) {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: loadingTextListIndex + 1,
        });
      } else if (
        isAdding &&
        loadingTextListIndex <
          loadingTextListSecond[loadingIndexVertical].length - 1
      ) {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: loadingTextListIndex + 1,
        });
      } else {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: 1,
        });
      }
    }, 70);
  }

  async function loadRandomFortune() {
    store.dispatch({
      type: "setHideTodayButton",
      payload: true,
    });
    store.dispatch({
      type: "setIsLoading",
      payload: true,
    });

    setTimeout(() => {
      store.dispatch({ type: "setLoadingIndexVertical", payload: 1 });
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
      store.dispatch({
        type: "setContent",
        payload: <TodayFortune doc={doc} url={doc.data().url} />,
      });

      setTimeout(() => {
        store.dispatch({
          type: "setIsLoading",
          payload: false,
        });
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: 0,
        });
      }, 2000);
      //   getDownloadURL(ref(storage, `images/${doc.data().fileName}`)).then(
      //     (url) => {
      //       console.log(url);
      //       let img = new Image();
      //       img.src = url;
      //       store.dispatch({
      //         type: "setContent",
      //         payload: <TodayFortune doc={doc} img={img} />,
      //       });

      //       setTimeout(() => {
      //         store.dispatch({
      //           type: "setIsLoading",
      //           payload: false,
      //         });
      //         store.dispatch({
      //           type: "setLoadingTextListIndex",
      //           payload: 0,
      //         });
      //       }, 1000);
      //     }
      //   );
    });
  }

  async function addFortune(fileName, url) {
    try {
      const docRef = await addDoc(collection(db, "Fortunes"), {
        // file: files[0],
        fortune: fortune,
        randomId: Math.random(),
        fileName: fileName,
        uploader: uploader,
        url: url,
      });
      store.dispatch({
        type: "setIsAdding",
        payload: false,
      });
      store.dispatch({
        type: "setIsLoading",
        payload: false,
      });
      store.dispatch({
        type: "setLoadingTextListIndex",
        payload: 0,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function uploadImage(image) {
    store.dispatch({
      type: "setIsLoading",
      payload: true,
    });
    const storageRef = ref(storage, `/images/${image.name}${Math.random()}`);

    uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log(snapshot);
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          addFortune(snapshot.metadata.name, url);
        });
      })
      .catch((e) => console.log(e));
  }

  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === "done") {
      console.log("?");
      store.dispatch({ type: "setFiles", payload: [file] });
    }
    console.log(status, meta, file);
  };

  const previewImg = (props) => {
    return (
      <img
        style={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 5,
        }}
        src={props.meta.previewUrl}
      />
    );
  };

  return (
    <div
      style={{
        animation: "fadeInAnimation ease 3s",
        animationIterationCount: 1,
        animationFillMode: "forwards",
      }}
      className="App"
    >
      <div className="TopNav">
        {!hideTodayButton && (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={{
                  background: "rgba(0,0,0,0)",
                  borderRadius: 100,
                  border: "2px solid white",
                  boxShadow: "0px 10px 10px grey",
                  padding: 5,
                }}
                className="mainButton"
                onClick={() =>
                  store.dispatch({
                    type: "setIsAdding",
                    payload: true,
                  })
                }
              >
                <img
                  style={{ borderRadius: 100 }}
                  src="./images/pepe_add.png"
                  width="80"
                  height="80"
                />
              </button>
              <button
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  padding: 5,
                  margin: 0,
                  boxShadow: "0px 5px 5px grey",
                  border: "2px solid white",
                }}
                disabled={hideTodayButton}
                onClick={() => {
                  store.dispatch({
                    type: "setIsAdding",
                    payload: true,
                  });
                }}
              >
                페페 추가
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={{
                  background: "rgba(0,0,0,0)",
                  borderRadius: 100,
                  border: "2px solid white",

                  boxShadow: "0px 10px 10px grey",
                  padding: 5,
                }}
                className="mainButton"
                onClick={() => {
                  //
                }}
              >
                <img
                  style={{ borderRadius: 100, transform: "scaleX(-1)" }}
                  src="./images/pepe_library.gif"
                  width="80"
                  height="80"
                />
              </button>
              <button
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  padding: 5,
                  margin: 0,
                  border: "2px solid white",

                  boxShadow: "0px 5px 5px grey",
                }}
                disabled={hideTodayButton}
                onClick={() => {
                  // setisAdding(true);
                }}
              >
                페페 모음
              </button>
            </div>
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
                  animation: "fadeInAnimation ease 1s",
                  animationIterationCount: 1,
                  animationFillMode: "forwards",

                  width: "100%",
                  maxWidth: 500,
                  height: "100%",
                  transform: "translate(-50%)",
                  left: "50%",
                  right: 0,
                  bottom: 0,
                  borderRadius: 15,
                  backgroundColor: "black",
                },
                content: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "black",
                  border: "0px solid black",
                },
              }}
            >
              <img
                style={{
                  width: "90%",
                  maxWidth: 700,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
                src={"./images/pepe_loading.gif"}
              />
              <p style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
                {loadingTextList[loadingIndexVertical].slice(
                  0,
                  loadingTextListIndex
                )}
              </p>
            </Modal>
          </>
        ) : (
          <>
            <button
              className="mainButton"
              style={{
                borderRadius: 100,
                background: "rgba(0,0,0,0)",
                border: "2px solid white",

                boxShadow: "0px 10px 10px black",
                padding: 5,
              }}
              disabled={hideTodayButton}
              onClick={() => {
                loadRandomFortune();
              }}
            >
              <img
                style={{ borderRadius: 100 }}
                src="./images/todayFortune.png"
                width="60"
                height="60"
              />
            </button>
            <button
              style={{
                backgroundColor: "white",
                borderRadius: 5,
                padding: 5,
                margin: 0,
                boxShadow: "0px 5px 5px black",
                border: "2px solid white",
              }}
              disabled={hideTodayButton}
              onClick={() => {
                loadRandomFortune();
              }}
            >
              오늘의 페페는?
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                display: "none" /** */,
              }}
            >
              <button
                className="mainButton"
                disabled={hideTodayButton}
                onClick={() => {
                  store.dispatch({ type: "setOpenCommentForm", payload: true });
                }}
              >
                방명록 쓰기
              </button>
              <button
                className="mainButton"
                disabled={hideTodayButton}
                onClick={() => {
                  store.dispatch({ type: "setOpenCommentForm", payload: true });
                }}
              >
                방명록 보기
              </button>
            </div>
          </>
        )}
      </div>

      {!hideTodayButton && (
        <div
          className={isRibbonTitleDown}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img width={400} src={"./images/ribbonTitle2.png"} />
          <p
            style={{
              fontSize: 24,
              color: "black",
              fontWeight: "bold",
              position: "relative",
              bottom: "55%",
            }}
          >
            페페의 다락방
          </p>
        </div>
      )}

      <Modal
        isOpen={isAdding}
        onRequestClose={() => {
          store.dispatch({
            type: "setIsAdding",
            payload: false,
          });
        }}
        style={{
          overlay: {
            animation: "fadeInAnimation ease 2s",
            animationIterationCount: 1,
            animationFillMode: "forwards",

            width: "100%",
            maxWidth: 500,
            height: "100%",
            transform: "translate(-50%)",
            left: "50%",
            right: 0,
            bottom: 0,
            borderRadius: 15,
            backgroundColor: "black",
          },
          content: {
            display: "flex",
            height: "80%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            border: "1px solid white",
            borderRadius: 15,
          },
        }}
      >
        {isLoading ? (
          <div>
            <img
              style={{
                width: "100%",
                height: "65%",
                maxWidth: 700,
                maxHeight: 700,
                borderRadius: 10,
                overflow: "hidden",
              }}
              src={"./images/upload_pepe.gif"}
            />

            <p style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {loadingTextListSecond[loadingIndexVertical].slice(
                0,
                loadingTextListIndex
              )}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              새로운 페페 운세를 추가해주세요!
            </p>
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
              onChange={(e) =>
                store.dispatch({ type: "setUploader", payload: e.target.value })
              }
            />
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              PreviewComponent={previewImg}
              accept="image/*"
              maxFiles={1}
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
                  store.dispatch({
                    type: "setFortune",
                    payload: e.target.value,
                  });
                }}
                value={fortune}
              />
              <div style={{ marginTop: 10 }}>
                <button
                  className="mainButton"
                  onClick={() => {
                    uploadImage(files[0]);
                    store.dispatch({
                      type: "setFortune",
                      payload: "",
                    });
                  }}
                >
                  저장
                </button>
                <button
                  className="mainButton"
                  onClick={() => {
                    store.dispatch({
                      type: "setIsAdding",
                      payload: false,
                    });
                    store.dispatch({
                      type: "setFortune",
                      payload: "",
                    });
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={openCommentForm}
        onRequestClose={() => {
          store.dispatch({ type: "setOpenCommentForm", payload: false });
        }}
        style={{
          overlay: {
            animation: "fadeInAnimation ease 2s",
            animationIterationCount: 1,
            animationFillMode: "forwards",

            width: "100%",
            maxWidth: 500,
            height: "100%",
            transform: "translate(-50%)",
            left: "50%",
            right: 0,
            bottom: 0,
            borderRadius: 15,
            backgroundColor: "black",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            border: "0px solid black",
          },
        }}
      >
        <input
          style={{
            width: "100%",
            maxWidth: 500,
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            padding: 10,
            resize: "none",
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 10,
          }}
          type="text"
          placeholder="작성자 이름"
          value={uploader}
          onChange={(e) => {
            store.dispatch({ type: "setUploader", payload: e.target.value });
          }}
        />
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
            store.dispatch({ type: "setComment", payload: e.target.value });
          }}
          value={comment}
        />
        <button
          onClick={() =>
            store.dispatch({ type: "setOpenCommentForm", payload: false })
          }
        >
          저장
        </button>
        <button
          onClick={() =>
            store.dispatch({ type: "setOpenCommentForm", payload: false })
          }
        >
          닫기
        </button>
      </Modal>
    </div>
  );
}

export default App;
