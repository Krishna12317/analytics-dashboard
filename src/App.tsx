import "./App.css";
import EVDashboardContainer from "../src/components/EVDashboardContainer";
import { StyledHeaderContainer } from "./styles";
import { useTranslation } from "react-i18next";

function App() {
  const { t: translate } = useTranslation();

  return (
    <>
      <StyledHeaderContainer>
        <h1>{translate("appHeader")}</h1>
      </StyledHeaderContainer>
      <EVDashboardContainer />
    </>
  );
}

export default App;
