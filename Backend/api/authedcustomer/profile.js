const express = require("express");
const database = require("../../utils/database");
const { getUserProfile } = require('../helpers/databaseHelpers');
const router = express.Router();
//const authMiddleware = require('../../middlewares/authMiddleware') 
const authenticateToken = require('../../middlewares/authMiddleware');
// // GET user profile
// router.get('/:Userid', authMiddleware, async (req, res) => {
//   const userId = req.params.Userid;
//   const loggedInUserId = req.session.userid; // Example using sessions

//   // Check if the logged-in user is requesting their own profile
//   if (userId !== loggedInUserId) {
//     return res.status(403).json({ error: 'Forbidden' });
//   }

//   try {
//     const userProfile = await getUserProfile(userId);
//     if (!userProfile) {
//       return res.status(404).json({ error: 'User profile not found' });
//     }
//     res.status(200).json(userProfile);
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ error: 'Failed to fetch user profile' });
//   }
// });

// module.exports = router;



// GET /profile/:userId
router.get('/:Userid',authenticateToken, async (req, res) => {
  const userid = req.params.Userid;  //this is from the /:path
    // Check if the authenticated user matches the requested user ID
    if (req.user.id != userid) {
      return res.status(403).json({ error: 'Access denied' });
    }
  try {
    const userProfile = await getUserProfile(userid);
    if (!userProfile) {
      return res.status(404).json({ error: 'profile API says, User profile not found' });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('profile API says Error fetching user profile:', error);
    res.status(500).json({ error: 'profile API says Failed to fetch user profile ' });
  }
});

module.exports = router;


// router.get('/:Userid', authenticateToken, async (req, res) => {
//   const userid = req.params.Userid;

//   // Check if the authenticated user matches the requested user ID
//   if (req.user.id != userid) {
//     return res.status(403).json({ error: 'Access denied' });
//   }

//   try {
//     const [rows] = await pool.execute('SELECT * FROM user WHERE user_id = ?', [userid]);
//     const userProfile = rows[0];

//     if (!userProfile) {
//       return res.status(404).json({ error: 'User profile not found' });
//     }

//     res.status(200).json(userProfile);
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ error: 'Failed to fetch user profile' });
//   }
// });

// module.exports = router;

