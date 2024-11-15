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
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 bg-cover bg-center relative"
      style={{ backgroundImage: `url('/usersignup2.jpeg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div> {/* Dark overlay for background */}
      <Card className="w-full max-w-md bg-white bg-opacity-70 rounded-3xl shadow-xl p-10 relative z-10">
        <h2 className="text-2xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          Waste Management System
        </h2>
        <p className="text-center text-black-800 font-bold mb-6 text-lg">Login to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="userId" value="User ID" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
            <TextInput
              id="userId"
              name="userId"
              type="text"
              placeholder="Enter your user ID"
              required
              value={formData.userId}
              onChange={handleChange}
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <Label htmlFor="password" value="Password" className="text-lg text-black-800 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg" />
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          {message.content && (
            <Alert color={message.type === 'success' ? 'success' : 'failure'}>
              {message.content}
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full py-3 mt-4  rounded-full bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold hover:from-teal-500 hover:to-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
            disabled={isLoading}
            
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/user/signup" className="text-teal-500 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
}
