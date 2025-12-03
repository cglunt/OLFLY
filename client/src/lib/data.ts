import { useState, useEffect } from 'react';

// New Pastel Assets
import cloveImg from '@assets/generated_images/pastel_flat_illustration_of_clove.png';
import lemonImg from '@assets/generated_images/pastel_flat_illustration_of_lemon.png';
import eucalyptusImg from '@assets/generated_images/pastel_flat_illustration_of_eucalyptus.png';
import roseImg from '@assets/generated_images/pastel_flat_illustration_of_rose.png';
import avatarImg from '@assets/generated_images/pastel_flat_illustration_of_a_friendly_avatar.png';

export const AVATAR_IMAGE = avatarImg;

export type Scent = {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string; // Tailwind class for background
  isDefault: boolean;
};

export const DEFAULT_SCENTS: Scent[] = [
  {
    id: 'clove',
    name: 'Clove',
    image: cloveImg,
    description: 'Spicy, warm, and aromatic.',
    color: 'bg-orange-100',
    isDefault: true,
  },
  {
    id: 'lemon',
    name: 'Lemon',
    image: lemonImg,
    description: 'Citrusy, sharp, and fresh.',
    color: 'bg-yellow-100',
    isDefault: true,
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    image: eucalyptusImg,
    description: 'Cool, camphorous, and minty.',
    color: 'bg-green-100',
    isDefault: true,
  },
  {
    id: 'rose',
    name: 'Rose',
    image: roseImg,
    description: 'Floral, sweet, and delicate.',
    color: 'bg-pink-100',
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
const STORAGE_KEY = 'scentpath_data_v2';

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
