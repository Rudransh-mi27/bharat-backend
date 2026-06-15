import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      unique: true,
      trim: true,
      minlength: [5, 'A course title must have at least 5 characters']
    },
    description: {
      type: String,
      required: [true, 'A course must have a description'],
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    duration: {
      type: Number,
      required: [true, 'A course must have a duration (hours)']
    },
    subject: {
      type: String,
      required: [true, 'A course must belong to a subject'],
      enum: ['Math', 'Science', 'Coding', 'History', 'Languages', 'General']
    },
    instructor: {
      type: String,
      default: 'EduSpark Instructor'
    },
    enrollmentCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
