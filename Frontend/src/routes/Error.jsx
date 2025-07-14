import { Button, Container, Typography } from "@mui/material"
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
    const error = useRouteError()
    return (
        <div style={style}>
            <Typography variant="h2">Oops!</Typography>
            <SmartToyOutlinedIcon style={{ fontSize: "200px" }} />
            <Typography variant="body1">You are trying to access undefined page! or An unexpected error has occured</Typography>
            <p><i>{error}</i></p>
            <Link to={'/'}>
            <Button variant="outlined">Get Back to Home</Button>
            </Link>
        </div>
    )
}

export default Error

const style = {
    display: "flex",
    margin: "100px auto",
    width: "100%",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center"
}