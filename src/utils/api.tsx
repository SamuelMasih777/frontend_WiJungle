import axios from 'axios';

export const fetchAlerts = async () => {
  const response = await axios.get('https://backend-wijungle.onrender.com/api/data');
  return response.data;
};