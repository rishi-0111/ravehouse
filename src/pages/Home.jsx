import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { mockEvents, mockAnnouncements } from '../mockData';
import { supabase } from '../supabaseClient';
import { Sparkles, Calendar, ArrowRight, Bell, Volume2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // GSAP Intro animations
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      );
      gsap.fromTo(ctaRef.current, 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' }
      );
    }, heroRef);

    // Fetch Events & Announcements from Supabase, fall back to mockData
    async function fetchData() {
      try {
        const { data: dbEvents, error: errEvents } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: true })
          .limit(3);
        
        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents);
        } else {
          setEvents(mockEvents.slice(0, 3));
        }

        const { data: dbAnnouncements, error: errAnn } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (dbAnnouncements && dbAnnouncements.length > 0) {
          setAnnouncements(dbAnnouncements);
        } else {
          setAnnouncements(mockAnnouncements);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setEvents(mockEvents.slice(0, 3));
        setAnnouncements(mockAnnouncements);
      }
    }
    fetchData();

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-20 overflow-hidden font-sans">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center px-4 border-b border-zinc-900 bg-radial-gradient">
        {/* Glowing aura effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl text-center z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-900/60 text-xs text-red-400 font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} className="animate-pulse" />
            <span>Chennai's Core Underground Community</span>
          </div>

          <h1 ref={titleRef} className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none uppercase">
            WE ARE THE <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-white drop-shadow-[0_0_12px_rgba(220,38,38,0.3)]">
              RAVE HOUSE
            </span>
          </h1>

          <p ref={subtitleRef} className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            An ecosystem for electronic music, active lifestyles, beach preservation, and youth well-being. We merge culture with local impact.
          </p>

          <div ref={ctaRef} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/events" 
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-red-600/30 transition-all duration-300 flex items-center justify-center space-x-2 border border-red-500"
            >
              <span>Explore Events</span>
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/volunteer" 
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex items-center justify-center"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT MISSION & VISION SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block border-l-4 border-red-600 pl-4">
              <span className="text-xs text-red-500 font-bold uppercase tracking-widest block">WHO WE ARE</span>
              <h2 className="text-3xl font-extrabold uppercase tracking-wide">Movement. Culture. Community.</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed font-light">
              RAVE HOUSE was founded as a collaborative safe space to nurture local talent, advocate for active lifestyles like running and surfing, and organize social welfare programs that give back to the city. We believe community builds culture, and culture drives positive action.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg hover:border-red-950/50 transition-colors">
                <span className="text-2xl font-bold text-red-500 block">500+</span>
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Active Runners</span>
              </div>
              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg hover:border-red-950/50 transition-colors">
                <span className="text-2xl font-bold text-white block">15+</span>
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Social Events</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-zinc-950/60 border border-zinc-800/60 p-8 rounded-2xl backdrop-blur-sm relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3">
              <h3 className="text-xl font-bold uppercase tracking-wider text-red-500 flex items-center space-x-2">
                <ShieldCheck size={20} />
                <span>Our Mission</span>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                To build a vibrant, inclusive platform that promotes physical fitness, environment consciousness, and sound-culture while empowering youth through mental welfare initiatives.
              </p>
            </div>

            <div className="space-y-3 border-t border-zinc-900 pt-6">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                <Sparkles size={20} />
                <span>Our Vision</span>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                To redefine urban gatherings in India, bridging subcultures with sustainable, high-impact civic engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs text-red-500 font-bold uppercase tracking-widest">GET INVOLVED</span>
            <h2 className="text-3xl font-extrabold uppercase tracking-wide">UPCOMING EXPERIENCES</h2>
          </div>
          <Link 
            to="/events" 
            className="inline-flex items-center space-x-2 text-red-400 hover:text-white font-semibold transition-colors"
          >
            <span>See All Events</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.banner_url || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600'} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 rounded text-xs font-bold text-red-500 uppercase tracking-widest">
                  {event.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-lg font-bold uppercase group-hover:text-red-500 transition-colors line-clamp-1">
                  {event.name}
                </h3>
                <p className="text-zinc-400 text-xs font-light line-clamp-2">
                  {event.description}
                </p>
                <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-900/60 pt-4 mt-auto">
                  <span>{event.date}</span>
                  <span className="font-bold text-red-500">
                    {event.fee > 0 ? `INR ${event.fee}` : 'FREE'}
                  </span>
                </div>
                <Link 
                  to={`/events/${event.id}`} 
                  className="w-full py-2.5 bg-zinc-900 hover:bg-red-600 text-center font-bold text-xs uppercase tracking-wider rounded border border-zinc-800 hover:border-red-500 transition-all duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENTS & INFO SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 relative">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Announcements Card */}
          <div className="lg:col-span-2 bg-zinc-950/80 border border-zinc-900 p-8 rounded-2xl relative">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-red-650/20 text-red-500 rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-wider">Latest Announcements</h2>
            </div>
            
            <div className="space-y-6">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors flex gap-4">
                  <div className="text-red-500 mt-1"><Volume2 size={20} /></div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm uppercase text-white tracking-wide">{ann.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-semibold">{ann.created_at}</span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed font-light">{ann.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Form or Banner */}
          <div className="bg-gradient-to-b from-red-950/30 to-black border border-red-950/40 p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs text-red-500 font-bold uppercase tracking-widest block">CONTACT US</span>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">Rave House HQ</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Have questions about our registrations, partner sponsorships, or want to suggest our next community drive? We're available 24/7.
              </p>
            </div>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3 text-xs text-zinc-400">
                <MapPin size={16} className="text-red-500" />
                <span>The Rave House Garage, ECR Road, Chennai, IN</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-400">
                <Phone size={16} className="text-red-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-400">
                <Mail size={16} className="text-red-500" />
                <span>community@ravehouse.in</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
