import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from "@mui/material";
import Header from "../components/Header/Header";
import { Container } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Faq = () => {
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);
  if (pageLoading === false) {
    return (
      <>
        <Header />
        <Container style={{ overflowX: "hidden" }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            Common Questions
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">
                What kind of training is provided?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                We provide comprehensive training about personal discovery,
                including hands-on sessions, webinars, and detailed
                documentation.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">
                Can I access the application on multiple devices?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Yes, our application is designed to be used across multiple
                devices, including desktops, laptops, and mobile devices.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">
                What support is available if I encounter issues with the
                application?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                We have a dedicated support team available to assist with any
                issues you may encounter. You can reach out to them via email,
                phone, or our in-app chat feature.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">
                How often is the training updated?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Our training materials are regularly updated to reflect the
                latest features and improvements to our application.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </>
    );
  } else {
    return (
      <div
        style={{
          padding: 0,
          margin: 0,
          width: "100%",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "hidden",
        }}
      >
        <CircularProgress style={{ margin: "auto" }} color="warning" />
      </div>
    );
  }
};

export default Faq;
