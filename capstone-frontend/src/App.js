import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  );
}


