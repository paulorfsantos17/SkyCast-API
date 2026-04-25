import { useLocationContext } from "@/contexts/LocationContext";
import { useHistoricalWeatherLogsViewModel } from "@/services/viewmodels/useHistoricalWeatherLogsViewModel";
import { useWeatherLogsViewModel } from "@/services/viewmodels/useWeatherLogsViewModel";
import { motion } from "framer-motion";
import { AIInsightsCard } from "./components/AIInsightsCard";
import { CitySelectionCard } from "./components/CitySelectionCard";
import { CurrentConditionCard } from "./components/CurrentConditionCard";
import { CurrentHumidityCard } from "./components/CurrentHumidityCard";
import { CurrentTemperatureCard } from "./components/CurrentTemperatureCard";
import { CurrentWindSpeedCard } from "./components/CurrentWindSpeedCard";
import { ExportDataCard } from "./components/ExportDataCard";
import { HistoricalHumidityChartCard } from "./components/HistoricalHumidityChartCard";
import { HistoricalTemperatureChartCard } from "./components/HistoricalTemperatureChartCard";
import { HistoricalWindSpeedChartCard } from "./components/HistoricalWindSpeedChartCard";

export const DashboardPage = () => {
  const { locationId } = useLocationContext();
  const { latestLog, loading, error, exportCSV, exportXLSX } = useWeatherLogsViewModel();
  const {
    historicalLogs,
    errorHistoricalLogs,
    loadingHistoricalLogs,
  } = useHistoricalWeatherLogsViewModel();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (!locationId) {
    return (
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mx-auto max-w-4xl p-4 mt-8"> {/* Adicionado mt-8 aqui */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <CitySelectionCard />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 lg:p-8 mt-8" // Adicionado mt-8 aqui
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div className="col-span-full h-full w-full" variants={cardVariants}>
        <CitySelectionCard />
      </motion.div>

      <motion.div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        <motion.div className="h-full" variants={cardVariants}>
          <CurrentTemperatureCard latestLog={latestLog} loading={loading} error={error} />
        </motion.div>
        <motion.div className="h-full" variants={cardVariants}>
          <CurrentHumidityCard latestLog={latestLog} loading={loading} error={error} />
        </motion.div>
        <motion.div className="h-full" variants={cardVariants}>
          <CurrentWindSpeedCard latestLog={latestLog} loading={loading} error={error} />
        </motion.div>
        <motion.div className="h-full" variants={cardVariants}>
          <CurrentConditionCard latestLog={latestLog} loading={loading} error={error} />
        </motion.div>
      </motion.div>

      <motion.div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        <motion.div className="col-span-full md:col-span-2 h-full" variants={cardVariants}>
          <AIInsightsCard />
        </motion.div>

        <motion.div className="col-span-full md:col-span-2 h-full" variants={cardVariants}>
          <HistoricalTemperatureChartCard
            historicalLogs={historicalLogs}
            loadingHistoricalLogs={loadingHistoricalLogs}
            errorHistoricalLogs={errorHistoricalLogs}
          />
        </motion.div>
        <motion.div className="col-span-full md:col-span-2 h-full" variants={cardVariants}>
          <HistoricalHumidityChartCard
            historicalLogs={historicalLogs}
            loadingHistoricalLogs={loadingHistoricalLogs}
            errorHistoricalLogs={errorHistoricalLogs}
          />
        </motion.div>
        <motion.div className="col-span-full md:col-span-2 h-full" variants={cardVariants}>
          <HistoricalWindSpeedChartCard
            historicalLogs={historicalLogs}
            loadingHistoricalLogs={loadingHistoricalLogs}
            errorHistoricalLogs={errorHistoricalLogs}
          />
        </motion.div>
      </motion.div>

      <motion.div className="col-span-full h-full" variants={cardVariants}>
        <ExportDataCard />
      </motion.div>
    </motion.div>
  );
};