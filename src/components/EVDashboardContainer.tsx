import React, { useEffect, useState } from "react";
import axios from "axios";
import { parse } from "csv-parse/browser/esm";
import { ClipLoader } from "react-spinners";
import { RawEVData } from "../types";
import { StyledLoaderWrapper } from "../styles";
import EVDistributionComponent from "./EVDistributionByLocation";

const EVDashboardContainer: React.FC = () => {
  const [rawData, setRawData] = useState<RawEVData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("/assets/Electric_Vehicle_Population_Data.csv", {
        responseType: "text",
      })
      .then((response) => {
        parse(response.data, { columns: true }, (err, records: RawEVData[]) => {
          if (err) {
            console.error("Error parsing CSV data:", err);
            setLoading(false);
            return;
          }
          setRawData(records);
          setLoading(false);
        });
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
        <EVDistributionComponent rawData={rawData} />
      )}
    </div>
  );
};

export default EVDashboardContainer;
