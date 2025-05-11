import { BrowserRouter, Route, Routes } from "react-router";
import PageLayout from "./layout/PageLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route path="/" element={<PageLayout />} />
          <Route path="/:searchKey" element={<PageLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
