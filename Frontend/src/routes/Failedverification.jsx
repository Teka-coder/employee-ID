import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import logo from "../assets/fav.png";
import faqIcon from "../assets/Icons/faq.png";
import helpIcon from "../assets/Icons/helpdesk.png";
import notesIcon from "../assets/Icons/notes.png";
import searchIcon from "../assets/Icons/search.png";
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

const Failed = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  });
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
           Verification failed
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
                onClick={() => navigate("/newticket")}
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
                  <Typography variant="button">New Ticket</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} md={5}>
              <Paper
                style={paperStyle}
                elevation={10}
                onClick={() => navigate("/track")}
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
                  <Typography variant="button">Track Your Ticket</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} md={5}>
              <Paper
                style={paperStyle}
                elevation={10}
                onClick={() => navigate("/support")}
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
                    src={helpIcon}
                    alt="add ticket icon"
                    style={buttonImgStyle}
                  />
                  <Typography variant="button">Additional Support</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} md={5}>
              <Paper
                style={paperStyle}
                elevation={10}
                onClick={() => navigate("/faq")}
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
                    src={faqIcon}
                    alt="add ticket icon"
                    style={buttonImgStyle}
                  />
                  <Typography variant="button">FAQ</Typography>
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

export default Failed;
