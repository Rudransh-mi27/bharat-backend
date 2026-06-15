import Course from '../models/courseModel.js';
import * as factory from './handlerFactory.js';

export const createCourse = factory.createOne(Course);
export const getCourse = factory.getOne(Course);
export const getAllCourses = factory.getAll(Course);
export const updateCourse = factory.updateOne(Course);
export const deleteCourse = factory.deleteOne(Course);
