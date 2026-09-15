export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiErrorBody {
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta | null;
  error: ApiErrorBody | null;
}

export interface Paginated<T> {
  items: T[];
  meta: ApiMeta;
}