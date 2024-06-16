import React, { useState, useEffect, useCallback } from "react";
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
import { IRawEVData } from "../types";

const EVType: React.FC<{ rawData: IRawEVData[] }> = ({ rawData }) => {
  const { t: translate } = useTranslation();

  const [makes, setMakes] = useState<string[]>([]);

  const [IFilteredData, setIFilteredData] = useState<
    { Make: string; BEV: number; PHEV: number }[]
  >([]);

  useEffect(() => {
    const uniqueMakes = Array.from(new Set(rawData.map((item) => item.Make)));
    setMakes(uniqueMakes);

    const initialIFilteredData = uniqueMakes.map((make) => ({
      Make: make,
      BEV: countEVType(rawData, make, "Battery Electric Vehicle (BEV)"),
      PHEV: countEVType(
        rawData,
        make,
        "Plug-in Hybrid Electric Vehicle (PHEV)"
      ),
    }));

    setIFilteredData(initialIFilteredData);
  }, [rawData]);

  const countEVType = (
    data: IRawEVData[],
    make: string,
    evType:
      | "Battery Electric Vehicle (BEV)"
      | "Plug-in Hybrid Electric Vehicle (PHEV)"
  ): number => {
    return data.filter(
      (item) => item.Make === make && item["Electric Vehicle Type"] === evType
    ).length;
  };

  const handleMakeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedMake = event.target.value;

      if (!selectedMake) {
        const updatedIFilteredData = makes.map((make) => ({
          Make: make,
          BEV: countEVType(rawData, make, "Battery Electric Vehicle (BEV)"),
          PHEV: countEVType(
            rawData,
            make,
            "Plug-in Hybrid Electric Vehicle (PHEV)"
          ),
        }));
        setIFilteredData(updatedIFilteredData);
      } else {
        const filtered = rawData.filter((item) => item.Make === selectedMake);

        const bevCount = countEVType(
          filtered,
          selectedMake,
          "Battery Electric Vehicle (BEV)"
        );
        const phevCount = countEVType(
          filtered,
          selectedMake,
          "Plug-in Hybrid Electric Vehicle (PHEV)"
        );

        setIFilteredData([
          { Make: selectedMake, BEV: bevCount, PHEV: phevCount },
        ]);
      }
    },
    [rawData, makes]
  );

  return (
    <div>
      <h2>{translate("evType")}</h2>
      <div>
        <label htmlFor="makeSelect">{translate("makeLabel")} </label>
        <select id="makeSelect" onChange={handleMakeChange}>
          <option value="">{translate("selectMake")}</option>
          {makes.map((make, index) => (
            <option key={index} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={IFilteredData}>
          <XAxis dataKey="Make" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="BEV" stackId="type" fill="#8884d8" />
          <Bar dataKey="PHEV" stackId="type" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVType;
