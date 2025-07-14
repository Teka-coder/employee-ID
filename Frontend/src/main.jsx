import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";

import Error from "./routes/Error";
import TrackEmployee from "./routes/TrackEmployee";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { userstatus } from "./services/userstatus";
import AddEmployee from "./routes/AddEmployee";
import EmployeeProfile from "./routes/EmployeeProfile";
import LandingPage from "./routes/LandingPage";
import NotFoundPage from "./routes/NotFoundPage";

const ForIbo = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    userstatus()
      .then((result) => {
        if (result.Logged && result.role === "editor") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return isAuthenticated ? children : null;
};

const ForOther = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    userstatus()
      .then((result) => {
        if (result.Logged && result.role === "normal") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/landingpage");
    }
  }, [navigate, isAuthenticated]);

  return isAuthenticated ? children : null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <Error />,
  },
  {
    path: "/addemployee",
    element: <AddEmployee />,
    errorElement: <Error />,
  },

  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/landingpage",
    element: <LandingPage />,
    errorElement: <Error />,
  },
  {
    path: "/notfound",
    element: <NotFoundPage />,
    errorElement: <Error />,
  },
  {
    path: "/viewyourprofile",
    element: <TrackEmployee />,
    errorElement: <Error />,
  },
  {
    path: "/employee/:employeeid",
    element: <EmployeeProfile />,
    errorElement: <Error />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <Error />,
  },

  {
    path: "/userlogout",
    element: <Login />,
    errorElement: <Error />,
  },
  // Uncomment if you want to handle all undefined routes
  {
    path: "*",
    element: <Error />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
