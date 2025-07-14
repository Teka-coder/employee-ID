import {
    Alert,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Snackbar
  } from "@mui/material";
  import CssBaseline from "@mui/material/CssBaseline";
  import logo from "../assets/otherpng.png";
  import smallLogo from "../assets/fav.png"; // Path to your small logo image
  import { useState } from "react";
  import { register } from "../services/register";
  import { useNavigate } from "react-router-dom";
  import inputChecker from "../utils/inputChecker";


  const Register = () => {

    const [userEmail, setUserEmail] = useState("");
    const [emailError, setemailError] = useState(false);
    const [userFirstName, setUserFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState(false);
    const [userLastName, setUserLastName] = useState("");
    const [lastNameError, setlastNameError] = useState(false);
    const [userPassword, setUserPassword] = useState("");
   // const [disabledButton, setDisabledButton] = useState(false);
    const [error, setError] = useState(false);
    const [userPhone, setPhone] = useState("");
    const [phoneError, setphoneError] = useState(false);
    const [recentuser, setRecentUser] = useState(-1);
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    let hasErrors = false;
    const navigate = useNavigate();
    const RedirectUser = () => {
     // navigator.clipboard.writeText(recentuser);
      setSnackBarStatus(true);
      setTimeout(() => {
        navigate(`/profile/${recentuser}`);
      }, 3000);
    };


    const onSubmitHandler = (event) => {
      event.preventDefault();
      const checkInputAndSetError = (type, input, setError) => {
        if (inputChecker(type, input)) {
          setError(false);
        } else {
          setError(true);
          hasErrors = true;
        }
      };
      

      checkInputAndSetError("text", userFirstName, setFirstNameError);
      checkInputAndSetError("text", userLastName, setlastNameError);
      checkInputAndSetError("email", userEmail, setemailError);
      checkInputAndSetError("phone", userPhone, setphoneError);
      // event.preventDefault();
      // register(userEmail, userPassword,userFirstName,userLastName,userPhone)
      //   .then((result) => {
      //     if (result && result.userId) {
      //       navigate(`/profile/${result.userId}`);
      //     }
      //   })
      //   .catch((error) => {
      //     setError(true);
      //   });
      if (!hasErrors) {
        const data = {
          userFirstName: userFirstName,
          userLastName: userLastName,
          userEmail: userEmail,
          userPassword: userPassword,
          userPhone: userPhone,
        
        };
  
        register("register", data)
          .then(async (result) => {
            console.log(result)  //return false if nothing sent
            if (result) {
             // navigate(`/profile/${result.userid}`);
             setRecentUser(result);
              setShowAlert(true);
             // setDisabledButton(true);
              // const fileInput = document.getElementById('file')
              // const file = fileInput.files[0]
              // const uploadResult = await attachImages(file, result)
              // if(uploadResult === false){
              //   alert('Ticket Submitted, but Image Not Uploaded. You can include that in the chat')
              // }
            } else {
              alert("No result. Failed to register, Please Try again.");
            }
          })
          // .catch((error) =>{
          //   alert("Failed to register, Please Try again.")
          // }
          // );
      }
    };
  
    return (
      <>
        <CssBaseline />
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: "100vh", // Adjusted to ensure full viewport height
          }}
        >
            {showAlert && (
              <Alert severity="success" style={{ marginTop: 20 }}>
                You are Registerd successfully {" "}
                <span
                  onClick={RedirectUser}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "3px",
                  }}
                >
                  {recentuser}
                </span>{" "}
                and confirmation is sent to your email address.
              </Alert>
            )}
        <Snackbar
          open={snackBarStatus}
          autoHideDuration={3000}
          message="redirecting you to your profile page."
        />

          {/* Left column: Image container */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <img src={logo} alt="Logo" style={{ maxWidth: "80%", height: "auto" }} />
          </Grid>
          {/* Right column: Registration form */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px 10px 10px 10px",
                borderRadius: "10px",
                backgroundColor: "white", // Replace with your desired dark background color
                border: "1px solid #F8BF0C",
                maxWidth: "200px", // Adjusted for better responsiveness
                
              }}
            >
              <img src={smallLogo} alt="Small Logo" style={{ width: "80px", marginBottom: "20px" }} />
              <Typography variant="h6" style={{ color: "black" }}>CFS | Register</Typography>
              <form onSubmit={onSubmitHandler}>
              <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={userFirstName}
                  onChange={(event) => {
                    setUserFirstName(event.target.value);
                  }}
                  error={firstNameError}
                  required
                  style={{ marginBottom: "20px", backgroundColor: "white" }} // Adjust styles as needed
                />
                  <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={userLastName}
                  onChange={(event) => {
                    setUserLastName(event.target.value);
                  }}
                  error={lastNameError}
                  required
                  style={{ marginBottom: "20px", backgroundColor: "white" }} // Adjust styles as needed
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={userEmail}
                  onChange={(event) => {
                    setUserEmail(event.target.value);
                  }}
                 error={emailError}
                  required
                  style={{ marginBottom: "20px", backgroundColor: "white" }} // Adjust styles as needed
                />
                 <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              style={{ marginBottom: 20 }}
              required
              inputProps={{ maxLength: 10 }}
              value={userPhone}
              onChange={(event) => setPhone(event.target.value)}
              error={phoneError}
              helperText="Please use a phone number in a format 09xxxxxxxx"
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
                  style={{ marginBottom: "20px", backgroundColor: "white" }} // Adjust styles as needed
                />
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  style={{ marginBottom: "10px" }}
                >
                  Register
                </Button>
                {error && (
                  <Alert severity="error">Registration failed</Alert>
                )}
                <Button
                  href="http://localhost:5173"
                  variant="contained"
                  color="warning"
                  fullWidth
                >
                  Go to Home
                </Button>
                <div style={{ marginTop: "10px", color: "green" }}>
                  <Typography variant="body2">
                    Have an account?{" "}
                    <a
                      href="http://localhost:5173/login"
                      style={{ textDecoration: "none", color: "#1976d2" }}
                    >
                      Login
                    </a>
                  </Typography>
                </div>
              </form>
            </Container>
          </Grid>
        </Container>
      </>
    );
  };
  
  export default Register;
  