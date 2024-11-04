import React, { useState } from 'react';
import { Label, TextInput, Button, Card } from 'flowbite-react';
import axios from 'axios';

const Login = () => {
  const [loginData, setLoginData] = useState({
    userId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!loginData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/login', loginData);
        
        if (response.data.success) {
          // Store the token or user data in localStorage/context
          localStorage.setItem('userId', response.data.userId);
          
          // Show success message
          alert('Login Successful!');
          
          // Redirect to dashboard (implement your routing logic here)
          // history.push('/dashboard');
        }
      } catch (error) {
        setErrors({
          login: error.response?.data?.message || 'An error occurred during login'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Waste Management System
        </h2>
        <h3 className="mt-2 text-center text-xl text-gray-600">
          Login to Your Account
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.login && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {errors.login}
              </div>
            )}

            <div>
              <Label htmlFor="userId" value="User ID" />
              <TextInput
                id="userId"
                name="userId"
                type="text"
                placeholder="Enter your User ID"
                value={loginData.userId}
                onChange={handleChange}
                color={errors.userId ? 'failure' : 'default'}
                helperText={errors.userId && <span className="text-red-600">{errors.userId}</span>}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleChange}
                color={errors.password ? 'failure' : 'default'}
                helperText={errors.password && <span className="text-red-600">{errors.password}</span>}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                color="success" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Sign Up
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;