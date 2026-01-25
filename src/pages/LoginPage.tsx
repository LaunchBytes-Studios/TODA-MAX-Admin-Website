import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Connection error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
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
        onSubmit={handleSubmit}
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
