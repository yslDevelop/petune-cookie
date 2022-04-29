const initalState = {
  comment: "",
  openCommentForm: false,
  hideTodayButton: false,
  isAdding: false,
  uploader: "",
  files: [],
  fortune: "",
  content: null,
  isRibbonTitleDown: "showRibbon",
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
  server: "Fortunes",
  loadingTextListEnglish: [
    `Hold on.. Pepe is asking to the wandering souls about your day................`,
    `Good things always take time....such as smores........SMORE BABY!!!!!!!!!!!!!!!`,
  ],
  loadingTextListEnglishSecond: [
    `Uploading....💚.....💚.....
Need little bit more time Thank you  💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`,
    `Thank you for patience and your contribution! you will be rewarded by someone somehow someday. I PROMISE`,
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
    case "increaseLoadingTextListIndex":
      return {
        ...state,
        loadingTextListIndex: state.loadingTextListIndex + 1,
      };
    case "setLoadingTextListIndex":
      return {
        ...state,
        loadingTextListIndex: action.payload,
      };
    case "setServer":
      return {
        ...state,
        server: action.payload,
      };

    default:
      return state;
  }
}
