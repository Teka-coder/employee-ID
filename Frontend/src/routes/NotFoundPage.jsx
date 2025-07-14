import React from "react";
import { Container, Typography, Box } from "@mui/material";

// You can import or create an animation, for example, a CSS-based 404 animation
import NotFoundAnimation from "../assets/404-notfound-animation.gif"; // Example GIF animation for 404 error

const NotFoundPage = () => {
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
        {/* Page Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
           Nothing Found
        </Typography>

        {/* 404 Animation or Image */}
        <img
          src={NotFoundAnimation} // Use your chosen 404 animation (GIF, SVG, or similar)
          alt="404 Not Found"
          style={{ width: 200, height: 200, objectFit: "contain", marginBottom: "20px" }}
        />

        {/* Additional Text */}
        <Typography variant="body2" color="textSecondary">
          Sorry, the employee ID card you are looking for does not exist.
        </Typography>
        
        {/* Optional link back to home or another page */}
        <Typography variant="body2" sx={{ marginTop: "20px" }}>
          <a href="/https://alphagenuine.com" style={{ textDecoration: "none", color: "#3f51b5" }}>
            Visit Our Website
          </a>
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
