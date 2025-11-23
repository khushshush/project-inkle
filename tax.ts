export interface Tax {
  id: string;
  name: string;
  country: string;
  rate: number;
  createdAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}
