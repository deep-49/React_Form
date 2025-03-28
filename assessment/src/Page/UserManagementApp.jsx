import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Grid,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  Paper
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const UserManagementApp = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const usersPerPage = 5;

  // Fetching users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/users`, {
          params: {
            page: currentPage,
            limit: usersPerPage
          }
        });

        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setSubmissionStatus('error');
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image must be less than 2MB' }));
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, profileImage: 'Only JPG and PNG images are allowed' }));
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }));
      delete errors.profileImage;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.firstName.length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters';
    }

    if (formData.lastName.length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^\+\d{1,3}-\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must include country code (+XX-XXXXXXXXXX)';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // if (!formData.profileImage) {
    //   newErrors.profileImage = 'Profile image is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSubmissionStatus(null);

    try {
      // Image Upload
      let imageUrl = null;
      const fileInput = document.getElementById('profileImageUpload');

      if (fileInput && fileInput.files.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', fileInput.files[0]);

        try {
          const imageUploadResponse = await axios.post('https://dummyapi.com/upload', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          imageUrl = imageUploadResponse.data.imageUrl;
        } catch (imageUploadError) {
          console.error('Image Upload Error:', imageUploadError.response?.data);


          console.warn('Continuing registration without profile image');
        }
      }

      // User Registration
      const userRegistrationResponse = await axios.post('https://dummyjson.com/users/add', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        profileImage: imageUrl || formData.profileImage
      });

      const newUser = userRegistrationResponse.data;

      
      setUsers(prev => [newUser, ...prev]);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        phone: '',
        profileImage: null
      });

      setSubmissionStatus('success');
      setIsRegistrationModalOpen(false);
    } catch (error) {
      console.error('Registration failed:', error);

      
      if (error.response) {
        
        console.error('Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        
        console.error('No response received:', error.request);
      } else {
        
        console.error('Error setup:', error.message);
      }

      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtering and Pagination Logic
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    if (submissionStatus) {
      const timer = setTimeout(() => {
        setSubmissionStatus(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 ">
      <div className="w-full mx-auto bg-white shadow-2xl  overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-300 to-purple-200 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold  text-black tracking-wide">User Management</h1>
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="bg-white text-blue-700 px-6 py-2 rounded-full hover:bg-blue-100 transition-all font-semibold shadow-md"
          >
            + New Registration
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 pl-10 border-2 border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>

        {submissionStatus === 'success' && (
          <Alert severity="success" sx={{ m: 2 }}>
            <AlertTitle>Success</AlertTitle>
            User registered successfully
          </Alert>
        )}



        {/* User Table */}
        <div className="p-6">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                <tr>
                  {['Profile', 'Name', 'Gender', 'Email', 'Phone'].map((header) => (
                    <th key={header} className="px-4 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <tr key={`user-${user.id || user.email}`} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={user.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{user.gender}</td>
                    <td className="px-4 py-3 text-blue-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-700">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50">
                No users found
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center p-6 space-x-4 bg-gray-50">
          <button
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-all"
          >
            Previous
          </button>
          <span className="text-blue-800 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-all"
          >
            Next
          </button>

        </div>

        {/* Registration Modal */}
        {isRegistrationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl">
              <Paper
                elevation={10}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div className="bg-blue-300  text-black font-bold p-6 flex justify-between items-center">
                  <Typography variant="h6" className="font-bold">User Registration</Typography>
                  <button
                    onClick={() => setIsRegistrationModalOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.gender} variant="outlined">
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          label="Gender"
                          onChange={handleInputChange}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91-XXXXXXXXXX"
                        error={!!errors.phone}
                        helperText={errors.phone}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        color="secondary"
                        sx={{
                          backgroundColor: '#6366F1',
                          '&:hover': { backgroundColor: '#4F46E5' }
                        }}
                      >
                        Upload Profile Image
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png"
                          onChange={handleImageUpload}
                        />
                      </Button>
                      {errors.profileImage && (
                        <Typography color="error" variant="caption">
                          {errors.profileImage}
                        </Typography>
                      )}
                      {formData.profileImage && (
                        <Avatar
                          src={formData.profileImage}
                          sx={{
                            width: 100,
                            height: 100,
                            margin: '10px auto',
                            border: '3px solid #6366F1'
                          }}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{
                          backgroundColor: '#10B981',
                          '&:hover': { backgroundColor: '#059669' },
                          '&:disabled': { backgroundColor: '#6EE7B7' }
                        }}
                      >
                        {isLoading ? <CircularProgress size={24} /> : 'Register User'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                {submissionStatus === 'success' && (
                  <Alert severity="success" sx={{ m: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    User registered successfully
                  </Alert>
                )}

                {submissionStatus === 'error' && (
                  <Alert severity="error" sx={{ m: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    Failed to register user
                  </Alert>
                )}
              </Paper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementApp;