import Modal from "react-modal";
import store from "../redux/store";
import { useSelector } from "react-redux";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  limit,
  query,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function PepeLibrary({ db, storage }) {
  const [lastDoc, setLastDoc] = useState(null);
  const [nextQuery, setNextQuery] = useState();
  const [contents, setContents] = useState([]);
  const listInnerRef = useRef();
  const [isEnd, setIsEnd] = useState(false);

  const { isLoading, isAdding, uploader, fortune, server } = useSelector(
    (state) => ({
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
    })
  );

  useEffect(() => {
    loadLibrary();
  }, []);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        if (!isLoading) {
          loadLibrary();
          store.dispatch({ type: "setIsLoading", payload: true });
        } else {
          return;
        }
      }
    }
  };

  async function loadLibrary() {
    store.dispatch({
      type: "setIsLoading",
      payload: true,
      origin: "loadRandomFortune",
    });

    let fortuneRef = collection(db, server);

    let q = query(fortuneRef, orderBy("uploadTime", "desc"), limit(10));
    const documentSnapshots = nextQuery
      ? await getDocs(nextQuery)
      : await getDocs(q);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);

    const next = query(
      collection(db, server),
      orderBy("uploadTime", "desc"),
      startAfter(lastVisible),
      limit(10)
    );
    setNextQuery(next);

    let tempContentsList = [];
    let rowList = [];
    let i = 1;
    documentSnapshots.forEach((doc) => {
      let data = doc.data();
      let date = data.uploadTime.toDate();
      let dateText = `${date.getMonth() + 1}.${date.getDate()}`;
      let size = Math.floor(window.innerWidth / 4.5);
      tempContentsList.push(
        <div
          key={i + Math.random()}
          style={{
            width: size,
            margin: 10,
            padding: 5,
            // flex: 1,
            // borderRadius: 10,
          }}
        >
          <p className="libraryText">{data.uploader}</p>

          <img
            src={data.url}
            width={size}
            height={size}
            style={{ overflow: "hidden", borderRadius: 10 }}
          />
          <p className="libraryText">{data.fortune}</p>
          {/* <p className="libraryText datText">{`uplodaed ${dateText}`}</p> */}
          {/* <p className="libraryText">{i}</p> */}
        </div>
      );

      i++;
    });
    setIsEnd(i <= 10);
    setContents([...contents, ...tempContentsList]);
    store.dispatch({ type: "setIsLoading", payload: false });
  }

  return (
    <div className="libraryMainDiv startFadeIn">
      <div
        className="libraryRibbonDiv"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // border: "1px solid red",
          padding: 0,
          margin: 0,
          height: 100,
          width: "90%",
        }}
      >
        <h2 className="libraryText libraryTitle">
          {navigator.language === "ko-KR" ? "페페의 서재" : "Pepe's Library"}
        </h2>
      </div>
      {/* <h2 className="libraryText">
        {navigator.language === "ko-KR" ? "페페의 서재" : "Pepe's Library"}
      </h2> */}

      <div className="libraryContentDiv" onScroll={onScroll} ref={listInnerRef}>
        {contents}
      </div>
      <div>
        <Link to="/">
          <button className="libraryButton mainButton">
            {navigator.language === "ko-KR" ? "돌아가기" : "Return"}
          </button>
        </Link>
        <button
          className="libraryButton mainButton"
          onClick={() => {
            loadLibrary();
          }}
        >
          {navigator.language === "ko-KR" ? "불러오기" : "Load"}
        </button>
      </div>
    </div>
  );
}
