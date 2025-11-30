import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import Contact from "./components/Contact";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
function App() {
  return (
    <Router>
      <div className="app">
         <Navbar />
        <Routes>

          {/* Home Page */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <HowItWorks />
                <Contact />
              </>
            } 
          />

          {/* If you want separate pages later, example: */}
          {/* 
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} /> 
          */}
           <Route path="/create-account" element={<CreateAccount />} />
           <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
