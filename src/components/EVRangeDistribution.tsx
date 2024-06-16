import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { IRawEVData } from "../types";

const EVRangeDistribution: React.FC<{ rawData: IRawEVData[] }> = ({
  rawData,
}) => {
  const { t: translate } = useTranslation();

  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [IFilteredData, setIFilteredData] = useState<IRawEVData[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    const uniqueMakes = Array.from(new Set(rawData.map((item) => item.Make)));
    setMakes(uniqueMakes);

    const uniqueYears = Array.from(
      new Set(rawData.map((item) => item["Model Year"]))
    );
    setYears(uniqueYears);

    let filtered: IRawEVData[] = rawData;
    if (selectedMake) {
      filtered = filtered.filter((item) => item.Make === selectedMake);
    }
    if (selectedModel) {
      filtered = filtered.filter((item) => item.Model === selectedModel);
    }
    if (selectedYear) {
      filtered = filtered.filter((item) => item["Model Year"] === selectedYear);
    }
    setIFilteredData(filtered);

    if (selectedMake) {
      const uniqueModels = Array.from(
        new Set(
          rawData
            .filter((item) => item.Make === selectedMake)
            .map((item) => item.Model)
        )
      );
      setModels(uniqueModels);

      if (uniqueModels.includes(selectedModel)) {
        setSelectedModel(selectedModel);
      } else {
        setSelectedModel("");
      }
    } else {
      setModels([]);
      setSelectedModel("");
    }
  }, [rawData, selectedMake, selectedModel, selectedYear]);

  const handleMakeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const make = event.target.value;
      setSelectedMake(make);
    },
    []
  );

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const model = event.target.value;
      setSelectedModel(model);
    },
    []
  );

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const year = event.target.value;
      setSelectedYear(year);
    },
    []
  );

  return (
    <div>
      <h2>{translate("evRange")}</h2>
      <div>
        <label htmlFor="makeSelect">{translate("makeLabel")} </label>
        <select
          id="makeSelect"
          onChange={handleMakeChange}
          value={selectedMake}
        >
          <option value="">{translate("selectMake")}</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="modelSelect">{translate("modelLabel")} </label>
        <select
          id="modelSelect"
          onChange={handleModelChange}
          value={selectedModel}
          disabled={!selectedMake}
        >
          <option value="">{translate("selectModel")}</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="yearSelect">{translate("yearLabel")} </label>
        <select
          id="yearSelect"
          onChange={handleYearChange}
          value={selectedYear}
        >
          <option value="">{translate("selectYear")}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={IFilteredData}>
          <XAxis dataKey="Model" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Electric Range"
            stroke="#8884d8"
            name="Electric Range"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVRangeDistribution;
