import React, { useState } from 'react';
import { Button, Label, TextInput, Select, Textarea, Modal } from 'flowbite-react';
import axios from 'axios';

function WasteRequestForm({ isOpen, onClose, onRequestCreated }) {
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
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
      const response = await axios.post('http://localhost:5000/api/waste-request/create', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      onRequestCreated(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while submitting the request');
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
            <Label htmlFor="quantity" value="Quantity (in kg)" />
            <TextInput
              id="quantity"
              name="quantity"
              type="number"
              placeholder="Enter quantity in kg"
              required
              value={formData.quantity}
              onChange={handleChange}
            />
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
          {error && <p className="text-red-500">{error}</p>}
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