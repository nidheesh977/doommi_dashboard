import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalAdoptions: 0,
    petTypes: [],
  });
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/`);
        setStats(response.data);
        setError(null);
      } catch (error) {
        const errorMessage = error.response?.status === 403
          ? 'Access forbidden. Please check your authentication token.'
          : error.response?.data?.detail || error.message;
        setError(errorMessage);
        console.error('Error fetching dashboard stats:', errorMessage);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (chartRef.current && stats.petTypes.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: stats.petTypes.map(type => type.pet_type),
          datasets: [{
            label: 'Pets by Type',
            data: stats.petTypes.map(type => type.count),
            backgroundColor: [
              '#3b82f6', // blue-500
              '#10b981', // green-500
              '#f59e0b', // yellow-500
              '#ef4444', // red-500
              '#8b5cf6', // purple-500
              '#ec4899', // pink-500
            ],
            borderColor: '#1f2937', // gray-800
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Pets',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Pet Type',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stats.petTypes]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg dashboard-card">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg dashboard-card">
          <h3 className="text-lg font-semibold">Total Pets</h3>
          <p className="text-2xl">{stats.totalPets}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg dashboard-card">
          <h3 className="text-lg font-semibold">Total Adoptions</h3>
          <p className="text-2xl">{stats.totalAdoptions}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Pets by Type</h3>
        <canvas ref={chartRef} className="max-h-96"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;