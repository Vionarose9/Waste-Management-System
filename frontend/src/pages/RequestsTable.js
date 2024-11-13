import React from 'react';
import { Alert } from 'flowbite-react';

const RequestsTable = ({ requests, error }) => {
  if (error) {
    return (
      <Alert color="failure" className="mb-4">
        <span>{error}</span>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
        <h5 className="text-lg font-bold text-white">Waste Requests and Collections</h5>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Request ID</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Request Date</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Status</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Waste Type</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">User</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Collection ID</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Collection Date</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Collection Quantity</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.req_id}>
                    <td className="px-4 py-2 border border-gray-300">{request.req_id}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(request.req_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{request.status}</td>
                    <td className="px-4 py-2 border border-gray-300">{request.waste_type}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {`${request.user.first_name} ${request.user.last_name}`}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {request.collection ? request.collection.collection_id : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {request.collection ? new Date(request.collection.collection_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {request.collection ? `${request.collection.collection_quantity} kg` : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 border border-gray-300 text-center">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;