
export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface CarVersion {
  name: string;
  features: string;
}

export interface CarRecommendation {
  modelName: string;
  searchTerm: string;
  summary: string;
  pros: string[];
  cons:string[];
  priceRange: string;
  versions: CarVersion[];
  consumptionCity: string;
  consumptionRoad: string;
  consumerRating: number;
}

export type Answers = Record<string, string>;