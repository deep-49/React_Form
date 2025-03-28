import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  Grid, 
  Typography, 
  Alert, 
  AlertTitle,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const User = () => {
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    profileImage: null
  });

  // State for validation and submission
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Users and Search State
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/users`, {
          params: {
            page: currentPage,
            limit: usersPerPage
          }
        });

        console.log(response)
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setSubmissionStatus('error');
      }
    };

    fetchUsers();
  }, [currentPage]);

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    // Validate image
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

  // Form Validation
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

    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmissionStatus(null);

    try {
      // Upload Image
      // const imageFormData = new FormData();
      // const fileInput = document.getElementById('profileImageUpload');
      // imageFormData.append('image', fileInput.files[0]);

      // const imageUploadResponse = await axios.post('https://dummyapi.com/upload', imageFormData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // const { imageUrl } = imageUploadResponse.data;
      
      // Submit User Details
      const userRegistrationResponse = await axios.post('https://dummyjson.com/users/add', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        //profileImage: imageUrl
      });

      const newUser = userRegistrationResponse.data;

      // Update users list
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
      document.getElementById('profileImageUpload').value = '';
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Image Upload Error:', error.response?.data);
      console.error('Error Details:', {
        status: error.response?.status,
        headers: error.response?.headers,
        data:error.response?.data
      });
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Search and Pagination Logic
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

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Registration Form */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Registration
          </Typography>
          <form onSubmit={handleSubmit}>
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
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.gender}>
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
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Profile Image
                  <VisuallyHiddenInput
                    id="profileImageUpload"
                    type="file"
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
                    sx={{ width: 100, height: 100, margin: '10px auto' }} 
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Register User'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {submissionStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <AlertTitle>Success</AlertTitle>
              User registered successfully
            </Alert>
          )}

          {submissionStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              Failed to register user
            </Alert>
          )}
        </Paper>
      </Grid>

      {/* User List */}
      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Registered Users
          </Typography>

          <TextField
            fullWidth
            label="Search Users"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar 
                        src={user.profileImage} 
                        alt="Profile" 
                        sx={{ width: 50, height: 50 }} 
                      />
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
              No users found
            </Typography>
          )}

          <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Typography variant="body2">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              sx={{ ml: 2 }}
            >
              Next
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default User;