import Modal from "react-modal";
import store from "../redux/store";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone-uploader";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AddPepe({ db, storage }) {
  const {
    isAdding,
    uploader,
    files,
    fortune,
    isLoading,
    loadingIndexVertical,
    loadingTextListIndex,
    loadingTextList,
    loadingTextListSecond,
    server,
    loadingTextListEnglishSecond,
    loadingTextListEnglish,
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
    server: state.GlobalStates.server,
    loadingTextListEnglish: state.GlobalStates.loadingTextListEnglish,
    loadingTextListEnglishSecond:
      state.GlobalStates.loadingTextListEnglishSecond,
  }));
  let nav = useNavigate();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        store.dispatch({ type: "setLoadingIndexVertical", payload: 1 });
      }, 3000);
      changeloadingTextIndex();
    }
  }, [isAdding, isLoading, changeloadingTextIndex]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function changeloadingTextIndex() {
    setTimeout(() => {
      if (
        isLoading &&
        navigator.language === "ko-KR" &&
        loadingTextListIndex < loadingTextList[loadingIndexVertical].length - 1
      ) {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: loadingTextListIndex + 1,
        });
      } else if (
        isAdding &&
        navigator.language === "ko-KR" &&
        loadingTextListIndex <
          loadingTextListSecond[loadingIndexVertical].length - 1
      ) {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: loadingTextListIndex + 1,
        });
      } else if (
        isAdding &&
        navigator.language !== "ko-KR" &&
        loadingTextListIndex <
          loadingTextListEnglish[loadingIndexVertical].length - 1
      ) {
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: loadingTextListIndex + 1,
        });
      } else if (
        isAdding &&
        navigator.language !== "ko-KR" &&
        loadingTextListIndex <
          loadingTextListEnglishSecond[loadingIndexVertical].length - 1
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

  async function addFortune(fileName, url) {
    try {
      const docRef = await addDoc(collection(db, server), {
        // file: files[0],
        fortune: fortune,
        randomId: Math.random(),
        fileName: fileName,
        uploader: uploader,
        url: url,
        uploadTime: new Date(),
      });
      nav("/");
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
        getDownloadURL(snapshot.ref).then((url) => {
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
    <Modal
      isOpen={isAdding}
      onRequestClose={() => {
        nav("/");

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
            {navigator.language === "ko-KR"
              ? loadingTextListSecond[loadingIndexVertical].slice(
                  0,
                  loadingTextListIndex
                )
              : loadingTextListEnglishSecond[loadingIndexVertical].slice(
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
                  store.dispatch({
                    type: "setUploader",
                    payload: "",
                  });
                }}
              >
                저장
              </button>
              <button
                className="mainButton"
                onClick={() => {
                  nav("/");
                  store.dispatch({
                    type: "setIsAdding",
                    payload: false,
                  });
                  store.dispatch({
                    type: "setFortune",
                    payload: "",
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
  );
}
