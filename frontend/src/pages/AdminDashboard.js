import React, { useState, useEffect } from 'react';
import { 
  Card,
  Navbar,
  Button,
  Table,
  Sidebar,
  Badge,
  Alert
} from 'flowbite-react';
import { 
  HiChartPie,
  HiTruck,
  HiUsers,
  HiDocumentText,
  HiCog,
  HiBell,
  HiMenu,
  HiX
} from 'react-icons/hi';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState('');

  // Mock data
  const requests = [
    { id: 'REQ001', user: 'John Doe', type: 'Household', status: 'Pending', date: '2024-11-07', quantity: '50kg', location: '123 Main St' },
    { id: 'REQ002', user: 'Jane Smith', type: 'Commercial', status: 'In Progress', date: '2024-11-08', quantity: '200kg', location: '456 Oak Ave' },
    { id: 'REQ003', user: 'Mike Johnson', type: 'Industrial', status: 'Completed', date: '2024-11-08', quantity: '500kg', location: '789 Pine Rd' }
  ];

  const vehicles = [
    { id: 'VEH001', type: 'Truck', status: 'Available', driver: 'Steve Wilson', lastMaintenance: '2024-10-15' },
    { id: 'VEH002', type: 'Van', status: 'On Route', driver: 'Sarah Brown', lastMaintenance: '2024-10-20' }
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Completed': return 'success';
      case 'Available': return 'success';
      case 'On Route': return 'info';
      default: return 'default';
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/admin/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'  // Include credentials if using cookies
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setNotifications(data);
      setError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };
  
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/admin/notifications/count', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setNotificationCount(data.count);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };
  
  const markAsRead = async (reqId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/admin/notifications/${reqId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setNotifications(notifications.filter(n => n.req_id !== reqId));
      setNotificationCount(prev => prev - 1);
      setError('');
    } catch (error) {
      console.error('Mark as read error:', error);
      setError('Failed to mark notification as read. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-purple-700 to-purple-900 text-white">
          <div className="flex h-16 items-center justify-center border-b border-purple-600">
            <span className="text-xl font-bold">Waste Management</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <button className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600">
              <HiChartPie className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600">
              <HiDocumentText className="mr-3 h-5 w-5" />
              Requests
            </button>
            <button className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600">
              <HiTruck className="mr-3 h-5 w-5" />
              Vehicles
            </button>
            <button className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600">
              <HiUsers className="mr-3 h-5 w-5" />
              Users
            </button>
            <button className="flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600">
              <HiCog className="mr-3 h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} flex flex-col transition-all duration-300`}>
        {/* Fixed Navbar */}
        <Navbar className="fixed top-0 right-0 left-0 z-20 lg:left-64 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              color="gray"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <HiMenu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Button
                color="gray"
                className="rounded-full"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    fetchNotifications();
                  }
                }}
              >
                <HiBell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    {error && (
                      <Alert color="failure" className="mb-4">
                        <span>{error}</span>
                      </Alert>
                    )}
                    <div className="space-y-4">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No new notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.req_id}
                            className="p-4 bg-blue-50 rounded-lg relative"
                          >
                            <button
                              onClick={() => markAsRead(notification.req_id)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                              <HiX className="h-5 w-5" />
                            </button>
                            <h4 className="font-semibold">
                              New Waste Request #{notification.req_id}
                            </h4>
                            <p className="text-sm text-gray-600">
                              From: {notification.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Type: {notification.waste_type}
                            </p>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(notification.req_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Address: {notification.user.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              Landmark: {notification.user.landmark}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src="/api/placeholder/32/32"
                alt="Admin"
              />
              <span className="ml-2 text-sm font-medium">Admin User</span>
            </div>
          </div>
        </Navbar>

        {/* Main Content Area */}
        <main className="flex-1 p-4 mt-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <h3 className="text-sm font-medium opacity-80">Total Requests</h3>
              <p className="text-2xl font-bold mt-2">156</p>
              <p className="text-sm mt-2 text-blue-100">+12% from last month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="text-sm font-medium opacity-80">Active Vehicles</h3>
              <p className="text-2xl font-bold mt-2">8</p>
              <p className="text-sm mt-2 text-purple-100">All vehicles operational</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <h3 className="text-sm font-medium opacity-80">Collection Rate</h3>
              <p className="text-2xl font-bold mt-2">94%</p>
              <p className="text-sm mt-2 text-green-100">Above target</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <h3 className="text-sm font-medium opacity-80">Total Users</h3>
              <p className="text-2xl font-bold mt-2">1,204</p>
              <p className="text-sm mt-2 text-orange-100">+85 this month</p>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <h5 className="text-lg font-bold text-white">Recent Collection Requests</h5>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Request ID</Table.HeadCell>
                    <Table.HeadCell>User</Table.HeadCell>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Date</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Location</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {requests.map((request) => (
                      <Table.Row key={request.id}>
                        <Table.Cell>{request.id}</Table.Cell>
                        <Table.Cell>{request.user}</Table.Cell>
                        <Table.Cell>{request.type}</Table.Cell>
                        <Table.Cell>
                          <Badge color={getStatusBadgeColor(request.status)}>
                            {request.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>{request.date}</Table.Cell>
                        <Table.Cell>{request.quantity}</Table.Cell>
                        <Table.Cell>{request.location}</Table.Cell>
                        <Table.Cell>
                          <Button size="xs" color="purple">Assign Vehicle</Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>

          {/* Vehicle Status Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h5 className="text-lg font-bold text-white">Vehicle Status</h5>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Vehicle ID</Table.HeadCell>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Driver</Table.HeadCell>
                    <Table.HeadCell>Last Maintenance</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {vehicles.map((vehicle) => (
                      <Table.Row key={vehicle.id}>
                        <Table.Cell>{vehicle.id}</Table.Cell>
                        <Table.Cell>{vehicle.type}</Table.Cell>
                        <Table.Cell>
                          <Badge color={getStatusBadgeColor(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>{vehicle.driver}</Table.Cell>
                        <Table.Cell>{vehicle.lastMaintenance}</Table.Cell>
                        <Table.Cell>
                          <Button size="xs" color="blue">Update Status</Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}