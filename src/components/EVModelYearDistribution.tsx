import React, { useEffect, useState, useCallback } from "react";
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
import { IRawEVData, IFilteredData } from "../types";
import { getUniqueValues, aggregateData, filterData } from "../utility";

const EVMakeModelYearComponent: React.FC<{ rawData: IRawEVData[] }> = ({
  rawData,
}) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelYears, setModelYears] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModelYear, setSelectedModelYear] = useState<string>("");
  const [IFilteredData, setIFilteredData] = useState<IFilteredData[]>([]);

  const { t: translate } = useTranslation();

  useEffect(() => {
    const uniqueMakes = getUniqueValues(rawData, "Make");
    setMakes(uniqueMakes);

    const aggregatedData = aggregateData(rawData);
    setIFilteredData(aggregatedData);
  }, [rawData]);

  useEffect(() => {
    if (selectedMake) {
      const uniqueModels = getUniqueValues(
        rawData.filter((d) => d.Make === selectedMake),
        "Model"
      );
      setModels(uniqueModels);
    } else {
      setModels([]);
    }

    if (selectedMake && selectedModel) {
      const uniqueModelYears = getUniqueValues(
        rawData.filter(
          (d) => d.Make === selectedMake && d.Model === selectedModel
        ),
        "Model Year"
      );
      setModelYears(uniqueModelYears);
    } else {
      setModelYears([]);
    }

    const aggregatedData = aggregateData(rawData);
    const filtered = filterData(
      aggregatedData,
      selectedMake,
      selectedModel,
      selectedModelYear
    );
    setIFilteredData(filtered);
  }, [rawData, selectedMake, selectedModel, selectedModelYear]);

  const handleMakeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMake(event.target.value);
      setSelectedModel("");
      setSelectedModelYear("");
    },
    []
  );

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(event.target.value);
      setSelectedModelYear("");
    },
    []
  );

  const handleModelYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModelYear(event.target.value);
    },
    []
  );

  return (
    <div>
      <h2>{translate("evModelYearDistribution")}</h2>
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
        <label htmlFor="modelYearSelect">{translate("yearLabel")} </label>
        <select
          id="modelYearSelect"
          onChange={handleModelYearChange}
          value={selectedModelYear}
          disabled={!selectedModel}
        >
          <option value="">{translate("selectYear")}</option>
          {modelYears.map((modelYear) => (
            <option key={modelYear} value={modelYear}>
              {modelYear}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={IFilteredData}>
          <XAxis dataKey="modelYear" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVMakeModelYearComponent;
