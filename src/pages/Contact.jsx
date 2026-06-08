import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { mockEvents } from '../mockData';
import { Send, CheckCircle2, AlertCircle, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  // Feedbacks
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Suggestions
  const [sugName, setSugName] = useState('');
  const [sugEmail, setSugEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Statuses
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [suggestionStatus, setSuggestionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await supabase.from('events').select('id, name').eq('status', 'published');
        if (data && data.length > 0) {
          setEvents(data);
          setSelectedEventId(data[0].id);
        } else {
          setEvents(mockEvents);
          setSelectedEventId(mockEvents[0].id);
        }
      } catch (err) {
        setEvents(mockEvents);
        setSelectedEventId(mockEvents[0].id);
      }
    }
    fetchEvents();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackEmail || !comment) {
      setErrorMessage('Please fill in your email and comment.');
      return;
    }

    try {
      setSubmittingFeedback(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('feedback')
        .insert([{ 
          event_id: selectedEventId || null, 
          participant_email: feedbackEmail, 
          rating: parseInt(rating), 
          comment 
        }]);

      if (error) throw error;

      setFeedbackStatus('success');
      confetti({
        particleCount: 50,
        colors: ['#ff003c', '#ffffff']
      });
      setFeedbackEmail('');
      setComment('');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Feedback submission failed.');
      setFeedbackStatus('error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion) {
      return;
    }

    try {
      setSubmittingSuggestion(true);
      const { error } = await supabase
        .from('suggestions')
        .insert([{ 
          name: sugName, 
          email: sugEmail, 
          suggestion 
        }]);

      if (error) throw error;

      setSuggestionStatus('success');
      confetti({
        particleCount: 50,
        colors: ['#ff003c', '#ffffff']
      });
      setSugName('');
      setSugEmail('');
      setSuggestion('');
    } catch (err) {
      console.error(err);
      setSuggestionStatus('error');
    } finally {
      setSubmittingSuggestion(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-widest">
            <Sparkles size={10} />
            <span>CONNECT & GROW</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider">
            FEEDBACK & <span className="text-red-500">SUGGESTIONS</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto font-light">
            We are built on feedback. Rate our recent community gigs or submit a general recommendation to enhance our programming.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Feedback Section */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6">
            <div className="border-l-4 border-red-650 pl-3">
              <h2 className="text-lg font-bold uppercase tracking-wider">Event Feedback</h2>
              <span className="text-[10px] text-zinc-500 font-medium">Review your recent experience</span>
            </div>

            {feedbackStatus === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                <h3 className="text-base font-bold uppercase">Feedback Received!</h3>
                <p className="text-zinc-500 text-xs font-light">Thank you for helping us refine our community operations.</p>
                <button 
                  onClick={() => setFeedbackStatus(null)}
                  className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded"
                >
                  Write Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Event *</label>
                  <select 
                    value={selectedEventId} 
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Email *</label>
                  <input 
                    type="email"
                    required
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="e.g. participant@gmail.com"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Event Rating *</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-colors"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? 'fill-red-500 text-red-500' : 'text-zinc-650'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Comment *</label>
                  <textarea 
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked and how we can improve..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-3 bg-red-650 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-colors flex items-center justify-center space-x-2 border border-red-500"
                >
                  <Send size={12} />
                  <span>{submittingFeedback ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </form>
            )}

          </div>

          {/* Suggestion Section */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl space-y-6">
            <div className="border-l-4 border-white pl-3">
              <h2 className="text-lg font-bold uppercase tracking-wider">General Suggestions</h2>
              <span className="text-[10px] text-zinc-500 font-medium">Share your innovative proposals</span>
            </div>

            {suggestionStatus === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                <h3 className="text-base font-bold uppercase">Suggestion Logged!</h3>
                <p className="text-zinc-500 text-xs font-light">Your suggestion was added. We review submissions at our weekly syncs.</p>
                <button 
                  onClick={() => setSuggestionStatus(null)}
                  className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded"
                >
                  Submit Another Suggestion
                </button>
              </div>
            ) : (
              <form onSubmit={handleSuggestionSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name (Optional)</label>
                  <input 
                    type="text"
                    value={sugName}
                    onChange={(e) => setSugName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email (Optional)</label>
                  <input 
                    type="email"
                    value={sugEmail}
                    onChange={(e) => setSugEmail(e.target.value)}
                    placeholder="e.g. john@gmail.com"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Suggestion *</label>
                  <textarea 
                    rows={6}
                    required
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Describe your suggestion (e.g. Next marathon should be along ECR road)..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingSuggestion}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg border border-zinc-850 hover:border-zinc-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send size={12} />
                  <span>{submittingSuggestion ? 'Submitting...' : 'Submit Suggestion'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
