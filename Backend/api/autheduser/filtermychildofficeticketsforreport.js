const exress = require('express')
const { filterMyChildOfficeTicketsForReport } = require('../helpers/databaseHelpers')
const router = exress.Router()
router.get('/', (request, response) => {
    const { startDate, endDate } = request.query; // Retrieve startDate and endDate from query parameters
  
    if (request.session.hierarchy === 'high') {
        filterMyChildOfficeTicketsForReport(request.session.userOffice, startDate, endDate)
        .then(result => {
          response.status(200).json(result);
        })
        .catch(error => {
          console.error("Error fetching high office tickets:", error); // Log the error
          response.status(500).json({ message: "An error occurred" });
        });
    } 
  });
  
  module.exports = router;