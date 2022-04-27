const initalState = {
  comment: "",
  openCommentForm: false,
  hideTodayButton: false,
  isAdding: false,
  uploader: "",
  files: [],
  fortune: "",
  content: null,
  isRibbonTitleDown: "",
  isLoading: false,
  loadingIndexVertical: 0,
  loadingTextListIndex: 1,
  loadingTextList: [
    `두구두구두구두구`,
    `언제까지 어깨 춤을 추게 할거야~
내 어깨를 봐~ 아 탈골 됐잖아~
아 탈골 탈골 탈골탈골타골~`,
  ],
  loadingTextListSecond: [
    `업로드 중....💚.....💚.....
조금만 기다려줘잉💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`,
    `언제까지 어깨 춤을 추게 할거야~
내 어깨를 봐~ 아 탈골 됐잖아~
아 탈골 탈골 탈골탈골타골~`,
  ],
};

export default function GlobalStates(state = initalState, action) {
  switch (action.type) {
    case "setComment":
      return {
        ...state,
        comment: action.payload,
      };
    case "setOpenCommentForm":
      return {
        ...state,
        openCommentForm: action.payload,
      };
    case "setHideTodayButton":
      return {
        ...state,
        hideTodayButton: action.payload,
      };
    case "setIsAdding":
      return {
        ...state,
        isAdding: action.payload,
      };
    case "setUploader":
      return {
        ...state,
        uploader: action.payload,
      };
    case "setFiles":
      return {
        ...state,
        files: action.payload,
      };
    case "setFortune":
      return {
        ...state,
        fortune: action.payload,
      };
    case "setContent":
      return {
        ...state,
        content: action.payload,
      };
    case "setIsRibbonTitleDown":
      return {
        ...state,
        isRibbonTitleDown: action.payload,
      };
    case "setIsLoading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "setLoadingIndexVertical":
      return {
        ...state,
        loadingIndexVertical: action.payload,
      };
    case "setLoadingTextListIndex":
      return {
        ...state,
        loadingTextListIndex: action.payload,
      };

    default:
      return state;
  }
}
