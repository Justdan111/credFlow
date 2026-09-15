import { apiClient, unwrap } from '@/api/client';
import type { ApiResponse, Paginated } from '@/api/types';

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  riskLevel: string;
  creditLimit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  riskLevel?: string;
  sort?: string;
}

export interface CustomerInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  riskLevel?: string;
  creditLimit?: number;
  notes?: string;
}

export async function listCustomers(params?: CustomerListParams) {
  const response = await apiClient.get<ApiResponse<Customer[]>>('/customers', { params });
  return { items: unwrap(response), meta: response.data.meta } as Paginated<Customer>;
}

export async function getCustomer(id: string) {
  return unwrap(await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`));
}

export async function createCustomer(input: CustomerInput) {
  return unwrap(await apiClient.post<ApiResponse<Customer>>('/customers', input));
}

export async function updateCustomer(id: string, input: Partial<CustomerInput>) {
  return unwrap(await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, input));
}

export async function deleteCustomer(id: string) {
  await apiClient.delete(`/customers/${id}`);
}