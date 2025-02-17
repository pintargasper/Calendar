import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "./components/Index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Create from "./components/create.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<Create />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
