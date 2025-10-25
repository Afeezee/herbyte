import Home from './pages/Home';
import ExploreHerbs from './pages/ExploreHerbs';
import HerbProfile from './pages/HerbProfile';
import SubmitRemedy from './pages/SubmitRemedy';
import About from './pages/About';
import Contact from './pages/Contact';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ExploreHerbs": ExploreHerbs,
    "HerbProfile": HerbProfile,
    "SubmitRemedy": SubmitRemedy,
    "About": About,
    "Contact": Contact,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};