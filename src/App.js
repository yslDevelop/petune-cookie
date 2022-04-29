import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PepeLibrary from "./components/PepeLibrary";
import AddPepe from "./components/AddPepe";
import TodayFortune from "./components/TodayFortune";

export default function App({ db, storage }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home db={db} storage={storage} />} />
        <Route
          path="PepeLibrary"
          element={<PepeLibrary db={db} storage={storage} />}
        />
        <Route path="AddPepe" element={<AddPepe db={db} storage={storage} />} />
      </Routes>
    </BrowserRouter>
  );
}
