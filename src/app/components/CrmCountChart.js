// "use client";
// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const StatusCountChart = ({ apiData, username }) => {
//   const [chartData, setChartData] = useState({});

//   useEffect(() => {
//     console.log("Username:", username);
//   }, [username]);

//   useEffect(() => {
//     console.log("API Data:", apiData);

//     if (apiData && Array.isArray(apiData.data) && apiData.data.length > 0) {
//       const statusMap = {};

//       apiData.data.forEach((item) => {
//         const name = item.status;
//         const status = item.salesperson;

//         if (!statusMap[name]) {
//           statusMap[name] = new Set();
//         }
//         statusMap[name].add(status);
//       });

//       const labels = Object.keys(statusMap);
//       const dataCounts = labels.map((name) => statusMap[name].size);

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Unique Status Count per User",
//             data: dataCounts,
//             backgroundColor: "rgba(75, 192, 192, 0.6)",
//             borderColor: "rgba(75, 192, 192, 1)",
//             borderWidth: 1,
//           },
//         ],
//       });
//     }
//   }, [apiData]);

//   return (
//     <div className="w-full max-w-4xl mx-auto mt-10">
//       <h2 className="text-xl font-bold mb-4 text-center">
//         Status Variety per User
//       </h2>
//       {chartData.labels && chartData.labels.length > 0 ? (
//         <Bar
//           data={chartData}
//           options={{
//             indexAxis: "x",
//             responsive: true,
//             plugins: {
//               legend: { display: true, position: "top" },
//               tooltip: { enabled: true },
//             },
//             scales: {
//               x: { beginAtZero: true, ticks: { stepSize: 1 } },
//             },
//           }}
//         />
//       ) : (
//         <p className="text-center text-gray-500">No data to display.</p>
//       )}
//     </div>
//   );
// };

// export default StatusCountChart;
