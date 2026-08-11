
import './App.css'
import QueryPractice from './features/recipes/components/query-practice';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/home/home-page';
import RecipePage from './pages/receipe-page';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/query-practice" element={<QueryPractice />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
