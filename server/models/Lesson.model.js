const mongoose = require('mongoose');

const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Title is too long'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    lessonNumber: {
      type: Number,
      required: [true, 'Lesson number is required'],
      min: [1, 'Lesson number must be at least 1'],
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: no two lessons in the same course can share the same number
lessonSchema.index({ course: 1, lessonNumber: 1 }, { unique: true });
lessonSchema.index({ course: 1, isPublished: 1, lessonNumber: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = { Lesson };
