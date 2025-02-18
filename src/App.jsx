import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "./components/Index.jsx";
import Navigation from "./components/navigation/Navigation.jsx";
import Calendar from "./components/create.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Navigation/>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<Calendar />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
