import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Modal, Label, Select, Textarea } from 'flowbite-react';
import { HiPlus, HiClock, HiUser, HiBell, HiOutlineArrowRight } from 'react-icons/hi';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/waste-request');
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
    setFormData({ wasteType: '', description: '' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/waste-request/create', formData);
      if (response.data) {
        setRequests(prevRequests => [response.data, ...prevRequests]);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(
        error.response?.data?.error || 
        error.message || 
        'An error occurred while submitting the request. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'warning',
      'Approved': 'success',
      'Completed': 'info'
    };
    return (
      <Badge color={colors[status]} size="sm">
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
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>Create Waste Collection Request</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="wasteType" value="Waste Type" />
              <Select
                id="wasteType"
                name="wasteType"
                required
                value={formData.wasteType}
                onChange={handleChange}
              >
                <option value="">Select waste type</option>
                <option value="Household">Household</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" value="Description (optional)" />
              <Textarea
                id="description"
                name="description"
                placeholder="Provide additional details about the waste"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {error && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50">
                {error}
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
          <Button color="gray" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard;