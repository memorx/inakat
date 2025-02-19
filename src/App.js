import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/commons/Navbar';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Companies from './components/sections/Companies';
import Talents from './components/sections/Talents';
import Contact from './components/sections/Contact';
import Login from './components/sections/Login';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/talents" element={<Talents />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;