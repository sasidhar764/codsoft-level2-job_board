const express = require('express');
const auth = require('../middleware/Auth');
const Job = require('../models/ob');
const User = require('../models/User');
const router = express.Router();

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.role === 'employer') {
      // Fetch jobs posted by this employer
      const jobs = await Job.find({ employer: user._id }).populate('applications');
      return res.json({ role: 'employer', jobs });
    } else {
      // Fetch jobs applied to by this candidate
      await user.populate({
        path: 'applications',
        model: 'Job',
        populate: { path: 'employer', model: 'User', select: 'name email' }
      });
      return res.json({ role: 'candidate', applications: user.applications });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
