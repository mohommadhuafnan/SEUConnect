import FormDocument from '../models/FormDocument.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllForms = async (req, res, next) => {
  try {
    const { category, search, role } = req.query;
    const filter = { status: 'Published' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { officialTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } }
      ];
    }

    const userRole = req.user?.role || 'student';
    filter.availableToRoles = { $in: [userRole, 'all', 'ALL'] };

    const forms = await FormDocument.find(filter).sort({ category: 1, name: 1 });
    return successResponse(res, forms);
  } catch (error) {
    next(error);
  }
};

export const getFormCategories = async (req, res, next) => {
  try {
    const categories = await FormDocument.distinct('category', { status: 'Published' });
    return successResponse(res, categories);
  } catch (error) {
    next(error);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let form = null;

    if (id.startsWith('SEU-')) {
      form = await FormDocument.findOne({ formId: id });
    } else {
      form = await FormDocument.findById(id);
    }

    if (!form) {
      return errorResponse(res, 'Faculty form not found.', 404);
    }

    return successResponse(res, form);
  } catch (error) {
    next(error);
  }
};

export const createAdminForm = async (req, res, next) => {
  try {
    const newForm = await FormDocument.create(req.body);
    return successResponse(res, newForm, 'Faculty form created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdminForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await FormDocument.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return errorResponse(res, 'Form not found', 404);

    return successResponse(res, updated, 'Faculty form updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteAdminForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FormDocument.findByIdAndDelete(id);
    return successResponse(res, {}, 'Form deleted successfully.');
  } catch (error) {
    next(error);
  }
};
