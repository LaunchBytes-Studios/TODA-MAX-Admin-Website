import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface ErrorResponse {
  error: string;
}

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post<LoginResponse>(
        `${url}/auth/login`,
        {
          contact: email,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const data = response.data;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error || 'Login failed');
      } else {
        toast.error('Connection error. Is the backend running?');
      }
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  };
};
