import { Class, Gym, Plan, Trainer } from '@/lib/types';

import { mapClass, mapGym, mapPlan, mapTrainer } from './mappers';
import { apiRequest, getApiBaseUrl } from './http';
import type { ApiClass, ApiGym, ApiPlan, ApiTrainer } from './types';

export type ClassInput = Omit<Class, 'id' | 'image'>;
export type PlanInput = Omit<Plan, 'id'>;
export type TrainerInput = {
  name: string;
  experience: string;
  bio?: string;
};

function parseExperienceYears(value: string): number {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function toApiClassBody(input: ClassInput) {
  return {
    name: input.name,
    duration: input.duration,
    number_of_classes: input.numberOfClasses,
    price: Math.round(input.price),
    description: input.description ?? '',
  };
}

function serializePlanFeatures(features?: string[]): string {
  if (!features?.length) return '';
  return JSON.stringify(features);
}

function toApiPlanBody(input: PlanInput) {
  return {
    name: input.name,
    duration: input.duration,
    price: input.price,
    description: input.description ?? '',
    features: serializePlanFeatures(input.features),
  };
}

export async function fetchGyms(): Promise<Gym[]> {
  const data = await apiRequest<ApiGym[]>('gyms/');
  return data.map(mapGym);
}

export async function fetchGym(id: string): Promise<Gym | null> {
  const url = `${getApiBaseUrl()}/gyms/${id}/`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }
  const data = (await response.json()) as ApiGym;
  return mapGym(data);
}

export async function fetchClasses(gymId?: string): Promise<Class[]> {
  const query = gymId ? `?gym_id=${encodeURIComponent(gymId)}` : '';
  const data = await apiRequest<ApiClass[]>(`classes/${query}`, { auth: !gymId });
  return data.map(mapClass);
}

export async function fetchPlans(gymId?: string): Promise<Plan[]> {
  const query = gymId ? `?gym_id=${encodeURIComponent(gymId)}` : '';
  const data = await apiRequest<ApiPlan[]>(`plans/${query}`, { auth: !gymId });
  return data.map(mapPlan);
}

export async function createPlan(input: PlanInput): Promise<Plan> {
  const data = await apiRequest<ApiPlan>('plans/', {
    method: 'POST',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiPlanBody(input)),
  });
  return mapPlan(data);
}

export async function updatePlan(id: string, input: PlanInput): Promise<Plan> {
  const data = await apiRequest<ApiPlan>(`plans/${id}/`, {
    method: 'PATCH',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiPlanBody(input)),
  });
  return mapPlan(data);
}

export async function deletePlan(id: string): Promise<void> {
  await apiRequest<void>(`plans/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchTrainers(gymId?: string): Promise<Trainer[]> {
  const query = gymId ? `?gym_id=${encodeURIComponent(gymId)}` : '';
  const data = await apiRequest<ApiTrainer[]>(`trainers/${query}`, { auth: !gymId });
  return data.map(mapTrainer);
}

export async function createClass(input: ClassInput): Promise<Class> {
  const data = await apiRequest<ApiClass>('classes/', {
    method: 'POST',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiClassBody(input)),
  });
  return mapClass(data);
}

export async function updateClass(id: string, input: ClassInput): Promise<Class> {
  const data = await apiRequest<ApiClass>(`classes/${id}/`, {
    method: 'PATCH',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiClassBody(input)),
  });
  return mapClass(data);
}

export async function deleteClass(id: string): Promise<void> {
  await apiRequest<void>(`classes/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}

function buildTrainerFormData(input: TrainerInput, imageFile?: File): FormData {
  const form = new FormData();
  form.append('name', input.name);
  form.append('experience', String(parseExperienceYears(input.experience)));
  form.append('bio', input.bio ?? '');
  if (imageFile) {
    form.append('image_url', imageFile, imageFile.name);
  }
  return form;
}

export async function createTrainer(
  input: TrainerInput,
  imageFile?: File
): Promise<Trainer> {
  const data = await apiRequest<ApiTrainer>('trainers/', {
    method: 'POST',
    auth: true,
    body: buildTrainerFormData(input, imageFile),
  });
  return mapTrainer(data);
}

export async function updateTrainer(
  id: string,
  input: TrainerInput,
  imageFile?: File
): Promise<Trainer> {
  const data = await apiRequest<ApiTrainer>(`trainers/${id}/`, {
    method: 'PATCH',
    auth: true,
    body: buildTrainerFormData(input, imageFile),
  });
  return mapTrainer(data);
}

export async function deleteTrainer(id: string): Promise<void> {
  await apiRequest<void>(`trainers/${id}/`, {
    method: 'DELETE',
    auth: true,
  });
}
