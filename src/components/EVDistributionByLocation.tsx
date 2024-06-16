import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { IRawEVData, ICountryData, ICityData } from "../types";

const EVDistributionComponent: React.FC<{ rawData: IRawEVData[] }> = ({
  rawData,
}) => {
  const [ICountryData, setICountryData] = useState<ICountryData[]>([]);
  const [ICityData, setICityData] = useState<ICityData[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  const { t: translate } = useTranslation();

  const counties = useMemo(
    () => Array.from(new Set(ICountryData.map((d) => d.county))),
    [ICountryData]
  );

  const processICountryData = useCallback((data: IRawEVData[]) => {
    const countByCounty = data.reduce((acc, curr) => {
      const county = curr.County;
      if (!acc[county]) {
        acc[county] = { county, count: 0 };
      }
      acc[county].count += 1;
      return acc;
    }, {} as Record<string, ICountryData>);

    const processedICountryData = Object.values(countByCounty);
    setICountryData(processedICountryData);
  }, []);

  const processICityData = useCallback((data: IRawEVData[], county: string) => {
    const countByCity = data.reduce((acc, curr) => {
      if (curr.County === county) {
        const city = curr.City;
        if (!acc[city]) {
          acc[city] = { city, count: 0 };
        }
        acc[city].count += 1;
      }
      return acc;
    }, {} as Record<string, ICityData>);

    const processedICityData = Object.values(countByCity);
    setICityData(processedICityData);
  }, []);

  const handleCountyChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const county = event.target.value;
      setSelectedCounty(county);
      if (county) {
        processICityData(rawData, county);
      } else {
        setICityData([]);
      }
    },
    [processICityData, rawData]
  );

  useEffect(() => {
    processICountryData(rawData);
  }, [processICountryData, rawData]);

  return (
    <div>
      <h2>{translate("evDistributionHeader")}</h2>
      <div>
        <label htmlFor="countySelect">{translate("countryLabel")} </label>
        <select
          id="countySelect"
          onChange={handleCountyChange}
          value={selectedCounty}
          defaultValue={translate("allCountryOpt")}
        >
          <option value="">{translate("allCountryOpt")}</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={selectedCounty ? ICityData : ICountryData}>
          <XAxis dataKey={selectedCounty ? "city" : "county"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVDistributionComponent;
