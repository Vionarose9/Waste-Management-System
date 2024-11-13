import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Label, TextInput, Card, Alert, Select } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    phoneNumber: '',
    city: '',
    street: '',
    landmark: '',
    password: '',
    confirmPassword: '',
    centreId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [currentImage, setCurrentImage] = useState(0);

  const backgroundImages = [
    '/usersignup.png',
    '/usersignup2.jpeg',
    '/usersignup3.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
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
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      showMessage('failure', "Phone number must be 10 digits.");
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
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      showMessage('success', response.data.message);
      setFormData({
        firstName: '',
        lastName: '',
        userId: '',
        phoneNumber: '',
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center pt-16" // Added padding at the top
      style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
    >
      <Card className="w-full max-w-2xl relative z-10 bg-white bg-opacity-70 shadow-2xl rounded-lg p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-center">
            <h2 className="text-2xl font-extrabold mb-2 text-blue-800 uppercase tracking-wide text-shadow-lg">
              Waste Management System
            </h2>
            <p className="text-lg font-bold text-black-800 mb-6 text-shadow-md">
              Create your account
            </p>
          </div>
          <div>
            <Label htmlFor="firstName" value="First Name"
            className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
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
            <Label htmlFor="lastName" value="Last Name" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"/>
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
            <Label htmlFor="userId" value="User ID" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
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
            <Label htmlFor="phoneNumber" value="Phone Number" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
            <TextInput
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="1234567890"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="city" value="City"  className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"/>
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
            <Label htmlFor="street" value="Street" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
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
            <Label htmlFor="landmark" value="Landmark" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
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
            <Label htmlFor="centreId" value="Centre ID"  className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"/>
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
          <div>
            <Label htmlFor="password" value="Password"  className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"/>
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
            <Label htmlFor="confirmPassword" value="Confirm Password" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            {message.content && (
              <Alert color={message.type === 'success' ? 'success' : 'failure'}>
                {message.content}
              </Alert>
            )}
          </div>
          <div className="col-span-2 space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-800" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
            <Button
              onClick={() => navigate('/user/login')}
              type="button"
              className="w-full bg-gradient-to-r from-green-400 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              Already have an account? Log in
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
