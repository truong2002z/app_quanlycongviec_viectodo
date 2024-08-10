import mongoose from "mongoose"


const taskSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    name: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true,
    },
    description:{
      type: String,
      required: false,
    },
  },{
    timestamps: true,
  }
)

const Task = mongoose.model("Task", taskSchema);

export default Task;