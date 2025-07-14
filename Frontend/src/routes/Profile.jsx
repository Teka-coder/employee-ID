import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import userIcon from "../assets/Icons/user.png";
import AuthedLanding from './AuthedLanding';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { getUserProfile } from "../services/profile";

const Profile = () => {
  const { Userid } = useParams(); // Assuming userId is passed as a URL parameter
  const [pageLoading, setPageLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log(`Fetching profile for UserID: ${Userid}`);
    getUserProfile(Userid)
      .then((profile) => {
        console.log('Profile fetched:', profile);
        setUserProfile(profile);
        setPageLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setError(error.message); // Capture and display the error
        setPageLoading(false);
      });
  }, [Userid]);

  if (pageLoading) {
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

  // Render error message if there's an error
  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container
        maxWidth="lg" // Adjust as per your layout needs
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack content vertically on mobile
          alignItems: "flex-start", // Align items to the top of the container
          justifyContent: "flex-start", // Align items to the start of the container
          paddingTop: "40px", // Adjust top padding as needed
        }}
      >
        {/* Left side content */}
        <Box
          style={{
            flex: "1", // Take up remaining space on the left
            marginRight: isMobile ? "0" : "40px", // Adjust margin between left and right content for mobile
            marginBottom: isMobile ? "20px" : "0", // Add bottom margin for separation on mobile
            textAlign: isMobile ? "center" : "left", // Align text center for mobile
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "16px", sm: "32px" },
              textAlign: isMobile ? "center" : "left", // Adjust text alignment for mobile
            }}
          >
            User Profile
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start", // Align items center for mobile
              mb: 4,
            }}
          >
            <img
              src={userIcon}
              alt="Profile Picture"
              style={{
                width: isMobile ? "80px" : "120px", // Adjust image size for mobile
                marginBottom: isMobile ? "10px" : "0",
              }}
            />
            <Typography variant="h6">{userProfile?.cfs_useremail}</Typography>
          </Box>
          {userProfile && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "center" : "flex-start", // Align text center for mobile
                mb: 4,
              }}
            >
              <Typography variant="h6">
                Email: {userProfile.cfs_useremail}
              </Typography>
              <Typography variant="h6">
                Full Name:{" "}
                {`${userProfile.cfs_firstname} ${
                  userProfile.middle_name
                    ? userProfile.middle_name + " "
                    : ""
                }${userProfile.cfs_lastname}`}
              </Typography>
              <Typography variant="h6">
                Phone: {userProfile.cfs_userphone}
              </Typography>
              <Typography variant="h6">
                Account:{" "}
                {userProfile.user_status === 1 ? "Active" : "Inactive"}
              </Typography>
              <Typography variant="h6">
                User type: {userProfile.cfs_user_type}
              </Typography>
              <Typography variant="h6">
                Link with MLM:{" "}
                {userProfile.mlm_verified === 1 ? (
                  "Verified"
                ) : (
                  <Link to="/verify-mlm">Verify</Link>
                )}
              </Typography>
              <Typography variant="h6">
                Verification attempt:{" "}
                {userProfile.link_attempt === 3
                  ? "Your trial limit reached"
                  : userProfile.link_attempt}
              </Typography>
              <Typography variant="h6">
                Status: {userProfile.online === 1 ? "Online" : "Offline"}
              </Typography>
              <Typography variant="h6">
                {userProfile.created_by !== "admin"
                  ? `Self initiated by ${userProfile.created_by}`
                  : "Admin created this account"}
              </Typography>
              <Typography variant="h6">
                Joined:{" "}
                {new Date(userProfile.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right side content */}
        <AuthedLanding />
        <Grid
          container
          spacing={2}
          style={{
            flex: "1", // Take up remaining space on the right
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Align items to the left
            marginTop: isMobile ? "20px" : "0", // Add top margin for separation on mobile
          }}
        >
          {/* Additional grid items for navigation or other content */}
        </Grid>
      </Container>
    </>
  );
};

export default Profile;
