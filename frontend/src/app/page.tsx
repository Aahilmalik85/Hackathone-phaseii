'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ✅ Redirect logged-in users to /tasks
  useEffect(() => {
    if (!loading && user) {
      router.push('/tasks');
    }
  }, [user, loading, router]);

  // ✅ While auth is loading, show spinner instead of flashing tasks
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-lg text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f1f0f] via-[#1a2b1a] to-[#0f1f0f] text-[#e6ffe6]">
      <section className="relative z-10"><Hero /></section>
      <section className="relative z-10 bg-[#1a2b1a]"><Features /></section>
      <section className="relative z-10 bg-[#32cd32]/10"><CTA /></section>
      <Footer />
    </main>
  );
}
