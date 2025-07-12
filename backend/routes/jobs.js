const express = require('express');
const { 
  createJob, 
  getJobs, 
  getJobById, 
  applyJob, 
  getJobApplications, 
  updateJob, 
  deleteJob 
} = require('../controllers/jobController');
const auth = require('../middleware/Auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Job routes
router.post('/', auth, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

// Application routes
router.post('/:id/apply', auth, upload.single('resume'), applyJob);
router.get('/:id/applications', auth, getJobApplications);

module.exports = router;
