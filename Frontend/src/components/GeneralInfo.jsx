import { Button, Container, CssBaseline, Paper, Typography } from "@mui/material";

const GeneralInfo = ({id, name, date,request, attachementHandler}) => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Paper elevation={4}style={{ padding:20 }}>
          <Typography variant="h6" gutterBottom>Ticket Info</Typography>
          <Typography variant="body1" gutterBottom>Ticket Id: {id}</Typography>
          <Typography variant="body1" gutterBottom>Name: {name}</Typography>
          <Typography variant="body1" gutterBottom>Date: {new Date(date).toLocaleDateString()}</Typography>
          <Typography variant="body1" gutterBottom>Request: {request}</Typography>
          <Button variant="outlined" onClick={attachementHandler}>View Attached Image</Button>
        </Paper>
      </Container>
    </>
  );
};
export default GeneralInfo;
