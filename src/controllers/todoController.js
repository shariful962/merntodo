import Todo from "../models/todoModel.js";

// Add new todo
export const addTodo = async (req, res) => {
  try {
    const { text, category, priority } = req.body;
    // validation
    if (!text) {
      return res.status(400).json({
        msg: "Text is required",
      });
    }
    //add todo
    const newTodo = await Todo.create({
      text,
      category,
      priority,
      user: req.user.id,
    });
    // save todo
    await newTodo.save();
    return res.status(201).json({
      msg: "Todo added successfully",
      todo: newTodo,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};
// Get all todos
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).select("-user -__v");
    return res.status(200).json({
      total_task: todos.length,
      complete_task: todos.filter((todo) => todo.isCompleted).length,
      pending_task: todos.filter((todo) => !todo.isCompleted).length,
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};
// Update todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, category, priority } = req.body;
    const updateTodo = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      { text, category, priority },
      { new: true, runValidators: true },
    );
    // validation
    if (!updateTodo) {
      return res.status(404).json({
        msg: "Todo not found",
      });
    }
    return res.status(200).json({
      msg: "Todo updated successfully",
      todo: updateTodo,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};

// toggle complete
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({
        msg: "Todo not found",
      });
    }
    todo.isCompleted = !todo.isCompleted;
    await todo.save();
    return res.status(200).json({
      msg: `Todo ${todo.isCompleted ? "completed" : "pending"} successfully`,
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};
// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!todo) {
      return res.status(404).json({
        msg: "Todo not found",
      });
    }
    return res.status(200).json({
      msg: "Todo deleted successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};
