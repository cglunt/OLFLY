import { useState, useEffect } from 'react';

// Reverting to Photo Assets for Training Mode as requested
import cloveImg from '@assets/generated_images/close-up_of_dried_cloves.png';
import lemonImg from '@assets/generated_images/close-up_of_fresh_lemon.png';
import eucalyptusImg from '@assets/generated_images/close-up_of_eucalyptus_leaves.png';
import roseImg from '@assets/generated_images/close-up_of_a_pink_rose.png';
import avatarImg from '@assets/generated_images/flat_vector_minimalist_user_profile_icon.png';

// New Generated Images
import cinnamonImg from '@assets/generated_images/cinnamon_sticks_close-up.png';
import nutmegImg from '@assets/generated_images/nutmeg_seeds_close-up.png';
import cardamomImg from '@assets/generated_images/cardamom_pods_close-up.png';
import corianderImg from '@assets/generated_images/coriander_seeds_close-up.png';
import orangeImg from '@assets/generated_images/orange_slices_close-up.png';
import grapefruitImg from '@assets/generated_images/grapefruit_slice_close-up.png';
import limeImg from '@assets/generated_images/lime_slices_close-up.png';
import bergamotImg from '@assets/generated_images/bergamot_fruit_close-up.png';
import lavenderImg from '@assets/generated_images/lavender_flowers_close-up.png';
import jasmineImg from '@assets/generated_images/jasmine_flowers_close-up.png';
import geraniumImg from '@assets/generated_images/geranium_flowers_close-up.png';
import ylangYlangImg from '@assets/generated_images/ylang_ylang_flowers_close-up.png';
import pineImg from '@assets/generated_images/pine_branch_close-up.png';
import firImg from '@assets/generated_images/fir_branch_close-up.png';
import cedarwoodImg from '@assets/generated_images/cedarwood_chips_close-up.png';
import teaTreeImg from '@assets/generated_images/tea_tree_leaves_close-up.png';
import coffeeImg from '@assets/generated_images/coffee_beans_close-up.png';
import peppermintImg from '@assets/generated_images/peppermint_leaves_close-up.png';
import vanillaImg from '@assets/generated_images/vanilla_beans_close-up.png';
import chocolateImg from '@assets/generated_images/dark_chocolate_close-up.png';
import garlicImg from '@assets/generated_images/garlic_bulbs_close-up.png';
import herbsImg from '@assets/generated_images/rosemary_and_basil_close-up.png';
import onionImg from '@assets/generated_images/caramelized_onions_close-up.png';
import breadImg from '@assets/generated_images/baked_bread_texture_close-up.png';
import laundryImg from '@assets/generated_images/laundry_bubbles_close-up.png';
import shampooImg from '@assets/generated_images/shampoo_bubbles_close-up.png';
import perfumeImg from '@assets/generated_images/perfume_bottle_close-up.png';
import lotionImg from '@assets/generated_images/lotion_texture_close-up.png';
import candleImg from '@assets/generated_images/scented_candle_close-up.png';
import greenTeaImg from '@assets/generated_images/green_tea_close-up.png';
import thymeImg from '@assets/generated_images/thyme_sprigs_close-up.png';
import sandalwoodImg from '@assets/generated_images/sandalwood_chips_close-up.png';

export const AVATAR_IMAGE = avatarImg;

export type ScentCategory = 'Spice' | 'Citrus' | 'Floral' | 'Woodsy' | 'Everyday' | 'Functional';

export type Scent = {
  id: string;
  name: string;
  image?: string; // Optional now, we use colors primarily
  description: string;
  color: string; // Tailwind class for background gradient
  category: ScentCategory;
  isDefault: boolean;
};

export type ScentSet = {
  id: string;
  name: string;
  scentIds: string[];
  description: string;
};

export const SCENT_CATEGORIES: Record<ScentCategory, string> = {
  'Spice': 'bg-gradient-to-br from-orange-600 to-red-700',
  'Citrus': 'bg-gradient-to-br from-yellow-400 to-orange-500',
  'Floral': 'bg-gradient-to-br from-pink-400 to-rose-600',
  'Woodsy': 'bg-gradient-to-br from-emerald-600 to-teal-800',
  'Everyday': 'bg-gradient-to-br from-amber-700 to-yellow-900', // Coffee/Bread tones
  'Functional': 'bg-gradient-to-br from-blue-400 to-indigo-600' // Clean/Soap tones
};

export const ALL_SCENTS: Scent[] = [
  // Spice Category
  { id: 'clove', name: 'Clove', category: 'Spice', description: 'Spicy, warm, and aromatic.', color: SCENT_CATEGORIES['Spice'], isDefault: true, image: cloveImg },
  { id: 'cinnamon', name: 'Cinnamon', category: 'Spice', description: 'Sweet, woody, and spicy.', color: SCENT_CATEGORIES['Spice'], isDefault: false, image: cinnamonImg },
  { id: 'nutmeg', name: 'Nutmeg', category: 'Spice', description: 'Warm, nutty, and sweet.', color: SCENT_CATEGORIES['Spice'], isDefault: false, image: nutmegImg },
  { id: 'cardamom', name: 'Cardamom', category: 'Spice', description: 'Piney, fruity, and menthol-like.', color: SCENT_CATEGORIES['Spice'], isDefault: false, image: cardamomImg },
  { id: 'coriander', name: 'Coriander', category: 'Spice', description: 'Fresh, citrusy, and nutty.', color: SCENT_CATEGORIES['Spice'], isDefault: false, image: corianderImg },

  // Citrus Category
  { id: 'lemon', name: 'Lemon', category: 'Citrus', description: 'Citrusy, sharp, and fresh.', color: SCENT_CATEGORIES['Citrus'], isDefault: true, image: lemonImg },
  { id: 'orange', name: 'Orange', category: 'Citrus', description: 'Sweet, tangy, and fruity.', color: SCENT_CATEGORIES['Citrus'], isDefault: false, image: orangeImg },
  { id: 'grapefruit', name: 'Grapefruit', category: 'Citrus', description: 'Tart, tangy, and bitter.', color: SCENT_CATEGORIES['Citrus'], isDefault: false, image: grapefruitImg },
  { id: 'lime', name: 'Lime', category: 'Citrus', description: 'Zesty, sour, and bright.', color: SCENT_CATEGORIES['Citrus'], isDefault: false, image: limeImg },
  { id: 'bergamot', name: 'Bergamot', category: 'Citrus', description: 'Complex, floral, and spicy citrus.', color: SCENT_CATEGORIES['Citrus'], isDefault: false, image: bergamotImg },

  // Floral Category
  { id: 'rose', name: 'Rose', category: 'Floral', description: 'Floral, sweet, and delicate.', color: SCENT_CATEGORIES['Floral'], isDefault: true, image: roseImg },
  { id: 'lavender', name: 'Lavender', category: 'Floral', description: 'Herbal, floral, and calming.', color: SCENT_CATEGORIES['Floral'], isDefault: false, image: lavenderImg },
  { id: 'jasmine', name: 'Jasmine', category: 'Floral', description: 'Rich, sweet, and fruity.', color: SCENT_CATEGORIES['Floral'], isDefault: false, image: jasmineImg },
  { id: 'geranium', name: 'Geranium', category: 'Floral', description: 'Green, rosy, and lemon-like.', color: SCENT_CATEGORIES['Floral'], isDefault: false, image: geraniumImg },
  { id: 'ylang_ylang', name: 'Ylang Ylang', category: 'Floral', description: 'Deep, rich, and slightly banana-like.', color: SCENT_CATEGORIES['Floral'], isDefault: false, image: ylangYlangImg },

  // Woodsy Category
  { id: 'eucalyptus', name: 'Eucalyptus', category: 'Woodsy', description: 'Cool, camphorous, and minty.', color: SCENT_CATEGORIES['Woodsy'], isDefault: true, image: eucalyptusImg },
  { id: 'pine', name: 'Pine', category: 'Woodsy', description: 'Fresh, resinous, and forest-like.', color: SCENT_CATEGORIES['Woodsy'], isDefault: false, image: pineImg },
  { id: 'fir', name: 'Fir', category: 'Woodsy', description: 'Clean, green, and balsamic.', color: SCENT_CATEGORIES['Woodsy'], isDefault: false, image: firImg },
  { id: 'cedarwood', name: 'Cedarwood', category: 'Woodsy', description: 'Warm, woody, and balsamic.', color: SCENT_CATEGORIES['Woodsy'], isDefault: false, image: cedarwoodImg },
  { id: 'tea_tree', name: 'Tea Tree', category: 'Woodsy', description: 'Medicinal, fresh, and woody.', color: SCENT_CATEGORIES['Woodsy'], isDefault: false, image: teaTreeImg },

  // Everyday
  { id: 'coffee', name: 'Coffee', category: 'Everyday', description: 'Roasted, earthy, and bold.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: coffeeImg },
  { id: 'peppermint', name: 'Peppermint', category: 'Everyday', description: 'Sharp, cooling, and menthol.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: peppermintImg },
  { id: 'vanilla', name: 'Vanilla', category: 'Everyday', description: 'Sweet, creamy, and comforting.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: vanillaImg },
  { id: 'chocolate', name: 'Chocolate', category: 'Everyday', description: 'Rich, sweet, and roasted.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: chocolateImg },
  { id: 'garlic', name: 'Garlic', category: 'Everyday', description: 'Pungent, spicy, and savory.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: garlicImg },
  { id: 'herbs', name: 'Fresh Herbs', category: 'Everyday', description: 'Green, savory (Rosemary/Basil).', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: herbsImg },
  { id: 'onion', name: 'Cooked Onion', category: 'Everyday', description: 'Savory, sweet, and sulfurous.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: onionImg },
  { id: 'bread', name: 'Baked Bread', category: 'Everyday', description: 'Yeasty, warm, and toasty.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: breadImg },

  // Functional
  { id: 'laundry', name: 'Laundry Detergent', category: 'Functional', description: 'Clean, fresh, and soapy.', color: SCENT_CATEGORIES['Functional'], isDefault: false, image: laundryImg },
  { id: 'shampoo', name: 'Shampoo/Soap', category: 'Functional', description: 'Clean, floral, or fruity.', color: SCENT_CATEGORIES['Functional'], isDefault: false, image: shampooImg },
  { id: 'perfume', name: 'Perfume/Cologne', category: 'Functional', description: 'Complex, alcohol-based, and distinct.', color: SCENT_CATEGORIES['Functional'], isDefault: false, image: perfumeImg },
  { id: 'lotion', name: 'Lotion/Oil', category: 'Functional', description: 'Creamy, subtle, and moisturizing.', color: SCENT_CATEGORIES['Functional'], isDefault: false, image: lotionImg },
  { id: 'candle', name: 'Favorite Candle', category: 'Functional', description: 'Waxy, fragranced, and familiar.', color: SCENT_CATEGORIES['Functional'], isDefault: false, image: candleImg },
  
  // Missing Set Scents
  { id: 'green_tea', name: 'Green Tea', category: 'Everyday', description: 'Earthy, grassy, and fresh.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: greenTeaImg },
  { id: 'thyme', name: 'Thyme', category: 'Everyday', description: 'Herbal, woody, and earthy.', color: SCENT_CATEGORIES['Everyday'], isDefault: false, image: thymeImg },
  { id: 'sandalwood', name: 'Sandalwood', category: 'Woodsy', description: 'Rich, woody, and warm.', color: SCENT_CATEGORIES['Woodsy'], isDefault: false, image: sandalwoodImg },
];

export const SCENT_SETS: ScentSet[] = [
  { id: 'set_a', name: 'Set A (Classic)', scentIds: ['lemon', 'rose', 'eucalyptus', 'clove'], description: 'The standard research set.' },
  { id: 'set_b', name: 'Set B', scentIds: ['peppermint', 'thyme', 'jasmine', 'grapefruit'], description: 'Second rotation set.' }, // Thyme mapped to 'herbs' for now if needed, or add specific
  { id: 'set_c', name: 'Set C', scentIds: ['green_tea', 'bergamot', 'vanilla', 'cinnamon'], description: 'Third rotation set.' }, // Green tea missing, adding placeholder
  { id: 'set_d', name: 'Set D', scentIds: ['lavender', 'orange', 'coffee', 'sandalwood'], description: 'Fourth rotation set.' }, // Sandalwood missing, placeholder
];

// Helper to get default scents
export const DEFAULT_SCENTS = ALL_SCENTS.filter(s => s.isDefault);

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
  hasOnboarded: boolean;
  reminders?: {
      enabled: boolean;
      morning: string;
      evening: string;
  };
};

// Simple local storage wrapper
const STORAGE_KEY = 'scentpath_data_v5'; // Incrementing version to reset data

export const getStoredData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      scents: ALL_SCENTS, // Initialize with ALL scents available in library, but maybe filter for active? 
      // For now, let's just store all scents in the "database" but user has an "active" list.
      // Simplifying: Library shows ALL scents. "My Collection" could be a subset. 
      // For this prototype, "Library" = All Scents.
      activeScentIds: ['clove', 'lemon', 'eucalyptus', 'rose'], // Default active set
      logs: [] as SessionLog[],
      settings: {
        streak: 0,
        lastSessionDate: null,
        name: 'Guest',
        hasOnboarded: false, 
      } as UserSettings,
    };
  }
  const parsed = JSON.parse(stored);
  // Migration/Fallback if scents are missing
  if (!parsed.scents || parsed.scents.length < ALL_SCENTS.length) {
     parsed.scents = ALL_SCENTS;
  }
  return parsed;
};

export const saveStoredData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
