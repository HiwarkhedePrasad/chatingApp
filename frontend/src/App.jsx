import { useState } from "react";

import "./App.css";
import WebRTCComponent from "./component/webRTC";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Import for routing
import HeroSection from "./component/herosection"; // Assuming HeroSection is in components folder
import About from "./component/about";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {" "}
      {/* Wrap with Router */}     {" "}
      <Routes>
        {" "}
        {/* Use Routes */}
                <Route path="/" element={<HeroSection />} /> {/* Home route */}
                <Route path="/call" element={<WebRTCComponent />} />{" "}
        <Route path="/about" element={<About />} />
        {/* Call route */}     {" "}
      </Routes>
         {" "}
    </Router>
  );
}

export default App;
