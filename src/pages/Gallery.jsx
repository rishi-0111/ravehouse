import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { mockGallery, mockEvents } from '../mockData';
import { Camera, Play, Tag, ExternalLink, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [filterEventId, setFilterEventId] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryData() {
      try {
        setLoading(true);
        const { data: dbGallery } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: dbEvents } = await supabase
          .from('events')
          .select('id, name')
          .eq('status', 'published');

        if (dbGallery && dbGallery.length > 0) {
          setGalleryItems(dbGallery);
        } else {
          setGalleryItems(mockGallery);
        }

        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents);
        } else {
          setEvents(mockEvents);
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
        setGalleryItems(mockGallery);
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleryData();
  }, []);

  const filteredItems = filterEventId === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.event_id === filterEventId);

  const getEventName = (eventId) => {
    const found = events.find(e => e.id === eventId);
    return found ? found.name : 'Community Activity';
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="space-y-4 mb-12 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-widest">
            <Sparkles size={10} className="animate-spin-slow" />
            <span>MOMENTS & REVELRY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider">
            COMMUNITY <span className="text-red-500">GALLERY</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl font-light">
            Relive memories from our beach clean-ups, evening runs, technology circles, and active wellness sessions.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-12">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-3">Filter by Event</label>
          <select 
            value={filterEventId} 
            onChange={(e) => setFilterEventId(e.target.value)}
            className="px-4 py-3 bg-zinc-950 border border-zinc-900 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors max-w-md w-full"
          >
            <option value="All">All Events & Meets</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-t-2 border-red-500 border-r-2 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Loading Gallery...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-2xl bg-zinc-950/20">
            <p className="text-zinc-500 text-sm">No photos found for this selection.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative aspect-square"
              >
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={getEventName(item.event_id)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <Camera size={36} className="text-zinc-700" />
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-500 uppercase tracking-wider">
                      <Tag size={10} />
                      {getEventName(item.event_id)}
                    </span>
                    <p className="text-white text-xs font-semibold uppercase tracking-wide truncate">
                      {item.video_url ? 'Video Clip' : 'Action Shot'}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80 mt-2">
                      <span>Uploaded by {item.uploaded_by || 'Admin'}</span>
                      {item.video_url && <Play size={12} className="text-red-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
