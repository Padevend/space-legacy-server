export interface ListPeopleQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  affiliation?: string;
  sort?: 'fullName' | 'affiliation';
  order?: 'asc' | 'desc';
}

export interface CreatePersonBody {
  fullName: string;
  biography?: string | null;
  affiliation?: string | null;
}

export interface UpdatePersonBody {
  fullName?: string;
  biography?: string | null;
  affiliation?: string | null;
}

export interface PersonIdParams {
  id: string; // UUID v4
}
