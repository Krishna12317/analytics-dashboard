import { IRawEVData, IFilteredData } from "./types";

export const getUniqueValues = (data: IRawEVData[], key: keyof IRawEVData): string[] => {
    return Array.from(new Set(data.map((d) => d[key] as string)));
};

export const aggregateData = (data: IRawEVData[]): IFilteredData[] => {
    const countByMakeModelYear = data.reduce((acc, curr) => {
        const key = `${curr.Make}-${curr.Model}-${curr["Model Year"]}`;
        if (!acc[key]) {
            acc[key] = { make: curr.Make, model: curr.Model, modelYear: curr["Model Year"], count: 0 };
        }
        acc[key].count += 1;
        return acc;
    }, {} as Record<string, IFilteredData>);

    return Object.values(countByMakeModelYear);
};

export const filterData = (data: IFilteredData[], make: string, model: string, modelYear?: string): IFilteredData[] => {
    return data.filter(d =>
        (!make || d.make === make) &&
        (!model || d.model === model) &&
        (!modelYear || d.modelYear === modelYear)
    );
};

export const processIFilteredData = (data: IRawEVData[], make: string, model: string, modelYear: string): IFilteredData[] => {
    const IFilteredData = data.filter((d) => d.Make === make && d.Model === model && d["Model Year"] === modelYear);
    const count = IFilteredData.length;
    return [{ make, model, modelYear, count }];
};