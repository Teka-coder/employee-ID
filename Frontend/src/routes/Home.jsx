import * as React from 'react';
//import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import logo from "../assets/fav.png";
import faqIcon from "../assets/Icons/faq.png";
import helpIcon from "../assets/Icons/helpdesk.png";
import notesIcon from "../assets/Icons/notes.png";
import searchIcon from "../assets/Icons/search.png";
import { userstatus } from "../services/userstatus";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Icon,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setPageLoading(false);
  //   }, 1000);
  // });
  React.useEffect(() => {
        setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    userstatus()
      .then((result) => {
        if (result.Logged) {
          setIsAuthenticated(true);
          setUserId(result.Userid); // the userstatus API returns the Userid comes from Login.jsx
        } else {
          setIsAuthenticated(false);
        }
      })
      // .catch((error) => {
      //   navigate("/");
      // });
  }, [navigate]);
  if (pageLoading === false) {
    return (
      <>
        <Header />
        <Container
          style={{
            display: "flex",
            paddingBottom: "80px",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            alt="Breakthrough Trading Logo"
            src={logo}
            mx={{ width: 40 }}
            sx={{ width: 120 }}
            mb={4}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "16px", sm: "32px" },
            }}
          >
            BTSC Emp. QR Generator
          </Typography>
          <Grid
            container
            spacing={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Grid item xs={6} md={5}>
              <Paper
                style={paperStyle}
                elevation={10}
                onClick={() => userId? navigate("/addemployee"):navigate('/login')}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "auto",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={notesIcon}
                    alt="add ticket icon"
                    style={buttonImgStyle}
                  />
                  <Typography variant="button">New Employee</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} md={5}>
              <Paper
                style={paperStyle}
                elevation={10}
                onClick={() => navigate('/viewyourprofile')}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "auto",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={searchIcon}
                    alt="add ticket icon"
                    style={buttonImgStyle}
                  />
                  <Typography variant="button">View Your Profile</Typography>
                </div>
              </Paper>
            </Grid>
    
        
          </Grid>
        </Container>
      </>
    );
  } else {
    return (
      <div
        style={{
          padding: 0,
          margin: 0,
          width: "100%",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "hidden",
        }}
      >
        <CircularProgress style={{ margin: "auto" }} color="warning" />
      </div>
    );
  }
};
const paperStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  height: "150px",
  cursor: "pointer",
};
const buttonImgStyle = {
  width: "60px",
  height: "auto",
  marginBottom: "10px",
};

export default Home;
