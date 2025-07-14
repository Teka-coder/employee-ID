const exress = require('express')
const { filterMyHighOfficeTicketsForReport,filterMyMidOfficeTicketsForReport,filterMyLowOfficeTicketsForReport } = require('../helpers/databaseHelpers')
const router = exress.Router()
router.get('/', (request, response) => {
    const { startDate, endDate } = request.query; // Retrieve startDate and endDate from query parameters
  
    if (request.session.hierarchy === 'high') {
      filterMyHighOfficeTicketsForReport(request.session.userOffice, startDate, endDate)
        .then(result => {
          response.status(200).json(result);
        })
        .catch(error => {
          console.error("Error fetching high office tickets:", error); // Log the error
          response.status(500).json({ message: "An error occurred" });
        });
    } else if (request.session.hierarchy === 'mid') {
      filterMyMidOfficeTicketsForReport(request.session.userOffice, startDate, endDate)
        .then(result => {
          response.status(200).json(result);
        })
        .catch(error => {
          console.error("Error fetching mid office tickets:", error); // Log the error
          response.status(500).json({ message: "An error occurred" });
        });
    } else if (request.session.hierarchy === 'low') {
      filterMyLowOfficeTicketsForReport(request.session.emp_id, startDate, endDate)
        .then(result => {
          response.status(200).json(result);
        })
        .catch(error => {
          console.error("Error fetching low office tickets:", error); // Log the error
          response.status(500).json({ message: "An error occurred" });
        });
    } else {
      response.status(400).json({ message: "Invalid hierarchy" }); // Handle invalid hierarchy
    }
  });
  
  module.exports = router;