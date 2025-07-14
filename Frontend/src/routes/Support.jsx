import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
const Support = () => {
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);
  if (pageLoading === false) {
    return (
      <>
        <Header />
        <Container style={{ overflowX: "hidden" }}>
          <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
            Need Additional Support?
          </Typography>
          <div style={{ margin: "80px 0px", alignItems: "center" }}>
            <Grid container spacing={4} justify="center">
              <Grid item xs={12} md={6}>
                <div style={supportItemStyle}>
                  <LocationCityOutlinedIcon style={{ fontSize: "80px" }} />
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Typography variant="body2">
                    Shilim Tower 4th Floor
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={supportItemStyle}>
                  <PhoneAndroidOutlinedIcon style={{ fontSize: "80px" }} />
                  <Typography variant="h6" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body2">+251930020395</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={supportItemStyle}>
                  <EmailOutlinedIcon style={{ fontSize: "80px" }} />
                  <Typography variant="h6" gutterBottom>
                    E-Mail
                  </Typography>
                  <Typography variant="body2">info@alphagenuine.com</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={supportItemStyle}>
                  <LanguageOutlinedIcon style={{ fontSize: "80px" }} />
                  <Typography variant="h6" gutterBottom>
                    Website
                  </Typography>
                  <Typography variant="body2">www.alphagenuine.com</Typography>
                </div>
              </Grid>
            </Grid>
          </div>
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

const supportItemStyle = {
  border: "1px solid black ",
  display: "flex",
  padding: "30px 0",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export default Support;
