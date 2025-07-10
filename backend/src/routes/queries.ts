import express from 'express';
import { NamedQueryModel } from '../models/NamedQuery';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { tags, categories, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (tags) {
      filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    if (categories) {
      filter.categories = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const queries = await NamedQueryModel.find(filter)
      .select('name description tags categories metadata.visualization.defaultView createdAt')
      .sort({ createdAt: -1 });

    res.json({
      data: queries,
      count: queries.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const query = await NamedQueryModel.findById(req.params.id);
    
    if (!query) {
      const error: AppError = new Error('Query not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(query);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const query = new NamedQueryModel(req.body);
    await query.save();
    
    res.status(201).json(query);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const query = await NamedQueryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!query) {
      const error: AppError = new Error('Query not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(query);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const query = await NamedQueryModel.findByIdAndDelete(req.params.id);
    
    if (!query) {
      const error: AppError = new Error('Query not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: 'Query deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;