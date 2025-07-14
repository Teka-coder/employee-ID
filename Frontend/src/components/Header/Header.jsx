import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/gbglogo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { userlogout } from "../../services/userlogout";
import { userstatus } from "../../services/userstatus";

const drawerWidth = 240;

function Header(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    userstatus()
      .then((result) => {
        if (result.Logged) {
          setIsAuthenticated(true);
          setUserId(result.Userid); // the userstatus API returns the Userid comes from Login.jsx
        } else {
          setIsAuthenticated(false);
        }
      })
      // .catch((error) => {
      //   navigate("/");
      // });
  }, [navigate]);

  const navItems = isAuthenticated
    ? ["Home", "New Employee", "View Your Profile", "Logout"]
    : ["View Your Profile"];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    const isLoggedOut = await userlogout();
    if (isLoggedOut) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      console.log("Logout failed");
      window.location.reload();
    }
  };

  const getLocation = (item) => {
    switch (item) {
      case "Home":
        return "/home";
      case "New Employee":
        return "/addemployee";
      case "Login":
        return "/login";
    
      case "View Your Profile":
        return "/viewyourprofile";
  
      default:
        return "/";
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src={logo} alt="" style={imgStyle} />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            {item === "Logout" ? (
              <ListItemButton sx={{ textAlign: "left" }} onClick={handleLogout}>
                <ListItemText primary={item} />
              </ListItemButton>
            ) : (
              <Link
                to={getLocation(item)}
                style={{ textDecoration: "none", color: "black", width: "100%" }}
              >
                <ListItemButton sx={{ textAlign: "left" }}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", marginBottom: "15vh" }}>
      <CssBaseline />
      <AppBar component="nav" style={appBarStyle}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon sx={{ color: "#000" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "block", sm: "block" } }}
          >
            <img src={logo} alt="" style={imgStyle} />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <React.Fragment key={item}>
                {item === "Logout" ? (
                  <Button sx={{ color: "#000" }} onClick={handleLogout}>
                    {item}
                  </Button>
                ) : (
                  <Link to={getLocation(item)} style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "#000" }}>{item}</Button>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

/* Style for the component */

const imgStyle = {
  width: "50px",
  height: "auto",
};
const appBarStyle = {
  backgroundColor: "#f8931e",
};

export default Header;
