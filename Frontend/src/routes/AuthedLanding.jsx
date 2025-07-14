import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Input,
} from "@mui/material";
import Header from "../components/Header/Header";
import inputChecker from "../utils/inputChecker";
import sendQuery from "../services/sendquery";
import { getCategories } from "../services/fetchRequests";
import { useNavigate } from "react-router-dom";
import { attachImages } from "../services/uploadimages";


const AuthedLanding = () => {
    const [id, setId] = useState("");
    const [idError, setIdError] = useState(false);
  const [query, setQuery] = useState("");
  const [queryError, setqueryError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [tktNumber, setTktNumber] = useState(-1);
  const [disabledButton, setDisabledButton] = useState(false);
  const [categories, setCategories] = useState([]);
  const [targetCategory, setTargetCategory] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [snackBarStatus, setSnackBarStatus] = useState(false);
  const navigate = useNavigate();
  let hasErrors = false;
  const copyRedirectTicket = () => {
    navigator.clipboard.writeText(tktNumber);
    setSnackBarStatus(true);
    setTimeout(() => {
      navigate(`/chat/${tktNumber}`);
    }, 5000);
  };
  useEffect(() => {
    getCategories()
      .then((result) => {
        if (result !== false) {
          setCategories(result);
        } else {
        }
      })
      .catch((error) => window.location.reload());
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);
  const menuItems = categories.map((row) => (
    <MenuItem value={row[0]} key={row[0]}>
      {row[1]}
    </MenuItem>
  ));
  const HandleSubmit = (event) => {
    event.preventDefault();
    const checkInputAndSetError = (type, input, setError) => {
      if (inputChecker(type, input)) {
        setError(false);
      } else {
        setError(true);
        hasErrors = true;
      }
    };

   
   
    checkInputAndSetError("text", query, setqueryError);
    if (!hasErrors) {
      const data = {
       userid: userId,
        category: targetCategory,
        query: query,
      };

      sendQuery("takerequest", data)
        .then(async (result) => {
          console.log(result)
          if (result) {
            setTktNumber(result);
            setShowAlert(true);
            setDisabledButton(true);
            const fileInput = document.getElementById('file')
            const file = fileInput.files[0]
            const uploadResult = await attachImages(file, result)
            if(uploadResult === false){
              alert('Ticket Submitted, but Image Not Uploaded. You can include that in the chat')
            }
          } else {
            alert("Failed to send your request, Please Try again.");
          }
        })
        .catch((error) =>{
          alert("Failed to send your request, Please Try again.")
        }
        );
    }
  };
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
            minHeight: "100vh",
            paddingBottom: "80px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            -----------Welcome! (CFS)-----------
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
           Send your feedback or request with a minimum input field. (Just category & body)
          </Typography>
          <form
            style={{ width: "100%", marginTop: 20 }}
            onSubmit={HandleSubmit}
          >
           
           <TextField
              label="User Id"
              aria-readonly
              variant="outlined"
              fullWidth
              style={{ marginBottom: 20 }}
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              error={idError}
            />
            <FormControl fullWidth style={{ marginBottom: 20 }}>
              <InputLabel id="product-title-label">Request Category</InputLabel>
              <Select
                labelId="product-title-label"
                value={targetCategory}
                required
                onChange={(e) => setTargetCategory(e.target.value)}
              >
                {menuItems}
              </Select>
            </FormControl>
            <TextField
              label="Your Request"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              style={{ marginBottom: 20 }}
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              error={queryError}
            />
            <Button style={{ display: "block" }} component="label">
              Upload image to support your case if required
              <Input type="file" id="file" hidden disabled={disabledButton} style={{ display: "block" }}/>
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={disabledButton}
            >
              Submit
            </Button>
            {showAlert && (
              <Alert severity="success" style={{ marginTop: 20 }}>
                Your Message Has Been Sent. Your Ticket Number is{" "}
                <span
                  onClick={copyRedirectTicket}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "3px",
                  }}
                >
                  {tktNumber}
                </span>{" "}
                and it's sent to your email address.
              </Alert>
            )}
          </form>
        </Container>
        <Snackbar
          open={snackBarStatus}
          autoHideDuration={5000}
          message="Ticket copied and redirecting to chat."
        />
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

export default AuthedLanding;
