import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from 'flowbite-react';
import { HiPlus, HiClock, HiUser, HiBell, HiOutlineArrowRight } from 'react-icons/hi';
import WasteRequestForm from './WasteRequestForm';
import axios from 'axios';

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/waste-request', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleNewRequest = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRequestCreated = (newRequest) => {
    setRequests(prevRequests => [newRequest, ...prevRequests]);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'warning',
      'Approved': 'success',
      'Completed': 'info'
    };
    return (
      <Badge color={colors[status]} className="w-24 justify-center">
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button color="gray" size="sm">
              <HiBell className="h-5 w-5" />
            </Button>
            <Button color="gray" size="sm">
              <HiUser className="h-5 w-5" />
            </Button>
            <Button color="gray" size="sm">
              <HiOutlineArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
          <Card className="cursor-pointer hover:bg-gray-50" onClick={handleNewRequest}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <HiPlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">New Request</h2>
                <p className="text-gray-600">Create collection request</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <HiClock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Request History</h2>
                <p className="text-gray-600">View past collections</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <HiUser className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <p className="text-gray-600">Update your details</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Recent Requests</h2>
          <Table>
            <Table.Head>
              <Table.HeadCell>Request ID</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {requests.map((request) => (
                <Table.Row key={request.req_id} className="bg-white">
                  <Table.Cell className="font-medium text-gray-900">
                    {request.req_id}
                  </Table.Cell>
                  <Table.Cell>{request.waste_type}</Table.Cell>
                  <Table.Cell>{getStatusBadge(request.status)}</Table.Cell>
                  <Table.Cell>{new Date(request.req_date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{request.quantity}kg</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <WasteRequestForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRequestCreated={handleRequestCreated}
      />
    </div>
  );
}

export default Dashboard;