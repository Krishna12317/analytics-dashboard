export interface RawEVData {
    County: string;
    City: string;
    [key: string]: string;
}

export interface CountyData {
    county: string;
    count: number;
}

export interface CityData {
    city: string;
    count: number;
}