import { Alert, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { trackEmployeeProfile } from "../services/trackemployeeprofile"; // API call service

const TrackEmployee = () => {
  const [employeeId, setEmployeeId] = useState(""); // This will hold the employee unique ID (ticket ID)
  const [error, setError] = useState(false); // Flag to show error message
  const [pageLoading, setPageLoading] = useState(true); // For loading state
  const navigate = useNavigate(); // Navigate to another page on success

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError(false); // Reset error state
    trackEmployeeProfile(employeeId)
    .then((result) => {
      if (result) {
        setError(false);
        navigate(`/employee/${employeeId}`)
      } else {
        setError(true);
      }
    })
    .catch((error) => setError(true));




    // Make an API call to fetch employee profile
    // const response = await trackEmployeeProfile(employeeId);

    // if (response.success) {
    //   // Redirect to the employee profile page
    //   navigate(`/employee/${employeeId}`);
    // } else {
    //   // If no employee is found, show an error message
    //   setError(true);
    // }
  };

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false); // Stop the loading state after 1 second (you can adjust this time)
    }, 1000);
  }, []);

  if (pageLoading === false) {
    return (
      <>
        <Header />
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "80px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Employee ID
          </Typography>
          <form onSubmit={onSubmitHandler}>
            <TextField
              label="Your Employee ID"
              variant="outlined"
              fullWidth
              style={{ marginBottom: 20, marginTop: 30 }}
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Button variant="contained" style={{ backgroundColor: '#f8931e' }} type="submit">
              Submit
            </Button>
          </form>

          {error && (
            <Alert severity="error" style={{ marginTop: 20 }}>
              Sorry, we couldn't find your profile!
            </Alert>
          )}
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

export default TrackEmployee;
