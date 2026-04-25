import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RAZAS
export const getRazas = async () => {
  try {
    const response = await api.get('/razas');
    return response.data;
  } catch (error) {
    console.error('Error fetching razas:', error);
    throw error;
  }
};

// ANIMALES
export const getAnimales = async () => {
  try {
    const response = await api.get('/animales');
    return response.data;
  } catch (error) {
    console.error('Error fetching animales:', error);
    throw error;
  }
};

export const getAnimal = async (id) => {
  try {
    const response = await api.get(`/animales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching animal ${id}:`, error);
    throw error;
  }
};

export const crearAnimal = async (data) => {
  try {
    const response = await api.post('/animales', data);
    return response.data;
  } catch (error) {
    console.error('Error creating animal:', error);
    throw error;
  }
};

export const actualizarAnimal = async (id, data) => {
  try {
    const response = await api.put(`/animales/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating animal ${id}:`, error);
    throw error;
  }
};

export const desactivarAnimal = async (id) => {
  try {
    const response = await api.delete(`/animales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting animal ${id}:`, error);
    throw error;
  }
};

// PESAJES
export const getPesajes = async (idAnimal) => {
  try {
    const response = await api.get(`/animales/${idAnimal}/pesajes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pesajes for animal ${idAnimal}:`, error);
    throw error;
  }
};

export const crearPesaje = async (idAnimal, data) => {
  try {
    const response = await api.post(`/animales/${idAnimal}/pesajes`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating pesaje for animal ${idAnimal}:`, error);
    throw error;
  }
};

// COSTOS
export const getCostos = async (idAnimal) => {
  try {
    const response = await api.get(`/animales/${idAnimal}/costos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching costos for animal ${idAnimal}:`, error);
    throw error;
  }
};

// ANÁLISIS CON IA
export const analizarConIA = async (idAnimal, precioMercadoCop) => {
  try {
    const response = await api.post(`/analisis/${idAnimal}`, {
      precioMercadoCop,
    });
    return response.data;
  } catch (error) {
    console.error(`Error analyzing animal ${idAnimal} with IA:`, error);
    throw error;
  }
};

// DASHBOARD
export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

export default api;
