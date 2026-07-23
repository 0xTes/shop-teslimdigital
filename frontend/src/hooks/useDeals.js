import { useState, useEffect } from 'react';
import api from '../services/api';

const calculateTimeLeft = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return [0, 0, 0, 0];
  return [
    Math.floor(diff / (1000 * 60 * 60 * 24)),
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    Math.floor((diff % (1000 * 60)) / 1000)
  ];
};

export function useDeals() {
  const [currentDeal, setCurrentDeal] = useState(null);
  const [timeLeft, setTimeLeft] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get('/deals/current');
        if (data.length > 0) {
          setCurrentDeal(data[0]);
          setTimeLeft(calculateTimeLeft(data[0].endDate));
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    if (!currentDeal) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentDeal.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentDeal]);

  return { currentDeal, timeLeft };
}
