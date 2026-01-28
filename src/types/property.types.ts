export type Property = {
  id: number;
  title: string;
  description: string;
  type: string;
  price: number;
  address: string;
};

export type PaginatedMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};
