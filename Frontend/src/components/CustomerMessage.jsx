import { Container, Paper, Typography } from "@mui/material";
import logo from '../assets/btlogo.png'

const CustomerMessage = ({ message="", img="", imageViewer}) => {
  return (
    <Container>
      <Paper elevation={4} style={{ padding: 20, marginTop: 10, backgroundColor:'#fef5d0',borderRadius:'15px 15px 15px 0'}}>
        <img src={img} style={{ width:'100px',height:'auto' }} onClick={()=>{imageViewer(img)}}/>
        <Typography variant="body1" color={'#78520a'}>{message}</Typography>
      </Paper>
    </Container>
  );
};

export default CustomerMessage;