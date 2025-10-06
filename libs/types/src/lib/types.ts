
export interface BusinessType {
  id: string;
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}
export type Category = { id: string; name: string };
export type Business = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  googleMapUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  timetable: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};