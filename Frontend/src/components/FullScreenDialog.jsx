import { Button, Container, Dialog } from "@mui/material";

const FullScreenDialog = ({ handleClose, src }) => {
  return (
    <>
      <Dialog fullScreen onClose={handleClose} open>
        <Button variant="outlined" onClick={handleClose} color="error">
          Close
        </Button>
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // This makes sure the div takes up the full height of the viewport
            }}
          >
            <img
              src={src}
              style={{
                width: "70%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </Container>
      </Dialog>
    </>
  );
};
export default FullScreenDialog;
