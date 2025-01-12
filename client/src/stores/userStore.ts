import { create } from 'zustand';
import { Coords } from '../types';

type UserStoreState = {
  position: Coords | null,
  username: string | null,
  userId: number | null,
  setPosition: (position: Coords | null) => void,
  setUsername: (username: string | null) => void,
  setUserId: (userId: number | null) => void,
};

export const useUserStore = create<UserStoreState>((set) => ({
  position: null,
  username: null,
  userId: null,
  setPosition: (position: Coords | null) => set({ position }),
  setUsername: (username: string | null) => set({ username }),
  setUserId: (userId: number | null) => set({ userId }),
}));
