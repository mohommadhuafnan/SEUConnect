import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Lecturer from '../models/Lecturer.js';
import Subject from '../models/Subject.js';
import Semester from '../models/Semester.js';
import MedicalRequest from '../models/MedicalRequest.js';
import Process from '../models/Process.js';
import FormDocument from '../models/FormDocument.js';
import AcademicRule from '../models/AcademicRule.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalLecturers,
      totalSubjects,
      pendingMedicals,
      activeProcesses,
      publishedForms,
      totalNotifications
    ] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Lecturer.countDocuments(),
      Subject.countDocuments(),
      MedicalRequest.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
      Process.countDocuments({ status: 'Active' }),
      FormDocument.countDocuments({ status: 'Published' }),
      Notification.countDocuments()
    ]);

    const recentMedicals = await MedicalRequest.find()
      .populate('studentId')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(6);

    return successResponse(res, {
      metrics: {
        totalUsers,
        totalStudents,
        totalLecturers,
        totalSubjects,
        pendingMedicals,
        activeProcesses,
        publishedForms,
        totalNotifications
      },
      recentMedicals,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    return successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, studentData, lecturerData } = req.body;

    if (!name || !email || !password || !role) {
      return errorResponse(res, 'Name, email, password, and role are required.', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return errorResponse(res, 'A user with this email address already exists.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role,
      status: 'active'
    });

    if (role === 'student' && studentData) {
      await Student.create({
        userId: newUser._id,
        registrationNumber: studentData.registrationNumber || `SEU/FT/${Date.now().toString().slice(-4)}`,
        indexNumber: studentData.indexNumber || `FT${Date.now().toString().slice(-4)}`,
        degreeProgramme: studentData.degreeProgramme || 'BICT',
        currentSemester: studentData.currentSemester || 1,
        specialization: studentData.specialization || 'Software Systems'
      });
    } else if (role === 'lecturer' && lecturerData) {
      await Lecturer.create({
        userId: newUser._id,
        staffId: lecturerData.staffId || `LEC-${Date.now().toString().slice(-4)}`,
        designation: lecturerData.designation || 'Lecturer (Unconfirmed)',
        department: lecturerData.department || 'Department of Information and Communication Technology'
      });
    }

    return successResponse(res, {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }, 'User created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, status, phone, address } = req.body;

    const user = await User.findById(id);
    if (!user) return errorResponse(res, 'User not found', 404);

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    return successResponse(res, user, 'User updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return errorResponse(res, 'Cannot delete your own administrative account.', 400);
    }
    await User.findByIdAndDelete(id);
    await Student.deleteOne({ userId: id });
    await Lecturer.deleteOne({ userId: id });
    return successResponse(res, {}, 'User account deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const getAllMedicalRequestsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const requests = await MedicalRequest.find(filter)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    return successResponse(res, requests);
  } catch (error) {
    next(error);
  }
};

export const updateMedicalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const request = await MedicalRequest.findById(id);
    if (!request) return errorResponse(res, 'Medical request not found', 404);

    if (status) request.status = status;
    if (remarks !== undefined) request.remarks = remarks;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();
    return successResponse(res, request, 'Medical request status updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const getAcademicRules = async (req, res, next) => {
  try {
    let rules = await AcademicRule.findOne({ ruleKey: 'SEUSL_FT_DEFAULT' });
    if (!rules) {
      rules = await AcademicRule.create({
        ruleKey: 'SEUSL_FT_DEFAULT',
        attendanceMinimumPercent: 80,
        maximumCreditsPerSemester: 22,
        bictGraduationCredits: 130,
        bbstGraduationCredits: 120
      });
    }
    return successResponse(res, rules);
  } catch (error) {
    next(error);
  }
};

export const updateAcademicRules = async (req, res, next) => {
  try {
    const rules = await AcademicRule.findOneAndUpdate(
      { ruleKey: 'SEUSL_FT_DEFAULT' },
      req.body,
      { new: true, upsert: true }
    );
    return successResponse(res, rules, 'Academic rules updated successfully.');
  } catch (error) {
    next(error);
  }
};
