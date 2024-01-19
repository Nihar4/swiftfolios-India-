import AccessManagement from "./components/AccessManagement/AccessManagement";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";
import "./css/global.css";
import "./css/CustomComponents/SwiftComponents.css";
import './css/Smallcase/AdvisorSmallcase.css';
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<AccessManagement />}></Route>
            <Route path="/404" element={<NotFound />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}


export default App;
