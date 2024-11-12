import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('home.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 py-16">
        {/* Header section */}
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-1 w-12 bg-blue-500"></div>
            <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm">Welcome to</span>
            <div className="h-1 w-12 bg-blue-500"></div>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="block mb-2">Municipal Waste</span>
            <span className="block text-blue-400">Management System</span>
          </h1>
          
          <p className="text-lg font-normal text-gray-200 lg:text-xl max-w-3xl mx-auto">
            Transforming our community through efficient and sustainable waste management solutions
          </p>
        </div>

        {/* Get Started Button */}
        <Link 
          to="/user/signup" 
          className="group inline-flex justify-center items-center py-4 px-8 text-lg font-medium text-center text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg shadow-blue-500/25 mb-12"
        >
          Get Started
          <svg 
            aria-hidden="true" 
            className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </Link>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-3">🌱</div>
            <h3 className="text-white font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-300 text-sm">Sustainable practices for a cleaner environment</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-3">⚡</div>
            <h3 className="text-white font-semibold mb-2">Efficient Service</h3>
            <p className="text-gray-300 text-sm">Quick and reliable waste collection system</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-blue-400 text-2xl mb-3">🤝</div>
            <h3 className="text-white font-semibold mb-2">Community Focused</h3>
            <p className="text-gray-300 text-sm">Working together for a cleaner future</p>
          </div>
        </div>
        
        {/* User Login section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Already have an account?</h2>
          <p className="text-gray-300 mb-4">Log in to access your waste management dashboard and services.</p>
          <Link 
            to="/user/login" 
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            User Login
          </Link>
        </div>

        {/* Footer section with Admin Portal */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-4">
            Join us in building a cleaner, more sustainable future for our community
          </p>
          <Link 
            to="/admin/login" 
            className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}