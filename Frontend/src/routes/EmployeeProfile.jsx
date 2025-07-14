import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardMedia, CircularProgress, IconButton } from '@mui/material';
import { viewYourProfile } from '../services/viewyourprofile';
import { url } from '../services/url';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/gbglogo.png';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const { employeeid } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      setLoading(true);
      const response = await viewYourProfile(employeeid);
      if (response.success) {
        setEmployee(response.employee);
      } else {
        navigate('/notfound');
        setMessage(response.message);
      }
      setLoading(false);
    };

    fetchEmployeeProfile();
  }, [employeeid]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!employee) {
    return <Typography variant="h6" color="error">{message}</Typography>;
  }

  const { emp_fullname, emp_picture, qr_picture } = employee;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, position: 'relative' }}>
      {/* Header text for the company name */}
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
      Breakthrough Trading S.C.
      </Typography>

      {/* Close button */}
      <IconButton
        onClick={() => navigate('/')} // navigate(-1) goes back to the previous page
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Container for Employee's Picture (Front Image) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 3, // Space before the next image
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: '100%', // Make the image take up full width of the card face
            height: 300, // Set a height for visibility
            objectFit: 'contain',
            borderRadius: 2,
            marginBottom: 2, // Space between the front and back images
          }}
          image={`${url}static/employee/${emp_picture}`}
          alt={`${emp_fullname}'s picture`}
        />
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'contain',
            borderRadius: 2,
          }}
          image={`${url}static/employeeqrpic/${qr_picture}`}
          alt="QR Code"
        />
      </Box>

      {/* Company logo below the cards */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 2,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: 120,
            height: 120,
            objectFit: 'contain',
          }}
          image={logo} // Use the logo from assets
          alt="Company Logo"
        />
      </Box>
    </Container>
  );
};

export default EmployeeProfile;
