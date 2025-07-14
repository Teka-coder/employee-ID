import { useTheme } from "@emotion/react";
import { CloudUpload } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Hidden,
  useMediaQuery,
} from "@mui/material";

const FileUpload = ({cancelHandler, uploadHandler}) => {
  const styles = {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery("md");
  const onSubmitHandler = (event)=>{
    event.preventDefault()
    const fileInput = document.getElementById('file')
    const file = fileInput.files[0]
    uploadHandler(file)
  }
  const closeHandler = ()=>{
    cancelHandler()
  }
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Upload Image</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmitHandler}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
            >
              Select file
              <input type="file" style={styles} id="file"/>
            </Button>
            <div style={{ marginTop:'20px' }}>
            <Button type="submit">Upload</Button>
            <Button onClick={closeHandler}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUpload;
