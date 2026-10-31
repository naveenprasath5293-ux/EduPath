const mongoose = require('mongoose');

const { Schema } = mongoose;

const COURSE_LEVELS = Object.freeze({
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
});

const COURSE_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
});

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [150, 'Title is too long'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'Short description is too long'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      required: [true, 'Course level is required'],
    },
    duration: {
      type: String,
      required: [true, 'Course duration is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Course thumbnail is required'],
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: [0, 'Enrolled count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Public catalog queries always filter by status+isDeleted - compound
// index keeps those fast as the catalog grows.
courseSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ title: 'text', shortDescription: 'text', description: 'text', instructor: 'text' });

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, COURSE_LEVELS, COURSE_STATUS };
