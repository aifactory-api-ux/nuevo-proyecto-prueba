import api from '../lib/api';
import {
  Dispatch,
  DispatchCreate,
  DispatchList,
  DispatchStatsList,
} from '../types/dispatch';

export const dispatchApi = {
  getDispatches: () => api.get<DispatchList>('/dispatches/'),

  getDispatch: (id: number) => api.get<Dispatch>(`/dispatches/${id}`),

  createDispatch: (data: DispatchCreate) =>
    api.post<Dispatch>('/dispatches/', data),

  deleteDispatch: (id: number) =>
    api.delete<{ ok: boolean }>(`/dispatches/${id}`),

  getStats: () => api.get<DispatchStatsList>('/dispatches/stats/plant'),
};