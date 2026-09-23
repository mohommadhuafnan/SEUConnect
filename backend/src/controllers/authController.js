import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Lecturer from '../models/Lecturer.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both university email and password.', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return errorResponse(res, 'Invalid university credentials. Account not found.', 401);
    }

    if (user.status !== 'active') {
      return errorResponse(res, `Your account is ${user.status}. Please contact the Faculty Technology administrator.`, 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid university credentials. Password incorrect.', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    let profile = null;
    let redirectPath = '/student/dashboard';

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
      redirectPath = '/student/dashboard';
    } else if (user.role === 'lecturer') {
      profile = await Lecturer.findOne({ userId: user._id }).populate('assignedCourses');
      redirectPath = '/lecturer/dashboard';
    } else if (user.role === 'hod') {
      profile = await Lecturer.findOne({ userId: user._id }).populate('assignedCourses');
      redirectPath = '/hod/dashboard';
    } else if (user.role === 'dean') {
      redirectPath = '/dean/dashboard';
    } else if (user.role === 'admin' || user.role === 'systemAdmin' || user.role === 'facultyAdmin') {
      redirectPath = '/admin/dashboard';
    }

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        lastLogin: user.lastLogin
      },
      profile,
      redirectPath
    }, 'Authentication successful.');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    let profile = null;
    let redirectPath = '/student/dashboard';

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
      redirectPath = '/student/dashboard';
    } else if (user.role === 'lecturer') {
      profile = await Lecturer.findOne({ userId: user._id }).populate('assignedCourses');
      redirectPath = '/lecturer/dashboard';
    } else if (user.role === 'hod') {
      profile = await Lecturer.findOne({ userId: user._id }).populate('assignedCourses');
      redirectPath = '/hod/dashboard';
    } else if (user.role === 'dean') {
      redirectPath = '/dean/dashboard';
    } else if (user.role === 'admin' || user.role === 'systemAdmin' || user.role === 'facultyAdmin') {
      redirectPath = '/admin/dashboard';
    }

    return successResponse(res, {
      user,
      profile,
      redirectPath
    }, 'Profile retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, specialization } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return errorResponse(res, 'User not found', 404);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();

    await user.save();

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
      if (profile && specialization) {
        profile.specialization = specialization;
        await profile.save();
      }
    } else if (user.role === 'lecturer') {
      profile = await Lecturer.findOne({ userId: user._id }).populate('assignedCourses');
      if (profile && specialization) {
        profile.specialization = specialization;
        await profile.save();
      }
    }

    return successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address
      },
      profile
    }, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file uploaded.', 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.profileImage = imageUrl;
    await user.save();

    return successResponse(res, { imageUrl }, 'Profile image updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.profileImage = '';
    await user.save();
    return successResponse(res, { imageUrl: '' }, 'Profile image removed successfully.');
  } catch (error) {
    next(error);
  }
};
