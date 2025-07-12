const Job = require('../models/job');
const User = require('../models/User');
const { sendJobApplicationNotification, sendApplicationConfirmation } = require('../utils/emailService');

exports.createJob = async (req, res) => {
  try {
    console.log('CreateJob: User attempting to create job:', req.user);
    console.log('CreateJob: User role:', req.user.role);
    console.log('CreateJob: User ID:', req.user._id || req.user.id);

    if (req.user.role !== 'employer') {
      return res.status(403).json({ msg: 'Only employers can post jobs' });
    }
    
    // Ensure we have a valid employer ID
    const employerId = req.user._id || req.user.id;
    if (!employerId) {
      console.error('CreateJob: No employer ID found in req.user');
      return res.status(400).json({ msg: 'Invalid user data' });
    }

    console.log('CreateJob: Creating job with employer ID:', employerId);
    
    // Verify employer exists in database
    const employer = await User.findById(employerId);
    if (!employer) {
      console.error('CreateJob: Employer not found in database:', employerId);
      return res.status(404).json({ msg: 'Employer not found' });
    }

    console.log('CreateJob: Employer verified:', employer.name, employer.email);

    // Create job with explicit employer field
    const jobData = {
      ...req.body,
      employer: employerId
    };

    console.log('CreateJob: Job data to be saved:', jobData);

    const job = await Job.create(jobData);
    
    console.log('CreateJob: Job created successfully:', job._id);
    console.log('CreateJob: Job employer field:', job.employer);
    
    // Verify the job was created with employer field
    const createdJob = await Job.findById(job._id).populate('employer', 'name email');
    console.log('CreateJob: Verification - job with employer:', createdJob.employer);

    res.json(job);
  } catch (err) {
    console.error('CreateJob: Error creating job:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, q, category, salaryMin, salaryMax } = req.query;
    let query = {};

    const searchTerm = q || keyword;
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { company: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Add salary filtering if provided
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = parseInt(salaryMin);
      if (salaryMax) query.salary.$lte = parseInt(salaryMax);
    }

    const jobs = await Job.find(query)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Jobs fetched:', jobs.length);
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    console.log('Fetching job by ID:', req.params.id);
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email')
      .populate('applications.candidate', 'name email');
    
    if (!job) {
      console.log('Job not found for ID:', req.params.id);
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    console.log('Job found:', job.title, 'by', job.employer?.name);
    res.json(job);
  } catch (err) {
    console.error('Error in getJobById:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.applyJob = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ msg: 'Only candidates can apply' });
    }
    
    console.log('ApplyJob: Job application attempt by user:', req.user._id);
    console.log('ApplyJob: Applying for job ID:', req.params.id);
    
    // Find the job first
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('ApplyJob: Job not found:', req.params.id);
      return res.status(404).json({ msg: 'Job not found' });
    }

    console.log('ApplyJob: Job found:', job.title);
    console.log('ApplyJob: Job employer field:', job.employer);

    // Check if employer field exists
    if (!job.employer) {
      console.error('ApplyJob: Job has no employer assigned:', req.params.id);
      return res.status(400).json({ msg: 'This job has no employer assigned. Please contact support.' });
    }

    // Get employer details
    const employer = await User.findById(job.employer);
    if (!employer) {
      console.error('ApplyJob: Employer not found:', job.employer);
      return res.status(404).json({ msg: 'Employer not found' });
    }

    console.log('ApplyJob: Employer found:', employer.name, employer.email);

    // Check if user already applied
    const alreadyApplied = job.applications.find(app => 
      app.candidate.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      console.log('ApplyJob: User already applied to this job');
      return res.status(400).json({ msg: 'Already applied' });
    }

    // Get applicant details
    const applicant = await User.findById(req.user._id);
    if (!applicant) {
      console.log('ApplyJob: Applicant user not found:', req.user._id);
      return res.status(404).json({ msg: 'Applicant not found' });
    }

    console.log('ApplyJob: Applicant found:', applicant.name, applicant.email);

    // Add application to job
    job.applications.push({ 
      candidate: req.user._id, 
      resume: req.file ? req.file.path : null,
      appliedAt: new Date()
    });
    await job.save();

    // Add job to user's applications
    applicant.applications.push(job._id);
    if (req.file) {
      applicant.resume = req.file.path;
    }
    await applicant.save();

    console.log('ApplyJob: Application saved successfully');

    // Create job object with employer details for email
    const jobWithEmployer = {
      ...job.toObject(),
      employer: employer
    };

    // Send email notification to employer
    console.log('ApplyJob: Sending email notification to employer:', employer.email);
    const employerEmailResult = await sendJobApplicationNotification(jobWithEmployer, applicant, employer.email);
    
    // Send confirmation email to applicant
    console.log('ApplyJob: Sending confirmation email to applicant:', applicant.email);
    const applicantEmailResult = await sendApplicationConfirmation(jobWithEmployer, applicant, applicant.email);
    
    if (employerEmailResult.success) {
      console.log('ApplyJob: Employer email sent successfully');
    } else {
      console.error('ApplyJob: Failed to send employer email:', employerEmailResult.error);
    }

    if (applicantEmailResult.success) {
      console.log('ApplyJob: Applicant confirmation email sent successfully');
    } else {
      console.error('ApplyJob: Failed to send applicant email:', applicantEmailResult.error);
    }

    res.json({ 
      msg: 'Applied successfully',
      employerEmailSent: employerEmailResult.success,
      applicantEmailSent: applicantEmailResult.success,
      emailErrors: {
        employer: employerEmailResult.success ? null : employerEmailResult.error,
        applicant: applicantEmailResult.success ? null : applicantEmailResult.error
      }
    });
  } catch (err) {
    console.error('ApplyJob: Error applying for job:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// New function: Get applications for a specific job (for employers)
exports.getJobApplications = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ msg: 'Only employers can view applications' });
    }

    const job = await Job.findById(req.params.id)
      .populate('applications.candidate', 'name email resume')
      .populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the employer owns this job
    if (job.employer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You can only view applications for your own jobs' });
    }

    res.json({
      job: {
        title: job.title,
        company: job.company,
        location: job.location
      },
      applications: job.applications
    });
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// New function: Update job status
exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ msg: 'Only employers can update jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the employer owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You can only update your own jobs' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('employer', 'name email');

    console.log('Job updated:', updatedJob.title, 'by employer', updatedJob.employer.name);
    res.json(updatedJob);
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// New function: Delete job
exports.deleteJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ msg: 'Only employers can delete jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the employer owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You can only delete your own jobs' });
    }

    await Job.findByIdAndDelete(req.params.id);
    console.log('Job deleted:', job.title);
    res.json({ msg: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
