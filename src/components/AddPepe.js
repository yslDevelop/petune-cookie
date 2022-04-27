import Modal from "react-modal";

export default function AddPepe({}) {
  return (
    <Modal
      isOpen={isAdding}
      onRequestClose={() => {
        setisAdding(false);
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
            onChange={(e) => setuploader(e.target.value)}
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
  );
}
