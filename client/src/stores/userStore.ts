import { create } from 'zustand';
import { Coords } from '../types';

type UserStoreState = {
  location: Coords | null,
  username: string | null,
  userId: number | null,
  setLocation: (location: Coords | null) => void,
  setUsername: (username: string | null) => void,
  setUserId: (userId: number | null) => void,
};

export const useUserStore = create<UserStoreState>((set) => ({
  location: null,
  username: null,
  userId: null,
  setLocation: (location: Coords | null) => set({ location }),
  setUsername: (username: string | null) => set({ username }),
  setUserId: (userId: number | null) => set({ userId }),
}));
