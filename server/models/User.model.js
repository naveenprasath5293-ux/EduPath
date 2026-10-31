const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN: 'admin',
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name is too short'],
      maxlength: [100, 'Full name is too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned by default
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPasswordIfModified(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES };
