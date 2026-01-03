import { CurrentConditionCard } from "./components/CurrentConditionCard";
import { CurrentHumidityCard } from "./components/CurrentHumidityCard";
import { CurrentTemperatureCard } from "./components/CurrentTemperatureCard";
import { CurrentWindSpeedCard } from "./components/CurrentWindSpeedCard";
import { ExportDataCard } from "./components/ExportDataCard";
import { HistoricalHumidityChartCard } from "./components/HistoricalHumidityChartCard";
import { HistoricalTemperatureChartCard } from "./components/HistoricalTemperatureChartCard";
import { HistoricalWindSpeedChartCard } from "./components/HistoricalWindSpeedChartCard";



export const DashboardPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mx-20"> 
      <CurrentTemperatureCard />
      <CurrentHumidityCard />
      <CurrentWindSpeedCard />
      <CurrentConditionCard />
      {/* <AIInsightsCard />  */}
      <HistoricalTemperatureChartCard />
      <HistoricalHumidityChartCard />
      <HistoricalWindSpeedChartCard />
      <ExportDataCard />
    </div>
  );
};
