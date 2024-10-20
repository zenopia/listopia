import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchLists = async () => {
  try {
    const response = await api.get('/api/lists');
    return response.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
};

export const createList = async (newList) => {
  const response = await api.post('/api/lists', newList);
  return response.data;
};

export const updateList = async (id, updatedList) => {
  const response = await api.patch(`/api/lists/${id}`, updatedList);
  return response.data;
};

export const deleteList = async (id) => {
  await api.delete(`/api/lists/${id}`);
};