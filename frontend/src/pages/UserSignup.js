import React, { useState } from 'react';
import { Label, TextInput, Button, Card } from 'flowbite-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // User ID validation
    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    } else if (formData.userId.length < 4) {
      newErrors.userId = 'User ID must be at least 4 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the signup data to your backend
      console.log('Form submitted:', {
        name: formData.name,
        userId: formData.userId
      });
      
      // Reset form or redirect user
      alert('Signup Successful!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Waste Management System
        </h2>
        <h3 className="mt-2 text-center text-xl text-gray-600">
          Create Your Account
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" value="Full Name" />
              <TextInput
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                color={errors.name ? 'failure' : 'default'}
                helperText={errors.name && <span className="text-red-600">{errors.name}</span>}
              />
            </div>

            <div>
              <Label htmlFor="userId" value="User ID" />
              <TextInput
                id="userId"
                name="userId"
                type="text"
                placeholder="Enter unique user ID"
                value={formData.userId}
                onChange={handleChange}
                color={errors.userId ? 'failure' : 'default'}
                helperText={errors.userId && <span className="text-red-600">{errors.userId}</span>}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                color={errors.password ? 'failure' : 'default'}
                helperText={errors.password && <span className="text-red-600">{errors.password}</span>}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" value="Confirm Password" />
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                color={errors.confirmPassword ? 'failure' : 'default'}
                helperText={errors.confirmPassword && <span className="text-red-600">{errors.confirmPassword}</span>}
              />
            </div>

            <div>
              <Button 
                type="submit" 
                color="success" 
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;