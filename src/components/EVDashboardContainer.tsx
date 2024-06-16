import React, { useEffect, useState } from "react";
import axios from "axios";
import { parse } from "csv-parse/browser/esm";
import { ClipLoader } from "react-spinners";
import { IRawEVData } from "../types";
import { StyledLoaderWrapper } from "../styles";
import EVDistributionComponent from "./EVDistributionByLocation";
import EVMakeModelYearComponent from "./EVModelYearDistribution";
import EVRangeDistribution from "./EVRangeDistribution";
import EVType from "./EVType";

const EVDashboardContainer: React.FC = () => {
  const [rawData, setRawData] = useState<IRawEVData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("/assets/Electric_Vehicle_Population_Data.csv", {
        responseType: "text",
      })
      .then((response) => {
        parse(
          response.data,
          { columns: true },
          (err, records: IRawEVData[]) => {
            if (err) {
              console.error("Error parsing CSV data:", err);
              setLoading(false);
              return;
            }
            console.log(records);
            setRawData(records);
            setLoading(false);
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <StyledLoaderWrapper>
          <ClipLoader size={50} color="#8884d8" loading={loading} />
        </StyledLoaderWrapper>
      ) : (
        <>
          <EVDistributionComponent rawData={rawData} />
          <EVMakeModelYearComponent rawData={rawData} />
          <EVType rawData={rawData} />
          <EVRangeDistribution rawData={rawData} />
        </>
      )}
    </div>
  );
};

export default EVDashboardContainer;
