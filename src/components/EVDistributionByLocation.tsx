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
import { RawEVData, CountyData, CityData } from "../types";
import { useTranslation } from "react-i18next";

const EVDistributionComponent: React.FC<{ rawData: RawEVData[] }> = ({
  rawData,
}) => {
  const [countyData, setCountyData] = useState<CountyData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  const { t: translate } = useTranslation();

  const counties = useMemo(
    () => Array.from(new Set(countyData.map((d) => d.county))),
    [countyData]
  );

  const processCountyData = useCallback((data: RawEVData[]) => {
    const countByCounty = data.reduce((acc, curr) => {
      const county = curr.County;
      if (!acc[county]) {
        acc[county] = { county, count: 0 };
      }
      acc[county].count += 1;
      return acc;
    }, {} as Record<string, CountyData>);

    const processedCountyData = Object.values(countByCounty);
    setCountyData(processedCountyData);
  }, []);

  const processCityData = useCallback((data: RawEVData[], county: string) => {
    const countByCity = data.reduce((acc, curr) => {
      if (curr.County === county) {
        const city = curr.City;
        if (!acc[city]) {
          acc[city] = { city, count: 0 };
        }
        acc[city].count += 1;
      }
      return acc;
    }, {} as Record<string, CityData>);

    const processedCityData = Object.values(countByCity);
    setCityData(processedCityData);
  }, []);

  const handleCountyChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const county = event.target.value;
      setSelectedCounty(county);
      if (county) {
        processCityData(rawData, county);
      } else {
        setCityData([]);
      }
    },
    [processCityData, rawData]
  );

  useEffect(() => {
    processCountyData(rawData);
  }, [processCountyData, rawData]);

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
        <BarChart data={selectedCounty ? cityData : countyData}>
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
