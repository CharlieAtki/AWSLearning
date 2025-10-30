import BusinessSalesLineChart from "./graphs/businessSalesLineChart";
import BusinessAreaChart from "./graphs/businessAreaChart";
import BusinessBarChart from "./graphs/businessBarChart";

const BusinessAnalyticsGrid = () => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl">

      {/* Top large chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 h-[500px] w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Sales Over Time
        </h2>
        <BusinessSalesLineChart
          metricOne="Total Sales"
          metricTwo="Number of Orders"
          metricOneUnit="USD"
          metricTwoUnit="Orders"
        />
      </div>

      {/* Bottom smaller charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-96">
          <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
            Sales by Category
          </h3>
          <BusinessAreaChart
            metricOne="Total Sales"
            metricTwo="Number of Orders"
            metricOneUnit="USD"
            metricTwoUnit="Orders"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-96">
          <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
            Sales by Region
          </h3>
          <BusinessBarChart
            metricOne="Total Sales"
            metricTwo="Number of Orders"
            metricOneUnit="USD"
            metricTwoUnit="Orders"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalyticsGrid;
