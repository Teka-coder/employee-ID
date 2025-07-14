import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Toolbar } from "@mui/material";

const ImageViewerDialog = ({ closeHandler, imgsrc }) => {
  return (
    <Dialog fullScreen open aria-labelledby="imageviewerdialog">
      <DialogContent>
        <IconButton onClick={closeHandler}>
          <Close />
        </IconButton>
        <Toolbar />
        <img
          src={imgsrc}
          style={{ display:'block',width: "80%", height: "auto", margin: "auto" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerDialog;
