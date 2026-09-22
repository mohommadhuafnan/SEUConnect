import Welfare from '../models/Welfare.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getWelfareServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { status: 'Active' };
    if (category && category !== 'All') filter.category = category;

    const items = await Welfare.find(filter).sort({ category: 1, title: 1 });
    return successResponse(res, items);
  } catch (error) {
    next(error);
  }
};

export const createWelfareService = async (req, res, next) => {
  try {
    const item = await Welfare.create(req.body);
    return successResponse(res, item, 'Welfare service registered successfully.', 201);
  } catch (error) {
    next(error);
  }
};
