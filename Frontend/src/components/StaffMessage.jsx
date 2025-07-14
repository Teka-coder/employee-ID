import { Container, Paper, Typography } from "@mui/material";

const StaffMessage = ({ name, office, message }) => {
  return (
    <Container>
      <Paper elevation={4} style={{ padding: 20, marginTop: 10, backgroundColor:'#f5f5f4',borderRadius:'15px 15px 0 15px' }}>
        <Typography variant="body2" align="right" style={{ color:"#0c0a09" }}>{name} ({office})</Typography>
        <Typography variant="body1" style={{ color:"#0c0a09" }}>{message}</Typography>
      </Paper>
    </Container>
  );
};

export default StaffMessage;