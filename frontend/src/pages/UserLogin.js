import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput, Card, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
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
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const validateForm = () => {
    if (formData.userId.length < 4) {
      showMessage('failure', "User ID must be at least 4 characters.");
      return false;
    }
    if (formData.password.length < 6) {
      showMessage('failure', "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      showMessage('success', response.data.message);
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard or home page after successful login
      navigate('/user/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showMessage('failure', error.response.data.error);
      } else {
        showMessage('failure', "An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Waste Management System</h2>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="userId" value="User ID" />
            <TextInput
              id="userId"
              name="userId"
              type="text"
              placeholder="Enter your user ID"
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
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {message.content && (
            <Alert color={message.type === 'success' ? 'success' : 'failure'}>
              {message.content}
            </Alert>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
}