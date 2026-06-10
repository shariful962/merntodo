import User from "../models/userModel.js";
import Todo from "../models/todoModel.js";

// dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({
      completed: true,
    });
    const pendingTodos = await Todo.countDocuments({
      completed: false,
    });
    return res.status(200).json({
      total_users: totalUsers,
      total_tasks: totalTodos,
      completed_tasks: completedTodos,
      pending_tasks: pendingTodos,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// get all users with todos (complete,pending, total)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -otp -otpExpiry -resetToken -resetTokenExpiry -refreshToken -__v",
    );
    // user with stats
    const userWithStats = await Promise.all(
      users.map(async (user) => {
        const totalTodos = await Todo.countDocuments({ user: user._id });
        const completedTodos = await Todo.countDocuments({
          user: user._id,
          completed: true,
        });
        const pendingTodos = await Todo.countDocuments({
          user: user._id,
          completed: false,
        });
        return {
          ...user.toObject(),
          total_task: totalTodos,
          completed_task: completedTodos,
          pending_task: pendingTodos,
        };
      }),
    );
    return res.status(200).json({
      total_users: users.length,
      data: userWithStats,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// get single user with stats
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otp -otpExpiry -resetToken -resetTokenExpiry -refreshToken -__v",
    );
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    // user with stats
    const totalTodos = await Todo.countDocuments({ user: user._id });
    const completedTodos = await Todo.countDocuments({
      user: user._id,
      completed: true,
    });
    const pendingTodos = await Todo.countDocuments({
      user: user._id,
      completed: false,
    });
    return res.status(200).json({
      ...user.toObject(),
      total_task: totalTodos,
      completed_task: completedTodos,
      pending_task: pendingTodos,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// get all users with paginatin
export const getAllUsersWithPaginatin = async (req, res) => {
  try {
    //pagination params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // get paginated users
    const users = await User.find()
      .select(
        "-password -otp -otpExpiry -resetToken -resetTokenExpiry -refreshToken -__v",
      )
      .skip(skip)
      .limit(limit);
    // count total users
    const totalUsers = await User.countDocuments();

    // user with stats
    const userWithStats = await Promise.all(
      users.map(async (user) => {
        const totalTodos = await Todo.countDocuments({ user: user._id });
        const completedTodos = await Todo.countDocuments({
          user: user._id,
          completed: true,
        });
        const pendingTodos = await Todo.countDocuments({
          user: user._id,
          completed: false,
        });
        return {
          ...user.toObject(),
          total_task: totalTodos,
          completed_task: completedTodos,
          pending_task: pendingTodos,
        };
      }),
    );
    return res.status(200).json({
      total_users: totalUsers,
      current_page: page,
      total_pages: Math.ceil(totalUsers / limit),
      data: userWithStats,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // validation
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    // if user is admin
    if (user.role === "admin") {
      return res.status(400).json({
        msg: "Admin cannot be deleted",
      });
    }

    await Todo.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      msg: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || "Internal Server Error",
    });
  }
};
