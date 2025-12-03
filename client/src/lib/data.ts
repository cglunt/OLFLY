import { useState, useEffect } from 'react';
// Removed unused zustand import

import cloveImg from '@assets/generated_images/close-up_of_dried_cloves.png';
import lemonImg from '@assets/generated_images/close-up_of_fresh_lemon.png';
import eucalyptusImg from '@assets/generated_images/close-up_of_eucalyptus_leaves.png';
import roseImg from '@assets/generated_images/close-up_of_a_pink_rose.png';

export type Scent = {
  id: string;
  name: string;
  image: string;
  description: string;
  isDefault: boolean;
};

export const DEFAULT_SCENTS: Scent[] = [
  {
    id: 'clove',
    name: 'Clove',
    image: cloveImg,
    description: 'Spicy, warm, and aromatic.',
    isDefault: true,
  },
  {
    id: 'lemon',
    name: 'Lemon',
    image: lemonImg,
    description: 'Citrusy, sharp, and fresh.',
    isDefault: true,
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    image: eucalyptusImg,
    description: 'Cool, camphorous, and minty.',
    isDefault: true,
  },
  {
    id: 'rose',
    name: 'Rose',
    image: roseImg,
    description: 'Floral, sweet, and delicate.',
    isDefault: true,
  },
];

export type SessionLog = {
  id: string;
  date: string; // ISO string
  completed: boolean;
  scentRatings: Record<string, number>; // scentId -> intensity (0-10)
};

export type UserSettings = {
  streak: number;
  lastSessionDate: string | null;
  name: string;
};

// Simple local storage wrapper
const STORAGE_KEY = 'scentpath_data_v1';

export const getStoredData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      scents: DEFAULT_SCENTS,
      logs: [] as SessionLog[],
      settings: {
        streak: 0,
        lastSessionDate: null,
        name: 'Guest',
      } as UserSettings,
    };
  }
  return JSON.parse(stored);
};

export const saveStoredData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
