import express from 'express';
import * as courseController from '../controllers/courseController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// All course routes require authentication
router.use(authController.protect);

router.route('/')
  .get(courseController.getAllCourses)
  .post(authController.restrictTo('admin'), courseController.createCourse);

router.route('/:id')
  .get(courseController.getCourse)
  .patch(authController.restrictTo('admin'), courseController.updateCourse)
  .delete(authController.restrictTo('admin'), courseController.deleteCourse);

export default router;
