export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  registered_at: string; // Lembre-se que nosso ClientResource formata o created_at
}

// Tipagem para a resposta paginada do Laravel
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
