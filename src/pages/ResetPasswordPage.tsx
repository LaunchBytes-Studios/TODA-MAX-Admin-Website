import React, { useEffect, useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    const initializeRecoverySession = async () => {
      // Check for Supabase auth errors in the hash
      const hash = window.location.hash;
      const errorMatch = hash.match(/error=([^&]*)/);
      const errorCodeMatch = hash.match(/error_code=([^&]*)/);

      if (errorMatch && errorCodeMatch) {
        const errorCode = decodeURIComponent(errorCodeMatch[1]);
        if (errorCode === 'otp_expired') {
          toast.error(
            'Recovery link has expired. Please request a new password reset.',
          );
          setTimeout(() => navigate('/admin/forgot-password'), 2000);
          return;
        }
        toast.error(`Authentication error: ${errorCode}`);
        return;
      }

      // Supabase automatically processes the hash fragment on page load
      // Check if we have an active session and if this is a recovery link
      const { data: sessionData } = await supabase.auth.getSession();
      const isRecoveryFlow =
        hash.includes('type=recovery') ||
        hash.includes('access_token') ||
        hash.includes('refresh_token');

      if (sessionData.session && isRecoveryFlow) {
        setHasRecoverySession(true);
      } else if (!sessionData.session && isRecoveryFlow) {
        // If recovery flow but no session yet, wait a moment for Supabase to process
        setTimeout(async () => {
          const { data: retrySession } = await supabase.auth.getSession();
          if (retrySession.session) {
            setHasRecoverySession(true);
          } else {
            toast.error(
              'Recovery session could not be established. Please request a new reset link.',
            );
            setTimeout(() => navigate('/admin/forgot-password'), 2000);
          }
        }, 500);
      } else if (!isRecoveryFlow) {
        toast.error(
          'This page is only for password reset. Please use the reset link from your email.',
        );
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    void initializeRecoverySession();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        toast.error(
          'Missing recovery session. Please open the email link again.',
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset successfully. You can now log in.');
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to reset password.';
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
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter a new password for your admin account.
          </p>
        </div>

        {!hasRecoverySession ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Loading recovery session...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
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
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
