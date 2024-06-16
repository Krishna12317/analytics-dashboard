export interface IRawEVData {
    County: string;
    City: string;
    [key: string]: string;
}

export interface ICountryData {
    county: string;
    count: number;
}

export interface ICityData {
    city: string;
    count: number;
}

export interface IFilteredData {
    make: string;
    model: string;
    modelYear: string;
    count: number;
    [key: string]: string | number;
}