import React, { useState } from 'react';
import { Button, Label, Select, Textarea, Modal } from 'flowbite-react';
import axiosInstance from './axiosConfig';

function WasteRequestForm({ isOpen, onClose, onRequestCreated }) {
  const [formData, setFormData] = useState({
    wasteType: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axiosInstance.post('/api/waste-request/create', formData);
      if (response.data) {
        onRequestCreated(response.data);
        onClose();
        // Reset form
        setFormData({
          wasteType: '',
          description: '',
        });
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

  return (
    <Modal show={isOpen} onClose={onClose}>
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
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WasteRequestForm;