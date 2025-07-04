import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) setError(error.message);
    else setStep('otp');
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'magiclink' });
    setLoading(false);
    if (error) setError(error.message);
    else if (data.session) onLogin(data.session);
    else setError('Invalid OTP or session');
  }

  return (
    <div style={{ maxWidth: 340, margin: '80px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, background: '#fff', fontFamily: 'verdana' }}>
      <h2 style={{ marginBottom: 24 }}>Sign In</h2>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp}>
          <label style={{ display: 'block', marginBottom: 8 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 18, borderRadius: 5, border: '1px solid #bbb', fontSize: 16 }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 6, background: '#1976d2', color: '#fff', fontSize: 16, border: 'none', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <label style={{ display: 'block', marginBottom: 8 }}>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 18, borderRadius: 5, border: '1px solid #bbb', fontSize: 16, letterSpacing: 4 }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 6, background: '#388e3c', color: '#fff', fontSize: 16, border: 'none', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" style={{ width: '100%', padding: 8, borderRadius: 6, background: '#eee', color: '#333', fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 10 }} onClick={() => setStep('email')}>
            Back
          </button>
        </form>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}
