import express from "express"
import {createTask, getAllTaskCompleted, getTasksForToday, getAllTaskbyCategory, getAllTasks, toggleTaskStatus, deleteTask, editTask, getAllTasksunfinished,} from "../controllers/task.controller"
import { authenticationMiddleware } from "../middleware"

const taskRoutes = express.Router()

taskRoutes.use(authenticationMiddleware as any)

taskRoutes.route("/").get(getAllTasks as any)
taskRoutes.route("/create").post(createTask as any)
taskRoutes.route("/update/:id").put(toggleTaskStatus as any)
taskRoutes.route("/tasks-by-category/:id").get(getAllTaskbyCategory as any)
taskRoutes.route("/tasks-completed").get(getAllTaskCompleted as any)
taskRoutes.route("/today").get(getTasksForToday as any)
taskRoutes.route("/delete/:id").delete(deleteTask as any)
taskRoutes.route("/editTask/:id").put(editTask as any)
taskRoutes.route("/unfinished").get(getAllTasksunfinished as any)


export default taskRoutes