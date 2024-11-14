import React, { useState, useEffect } from 'react';
import { 
  Card,
  Navbar,
  Button,
  Table,
  Sidebar,
  Badge,
  Alert,
  Spinner,
  Modal
} from 'flowbite-react';
import { 
  HiChartPie,
  HiTruck,
  HiUsers,
  HiDocumentText,
  HiCog,
  HiBell,
  HiMenu,
  HiX,
  HiLogout
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import UsersList from './UserList';
import RequestsTable from './RequestsTable';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState([]);
  const [vehicleError, setVehicleError] = useState('');
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestError, setRequestError] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    activeVehicles: 0,
    collectionRate: 0,
    totalUsers: 0,
    recentRequests: []
  });

  

  // ... (keep all existing useEffect hooks and functions)

 
  const [adminDataLoading, setAdminDataLoading] = useState(false);

  const fetchAdminData = async () => {
    setAdminDataLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdminData(data);
      setShowAdminModal(true);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch admin data. Please try again later.');
    } finally {
      setAdminDataLoading(false);
    }
  };


  const navigate = useNavigate();
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch dashboard data. Please try again later.');
      setDashboardData({
        totalRequests: 0,
        activeVehicles: 0,
        collectionRate: 0,
        totalUsers: 0,
        recentCollections: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setRequestError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setRequestError('Failed to fetch requests. Please try again later.');
    }
  };

  useEffect(() => {
    if (activeTab === 'vehicles') {
      console.log('Fetching vehicles...'); // Debug log
      fetchVehicles();
    }
  }, [activeTab]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Vehicles data:', data.vehicles); // Updated console log
      setVehicles(data.vehicles || []); // Updated setVehicles

    } catch (error) {
      console.error('Fetch error:', error);
      setVehicleError('Failed to fetch vehicles. Please try again later.');
    }
  };
  const handleUpdateVehicleStatus = async (vehicleId) => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ vehicle_id: vehicleId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUpdateMessage(data.message);
      fetchVehicles(); // Refresh the vehicle list
    } catch (error) {
      console.error('Update error:', error);
      setVehicleError('Failed to update vehicle status. Please try again.');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
      setUserError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setUserError('Failed to fetch users. Please try again later.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/getnotif', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setNotificationCount(data.count);
      setError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };

  const markAsRead = async (reqId) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/getnotif', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ req_id: reqId })
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {dashboardData.totalRequests}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Total Requests
                </p>
              </Card>
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {dashboardData.activeVehicles}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Active Vehicles
                </p>
              </Card>
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {dashboardData.collectionRate.toFixed(2)}%
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Collection Rate
                </p>
              </Card>
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {dashboardData.totalUsers}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Total Users
                </p>
              </Card>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
  <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
    <h5 class="text-lg font-bold text-white">Recent Collections</h5>
  </div>
  <div class="p-4">
    {loading ? (
      <div class="flex justify-center items-center h-64">
        <div role="status">
          <svg class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    ) : error ? (
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <div class="font-bold">Error</div>
        <div>{error}</div>
      </div>
    ) : dashboardData.recentCollections && dashboardData.recentCollections.length > 0 ? (
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left bg-gray-200 border border-gray-300">Collection ID</th>
              <th class="px-4 py-2 text-left bg-gray-200 border border-gray-300">User</th>
              <th class="px-4 py-2 text-left bg-gray-200 border border-gray-300">Waste Type</th>
              <th class="px-4 py-2 text-left bg-gray-200 border border-gray-300">Date</th>
              <th class="px-4 py-2 text-left bg-gray-200 border border-gray-300">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentCollections.map((collection) => (
              <tr key={collection.collection_id} class="border-b border-gray-300">
                <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">
                  {collection.collection_id}
                </td>
                <td class="px-4 py-2">{`${collection.user.first_name} ${collection.user.last_name}`}</td>
                <td class="px-4 py-2">{collection.waste_type}</td>
                <td class="px-4 py-2">{new Date(collection.collection_date).toLocaleDateString()}</td>
                <td class="px-4 py-2">{collection.collection_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p class="text-gray-500 text-center py-4">No recent collections available.</p>
    )}
  </div>
</div>
            </div>
      );
      default:
        return (
          <>
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
                      {[
                        { id: 'REQ001', user: 'John Doe', type: 'Household', status: 'Pending', date: '2024-11-07', quantity: '50kg', location: '123 Main St' },
                        { id: 'REQ002', user: 'Jane Smith', type: 'Commercial', status: 'In Progress', date: '2024-11-08', quantity: '200kg', location: '456 Oak Ave' },
                        { id: 'REQ003', user: 'Mike Johnson', type: 'Industrial', status: 'Completed', date: '2024-11-08', quantity: '500kg', location: '789 Pine Rd' }
                      ].map((request) => (
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
          </>
        );
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
            {[
              { name: 'Dashboard', icon: HiChartPie, tab: 'dashboard' },
              { name: 'Requests', icon: HiDocumentText, tab: 'requests' },
              { name: 'Vehicles', icon: HiTruck, tab: 'vehicles' },
              { name: 'Users', icon: HiUsers, tab: 'users' },
              { name: 'Settings', icon: HiCog, tab: 'settings' },
            ].map((item) => (
              <button 
                key={item.tab}
                className={`flex w-full items-center rounded-lg px-4 py-2 text-white hover:bg-purple-600 ${activeTab === item.tab ? 'bg-purple-600' : ''}`}
                onClick={() => setActiveTab(item.tab)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
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
                              Date: {new Date(notification.req_date).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {notification.status}
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
            <Button
        color="gray"
        className="rounded-full"
        onClick={fetchAdminData}
      >
        <HiUsers className="h-5 w-5" />
      </Button>
            <Button
              color="gray"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <HiLogout className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </Navbar>

        {/* Main Content Area */}
        <main className="flex-1 p-4 mt-16">
          {renderContent()}
        </main>
      </div>
      <Modal show={showAdminModal} onClose={() => setShowAdminModal(false)}>
        <Modal.Header>Admin Information</Modal.Header>
        <Modal.Body>
          {adminDataLoading ? (
            <div className="flex justify-center items-center">
              <Spinner size="xl" />
            </div>
          ) : adminData ? (
            <div className="space-y-4">
              <p><strong>Admin ID:</strong> {adminData.admin_id}</p>
              <p><strong>Name:</strong> {adminData.admin_name}</p>
              <p><strong>Centre ID:</strong> {adminData.centre_id}</p>
              <p><strong>Centre Name:</strong> {adminData.centre_name}</p>
              <p><strong>Centre Location:</strong> {adminData.centre_location}</p>
            </div>
          ) : (
            <p>No admin data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowAdminModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}