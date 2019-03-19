const express = require('express');
const router = express.Router();

// Tests Profile Route
router.get('/test', (req, res) => res.json({ message: 'Profile Works' }));

module.exports = router;