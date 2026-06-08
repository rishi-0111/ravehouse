import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mockEvents } from '../mockData';
import { Calendar, MapPin, Grid, Tag, Sparkles } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Running Events', 'Beach Activities', 'Social Welfare Programs', 'Community Meetups'];

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { data: dbEvents, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: true });

        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents);
        } else {
          setEvents(mockEvents);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="space-y-4 mb-12 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-widest">
            <Sparkles size={10} className="animate-spin-slow" />
            <span>JOIN THE CULTURE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider">
            COMMUNITY <span className="text-red-500">EVENTS</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl font-light">
            Discover and participate in running races, beach meetups, cleanups, and social circles. Connect with your community today.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-red-650 text-white border-red-500 shadow-md shadow-red-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-t-2 border-red-500 border-r-2 rounded-full animate-spin" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Syncing Experiences...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-2xl bg-zinc-950/20">
            <p className="text-zinc-500 text-sm">No events found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Banner Image */}
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <img
                    src={event.banner_url || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 rounded text-[10px] font-bold text-red-500 uppercase tracking-widest">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2.5 py-1 bg-red-600/90 text-white rounded text-[10px] font-bold uppercase tracking-widest">
                      {event.fee > 0 ? `INR ${event.fee}` : 'FREE'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <h2 className="text-lg font-bold uppercase group-hover:text-red-500 transition-colors line-clamp-1">
                    {event.name}
                  </h2>
                  <p className="text-zinc-400 text-xs font-light line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2.5 text-xs text-zinc-500 pt-4 border-t border-zinc-900/60 mt-auto">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-red-500" />
                      <span>{event.date} at {event.time || "TBD"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-red-500" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    className="w-full py-3 bg-zinc-900 hover:bg-red-600 text-center font-bold text-xs uppercase tracking-wider rounded-lg border border-zinc-800 hover:border-red-500 transition-all duration-200"
                  >
                    Register / View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
