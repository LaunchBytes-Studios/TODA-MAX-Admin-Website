import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

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

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      return null;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Connection error. Is the backend running?';
      const nextError = new Error(errorMessage || 'Login failed');

      setError(nextError);
      console.error('Login failed:', error);
      return nextError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSubmit,
  };
};
