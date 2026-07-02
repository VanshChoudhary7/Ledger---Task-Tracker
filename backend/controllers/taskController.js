const Task = require('../models/Task');

// @desc    Get all tasks (supports ?status=&priority=&search= filtering)
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
