import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./routes/Navbar.jsx";
import Homepage from "./routes/Homepage.jsx";
import SearchFields from "./components/SearchFields.jsx";
import StaffHiringPage from "./components/StaffHiringPage.jsx"; // <-- import your new page
import AIAssistantButton from "./components/AIAssistantButton";
const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        {/* prevents navbar overlap */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/fields" element={<SearchFields />} />
          <Route path="/staff-hiring" element={<StaffHiringPage />} /> {/* <-- add this */}
        </Routes>
      </div>
      <AIAssistantButton />
    </Router>
  );
};

export default App;

