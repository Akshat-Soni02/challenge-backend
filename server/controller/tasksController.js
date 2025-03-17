import task from "../models/task.js";

export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await task.find({ userId });
    res.status(201).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.log("Error fetching all tasks:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: err.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentTask = await task.findById(id);
    res.status(200).json({
      success: true,
      task: currentTask,
      message: "Task updated successfully",
    });
  } catch (err) {
    console.log("Error getting task:", err);
    res.status(500).json({
      success: false,
      message: "Error getting task",
      error: err.message,
    });
  }
};

export const createNewTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user._id;
    const newTask = new task({
      title,
      description,
      status,
      userId
    });
    await newTask.save();
    const tasks = await task.find({userId});

    res.status(201).json({
      success: true,
      task: newTask,
      tasks,
    });
  } catch (err) {
    console.log("Error creating task:", err);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: err.message,
    });
  }
};

export const updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;
    const currentTask = await task.findById(id);
    if (updatedDetails.title) {
      currentTask.title = updatedDetails.title;
    }
    if (updatedDetails.description) {
      currentTask.description = updatedDetails.description;
    }
    if (updatedDetails.status) {
      currentTask.status = updatedDetails.status;
    }
    await currentTask.save();
    const tasks = await task.find();
    res.status(200).json({
      success: true,
      tasks,
      message: "Task updated successfully",
    });
  } catch (err) {
    console.log("Error updating task:", err);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: err.message,
    });
  }
};

export const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletingTask = await task.findById(id);
    await deletingTask.deleteOne();
    res.status(200).json({
      success: true,
      message: "task removed",
    });
  } catch (err) {
    console.log("Error deleting task:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: err.message,
    });
  }
};
