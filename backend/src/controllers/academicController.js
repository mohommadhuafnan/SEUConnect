import Subject from '../models/Subject.js';
import Semester from '../models/Semester.js';
import Examination from '../models/Examination.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSubjects = async (req, res, next) => {
  try {
    const { semester, degreeProgramme } = req.query;
    const filter = {};
    if (semester) filter.semester = Number(semester);
    if (degreeProgramme) filter.degreeProgramme = { $in: [degreeProgramme, 'COMMON'] };

    const subjects = await Subject.find(filter).populate('lecturerInCharge').sort({ semester: 1, code: 1 });
    return successResponse(res, subjects);
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    return successResponse(res, subject, 'Subject created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
    if (!subject) return errorResponse(res, 'Subject not found', 404);
    return successResponse(res, subject, 'Subject updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    return successResponse(res, {}, 'Subject deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const getSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.find().sort({ academicYear: -1, semesterNumber: 1 });
    return successResponse(res, semesters);
  } catch (error) {
    next(error);
  }
};

export const createSemester = async (req, res, next) => {
  try {
    const sem = await Semester.create(req.body);
    return successResponse(res, sem, 'Semester created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getExaminations = async (req, res, next) => {
  try {
    const exams = await Examination.find().sort({ startDate: -1 });
    return successResponse(res, exams);
  } catch (error) {
    next(error);
  }
};
