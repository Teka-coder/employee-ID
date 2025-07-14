import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Box, CircularProgress, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Swal from 'sweetalert2';  // Import SweetAlert2
import { addEmployee } from '../services/addemployee'; // Import the service function
import { userlogout } from '../services/userlogout';  // Import logout service
import { useNavigate } from 'react-router-dom';  // For redirecting after logout
import MenuIcon from '@mui/icons-material/Menu';  // Menu icon for the sidebar

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    emp_fullname: '',
    emp_position: '',
  
  });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);  // State to control sidebar open/close
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
   
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    
  };

  // Validate that all fields are filled
  const validateForm = () => {
    const { emp_fullname, staff_uniqueid } = formData;

    if (!emp_fullname || !staff_uniqueid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all required fields!',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    // Call the addEmployee service function
    const response = await addEmployee(form);

    if (response.success) {
      setFormData({  // Clear the form after successful submission
        emp_fullname: '',
        staff_uniqueid: '',
      });

      Swal.fire({
        icon: 'success',
        title: 'Employee Added!',
        text: response.message,
        confirmButtonColor: '#3f51b5', // Button color
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: response.message,
        confirmButtonColor: '#f44336', // Button color
      });
    }

    setLoading(false); // Stop loading
  };

  // Handle logout
  const handleLogout = async () => {
    const response = await userlogout();
    if (response.success) {
      // Redirect to login page after successful logout
      navigate('/login');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: response.message, // Show the message from the logout service
      });
    }
  };

  // Toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigate to different pages
  const handleNavigation = (page) => {
    setSidebarOpen(false); // Close sidebar after navigation
    if (page === 'viewList') {
      navigate('/view-list'); // Replace with your route for viewing the list
    } else if (page === 'trackEmployee') {
      navigate('/track-employee'); // Replace with your route for tracking employees
    }
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', padding: 2 }}>
      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavigation('viewList')}>
            <ListItemText primary="View List" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('trackEmployee')}>
            <ListItemText primary="Track Employee" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, paddingLeft: sidebarOpen ? 250 : 0 }}>
        {/* Menu Button to toggle sidebar */}
        <IconButton onClick={toggleSidebar} sx={{ marginTop: 2, color: '#3f51b5' }}>
          <MenuIcon />
        </IconButton>

        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ color: '#3f51b5', marginBottom: 4 }}>
            New Employee
          </Typography>

          {/* Form Container */}
          <Box sx={{ width: '100%', maxWidth: 600, padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="emp_fullname"
                    value={formData.emp_fullname}
                    onChange={handleChange}
                    required
                    sx={{ '& .MuiInputBase-root': { borderRadius: 4, backgroundColor: '#f5f5f5' } }}
                  />
                </Grid>

            

              

                <Grid item xs={12}>
                  <TextField
                    label="Employee Unique ID"
                    variant="outlined"
                    fullWidth
                    name="staff_uniqueid"
                    value={formData.staff_uniqueid}
                    onChange={handleChange}
                    required
                    sx={{ '& .MuiInputBase-root': { borderRadius: 4, backgroundColor: '#f5f5f5' } }}
                  />
                </Grid>

             


              

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#3f51b5', color: '#fff', '&:hover': { backgroundColor: '#303f9f' } }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add Employee'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AddEmployee;
