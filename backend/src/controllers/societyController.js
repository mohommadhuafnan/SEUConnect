import Society from '../models/Society.js';
import Membership from '../models/Membership.js';
import Student from '../models/Student.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSocieties = async (req, res, next) => {
  try {
    const societies = await Society.find().sort({ name: 1 });

    let studentMemberships = [];
    if (req.user?.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        studentMemberships = await Membership.find({ studentId: student._id });
      }
    }

    const membershipMap = new Map();
    studentMemberships.forEach(m => membershipMap.set(m.societyId.toString(), m.status));

    const enriched = societies.map(s => ({
      ...s.toObject(),
      membershipStatus: membershipMap.get(s._id.toString()) || 'Not a member'
    }));

    return successResponse(res, enriched);
  } catch (error) {
    next(error);
  }
};

export const requestMembership = async (req, res, next) => {
  try {
    const { societyId } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student record not found.', 404);

    const existing = await Membership.findOne({ studentId: student._id, societyId });
    if (existing) {
      return errorResponse(res, `You have already submitted a membership request (Status: ${existing.status}).`, 400);
    }

    const membership = await Membership.create({
      studentId: student._id,
      societyId,
      status: 'Active' // Auto-active for demonstration or pending
    });

    return successResponse(res, membership, 'Membership joined successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const createSociety = async (req, res, next) => {
  try {
    const society = await Society.create(req.body);
    return successResponse(res, society, 'Society created successfully.', 201);
  } catch (error) {
    next(error);
  }
};
