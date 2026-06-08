import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Image, Users, HelpCircle, LayoutDashboard, Info, Home } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Volunteer', path: '/volunteer', icon: Users },
    { name: 'Contact', path: '/contact', icon: HelpCircle },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-md border-b border-zinc-800 py-3 shadow-lg' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-extrabold text-2xl tracking-widest text-white transition-colors">
              <span className="text-red-600 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">RAVE</span> HOUSE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                    active
                      ? 'text-red-500 border-b-2 border-red-500'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <LinkIcon size={14} className={active ? 'text-red-500' : 'text-zinc-400'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <Link
              to="/admin/login"
              className="flex items-center space-x-1 ml-4 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:bg-red-950/20 text-white rounded-md text-sm font-semibold tracking-wider uppercase transition-all duration-200"
            >
              <LayoutDashboard size={14} />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'
      } bg-black/95 border-b border-zinc-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-semibold tracking-wider uppercase transition-colors ${
                  active
                    ? 'text-red-500 bg-zinc-900/80 border-l-4 border-red-500'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <LinkIcon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-semibold tracking-wider uppercase text-zinc-300 hover:text-red-500 hover:bg-zinc-900/50"
          >
            <LayoutDashboard size={18} />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
