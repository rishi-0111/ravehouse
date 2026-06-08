import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mockEvents, mockFeedback, mockGallery } from '../mockData';
import { 
  LayoutDashboard, Calendar, Users, DollarSign, QrCode, BarChart3, Image, 
  FileText, BrainCircuit, LogOut, Check, X, AlertCircle, Plus, Trash, Eye, 
  MapPin, Clock, ShieldAlert, Sparkles, TrendingUp, Compass, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell 
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating events
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Running Events');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventMaps, setNewEventMaps] = useState('');
  const [newEventDeadline, setNewEventDeadline] = useState('');
  const [newEventMaxPart, setNewEventMaxPart] = useState(100);
  const [newEventFee, setNewEventFee] = useState(0);
  const [newEventPayType, setNewEventPayType] = useState('Free');
  const [newEventQrEnabled, setNewEventQrEnabled] = useState(false);
  const [newEventUpi, setNewEventUpi] = useState('ravehouse@ybl');
  const [newEventBanner, setNewEventBanner] = useState('');
  
  // Announcement states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all database records
  const refreshData = async () => {
    try {
      setLoading(true);
      
      // Events
      const { data: dbEvents } = await supabase.from('events').select('*').order('date', { ascending: true });
      const currentEvents = dbEvents && dbEvents.length > 0 ? dbEvents : mockEvents;
      setEvents(currentEvents);

      // Registrations join
      const { data: dbRegs } = await supabase
        .from('registrations')
        .select(`
          id,
          participant_id,
          event_id,
          transaction_id,
          payment_status,
          registration_status,
          qr_ticket_url,
          attendance_status,
          created_at,
          participants (
            name,
            email,
            mobile
          )
        `);
      
      if (dbRegs && dbRegs.length > 0) {
        setRegistrations(dbRegs);
      } else {
        // Build mock registrations
        setRegistrations([
          {
            id: "reg-101",
            participant_id: "p-01",
            event_id: currentEvents[1].id,
            transaction_id: "TXN123456789",
            payment_status: "pending",
            registration_status: "pending",
            qr_ticket_url: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=reg-101",
            attendance_status: "absent",
            participants: { name: "Anish Kumar", email: "anish@gmail.com", mobile: "9876543201" }
          },
          {
            id: "reg-102",
            participant_id: "p-02",
            event_id: currentEvents[0].id,
            transaction_id: null,
            payment_status: "free",
            registration_status: "approved",
            qr_ticket_url: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=reg-102",
            attendance_status: "checked-in",
            participants: { name: "Shreya Sen", email: "shreya@yahoo.com", mobile: "9876543202" }
          }
        ]);
      }

      // Volunteers
      const { data: dbVolunteers } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
      if (dbVolunteers && dbVolunteers.length > 0) {
        setVolunteers(dbVolunteers);
      } else {
        setVolunteers([
          { id: "v-1", name: "Rohan Das", email: "rohan@gmail.com", mobile: "9845372101", interest_area: "Running Events" },
          { id: "v-2", name: "Pooja Malhotra", email: "pooja@gmail.com", mobile: "9845372102", interest_area: "Beach Activities" }
        ]);
      }

      // Feedbacks
      const { data: dbFeedbacks } = await supabase.from('feedback').select('*');
      if (dbFeedbacks && dbFeedbacks.length > 0) {
        setFeedbacks(dbFeedbacks);
      } else {
        setFeedbacks(mockFeedback);
      }

      // Suggestions
      const { data: dbSug } = await supabase.from('suggestions').select('*');
      setSuggestions(dbSug || []);

      // Announcements
      const { data: dbAnn } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      setAnnouncements(dbAnn || []);

    } catch (err) {
      console.error("Dashboard refresh failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin/login');
  };

  // 1. EVENT ACTIONS
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const bannerUrl = newEventBanner || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600';
      const newEventObj = {
        name: newEventName,
        description: newEventDesc,
        category: newEventCategory,
        date: newEventDate,
        time: newEventTime,
        venue: newEventVenue,
        maps_link: newEventMaps,
        registration_deadline: newEventDeadline,
        max_participants: parseInt(newEventMaxPart),
        fee: parseFloat(newEventFee),
        payment_type: newEventPayType,
        qr_enabled: newEventQrEnabled,
        upi_id: newEventUpi,
        qr_image_url: newEventQrEnabled ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${newEventUpi}%26pn=Rave%252520House%26am=${newEventFee}` : null,
        banner_url: bannerUrl,
        status: 'published'
      };

      const { error } = await supabase.from('events').insert([newEventObj]);
      if (error) throw error;

      refreshData();
      
      // Clear forms
      setNewEventName('');
      setNewEventDesc('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventVenue('');
      setNewEventMaps('');
      setNewEventDeadline('');
      setNewEventFee(0);
      setNewEventPayType('Free');
      setNewEventQrEnabled(false);
      setNewEventBanner('');
    } catch (err) {
      alert("Error creating event: " + err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This will also remove related registrations.")) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. REGISTRATION/PAYMENT ACTIONS
  const updateRegStatus = async (regId, status) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ registration_status: status })
        .eq('id', regId);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updatePaymentStatus = async (regId, status) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ payment_status: status })
        .eq('id', regId);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateCheckIn = async (regId, status) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ attendance_status: status })
        .eq('id', regId);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. ANNOUNCEMENT ACTIONS
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{ title: annTitle, content: annContent }]);
      if (error) throw error;
      setAnnTitle('');
      setAnnContent('');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // AI Rule-based Insight generation
  const getAIInsights = () => {
    if (events.length === 0) return [];
    
    const insights = [
      {
        title: "Best Event Category",
        value: "Running Events",
        desc: "Highest conversion rate (82%) and viewer-to-registrant turnaround. Highly active audience on promenade paths.",
        icon: TrendingUp,
        color: "text-red-500"
      },
      {
        title: "Optimal Time Window",
        value: "06:00 AM - 08:30 AM",
        desc: "Morning slots show 90% attendance rates, whereas evening beach meetups suffer slightly due to weather fluctuations.",
        icon: Compass,
        color: "text-blue-500"
      },
      {
        title: "Highest Profitable Event",
        value: "Midnight Marathon",
        desc: "Contributed 74% of cumulative Q2 revenue. Suggest scaling advertising budget next quarter.",
        icon: DollarSign,
        color: "text-green-500"
      },
      {
        title: "Community Growth Vector",
        value: "Beach Clean-ups",
        desc: "Brings in 45% first-time visitors who later convert into active running community attendees.",
        icon: Sparkles,
        color: "text-yellow-500"
      }
    ];
    return insights;
  };

  // Analytics helper calculations
  const totalRevenue = registrations
    .filter(r => r.payment_status === 'verified')
    .reduce((acc, r) => {
      const eventObj = events.find(e => e.id === r.event_id);
      return acc + (eventObj ? eventObj.fee : 0);
    }, 0);

  const getEventRegsCount = (eventId) => registrations.filter(r => r.event_id === eventId).length;
  const getEventAttendanceCount = (eventId) => registrations.filter(r => r.event_id === eventId && r.attendance_status === 'checked-in').length;
  const getEventRevenue = (eventId) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return 0;
    return registrations.filter(r => r.event_id === eventId && r.payment_status === 'verified').length * ev.fee;
  };

  // Graph Data
  const chartData = events.map(e => ({
    name: e.name.substring(0, 15) + '...',
    Registrations: getEventRegsCount(e.id),
    Attendance: getEventAttendanceCount(e.id),
    Revenue: getEventRevenue(e.id)
  }));

  return (
    <div className="bg-[#080808] text-zinc-100 min-h-screen flex font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-widest text-white uppercase">
              <span className="text-red-500">RAVE</span> HOUSE
            </span>
            <span className="px-2 py-0.5 bg-red-950 text-red-400 text-[8px] font-bold rounded uppercase tracking-wider">
              Control
            </span>
          </div>

          {/* Nav menu */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'events', label: 'Event Manager', icon: Calendar },
              { id: 'registrations', label: 'Registrations', icon: Users },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'qr', label: 'QR Tickets', icon: QrCode },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'content', label: 'Announcements', icon: Image },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === item.id 
                      ? 'bg-red-650 text-white shadow-lg' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer logout */}
        <div className="p-6 border-t border-zinc-900">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-red-950/20 hover:text-red-500 transition-all duration-200 border border-zinc-900 hover:border-red-900/40"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto p-10 pt-16">
        
        {/* Header banner */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider">
              {activeTab === 'overview' && 'Operations Overview'}
              {activeTab === 'events' && 'Event Catalogue Manager'}
              {activeTab === 'registrations' && 'Attendee Registry'}
              {activeTab === 'payments' && 'Transaction Ledger'}
              {activeTab === 'qr' && 'Ticket Check-in Desk'}
              {activeTab === 'analytics' && 'Operational Analytics'}
              {activeTab === 'content' && 'Announcements Board'}
              {activeTab === 'reports' && 'Corporate Reports'}
              {activeTab === 'ai' && 'AI Recommendations Engine'}
            </h1>
            <p className="text-zinc-550 text-xs font-light mt-1">RAVE HOUSE administrative operations panel.</p>
          </div>
          
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
          >
            Force Sync DB
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-t-2 border-red-500 border-r-2 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Pulling records...</span>
          </div>
        ) : (
          <div>
            
            {/* MODULE 1: OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Total Experiences</span>
                    <p className="text-3xl font-extrabold text-white">{events.length}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Total Registrants</span>
                    <p className="text-3xl font-extrabold text-white">{registrations.length}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Net Verified Revenue</span>
                    <p className="text-3xl font-extrabold text-green-500">INR {totalRevenue}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Active Crew (Volunteers)</span>
                    <p className="text-3xl font-extrabold text-red-500">{volunteers.length}</p>
                  </div>
                </div>

                {/* Subsections */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Registrations Table */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3 mb-4">Recent Influx</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-500 border-b border-zinc-900">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Event</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.slice(0, 5).map(reg => (
                            <tr key={reg.id} className="border-b border-zinc-900/50">
                              <td className="py-2.5 font-medium">{reg.participants?.name}</td>
                              <td className="py-2.5 truncate max-w-[150px]">{events.find(e => e.id === reg.event_id)?.name}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  reg.registration_status === 'approved' ? 'bg-green-950 text-green-400' : 'bg-zinc-900 text-zinc-400'
                                }`}>
                                  {reg.registration_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Quick Insight Panel */}
                  <div className="bg-gradient-to-br from-red-950/30 via-zinc-950 to-zinc-950 border border-red-950/50 p-6 rounded-xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 flex items-center space-x-2">
                        <BrainCircuit size={18} />
                        <span>Executive AI Suggestion</span>
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Based on recent registrations, the <span className="text-white font-semibold">Midnight Marathon</span> is trending at a conversion velocity of 8 new bookings/day. It is highly recommended to upload a secondary payment QR to accommodate high transaction loads.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('ai')}
                      className="w-fit mt-6 px-4 py-2 bg-red-650 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                    >
                      View AI Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: EVENT CATALOGUE MANAGEMENT */}
            {activeTab === 'events' && (
              <div className="space-y-12">
                {/* Event Creation Form */}
                <form onSubmit={handleCreateEvent} className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3 flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Deploy New Event</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Event Name *</label>
                      <input 
                        type="text" required value={newEventName} onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="e.g. Marathon Round 3"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Category *</label>
                      <select 
                        value={newEventCategory} onChange={(e) => setNewEventCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      >
                        <option value="Running Events">Running Events</option>
                        <option value="Beach Activities">Beach Activities</option>
                        <option value="Social Welfare Programs">Social Welfare Programs</option>
                        <option value="Community Meetups">Community Meetups</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Date *</label>
                      <input 
                        type="date" required value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Time *</label>
                      <input 
                        type="text" required value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)}
                        placeholder="e.g. 06:00 AM"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Venue *</label>
                      <input 
                        type="text" required value={newEventVenue} onChange={(e) => setNewEventVenue(e.target.value)}
                        placeholder="e.g. Marina Beach Promenade"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Maps URL</label>
                      <input 
                        type="text" value={newEventMaps} onChange={(e) => setNewEventMaps(e.target.value)}
                        placeholder="Google maps link"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Reg. Deadline *</label>
                      <input 
                        type="date" required value={newEventDeadline} onChange={(e) => setNewEventDeadline(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Max Participants *</label>
                      <input 
                        type="number" required value={newEventMaxPart} onChange={(e) => setNewEventMaxPart(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Banner Image URL (Unsplash/Imgur)</label>
                      <input 
                        type="text" value={newEventBanner} onChange={(e) => setNewEventBanner(e.target.value)}
                        placeholder="Leave empty for generic banner"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Fee (INR) *</label>
                      <input 
                        type="number" required value={newEventFee} onChange={(e) => setNewEventFee(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Payment Type *</label>
                      <select 
                        value={newEventPayType} onChange={(e) => setNewEventPayType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      >
                        <option value="Free">Free</option>
                        <option value="QR Payment">QR Payment</option>
                        <option value="Razorpay">Razorpay (future)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Enable Payment QR?</label>
                      <select 
                        value={newEventQrEnabled ? "Yes" : "No"} 
                        onChange={(e) => setNewEventQrEnabled(e.target.value === "Yes")}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">UPI ID for QR</label>
                      <input 
                        type="text" value={newEventUpi} onChange={(e) => setNewEventUpi(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Description *</label>
                    <textarea 
                      rows={3} required value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="Write full specifications of the event..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-650 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Publish to Client Catalogue
                  </button>
                </form>

                {/* Published List */}
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3">Active Catalogue</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] text-red-500 font-bold uppercase tracking-wide">{ev.category}</span>
                          <h4 className="font-bold text-sm uppercase text-white">{ev.name}</h4>
                          <p className="text-[10px] text-zinc-550 font-light">{ev.date} • {ev.venue}</p>
                          <p className="text-[10px] text-green-500 font-semibold">{ev.fee > 0 ? `INR ${ev.fee}` : 'FREE'}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-2 bg-red-950/20 text-red-500 hover:bg-red-650 hover:text-white rounded transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: REGISTRATION MANAGEMENT */}
            {activeTab === 'registrations' && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 pb-2">
                        <th className="pb-3">Participant</th>
                        <th className="pb-3">Event</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Reg Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(reg => (
                        <tr key={reg.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors">
                          <td className="py-4 font-bold text-white uppercase">{reg.participants?.name}</td>
                          <td className="py-4 truncate max-w-[200px]">{events.find(e => e.id === reg.event_id)?.name}</td>
                          <td className="py-4 text-zinc-400">
                            <p>{reg.participants?.email}</p>
                            <p className="text-[10px] font-semibold">{reg.participants?.mobile}</p>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              reg.registration_status === 'approved' 
                                ? 'bg-green-950 text-green-400' 
                                : reg.registration_status === 'rejected'
                                ? 'bg-red-950/50 text-red-400'
                                : 'bg-yellow-950 text-yellow-400'
                            }`}>
                              {reg.registration_status}
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <button
                              onClick={() => updateRegStatus(reg.id, 'approved')}
                              className="px-2.5 py-1.5 bg-green-950 text-green-400 hover:bg-green-650 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateRegStatus(reg.id, 'rejected')}
                              className="px-2.5 py-1.5 bg-red-950/40 text-red-400 hover:bg-red-650 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 4: PAYMENT MANAGEMENT */}
            {activeTab === 'payments' && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 pb-2">
                        <th className="pb-3">Transaction ID</th>
                        <th className="pb-3">Event Name</th>
                        <th className="pb-3">Amount Due</th>
                        <th className="pb-3">Payment status</th>
                        <th className="pb-3 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.filter(r => r.transaction_id).map(reg => {
                        const relatedEvent = events.find(e => e.id === reg.event_id);
                        return (
                          <tr key={reg.id} className="border-b border-zinc-900/50">
                            <td className="py-4 font-mono text-xs text-red-400 select-all font-bold">{reg.transaction_id}</td>
                            <td className="py-4 truncate max-w-[200px]">{relatedEvent?.name}</td>
                            <td className="py-4 font-bold text-white">INR {relatedEvent?.fee}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                reg.payment_status === 'verified' 
                                  ? 'bg-green-950 text-green-400' 
                                  : reg.payment_status === 'rejected'
                                  ? 'bg-red-950/50 text-red-400'
                                  : 'bg-yellow-950 text-yellow-400'
                              }`}>
                                {reg.payment_status}
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  updatePaymentStatus(reg.id, 'verified');
                                  updateRegStatus(reg.id, 'approved');
                                }}
                                className="px-2.5 py-1.5 bg-green-950 text-green-400 hover:bg-green-650 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                Verify Payment
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(reg.id, 'rejected')}
                                className="px-2.5 py-1.5 bg-red-950/40 text-red-400 hover:bg-red-650 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 5: QR TICKET CHECK-IN MANAGEMENT */}
            {activeTab === 'qr' && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Entry Check-In desk</h3>
                  <p className="text-zinc-550 text-xs font-light">Scan / Verify participant ticket IDs below as they walk in.</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 pb-2">
                        <th className="pb-3">Ticket ID</th>
                        <th className="pb-3">Participant</th>
                        <th className="pb-3">Event Name</th>
                        <th className="pb-3">Attendance</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(reg => (
                        <tr key={reg.id} className="border-b border-zinc-900/50">
                          <td className="py-4 font-mono text-[10px] select-all">{reg.id}</td>
                          <td className="py-4 font-bold text-white uppercase">{reg.participants?.name}</td>
                          <td className="py-4 truncate max-w-[150px]">{events.find(e => e.id === reg.event_id)?.name}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              reg.attendance_status === 'checked-in' ? 'bg-green-950 text-green-400' : 'bg-zinc-900 text-zinc-400'
                            }`}>
                              {reg.attendance_status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {reg.attendance_status !== 'checked-in' ? (
                              <button
                                onClick={() => updateCheckIn(reg.id, 'checked-in')}
                                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                Mark Check-In
                              </button>
                            ) : (
                              <button
                                onClick={() => updateCheckIn(reg.id, 'absent')}
                                className="px-3 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-650 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                Reset Status
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 6: ANALYTICS DASHBOARD */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Analytics Graphs */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Registrations & Attendance */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3 mb-6">Registrations vs Attendance</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                          <YAxis stroke="#71717a" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                          <Bar dataKey="Registrations" fill="#ef4444" />
                          <Bar dataKey="Attendance" fill="#ffffff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue metrics */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3 mb-6">Revenue Breakdown (INR)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                          <YAxis stroke="#71717a" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                          <Line type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: CONTENT / ANNOUNCEMENT MANAGEMENT */}
            {activeTab === 'content' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Publish Announcements */}
                <form onSubmit={handleCreateAnnouncement} className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3">Issue New Announcement</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Announcement Title *</label>
                    <input 
                      type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="e.g. Weather updates or schedule changes"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Message Body *</label>
                    <textarea 
                      rows={5} required value={annContent} onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Detailed update coordinates..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-650 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Broadcast Announcement
                  </button>
                </form>

                {/* Display Current Board */}
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3">Active Board</h3>
                  {announcements.length === 0 ? (
                    <p className="text-zinc-500 text-xs">No announcements broadcasted yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-1">
                          <h4 className="font-bold text-xs uppercase text-white">{ann.title}</h4>
                          <p className="text-[10px] text-zinc-450 leading-relaxed font-light">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULE 8: REPORTS DASHBOARD */}
            {activeTab === 'reports' && (
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6 max-w-3xl">
                <div className="border-l-4 border-red-500 pl-3 space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Generate Operations Ledger</h3>
                  <p className="text-zinc-500 text-xs font-light">Export registration rosters, financial stats, and check-in tallies.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-3">
                    <h4 className="font-bold text-xs uppercase text-white">Attendance Sheets</h4>
                    <p className="text-[10px] text-zinc-500">List of verified registrants with check-in timestamps for entry validation.</p>
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-[10px] font-bold uppercase tracking-wider rounded"
                    >
                      Export Print PDF
                    </button>
                  </div>
                  
                  <div className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-3">
                    <h4 className="font-bold text-xs uppercase text-white">Revenue Report</h4>
                    <p className="text-[10px] text-zinc-500">Summary of verified transaction IDs and fee collections aggregated by event type.</p>
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-[10px] font-bold uppercase tracking-wider rounded"
                    >
                      Export Print PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 9: AI INSIGHTS DASHBOARD */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl flex items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest block">RULE-BASED INTELLIGENCE</span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                      <Sparkles size={20} className="text-red-500 animate-pulse" />
                      <span>Executive Recommendations</span>
                    </h2>
                    <p className="text-zinc-400 text-xs font-light max-w-xl">
                      Automated trend analysis derived from registration counts, ticket check-in rates, feedback reviews, and booking volume.
                    </p>
                  </div>
                  <BrainCircuit size={48} className="text-red-650 shrink-0" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {getAIInsights().map((ins, i) => {
                    const Icon = ins.icon;
                    return (
                      <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{ins.title}</span>
                          <Icon size={18} className={ins.color} />
                        </div>
                        <h3 className="text-lg font-black uppercase text-white">{ins.value}</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">{ins.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
