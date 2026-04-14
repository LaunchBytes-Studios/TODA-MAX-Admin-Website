import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    await supabase.auth.signOut();

    navigate('/login');
  };

  return { logout };
};
