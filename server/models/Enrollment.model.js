const mongoose = require('mongoose');

const { Schema } = mongoose;

const ENROLLMENT_STATUS = Object.freeze({
  ENROLLED: 'enrolled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const enrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.ENROLLED,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot be more than 100'],
    },
    // Array of lesson IDs this student has completed
    completedLessons: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
      default: [],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Useful indexes for queries
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = { Enrollment, ENROLLMENT_STATUS };
