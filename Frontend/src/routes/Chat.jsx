import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import GeneralInfo from "../components/GeneralInfo";
import { url } from "../services/url";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { AttachFile, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  checkTicket,
  getConversation,
  sendMessage,
} from "../services/tickettracker";
import CustomerMessage from "../components/CustomerMessage";
import StaffMessage from "../components/StaffMessage";
import Gap from "../components/Gap";
import FileUpload from "../components/FileUpload";
import axios from "axios";
import ImageViewerDialog from "../components/ImageViewerDialog";

const Chat = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [tktStatus, setTktStatus] = useState(false);
  const [request, setRequest] = useState("");
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [imageViewerVisibility, setImageViewerVisibility] = useState(false)
  const [imgSrc, setImageSrc] = useState('')
  const navigate = useNavigate();
  setTimeout(() => {
    setPageLoading(false);
  }, 1000);
  let { id } = useParams();
  let parts = id.split("_");
  let lastNumber = parts[parts.length - 1];
  const onSubmitHandler = (event) => {
    event.preventDefault();
    sendMessage(id, 0, message).then((result) => {
      if (result === true) {
        setConvo(
          convo.concat(
            <CustomerMessage message={message} key={convo.length + 1} />
          )
        );
        setMessage("");
      } else {
        alert("failed to send your message");
      }
    });
  };
  useEffect(() => {
    checkTicket(id).then((result) => {
      if (result === false) {
        window.location.replace("/");
      } else {
        if (result[8] !== "InProgress") {
          setTktStatus(true);
          alert("This Ticket is closed");
        }
        setName(result[0]);
        setDate(result[5]);
        setRequest(result[6]);
      }
    });
    const fetchConversation = () => {
      getConversation(id).then((result) => {
        let conversation = [];
        if (result) {
          if (result.length !== 0) {
            conversation = result.map((row) => {
              if (row[4] === 0) {
                let imgUrl = ''
                if(row[6]){
                  imgUrl = url+row[6]
                }
                return <CustomerMessage message={row[3]} key={row[0]} img={imgUrl} imageViewer={openImageViewer}/>;
              } else {
                return (
                  <StaffMessage
                    name={row[2]}
                    office={row[5]}
                    message={row[3]}
                    key={row[0]}
                  />
                );
              }
            });
          }
        }
        setConvo(conversation);
      });
    };
    fetchConversation();
    const intervalId = setInterval(fetchConversation, 9000);
    return () => clearInterval(intervalId);
  }, [id]);
  // Dialog Functions
  const handleClosingDialog = () => {
    setDialogVisibility(false);
  };
  const handleOpeningDialog = () => {
    setDialogVisibility(true);
  };
  // ImageViewr Functions Handler
  const openImageViewer = (src)=>{
    setImageSrc(src)
    setImageViewerVisibility(true)
  }
  const closeImageViewerDialog = ()=>{
    setImageViewerVisibility(false)
  }
  // File Uploader Function
  const fileUploadHandler = (file) => {
    setPageLoading(true);
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      alert("No file selected");
    } 
    // else if (!file.type.startsWith("image/") || file.size > maxSize) {
    //   alert("Only image file below 5Mb is allowed");
    // } 
    else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", lastNumber);
      axios
        .post(`${url}uploadchatimg`, formData)
        .then((response) => {
          setDialogVisibility(false)
          setPageLoading(false);
          window.location.reload()
        })
        .catch((error) => {
          alert("Failed to upload your image");
          setPageLoading(false);
          setDialogVisibility(false)
        });
    }
  };
  // Go to attached files
  const gotoAttachedImages = () => {
    navigate(`/attachedimgs/${id}`);
  };
  if (pageLoading === false) {
    return (
      <>
        <Header />
        <GeneralInfo
          id={id}
          name={name}
          date={date}
          request={request}
          attachementHandler={gotoAttachedImages}
        />
        {convo}
        <Gap />
        <Box
          display="flex"
          justifyContent="center"
          position="fixed"
          bottom={0}
          width="100%"
        >
          <Container style={{ width: "100%" }}>
            <form onSubmit={onSubmitHandler}>
              <Grid container spacing={1}>
                <Grid item md={11} xs={8}>
                  <TextField
                    label="Your Message"
                    variant="outlined"
                    fullWidth
                    disabled={tktStatus}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    style={{ marginBottom: 20, backgroundColor: "white" }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          onClick={tktStatus ? null : handleOpeningDialog}
                          position="start"
                          style={{ cursor: "pointer" }}
                        >
                          <AttachFile />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={1} xs={1}>
                  <Button
                    variant="contained"
                    endIcon={<Send />}
                    style={{ height: "73%" }}
                    type="submit"
                    disabled={tktStatus}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>

          </Container>
        </Box>
        {imageViewerVisibility && <ImageViewerDialog closeHandler={closeImageViewerDialog} imgsrc={imgSrc}/>}
        {dialogVisibility && (
          <FileUpload
            cancelHandler={handleClosingDialog}
            uploadHandler={fileUploadHandler}
          />
        )}
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

export default Chat;
