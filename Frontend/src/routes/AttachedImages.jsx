import {
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAttachedImages } from "../services/fetchRequests";
import Header from "../components/Header/Header";
import { ArrowBack } from "@mui/icons-material";
import FullScreenDialog from "../components/FullScreenDialog";
import { url } from "../services/url";

const AttachedImages = () => {
  const { id } = useParams();
  const number = id.split("_");
  const filteredId = number[number.length - 1];
  const [images, setImages] = useState([]);
  const [fullScreenDialog, setFullScreenDialog] = useState(false);
  const [dialogImageSrc, setDialogImageSrc] = useState("");
  const styleForImage = {
    objectFit: "contain",
    height: "100px",
    width: "100%",
    cursor: "pointer",
  };
  // dialog functions
  const closeDialog = () => {
    setFullScreenDialog(false);
  };
  const openDialog = (src) => {
    setDialogImageSrc(src);
    setFullScreenDialog(true);
  };
  useEffect(() => {
    getAttachedImages(id).then((result) => {
      if (result != false) {
        const imageList = result.map((arr, index) => {
          return (
            <Grid item xs={3} md={3} key={index}>
              <img
                src={url +"resources/"+ arr}
                alt={url+"resources/"+arr}
                style={styleForImage}
                onClick={() => openDialog(event.target.src)}
              />
            </Grid>
          );
        });
        setImages(imageList);
      } else {
        alert("Failed to get images");
      }
    });
  }, []);
  return (
    <>
      <Header />
      <Container>
        <Link to={`/chat/${id}`}>
          <IconButton>
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography
          variant="subtitle1"
          textAlign={"center"}
          gutterBottom
          sx={{
            fontSize: { xs: "16px", sm: "28px" },
          }}
        >
          Attached image files
        </Typography>
        <Grid container>{images}</Grid>
        {fullScreenDialog && (
          <FullScreenDialog handleClose={closeDialog} src={dialogImageSrc} />
        )}
      </Container>
    </>
  );
};

export default AttachedImages;
