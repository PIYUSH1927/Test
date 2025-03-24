import React from "react";
import Navbar from "./components/NavBar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Home from "./pages/Home";
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import Features from "./pages/Features";
import About from "./pages/AboutUs";
import Playground from "./pages/Playground";
import View3D from "./pages/Playground/3D/View3D";
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/playground" element={<Playground />} />
                <Route path="/3D" element={<View3D />} />
                <Route path="*" element={
                    <>
                        <Navbar />
                        <div style={{ paddingTop: "70px" }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/features" element={<Features />} />
                                <Route path="/projects" element={<Project />} />
                                <Route path="/LoginPage" element={<LoginPage />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </>
                } />
            </Routes>
        </Router>
    );
};

export default App;
