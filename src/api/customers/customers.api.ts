import { apiClient, cleanParams, unwrap, unwrapPage } from '@/api/client';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

export const RISK_LEVELS = ['low', 'medium', 'high'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/** Sort keys the backend accepts; a `-` prefix reverses the direction. */
export const CUSTOMER_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'name',
  'riskLevel',
  'creditLimit',
] as const;
export type CustomerSortField = (typeof CUSTOMER_SORT_FIELDS)[number];
export type CustomerSort = CustomerSortField | `-${CustomerSortField}`;

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  address?: string | null;
  riskLevel: RiskLevel | string;
  creditLimit: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListParams extends PageParams {
  search?: string;
  riskLevel?: RiskLevel;
  sort?: CustomerSort;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  riskLevel?: RiskLevel;
  creditLimit?: number;
  notes?: string;
}

/** Every key is optional: an omitted field is left untouched by the API. */
export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export async function listCustomers(params?: CustomerListParams): Promise<Paginated<Customer>> {
  const response = await apiClient.get<ApiEnvelope<Customer[]>>('/customers', {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

export async function getCustomer(customerId: string): Promise<Customer> {
  return unwrap(await apiClient.get<ApiEnvelope<Customer>>(`/customers/${customerId}`));
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return unwrap(await apiClient.post<ApiEnvelope<Customer>>('/customers', input));
}

export async function updateCustomer(
  customerId: string,
  input: UpdateCustomerInput,
): Promise<Customer> {
  return unwrap(await apiClient.patch<ApiEnvelope<Customer>>(`/customers/${customerId}`, input));
}

/** Soft-deletes the customer server-side; requires the owner or admin role. */
export async function deleteCustomer(customerId: string): Promise<void> {
  await apiClient.delete(`/customers/${customerId}`);
}
