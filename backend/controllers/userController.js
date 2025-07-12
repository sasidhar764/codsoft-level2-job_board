const User = require('../models/User');
const Job = require('../models/job');

exports.getDashboard = async (req, res) => {
  try {
    console.log('getDashboard: req.user:', req.user);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found in database for id:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Dashboard user found:', user.email, 'with role:', user.role);

    if (user.role === 'employer') {
      const jobs = await Job.find({ employer: user._id }).populate('applications');
      console.log('Employer dashboard jobs:', jobs.length);
      return res.json({ role: 'employer', jobs });
    } else {
      await user.populate({
        path: 'applications',
        model: 'Job',
        populate: { path: 'employer', model: 'User', select: 'name email' }
      });
      console.log('Candidate dashboard applications:', user.applications.length);
      return res.json({ role: 'candidate', applications: user.applications });
    }
  } catch (err) {
    console.log('Dashboard controller error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
