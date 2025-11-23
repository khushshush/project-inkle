import { Tax, Country } from "@/types/tax";

const BASE_URL = "https://685013d7e7fc42cfd17974a33.mockapi.io/api/v1";

// Mock data fallback
const mockTaxes: Tax[] = [
  {
    id: "1",
    name: "VAT",
    country: "United Kingdom",
    rate: 20,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "GST",
    country: "India",
    rate: 18,
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Sales Tax",
    country: "United States",
    rate: 7.5,
    createdAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "IVA",
    country: "Spain",
    rate: 21,
    createdAt: "2024-01-25T11:45:00Z",
  },
];

const mockCountries: Country[] = [
  { id: "1", name: "United States", code: "US" },
  { id: "2", name: "United Kingdom", code: "GB" },
  { id: "3", name: "Canada", code: "CA" },
  { id: "4", name: "Australia", code: "AU" },
  { id: "5", name: "Germany", code: "DE" },
  { id: "6", name: "France", code: "FR" },
  { id: "7", name: "Spain", code: "ES" },
  { id: "8", name: "India", code: "IN" },
  { id: "9", name: "Japan", code: "JP" },
  { id: "10", name: "Brazil", code: "BR" },
];

export const taxApi = {
  getTaxes: async (): Promise<Tax[]> => {
    try {
      const response = await fetch(`${BASE_URL}/taxes`);
      if (!response.ok) {
        console.warn("API failed, using mock data");
        return mockTaxes;
      }
      return response.json();
    } catch (error) {
      console.warn("API error, using mock data:", error);
      return mockTaxes;
    }
  },

  updateTax: async (id: string, data: Partial<Tax>): Promise<Tax> => {
    try {
      const response = await fetch(`${BASE_URL}/taxes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        // Simulate update with mock data
        const updatedTax = mockTaxes.find((t) => t.id === id);
        if (updatedTax) {
          return { ...updatedTax, ...data };
        }
        throw new Error("Tax not found");
      }
      return response.json();
    } catch (error) {
      // Simulate update with mock data
      const updatedTax = mockTaxes.find((t) => t.id === id);
      if (updatedTax) {
        return { ...updatedTax, ...data };
      }
      throw error;
    }
  },
};

export const countryApi = {
  getCountries: async (): Promise<Country[]> => {
    try {
      const response = await fetch(`${BASE_URL}/countries`);
      if (!response.ok) {
        console.warn("API failed, using mock countries");
        return mockCountries;
      }
      return response.json();
    } catch (error) {
      console.warn("API error, using mock countries:", error);
      return mockCountries;
    }
  },
};
