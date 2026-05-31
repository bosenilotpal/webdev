import { CMSItem } from '@/lib/types';

import { apiRequest } from './http';

interface ApiCmsItem {
  id: number;
  gym_id: number;
  name: string;
  content: string;
  type: 'text' | 'image' | 'banner';
  created_at: string;
  updated_at: string;
}

function mapCmsItem(api: ApiCmsItem): CMSItem {
  return {
    id: String(api.id),
    name: api.name,
    content: api.content,
    type: api.type,
  };
}

export async function fetchCmsItems(gymId?: string): Promise<CMSItem[]> {
  const query = gymId ? `?gym_id=${encodeURIComponent(gymId)}` : '';
  const data = await apiRequest<ApiCmsItem[]>(`cms/${query}`, {
    auth: !gymId,
  });
  return data.map(mapCmsItem);
}

export async function updateCmsItem(
  id: string,
  content: string
): Promise<CMSItem> {
  const data = await apiRequest<ApiCmsItem>(`cms/${id}/`, {
    method: 'PATCH',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return mapCmsItem(data);
}

export function getCmsByName(
  items: CMSItem[],
  name: string
): CMSItem | undefined {
  return items.find((item) => item.name === name);
}
