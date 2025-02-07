import { PaginatedResponse } from './pagination';

export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type AdvocatesResponse = PaginatedResponse<Advocate>; 