const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  salary: { type: String, required: true, trim: true },
  requirements: [String], // Array of job requirements
  benefits: [String], // Array of job benefits
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'], 
    default: 'Full-time' 
  },
  experienceLevel: { 
    type: String, 
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'], 
    default: 'Mid Level' 
  },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) }, // 30 days from now
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [{
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resume: String,
    coverLetter: String,
    status: { 
      type: String, 
      enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'], 
      default: 'Applied' 
    },
    appliedAt: { type: Date, default: Date.now }
  }]
});

// Update the updatedAt field before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better search performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ employer: 1 });

jobSchema.post('save', function(doc) {
  console.log('Job created/updated:', doc.title, 'at', doc.company, 'by employer', doc.employer);
});

module.exports = mongoose.model('Job', jobSchema);
