export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  country: string;
  city: string;
  birthDate: string; // Consider using Date type if you parse it, or a specific date string format
  imageUrl: string;
}

export interface GroupedEmployees {
  [country: string]: {
    [city: string]: Employee[];
  };
}
