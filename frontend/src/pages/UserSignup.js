import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput, Card, Alert, Select } from 'flowbite-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    city: '',
    street: '',
    landmark: '',
    password: '',
    confirmPassword: '',
    centreId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000); // Clear message after 5 seconds
  };

  const validateForm = () => {
    if (formData.firstName.length < 2) {
      showMessage('failure', "First name must be at least 2 characters.");
      return false;
    }
    if (formData.lastName.length < 2) {
      showMessage('failure', "Last name must be at least 2 characters.");
      return false;
    }
    if (formData.userId.length < 4) {
      showMessage('failure', "User ID must be at least 4 characters.");
      return false;
    }
    if (formData.password.length < 6) {
      showMessage('failure', "Password must be at least 6 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showMessage('failure', "Passwords don't match");
      return false;
    }
    if (!formData.centreId) {
      showMessage('failure', "Please select a Centre ID");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      showMessage('success', response.data.message);
      setFormData({
        firstName: '',
        lastName: '',
        userId: '',
        city: '',
        street: '',
        landmark: '',
        password: '',
        confirmPassword: '',
        centreId: ''
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showMessage('failure', error.response.data.error);
      } else {
        showMessage('failure', "An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Waste Management System</h2>
        <p className="text-center text-gray-600 mb-6">Create your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="firstName" value="First Name" />
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="userId" value="User ID" />
            <TextInput
              id="userId"
              name="userId"
              type="text"
              placeholder="johndoe123"
              required
              value={formData.userId}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="city" value="City" />
            <TextInput
              id="city"
              name="city"
              type="text"
              placeholder="Your City"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="street" value="Street" />
            <TextInput
              id="street"
              name="street"
              type="text"
              placeholder="Your Street"
              required
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="landmark" value="Landmark" />
            <TextInput
              id="landmark"
              name="landmark"
              type="text"
              placeholder="Nearby Landmark"
              required
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" value="Confirm Password" />
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="centreId" value="Centre ID" />
            <Select
              id="centreId"
              name="centreId"
              required
              value={formData.centreId}
              onChange={handleChange}
            >
              <option value="">Select a Centre ID</option>
              <option value="1">1 - Banashankari</option>
              <option value="2">2 - Majestic</option>
              <option value="3">3 - Electronic City</option>
              <option value="4">4 - Koramangala</option>
            </Select>
          </div>
          {message.content && (
            <Alert color={message.type === 'success' ? 'success' : 'failure'}>
              {message.content}
            </Alert>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </Card>
    </div>
  );
}