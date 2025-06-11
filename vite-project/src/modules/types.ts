export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  country: string;
  city: string;
  birthDate: string;
  imageUrl: string;
}

export interface GroupedEmployees {
  [country: string]: {
    [city: string]: Employee[];
  };
}
