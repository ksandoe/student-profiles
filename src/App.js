import './App.css';
import Profiles from './Profiles';
import Login from './Login';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <Login onLogin={setSession} />;
  }
  return <Profiles />;
}

export default App;
