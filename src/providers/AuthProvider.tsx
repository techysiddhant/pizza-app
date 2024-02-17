import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { supabase } from 'src/lib/supabase';

type AuthData = {
 session: Session | null;
 loading: Boolean;
 profile: any;
 isAdmin: Boolean
};


const AuthContext = createContext<AuthData>({
 session: null,
 loading: true,
 profile: null,
 isAdmin: false
});

export default function AuthProvider({ children }: PropsWithChildren) {
 const [session, setSession] = useState<Session | null>(null);
 const [loading, setLoading] = useState(true);
 const [profile, setProfile] = useState(null);
 useEffect(() => {
  const fetchSession = async () => {
   const { data: { session }, error, } = await supabase.auth.getSession();
   setSession(session)

   // console.log(data);
   if (session) {
    const { data } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single();
    setProfile(data || null);
   }
   setLoading(false);
  }
  fetchSession();
  supabase.auth.onAuthStateChange((_event, session) => {
   setSession(session);
  })
 }, [])
 return <AuthContext.Provider value={{ session, loading, profile, isAdmin: profile?.group === "ADMIN" }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);