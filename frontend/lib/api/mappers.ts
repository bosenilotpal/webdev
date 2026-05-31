import { Class, Gym, Plan, Trainer } from '@/lib/types';

import type { ApiClass, ApiGym, ApiPlan, ApiTrainer } from './types';

const PLACEHOLDER_GYM_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
const PLACEHOLDER_TRAINER_IMAGE =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80';

function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const apiBase = (
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://127.0.0.1:8000/api'
  ).replace(/\/api\/?$/, '');
  return url.startsWith('/') ? `${apiBase}${url}` : `${apiBase}/${url}`;
}

function parseFeatures(features: string): string[] {
  if (!features?.trim()) return [];
  try {
    const parsed = JSON.parse(features);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // not JSON — fall through
  }
  return features
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

export function mapGym(api: ApiGym): Gym {
  return {
    id: String(api.id),
    name: api.name,
    location: api.location,
    image: api.image_url || PLACEHOLDER_GYM_IMAGE,
    featured: api.featured,
    description: api.description,
    address: api.address,
    phone: api.phone_number,
    email: api.email,
  };
}

export function mapClass(api: ApiClass): Class {
  return {
    id: String(api.id),
    name: api.name,
    duration: api.duration,
    numberOfClasses: api.number_of_classes,
    price: api.price,
    description: api.description,
    image: api.image_url || undefined,
  };
}

export function mapPlan(api: ApiPlan): Plan {
  return {
    id: String(api.id),
    name: api.name,
    duration: api.duration,
    price: Number(api.price),
    description: api.description,
    features: parseFeatures(api.features),
  };
}

export function mapTrainer(api: ApiTrainer): Trainer {
  const years = api.experience;
  return {
    id: String(api.id),
    name: api.name,
    experience: years === 1 ? '1 year' : `${years} years`,
    image: resolveMediaUrl(api.image_url) || PLACEHOLDER_TRAINER_IMAGE,
    bio: api.bio,
  };
}
