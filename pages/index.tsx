import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Menubar } from '@radix-ui/react-menubar';
import { useEffect } from 'react';
import { supabase } from '@/supabase';

const Index = () => {
  
  async function ensureUser() {
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) console.error('Anon sign-in error:', error);
    }
  }

  useEffect(() => {
    ensureUser();
  }, []);
  
  return (
    <>
    <Header />
    <Menubar />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-12">
        <h1 className="scroll-m-20 text-8xl leading-16 font-extrabold tracking-tight lg:text-5xl">
          Share your college journey,
          find your chances
        </h1>
        <h2 className="mt-8 scroll-m-20 text-xl tracking-tight">
          click on "college results" to see other people's results,
          click on chance me to post your stats and get a result
        </h2>
      </div>
    </>
  );
};

export default Index;