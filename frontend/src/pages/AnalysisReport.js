import React, { useState } from 'react';
import { Card, Spinner, Button, Alert } from 'flowbite-react';

function AnalysisReport() {
  const [analysisData, setAnalysisData] = useState({
    totalHousehold: 0,
    totalOrganic: 0,
    totalRecyclable: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/admin/analysis', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analysis data');
      }

      const data = await response.json();
      setAnalysisData({
        totalHousehold: data.totalHousehold || 0,
        totalOrganic: data.totalOrganic || 0,
        totalRecyclable: data.totalRecyclable || 0
      });
    } catch (err) {
      console.error('Analysis data fetch error:', err);
      setError(err.message || 'Failed to fetch analysis data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center">
        <h5 className="text-lg font-bold text-white">Waste Analysis Report</h5>
        <Button 
          color="light" 
          onClick={fetchAnalysisData} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Analyzing...
            </>
          ) : 'Analyze'}
        </Button>
      </div>
      
      <div className="p-4">
        {error && (
          <Alert color="failure" className="mb-4">
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {analysisData.totalHousehold.toFixed(2)} kg
                </h5>
                <p className="font-normal text-gray-700">
                  Total Household Waste
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {analysisData.totalOrganic.toFixed(2)} kg
                </h5>
                <p className="font-normal text-gray-700">
                  Total Organic Waste
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                  {analysisData.totalRecyclable.toFixed(2)} kg
                </h5>
                <p className="font-normal text-gray-700">
                  Total Recyclable Waste
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisReport;