import React from "react";
import { Container, Typography, Box, CardMedia } from "@mui/material";
import smallLogo from "../assets/fav.png"; // Path to your small logo image

const LandingPage = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Ensures full viewport height
        textAlign: "center", // Centers the text
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          borderRadius: "10px",
          backgroundColor: "white",
          border: "1px solid #ddd", // Light border for card effect
        }}
      >
        {/* Site Name */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Breakthrough Trading S.C. Employee Profile App
        </Typography>

        {/* Company Logo */}
        <CardMedia
          component="img"
          sx={{
            width: 120, // Adjust size of logo
            height: 120,
            objectFit: "contain",
            mb: 4, // Space between logo and copyright text
          }}
          image={smallLogo} // Logo image source
          alt="Company Logo"
        />

        {/* Copyright Information */}
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Breakthrough Trading S.C. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;
