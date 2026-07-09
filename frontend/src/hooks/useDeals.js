import { useState, useEffect } from 'react';
import api from '../services/api';

export function useDeals() {
  const [currentDeal, setCurrentDeal] = useState(null);
  const [timeLeft, setTimeLeft] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get('/deals/current');
        if (data.length > 0) {
          setCurrentDeal(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    if (!currentDeal) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(currentDeal.endDate);
      const diff = end - now;

      if (diff <= 0) return [0, 0, 0, 0];

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return [days, hours, minutes, seconds];
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [currentDeal]);

  return { currentDeal, timeLeft };
}