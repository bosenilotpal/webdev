/** Raw JSON shapes from Django REST framework (snake_case). */

export interface ApiGym {
  id: number;
  owner_user_id: number;
  name: string;
  location: string;
  featured: boolean;
  image_url: string | null;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ApiClass {
  id: number;
  gym_id: number;
  name: string;
  duration: string;
  number_of_classes: number;
  price: number;
  description: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiPlan {
  id: number;
  gym_id: number;
  name: string;
  duration: string;
  price: string;
  description: string;
  features: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  classes: number[];
}

export interface ApiTrainer {
  id: number;
  gym_id: number;
  name: string;
  experience: number;
  image_url: string | null;
  bio: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
