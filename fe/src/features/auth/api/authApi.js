import axiosClient from '../../../config/axiosClient';

export const authApi = {
  getAllUsers: () => axiosClient.get('/users'),
  createUser: (data) => axiosClient.post('/users', data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
};