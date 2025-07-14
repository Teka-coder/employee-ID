import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import smallLogo from "../assets/fav.png"; // Path to your small logo image
import { useState } from "react";
import { authenticate } from "../services/authenticate";
import { userstatus } from "../services/userstatus";
import { useNavigate } from "react-router-dom";
import { link } from "../services/url";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    authenticate(userName, userPassword)
      .then((result) => {
        if (result) {
          userstatus().then((result) => {
            if (result.role === "editor") {
              if (result.acc_status === 'active') {
                navigate("/addemployee");
              } else if (result.acc_status !== 'active') {
                navigate("/failedlogin");
              } else {
                navigate("/failedlogin");
              }
            } else {
              navigate(`/failedlogin`);
            }
          });
        }
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Adjusted to ensure full viewport height
        }}
      >
        {/* Centered container for login */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            borderRadius: "10px",
            backgroundColor: "white", // Replace with your desired background color
            border: "1px solid #000",
            maxWidth: "400px", // Adjusted for better responsiveness
          }}
        >
          <img
            src={smallLogo}
            alt="Small Logo"
            style={{ width: "80px", marginBottom: "20px" }}
          />
          <Typography variant="h6" style={{ color: "black" }}>
            QR generator | Login
          </Typography>
          <form onSubmit={onSubmitHandler}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={userName}
              onChange={(event) => {
                setUserName(event.target.value);
              }}
              type="text"
              required
              style={{
                marginBottom: "20px",
                backgroundColor: "white",
              }} // Adjust styles as needed
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={userPassword}
              onChange={(event) => {
                setUserPassword(event.target.value);
              }}
              required
              style={{
                marginBottom: "20px",
                backgroundColor: "white",
              }} // Adjust styles as needed
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginBottom: "10px" }}
            >
              Login
            </Button>
            {error && (
              <Alert severity="error">Incorrect credentials or inactive account</Alert>
            )}
            <Button
              href={`${link}`}
              variant="contained"
              color="warning"
              fullWidth
            >
              Go to Home
            </Button>
          </form>
        </Container>
      </Container>
    </>
  );
};

export default Login;
