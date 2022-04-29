import "../App.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  collection,
  addDoc,
  getDocs,
  limit,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import "react-dropzone-uploader/dist/styles.css";
import TodayFortune from "../components/TodayFortune";
import TodayFortuneLoading from "../components/TodayFortuneLoading";
import store from "../redux/store";
import { useSelector } from "react-redux";
import AddPepe from "../components/AddPepe";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Home({ db, storage }) {
  const {
    hideTodayButton,
    isAdding,
    content,
    isRibbonTitleDown,
    isLoading,
    loadingIndexVertical,
    loadingTextListIndex,
    loadingTextList,
    loadingTextListSecond,
    server,
  } = useSelector((state) => ({
    hideTodayButton: state.GlobalStates.hideTodayButton,
    isAdding: state.GlobalStates.isAdding,
    content: state.GlobalStates.content,
    isRibbonTitleDown: state.GlobalStates.isRibbonTitleDown,
    isLoading: state.GlobalStates.isLoading,
    loadingIndexVertical: state.GlobalStates.loadingIndexVertical,
    loadingTextListIndex: state.GlobalStates.loadingTextListIndex,
    loadingTextList: state.GlobalStates.loadingTextList,
    loadingTextListSecond: state.GlobalStates.loadingTextListSecond,
    server: state.GlobalStates.server,
  }));

  Modal.setAppElement("#root");

  useEffect(() => {
    // console.log(navigator.language);
    if (navigator.language !== "ko-KR") {
      store.dispatch({ type: "setServer", payload: "Fortune-English" });
    }
  }, []);

  useEffect(() => {
    // console.log("isLoading", isLoading);
    function changeloadingTextIndex() {
      setTimeout(() => {
        if (
          isLoading &&
          isAdding &&
          loadingTextListIndex <
            loadingTextListSecond[loadingIndexVertical].length - 1
        ) {
          store.dispatch({
            type: "increaseLoadingTextListIndex",
          });
        } else if (
          isLoading &&
          loadingTextListIndex <
            loadingTextList[loadingIndexVertical].length - 1
        ) {
          store.dispatch({
            type: "increaseLoadingTextListIndex",
          });
        } else {
          store.dispatch({
            type: "setLoadingTextListIndex",
            payload: 1,
          });
        }
      }, 70);
    }

    if (isLoading) {
      setTimeout(() => {
        store.dispatch({ type: "setLoadingIndexVertical", payload: 1 });
      }, 3000);
      changeloadingTextIndex();
    }
  }, [isLoading, loadingTextListIndex]);
  useEffect(() => {
    setTimeout(() => {
      store.dispatch({
        type: "setIsRibbonTitleDown",
        payload: "showRibbon startFadeOut",
      });
    }, 3500);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function loadRandomFortune() {
    console.log("LoadRandom??");
    store.dispatch({
      type: "setHideTodayButton",
      payload: true,
    });
    store.dispatch({
      type: "setIsLoading",
      payload: true,
      origin: "loadRandomFortune",
    });

    let rand = Math.random();
    // let rand = 0.25;
    let fortuneRef = collection(db, server);
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
          origin: "querySnapshot",
        });
        store.dispatch({
          type: "setLoadingTextListIndex",
          payload: 0,
        });
      }, 2000);

      // getDownloadURL(ref(storage, `images/${doc.data().fileName}`)).then(
      //   (url) => {
      //     console.log(url);
      //     let img = new Image();
      //     img.src = url;
      //     store.dispatch({
      //       type: "setContent",
      //       payload: <TodayFortune doc={doc} img={img} />,
      //     });

      //     setTimeout(() => {
      //       store.dispatch({
      //         type: "setIsLoading",
      //         payload: false,
      //       });
      //       store.dispatch({
      //         type: "setLoadingTextListIndex",
      //         payload: 0,
      //       });
      //     }, 1000);
      //   }
      // );
    });
  }

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
            <Link
              style={{ display: "flex", flexDirection: "column" }}
              to="/AddPepe"
            >
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
                  src="../images/pepe_add.png"
                  width="80"
                  height="80"
                />
              </button>

              <button
                className="mainButton"
                disabled={hideTodayButton}
                onClick={() => {
                  store.dispatch({
                    type: "setIsAdding",
                    payload: true,
                  });
                }}
              >
                {navigator.language === "ko-KR" ? "페페 추가" : "Add Pepe"}
              </button>
            </Link>
            <Link to="/PepeLibrary">
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
                    src="../images/pepe_library.gif"
                    width="80"
                    height="80"
                  />
                </button>
                <button
                  className="mainButton"
                  disabled={hideTodayButton}
                  onClick={() => {
                    // setisAdding(true);
                  }}
                >
                  {navigator.language === "ko-KR"
                    ? "페페 모음"
                    : "Pepe Library"}
                </button>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="MainContent">
        {hideTodayButton ? (
          <>
            {content}
            <TodayFortuneLoading />
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
                src="../images/todayFortune.png"
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
              {navigator.language === "ko-KR"
                ? "오늘의 페페는?"
                : "Today's Pepe"}
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
        <div className={isRibbonTitleDown}>
          <img style={{ width: "80%" }} src={"../images/ribbonTitle2.png"} />
          <p
            style={{
              fontSize: 24,
              color: "black",
              fontWeight: "bold",
              position: "relative",
              bottom: "55%",
            }}
          >
            {navigator.language === "ko-KR" ? "페페의 다락방" : `Pepe's Room`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
