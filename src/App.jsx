import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./components/Utils.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "./components/Index.jsx";
import Navigation from "./components/navigation/Navigation.jsx";
import Calendar from "./components/Create.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Navigation/>
            <Routes>
                <Route path={"/"} element={<Index />} />
                <Route path={"/create"} element={<Calendar />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
};
export default App;
