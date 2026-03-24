// internal-imports
import { asyncHandler } from '../../../core/index.js';
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route GET /
router.get('/', asyncHandler(controller.getBooks));

// @route GET /totalPages
router.get('/totalPages', asyncHandler(controller.getBooksTotalPages));
