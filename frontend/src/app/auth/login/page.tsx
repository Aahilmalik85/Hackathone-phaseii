'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { fadeVariants, slideUpVariants } from '@/lib/animations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  // ✅ Redirect already logged-in users to tasks
  useEffect(() => {
    if (!loading && user) {
      router.push('/tasks');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/tasks'); // ✅ only redirect after successful login
    } catch (err: any) {
      setError(
        err.message?.includes('Invalid')
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4">
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={slideUpVariants} className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent">
              Todo App
            </h1>
          </Link>
          <p className="text-[#38bdf8] mt-2">Sign in to continue</p>
        </motion.div>

        <Card className="glass border border-green-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[#e6ffe6]">Welcome Back</CardTitle>
            <CardDescription className="text-[#77cc77]">
              Access your tasks securely
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-600/10 border border-red-600 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
              />
              <Button
                type="submit"
                 isLoading={loadingForm}
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-400/30"
                rightIcon={!loadingForm && <ArrowRight size={18} />}
>
                Sign In
               </Button> 
              </form>

            <p className="mt-6 text-center text-sm text-[#38bdf8]">
              Don’t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-[#38bdf8] hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
