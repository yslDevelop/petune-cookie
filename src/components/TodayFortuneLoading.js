import Modal from "react-modal";
import { useSelector } from "react-redux";

export default function TodayFortuneLoading() {
  const {
    isLoading,
    loadingIndexVertical,
    loadingTextListIndex,
    loadingTextList,
    loadingTextListEnglish,
  } = useSelector((state) => ({
    isLoading: state.GlobalStates.isLoading,
    loadingIndexVertical: state.GlobalStates.loadingIndexVertical,
    loadingTextListIndex: state.GlobalStates.loadingTextListIndex,
    loadingTextList: state.GlobalStates.loadingTextList,
    loadingTextListEnglish: state.GlobalStates.loadingTextListEnglish,
  }));

  return (
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
        src={"../images/pepe_loading.gif"}
      />
      <p style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
        {navigator.language === "ko-KR"
          ? loadingTextList[loadingIndexVertical].slice(0, loadingTextListIndex)
          : loadingTextListEnglish[loadingIndexVertical].slice(
              0,
              loadingTextListIndex
            )}
      </p>
    </Modal>
  );
}
