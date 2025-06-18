"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatusCountChart = ({ apiData, username }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    console.log("Username:", username);
  }, [username]);

  useEffect(() => {
    console.log("API Data:", apiData);

    // if (apiData && Array.isArray(apiData.data) && apiData.data.length > 0) {
    if (apiData && apiData.result) {
      const statusMap = {};

      Object.values(apiData.result).forEach((dailyData) => {
        Object.entries(dailyData).forEach(([name, count]) => {
          const formattedName = name.trim().toLocaleLowerCase();
          statusMap[formattedName] = (statusMap[formattedName] || 0) + count;
        });
      });

      const labels = Object.keys(statusMap).map(
        (name) => name.charAt(0).toUpperCase() + name.slice(1)
      );
      const dataCounts = Object.values(statusMap);

      // apiData.data.forEach((item) => {
      //   const name = item.status;
      //   // const name = item.status;
      //   // const status = item.salesperson;

      //   if (!statusMap[name]) {
      //     statusMap[name] = 0;
      //     //   statusMap[name] = new Set();
      //   }

      //   // statusMap[name].add(status);
      //   statusMap[name] += 1;
      // });

      // console.log("Final  =>  ", statusMap);

      // const labels = Object.keys(statusMap);
      // const dataCounts = labels.map((name) => statusMap[name]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Crm Entries Userwise",
            data: dataCounts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [apiData]);

  return (
    <div className="w-full max-w-xl mx-auto mt-0">
      <p className="text-xs font-bold mb-1 text-center">CRM Status</p>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            indexAxis: "x",
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
              tooltip: { enabled: true },
            },
            scales: {
              x: { beginAtZero: true, ticks: { stepSize: 1 } },
            },
          }}
        />
      ) : (
        <p className="text-center text-gray-500">No data to display.</p>
      )}
    </div>
  );
};

export default StatusCountChart;

