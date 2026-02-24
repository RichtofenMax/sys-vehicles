export type CarStatus = "available" | "reserved" | "sold";

export interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  badge: string;
  photoId: string;
  category: string[];
  status: CarStatus;
}

// Cars are managed via /admin panel and stored in localStorage.
// Add your real stock through the admin page.
export const DEFAULT_CARS: CarData[] = [];
