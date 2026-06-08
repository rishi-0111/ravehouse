import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ThreeSplash from './components/ThreeSplash';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function AppContent({ showSplash, setShowSplash }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (showSplash) {
    return <ThreeSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Conditionally render Navbar if not in Admin Portal */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>

      {/* Conditionally render Footer if not in Admin Portal */}
      {!isAdminRoute && (
        <footer className="bg-zinc-950 border-t border-zinc-900 py-8 text-center text-xs text-zinc-500 font-sans">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="tracking-widest uppercase font-bold text-[10px]">
              <span className="text-red-500">RAVE</span> HOUSE
            </p>
            <p className="font-light">Movement. Culture. Community. © 2026. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <AppContent showSplash={showSplash} setShowSplash={setShowSplash} />
    </Router>
  );
}
