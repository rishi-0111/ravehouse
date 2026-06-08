import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Volunteer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [interestArea, setInterestArea] = useState('Running Events');
  
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !mobile) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('volunteers')
        .insert([{ name, email, mobile, interest_area: interestArea }]);

      if (error) throw error;

      setStatus('success');
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#ff003c', '#ffffff']
      });

      // Reset
      setName('');
      setEmail('');
      setMobile('');
    } catch (err) {
      console.error("Error submitting volunteer details:", err);
      setErrorMessage(err.message || 'Submission failed. Please try again.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Info Side */}
          <div className="md:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-widest">
              <Sparkles size={10} />
              <span>THE CORE FORCE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider leading-none">
              BECOME A <br />
              <span className="text-red-500">VOLUNTEER</span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Our volunteers are the heartbeat of the Rave House movement. Help manage track routes, run beach cleanup coordination, check tickets, or shoot content!
            </p>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                <h4 className="font-bold text-xs uppercase text-red-500 mb-1">Crew Benefits</h4>
                <p className="text-zinc-400 text-xs font-light">Exclusive crew neon tees, free entry passes to VIP events, and networking with creators and athletes.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-6">
            <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6">
              
              {status === 'success' ? (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center"><CheckCircle2 size={48} className="text-green-500" /></div>
                  <h3 className="text-xl font-bold uppercase">Application Received!</h3>
                  <p className="text-zinc-400 text-xs font-light">Thank you for stepping up. Our operations lead will get in touch with you shortly.</p>
                  <button 
                    onClick={() => setStatus(null)}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold uppercase tracking-wider rounded"
                  >
                    Register Another Person
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-2">Join the crew</h3>
                  
                  {errorMessage && (
                    <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start gap-2.5 text-xs text-red-400">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Karan Dev"
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
                      placeholder="e.g. karan@gmail.com"
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
                      placeholder="10-digit phone number"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interest Area *</label>
                    <select 
                      value={interestArea}
                      onChange={(e) => setInterestArea(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                    >
                      <option value="Running Events">Running Events</option>
                      <option value="Beach Activities">Beach Activities</option>
                      <option value="Social Welfare Programs">Social Welfare Programs</option>
                      <option value="Community Meetups">Community Meetups</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-4 py-3.5 bg-red-650 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-red-600/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-red-500"
                  >
                    <Send size={14} />
                    <span>{submitting ? "Submitting Application..." : "Submit Volunteer Crew Application"}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
