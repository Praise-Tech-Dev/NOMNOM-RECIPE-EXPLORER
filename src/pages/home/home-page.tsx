import { QuickMeal } from "../../features/recipes/components/quick-meal";
import AboutSection from "./components/about-section";
import Category from "./components/category";
import HomeHero from "./components/home-hero";
import NewestRecipes from "./components/newest-recipes";
import Newsletter from "./components/newsletter";
import PopularRecipes from "./components/popular-recipes";
import Writers from "./components/writers";

export default function Home() {
  return (
    <div>
      <HomeHero />
      <Category />
      <QuickMeal />
      <NewestRecipes />
      <PopularRecipes />
      <Writers />
      <AboutSection />
      <Newsletter />
    </div>
  );
}
