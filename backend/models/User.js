const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['employer', 'candidate'], required: true },
  resume: String,
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

userSchema.post('save', function(doc) {
  console.log('User created:', doc.email, doc.role);
});

module.exports = mongoose.model('User', userSchema);
