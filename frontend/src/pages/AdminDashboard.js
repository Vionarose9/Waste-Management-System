// AdminDashboard.js
import React, { useState } from 'react';
import { 
  Navbar, 
  Button, 
  Table, 
  Badge,
  Dropdown,
  Sidebar,
  Card
} from 'flowbite-react';
import { 
  HiOutlineTruck, 
  HiOutlineUserGroup, 
  HiOutlineDocumentReport,
  HiOutlineChartPie,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineCog
} from 'react-icons/hi';

function AdminDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar className="fixed h-full w-64">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiOutlineChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiOutlineDocumentReport}>
                Requests
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiOutlineTruck}>
                Vehicles
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiOutlineUserGroup}>
                Users
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiOutlineCog}>
                Settings
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Navbar fluid>
          <div className="flex items-center">
            <Button 
              color="gray" 
              pill
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="mr-4 lg:hidden"
            >
              <HiOutlineMenu className="h-5 w-5" />
            </Button>
            <span className="text-xl font-semibold">Waste Management Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Button color="gray" pill>
              <HiOutlineBell className="h-5 w-5" />
            </Button>
            <Dropdown
              label="Admin User"
              inline
            >
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={HiOutlineLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        </Navbar>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Requests</span>
                <span className="text-2xl font-bold">156</span>
                <span className="text-green-500 text-sm">+12% from last month</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Active Vehicles</span>
                <span className="text-2xl font-bold">8</span>
                <span className="text-green-500 text-sm">All vehicles operational</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Collection Rate</span>
                <span className="text-2xl font-bold">94%</span>
                <span className="text-green-500 text-sm">Above target</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Users</span>
                <span className="text-2xl font-bold">1,204</span>
                <span className="text-green-500 text-sm">+85 this month</span>
              </div>
            </Card>
          </div>

          {/* Recent Requests Table */}
          <Card className="mb-6">
            <h5 className="text-xl font-bold mb-4">Recent Collection Requests</h5>
            <Table hoverable>
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
              <Table.Body className="divide-y">
                {requests.map((request) => (
                  <Table.Row key={request.id} className="bg-white">
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
                      <Button size="xs">Assign Vehicle</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>

          {/* Vehicle Status Table */}
          <Card>
            <h5 className="text-xl font-bold mb-4">Vehicle Status</h5>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Vehicle ID</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Driver</Table.HeadCell>
                <Table.HeadCell>Last Maintenance</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {vehicles.map((vehicle) => (
                  <Table.Row key={vehicle.id} className="bg-white">
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
                      <Button size="xs" color="gray">Update Status</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;