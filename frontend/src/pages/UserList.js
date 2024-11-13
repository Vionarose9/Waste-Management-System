import React from 'react';
import { Table, Alert } from 'flowbite-react';

const UsersList = ({ users, error }) => {
  if (error) {
    return (
      <Alert color="failure" className="mb-4">
        <span>{error}</span>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <h5 className="text-lg font-bold text-white">Users in Your Center</h5>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">User ID</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Name</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">City</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Street</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Landmark</th>
                <th className="px-4 py-2 text-left bg-gray-200 border border-gray-300">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-2 border border-gray-300">{user.user_id}</td>
                    <td className="px-4 py-2 border border-gray-300">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.city}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.street}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.landmark}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.phone_number}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-2 border border-gray-300 text-center">
                    No users found
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

export default UsersList;