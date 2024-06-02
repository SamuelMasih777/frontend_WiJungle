import React from 'react';
import CategoryPieChart from '../components/categoryPieChart';

const GraphByCategory = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-white text-center">
        Alerts by Category
      </h2>
      <div className="p-4 flex flex-wrap justify-center md:justify-between">
        <div className="w-full md:w-1/3 flex flex-col justify-center mb-4 md:mb-0">
          <p className="font-mono font-semibold text-xl text-white text-center">
            The pie chart beside shows the distribution of alerts based on
            their category. Each slice represents a different category,
            such as "Potentially Bad Traffic", "Attempted Information
            Leak", or "Misc Attack". The size of each slice indicates the
            proportion of alerts belonging to that category. This overview
            helps you quickly identify the most common types of alerts in
            your system.
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <CategoryPieChart />
        </div>
      </div>
    </div>
  );
};

export default GraphByCategory;
