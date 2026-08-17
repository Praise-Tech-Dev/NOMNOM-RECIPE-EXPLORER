
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/home/home-page';
import RecipePage from './pages/receipe-page';
import RecipeDetailPage from './pages/recipe-detail-page';
import MainLayout from './layout/main-layout';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipePage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
