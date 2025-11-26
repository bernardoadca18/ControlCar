export interface DashboardData {
  // endpoint /api/dashboard
  totalClients: number;
  activeOS: number;
  revenue: number;
}

export interface Vehicle {
    id: string;
    tenantId: string;
    clientId: string;
    plate: string;
    vin: string;
    brand: string;
    model: string;
    year: number;
    modelYear: number;
    color: string;
    engineCode: string;
    fuelType: string;
    transmissionType: string;
    mileage: number;
    notes: string;
    createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  plate?: string; 
  vehicles: Vehicle[];
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  problemDescription?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  client?: { name: string };
  vehicle?: { plate: string; model: string };
}