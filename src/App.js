import "./App.css";
import { useState } from "react";

function App() {
  const [today, setToday] = useState("");

  return (
    <div className="App">
      <div className="TopNav">
        <button> add pepe</button>
        <button> pepe libs</button>
      </div>
      <div className="MainContent">
        <button>오늘의 페페는?</button>
      </div>
    </div>
  );
}

export default App;
