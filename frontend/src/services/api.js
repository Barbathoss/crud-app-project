import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Obtener todas las tareas
  getAllTasks: (params = {}) => api.get('/tasks/', { params }),
  
  // Obtener una tarea específica
  getTask: (id) => api.get(`/tasks/${id}/`),
  
  // Crear nueva tarea
  createTask: (taskData) => api.post('/tasks/', taskData),
  
  // Actualizar tarea completa
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  
  // Actualizar tarea parcialmente
  patchTask: (id, taskData) => api.patch(`/tasks/${id}/`, taskData),
  
  // Eliminar tarea
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
  
  // Actualizar solo el estado
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status/`, { status }),
  
  // Obtener estadísticas
  getStats: () => api.get('/tasks/stats/'),
};

export default api;