import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput, Card, Alert } from 'flowbite-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    confirmPassword: ''
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
    if (formData.name.length < 2) {
      showMessage('failure', "Name must be at least 2 characters.");
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      showMessage('success', response.data.message);
      setFormData({ name: '', userId: '', password: '', confirmPassword: '' });
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
            <Label htmlFor="name" value="Full Name" />
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
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