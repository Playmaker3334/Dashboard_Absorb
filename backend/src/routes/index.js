const express = require('express');
const absorbService = require('../services/absorb-service');

const router = express.Router();

/**
 * Helper to catch async errors
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      message: 'API is running'
    }
  });
});

/**
 * @route   GET /api/simulators
 * @desc    Get all simulators
 * @access  Public
 */
router.get('/simulators', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const includeAllCourses = req.query.include_all === 'true';
  
  const response = await absorbService.getSimulators({
    limit,
    includeAllCourses
  });
  
  res.json(response);
}));

/**
 * @route   GET /api/courses
 * @desc    Get all courses (including non-simulators)
 * @access  Public
 */
router.get('/courses', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  
  const response = await absorbService.getCourses({
    limit
  });
  
  res.json(response);
}));

/**
 * @route   GET /api/simulators/:simulatorId/users
 * @desc    Get users for a specific simulator
 * @access  Public
 */
router.get('/simulators/:simulatorId/users', asyncHandler(async (req, res) => {
  const { simulatorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const includeDetails = req.query.include_details !== 'false';
  
  const response = await absorbService.getSimulatorUsers(simulatorId, {
    page,
    limit,
    includeDetails
  });
  
  res.json(response);
}));

/**
 * @route   GET /api/courses/:courseId/users
 * @desc    Get users for a specific course
 * @access  Public
 */
router.get('/courses/:courseId/users', asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const includeDetails = req.query.include_details !== 'false';
  
  const response = await absorbService.getCourseUsers(courseId, {
    page,
    limit,
    includeDetails
  });
  
  res.json(response);
}));

module.exports = router;