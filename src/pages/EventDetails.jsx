import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mockEvents } from '../mockData';
import { Calendar, MapPin, Clock, DollarSign, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Registration flow state
  const [regStatus, setRegStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const { data: dbEvent, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (dbEvent) {
          setEvent(dbEvent);
        } else {
          // Fall back to mock data
          const found = mockEvents.find(e => e.id === id);
          setEvent(found || null);
        }
      } catch (err) {
        console.error("Error loading event details:", err);
        const found = mockEvents.find(e => e.id === id);
        setEvent(found || null);
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !mobile) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (event.fee > 0 && !transactionId) {
      setErrorMessage('Please enter the UPI transaction ID to complete payment verification.');
      return;
    }

    try {
      setRegistering(true);
      setErrorMessage('');

      // 1. Participant registration logic:
      // Check if participant already exists in the database
      let participantId;
      const { data: existingParticipant, error: findError } = await supabase
        .from('participants')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingParticipant) {
        participantId = existingParticipant.id;
      } else {
        // Insert new participant
        const { data: newParticipant, error: insertPartError } = await supabase
          .from('participants')
          .insert([{ name: fullName, email, mobile, emergency_contact: emergencyContact }])
          .select('id')
          .single();

        if (insertPartError) throw insertPartError;
        participantId = newParticipant.id;
      }

      // 2. Registration Insertion
      const regId = crypto.randomUUID();
      const qrTicketUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${regId}`;

      const { error: regError } = await supabase
        .from('registrations')
        .insert([{
          id: regId,
          participant_id: participantId,
          event_id: event.id,
          transaction_id: event.fee > 0 ? transactionId : null,
          payment_status: event.fee > 0 ? 'pending' : 'free',
          registration_status: event.fee > 0 ? 'pending' : 'approved',
          qr_ticket_url: qrTicketUrl,
          attendance_status: 'absent'
        }]);

      if (regError) {
        // Handle unique constraint or other DB errors
        if (regError.code === '23505') {
          throw new Error("You have already registered for this event.");
        }
        throw regError;
      }

      // Success
      setRegStatus('success');
      setTicketDetails({
        id: regId,
        qrCode: qrTicketUrl,
        fee: event.fee
      });

      // Fire confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff003c', '#ffffff', '#22c55e']
      });

    } catch (err) {
      console.error("Registration failed:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setRegStatus('error');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 border-t-2 border-red-500 border-r-2 rounded-full animate-spin" />
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Configuring Experience...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col items-center justify-center space-y-4 font-sans">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="text-xl font-bold uppercase">Event not found</h2>
        <Link to="/events" className="text-sm text-red-400 hover:text-white transition-colors underline">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <Link to="/events" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors mb-8">
          <ArrowLeft size={14} />
          <span>Back to Event Catalogue</span>
        </Link>

        {/* Success / Final Ticket Screen */}
        {regStatus === 'success' && ticketDetails && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl">
            <div className="flex justify-center">
              <CheckCircle2 size={56} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold uppercase tracking-wide">Registration Submitted!</h2>
              <p className="text-zinc-400 text-xs font-light">
                {ticketDetails.fee > 0 
                  ? "Your payment verification is pending admin approval. You will receive an email once approved."
                  : "Welcome to the crew! Your registration is approved. Your ticket details are shown below."}
              </p>
            </div>

            {/* QR Card Container */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm mx-auto space-y-4">
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-bold">Entry Pass QR Code</span>
              <div className="flex justify-center bg-white p-4 rounded-lg">
                <img src={ticketDetails.qrCode} alt="QR Ticket" className="w-48 h-48" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Ticket Reference ID</p>
                <code className="text-xs text-red-500 font-mono select-all break-all">{ticketDetails.id}</code>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/events" 
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Browse Events
              </Link>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-red-650 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Print Ticket
              </button>
            </div>
          </div>
        )}

        {/* Standard Details & Form Screen */}
        {regStatus !== 'success' && (
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Event Info Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Banner */}
              <div className="h-72 sm:h-96 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 relative">
                <img 
                  src={event.banner_url || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200'} 
                  alt={event.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-6 left-6 px-3 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 rounded text-xs font-bold text-red-500 uppercase tracking-widest">
                  {event.category}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide leading-tight">{event.name}</h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">DATE</span>
                    <span className="text-xs font-semibold text-white">{event.date}</span>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">TIME</span>
                    <span className="text-xs font-semibold text-white">{event.time || "TBD"}</span>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">DEADLINE</span>
                    <span className="text-xs font-semibold text-red-500">{event.registration_deadline}</span>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">FEE</span>
                    <span className="text-xs font-bold text-green-500">{event.fee > 0 ? `INR ${event.fee}` : 'FREE'}</span>
                  </div>
                </div>
              </div>

              {/* Venue & Location Link */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">Venue Details</h3>
                <div className="space-y-2 text-zinc-400 text-xs">
                  <p className="font-semibold text-white">{event.venue}</p>
                  {event.maps_link && (
                    <a 
                      href={event.maps_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1 text-red-400 hover:text-white transition-colors underline pt-1 font-semibold"
                    >
                      <MapPin size={12} />
                      <span>Open in Google Maps</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-2">About the Event</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-light whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>

            {/* Registration Form Column */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl shadow-xl sticky top-28 space-y-6">
                <div className="border-l-4 border-red-600 pl-3">
                  <h2 className="text-xl font-bold uppercase tracking-wider">EVENT REGISTRATION</h2>
                  <span className="text-[10px] text-zinc-500 font-medium">No account required.</span>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start gap-3 text-xs text-red-400">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Emergency Contact (Optional)</label>
                    <input 
                      type="text" 
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Contact name & number"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Payment Details if Event is Paid */}
                  {event.fee > 0 && (
                    <div className="p-5 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-4 mt-6">
                      <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">PAYMENT DETAILS</h4>
                      <div className="text-xs text-zinc-400 space-y-1">
                        <p className="flex justify-between">
                          <span>Amount Due:</span>
                          <span className="font-bold text-white">INR {event.fee}</span>
                        </p>
                        <p className="flex justify-between">
                          <span>UPI ID:</span>
                          <span className="font-mono text-white select-all">{event.upi_id || "ravehouse@ybl"}</span>
                        </p>
                      </div>

                      {/* Display QR code */}
                      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg max-w-[180px] mx-auto">
                        <img 
                          src={event.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${event.upi_id || 'ravehouse@ybl'}&pn=Rave%20House%2520Events&am=${event.fee}.00`} 
                          alt="Payment QR" 
                          className="w-full aspect-square"
                        />
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">Scan to Pay</span>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Transaction Ref/ID *</label>
                        <input 
                          type="text" 
                          required 
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter 12-digit transaction ID"
                          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full mt-4 py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-red-600/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-red-500"
                  >
                    <Send size={14} />
                    <span>{registering ? "Confirming Spot..." : "Submit Registration"}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
