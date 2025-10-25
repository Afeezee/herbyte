import Home from './pages/Home';
import ExploreHerbs from './pages/ExploreHerbs';
import HerbProfile from './pages/HerbProfile';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ExploreHerbs": ExploreHerbs,
    "HerbProfile": HerbProfile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};