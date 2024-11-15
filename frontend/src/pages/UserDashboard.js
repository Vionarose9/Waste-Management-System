// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });



// // Add request interceptor to add token to all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 422) {
//       localStorage.removeItem('token');
//       window.location.href = '/user/login';
//     }
//     return Promise.reject(error);
//   }
// );


// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [reqDate, setReqDate] = useState('');
//   const [wasteType, setWasteType] = useState('');
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [showProfile, setShowProfile] = useState(false);

//   useEffect(() => {
//     fetchRequests();
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Not authenticated');
//         return;
//       }

//       const response = await api.get('/api/auth/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setUserProfile(response.data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await api.post('/api/auth/logout', {}, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       localStorage.removeItem('token');
//       navigate('/user/signup');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Not authenticated');
//         return;
//       }

//       const response = await api.get('/api/waste/list', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setRequests(response.data);
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//       setError(error.response?.data?.error || 'Failed to fetch requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Not authenticated');
//         return;
//       }

//       await api.post('/api/waste/new', {
//         req_date: reqDate,
//         waste_type: wasteType,
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setReqDate('');
//       setWasteType('');
//       fetchRequests();
//     } catch (error) {
//       console.error('Error submitting request:', error);
//       setError(error.response?.data?.error || 'Failed to submit request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">User Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setShowProfile(!showProfile)}
//             className="text-gray-700 hover:text-gray-900"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//             </svg>
//           </button>
//           <button
//             onClick={handleLogout}
//             className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {showProfile && userProfile && (
//         <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Profile Information</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-600">Name</p>
//               <p className="font-medium">{`${userProfile.firstName} ${userProfile.lastName}`}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">User ID</p>
//               <p className="font-medium">{userProfile.userId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Phone</p>
//               <p className="font-medium">{userProfile.phoneNumber}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Address</p>
//               <p className="font-medium">{`${userProfile.street}, ${userProfile.city}`}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Landmark</p>
//               <p className="font-medium">{userProfile.landmark}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Centre ID</p>
//               <p className="font-medium">{userProfile.centreId}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="mb-6 space-y-4">
//         <div>
//           <label htmlFor="req_date" className="block text-sm font-medium text-gray-700 mb-1">
//             Request Date
//           </label>
//           <input
//             id="req_date"
//             type="date"
//             value={reqDate}
//             onChange={(e) => setReqDate(e.target.value)}
//             required
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//           />
//         </div>

//         <div>
//           <label htmlFor="waste_type" className="block text-sm font-medium text-gray-700 mb-1">
//             Waste Type
//           </label>
//           <select
//             id="waste_type"
//             value={wasteType}
//             onChange={(e) => setWasteType(e.target.value)}
//             required
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//           >
//             <option value="">Select waste type</option>
//             <option value="Household">Household</option>
//             <option value="Recyclable">Recyclable</option>
//             <option value="Organic">Organic</option>
//             <option value="Hazardous">Hazardous</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
//         >
//           {loading ? 'Submitting...' : 'Submit Request'}
//         </button>
//       </form>

//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
//           {error}
//         </div>
//       )}

//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-4">Your Requests</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//             <table className="w-full text-sm text-left text-gray-500">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">REQUEST ID</th>
//                   <th scope="col" className="px-6 py-3">DATE</th>
//                   <th scope="col" className="px-6 py-3">TYPE</th>
//                   <th scope="col" className="px-6 py-3">REQUEST STATUS</th>
//                   <th scope="col" className="px-6 py-3">COLLECTION STATUS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests.map((request) => (
//                   <tr key={request.req_id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="px-6 py-4">{request.req_id}</td>
//                     <td className="px-6 py-4">
//                       {new Date(request.req_date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4">{request.waste_type}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                           request.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                             'bg-red-100 text-red-800'
//                         }`}>
//                         {request.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {requests.length === 0 && (
//                   <tr className="bg-white border-b">
//                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                       No requests found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Badge, Alert, Spinner, Modal, Label, TextInput } from 'flowbite-react';
import { HiPencil } from 'react-icons/hi';
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422) {
      localStorage.removeItem('token');
      window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [reqDate, setReqDate] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [collectionQuantity, setCollectionQuantity] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [showEditOptions, setShowEditOptions] = useState(false);
  useEffect(() => {
    fetchRequests();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      navigate('/user/signup');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/waste/list');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/waste/new', {
        req_date: reqDate,
        waste_type: wasteType,
      });
      setReqDate('');
      setWasteType('');
      fetchRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      setError(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCollected = async () => {
    try {
      await api.post('/api/waste/mark-collected', {
        req_id: selectedRequest.req_id,
        collection_quantity: parseFloat(collectionQuantity),
      });
      setShowCollectionModal(false);
      fetchRequests();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to mark as collected');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/api/auth/profile', updatedProfile);
      setShowUpdateModal(false);
      fetchUserProfile();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };



  const handleDeleteRequest = async (reqId) => {
    try {
      await api.delete(`/api/waste/delete/${reqId}`);
      fetchRequests();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Waste Management Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your waste collection requests</p>
            </div>
            
            <div className="relative">
                  <button
                    onClick={() => setShowEditOptions(!showEditOptions)}
                    className="text-gray-700 hover:text-gray-900 ml-70"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  {showEditOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                      <button
                        onClick={() => {
                          setShowUpdateModal(true);
                          setShowEditOptions(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Update Profile
                      </button>
                  
                    </div>
                  )}
                </div>
            <div className="flex items-center gap-4">
              <Button color="light" onClick={() => setShowProfile(!showProfile)}>
                Profile
              </Button>
              <Button color="black" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        

        {/* Profile Card */}
        {showProfile && userProfile && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base text-gray-900">{`${userProfile.firstName} ${userProfile.lastName}`}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-base text-gray-900">{userProfile.userId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base text-gray-900">{userProfile.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base text-gray-900">{`${userProfile.street}, ${userProfile.city}`}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Landmark</p>
                <p className="text-base text-gray-900">{userProfile.landmark}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Centre ID</p>
                <p className="text-base text-gray-900">{userProfile.centreId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">New Waste Collection Request</h2>
            <p className="text-blue-100 text-sm mt-1">Submit a new request for waste collection</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="req_date">Request Date</Label>
                  <TextInput
                    id="req_date"
                    type="date"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waste_type">Waste Type</Label>
                  <select
                    id="waste_type"
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select waste type</option>
                    <option value="Household">Household</option>
                    <option value="Recyclable">Recyclable</option>
                    <option value="Organic">Organic</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} color="blue">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <Alert color="failure" className="mb-8">
            {error}
          </Alert>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Requests</h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="xl" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">REQUEST ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">DATE</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">TYPE</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">STATUS</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">ACTION</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">DELETE</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.req_id}
                      className="border-b hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{request.req_id}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(request.req_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{request.waste_type}</td>
                      <td className="px-4 py-3">
                        <Badge
                          color={
                            request.status === 'Pending'
                              ? 'warning'
                              : request.status === 'Assigned'
                              ? 'info'
                              : 'success'
                          }
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {request.status === 'Assigned' && (
                          <Button
                            color="black"
                            size="xs"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCollectionModal(true);
                            }}
                          >
                            Mark as Collected
                          </Button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteRequest(request.req_id)}
                          className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                        No requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal show={showCollectionModal} onClose={() => setShowCollectionModal(false)}>
        <Modal.Header>Mark as Collected</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p>Please enter the collection quantity for request ID: {selectedRequest?.req_id}</p>
            <div>
              <Label htmlFor="collection_quantity">Collection Quantity (kg)</Label>
              <TextInput
                id="collection_quantity"
                type="number"
                step="0.01"
                value={collectionQuantity}
                onChange={(e) => setCollectionQuantity(e.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" onClick={handleMarkCollected}>
            Confirm
          </Button>
          <Button color="gray" onClick={() => setShowCollectionModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Update Profile
                </h3>
                <div className="mt-2">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={updatedProfile.firstName || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, firstName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={updatedProfile.lastName || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, lastName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        value={updatedProfile.phoneNumber || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, phoneNumber: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                      <input
                        type="text"
                        id="street"
                        value={updatedProfile.street || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, street: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        id="city"
                        value={updatedProfile.city || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, city: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                      <input
                        type="text"
                        id="landmark"
                        value={updatedProfile.landmark || ''}
                        onChange={(e) => setUpdatedProfile({...updatedProfile, landmark: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}