'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { fadeVariants, slideUpVariants } from '@/lib/animations';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, signUp, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/tasks');
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError(null);

    try {
      await signUp(name, email, password);
      router.push('/tasks');
    } catch (err: any) {
      setError(
        err.message?.includes('exists')
          ? 'User already exists. Please sign in instead.'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4">
      <motion.div variants={fadeVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={slideUpVariants} className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text">
              Todo App
            </h1>
          </Link>
          <p className="text-[#bae6fd] mt-2">Create your account</p>
        </motion.div>

        <Card className="glass border border-[#94a3b8] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[#e0f2fe]">Create Account</CardTitle>
            <CardDescription className="text-[#7dd3fc]">
              Start managing your tasks efficiently
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-red-200/30 border border-red-300 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={18} />}
                required
              />

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
                helperText="Minimum 8 characters"
                minLength={8}
                required
              />

              <Button
                type="submit"
                isLoading={loadingForm}
                className="w-full bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#3b82f6] text-white shadow-lg"
                rightIcon={!loadingForm && <ArrowRight size={18} />}
              >
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#bae6fd]">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-[#38bdf8] hover:text-[#0ea5e9] hover:underline font-semibold transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-[#7dd3fc]">
          Designed by Dil Awaiz Malik • GIAIC ID: 00052516
        </p>
      </motion.div>
    </main>
  );
}
