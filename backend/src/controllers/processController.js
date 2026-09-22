import Process from '../models/Process.js';
import FormDocument from '../models/FormDocument.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllProcesses = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = { status: 'Active' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } }
      ];
    }

    const processes = await Process.find(filter).sort({ title: 1 });
    return successResponse(res, processes);
  } catch (error) {
    next(error);
  }
};

export const getProcessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let processDoc = null;

    if (id.startsWith('PROC-')) {
      processDoc = await Process.findOne({ processId: id });
    } else {
      processDoc = await Process.findById(id);
    }

    if (!processDoc) {
      return errorResponse(res, 'Process guide not found', 404);
    }

    // Fetch linked forms
    const linkedForms = await FormDocument.find({
      formId: { $in: processDoc.requiredFormIds || [] }
    });

    return successResponse(res, {
      ...processDoc.toObject(),
      linkedForms
    });
  } catch (error) {
    next(error);
  }
};

export const searchGuidance = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return successResponse(res, { processes: [], forms: [] });
    }

    const regex = new RegExp(query, 'i');

    const [processes, forms] = await Promise.all([
      Process.find({
        status: 'Active',
        $or: [
          { title: regex },
          { purpose: regex },
          { keywords: regex },
          { eligibility: regex }
        ]
      }).limit(5),
      FormDocument.find({
        status: 'Published',
        $or: [
          { name: regex },
          { officialTitle: regex },
          { description: regex },
          { purpose: regex }
        ]
      }).limit(5)
    ]);

    return successResponse(res, { processes, forms });
  } catch (error) {
    next(error);
  }
};

export const createAdminProcess = async (req, res, next) => {
  try {
    const newProcess = await Process.create(req.body);
    return successResponse(res, newProcess, 'Process guide created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdminProcess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Process.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return errorResponse(res, 'Process not found', 404);
    return successResponse(res, updated, 'Process guide updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteAdminProcess = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Process.findByIdAndDelete(id);
    return successResponse(res, {}, 'Process guide deleted successfully.');
  } catch (error) {
    next(error);
  }
};
