import React, { useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/logo.png';
import { useLogin } from '../hooks/useLogin';

const LoginPage: React.FC = () => {
  const { isLoading, handleSubmit } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitError = await handleSubmit(email, password);

    if (submitError) {
      toast.error(submitError.message);
      return;
    }

    toast.success('Login successful! Redirecting...');
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <img
        alt="Municipality of Pototan TODA MAX"
        src={logo}
        className="mx-auto mb-8 h-32 w-32 object-contain"
      />

      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TODA MAX</h1>
        <p className="text-gray-600">
          Welcome Back! Ready to take control of your health?
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 space-y-6"
      >
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Contact Number / Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email or phone number"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => alert('Forgot password feature coming soon')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-md font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
