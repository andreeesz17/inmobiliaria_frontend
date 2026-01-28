export interface Category {
  id: number;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface PropertyFeature {
  id: number;
  name: string;
}
