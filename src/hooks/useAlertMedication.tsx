import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Medication {
  name: string;
  price: number;
  type: string;
  stock_qty: number;
  threshold_qty: number;
}

export function useAlertMedication() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    axios
      .get(`http://localhost:3000/enavigator/alert/medication`, { headers }) // Update this URL to match your backend route
      .then((res) => {
        setMedications(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Failed to fetch alert medications',
        );
        setMedications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { medications, loading, error };
}
