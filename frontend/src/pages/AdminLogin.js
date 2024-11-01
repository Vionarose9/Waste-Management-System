import React, { useState } from 'react';
import { Label, TextInput, Button, Card } from 'flowbite-react';
import { ShieldCheckIcon } from 'lucide-react';

const AdminLogin = () => {
  const [adminLoginData, setAdminLoginData] = useState({
    adminId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Admin ID validation
    if (!adminLoginData.adminId.trim()) {
      newErrors.adminId = 'Admin ID is required';
    }

    // Password validation
    if (!adminLoginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send login credentials to your backend
      console.log('Admin Login attempt:', {
        adminId: adminLoginData.adminId
      });
      
      // Simulated admin login logic (replace with actual authentication)
      try {
        // Placeholder for actual admin authentication
        // In a real app, this would be a secure API call
        if (adminLoginData.adminId === 'admin' && adminLoginData.password === 'admin123') {
          alert('Admin Login Successful!');
          // Typically, you'd redirect to admin dashboard
        } else {
          setErrors({
            login: 'Invalid Admin ID or Password'
          });
        }
      } catch (error) {
        setErrors({
          login: 'An error occurred during admin login'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Admin Access
        </h2>
        <h3 className="mt-2 text-center text-xl text-gray-600">
          Waste Management System
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-2xl border-2 border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.login && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {errors.login}
              </div>
            )}

            <div>
              <Label htmlFor="adminId" value="Admin ID" />
              <TextInput
                id="adminId"
                name="adminId"
                type="text"
                placeholder="Enter Admin ID"
                value={adminLoginData.adminId}
                onChange={handleChange}
                color={errors.adminId ? 'failure' : 'default'}
                helperText={errors.adminId && <span className="text-red-600">{errors.adminId}</span>}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={adminLoginData.password}
                onChange={handleChange}
                color={errors.password ? 'failure' : 'default'}
                helperText={errors.password && <span className="text-red-600">{errors.password}</span>}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-admin"
                  name="remember-admin"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-admin" className="ml-2 block text-sm text-gray-900">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Reset Password
                </a>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                color="success" 
                className="w-full"
              >
                Admin Login
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Authorized Access Only - Unauthorized Access Prohibited
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;