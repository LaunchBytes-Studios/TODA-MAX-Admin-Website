import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabaseClient';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const appUrl =
    import.meta.env.VITE_APP_URL ??
    import.meta.env.VITE_FRONTEND_URL ??
    'http://localhost:5173';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${appUrl}/admin/reset-password`,
        },
      );

      if (error) {
        throw error;
      }

      setSent(true);
      toast.success('If your email exists, a reset link has been sent.');
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Failed to send reset email.')
        : error instanceof Error
          ? error.message
          : 'Failed to send reset email.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-8 text-center">
          <img
            alt="Municipality of Pototan TODA MAX"
            src={logo}
            className="mx-auto mb-6 h-20 w-20 object-contain"
          />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reset your admin password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your admin email address and we’ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              If an account exists for that email, a reset link has been sent.
            </div>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your admin email address"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl py-3 font-semibold text-white transition ${
                isSubmitting
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
