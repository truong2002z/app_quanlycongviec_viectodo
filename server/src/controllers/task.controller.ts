import {Request, Response } from "express";
import { AuthRequest } from "../middleware";
import { ITask } from "../types";
import Task from "../models/task-model";




const getAllTasks = async (request: AuthRequest, response: Response) => {
    try {
        const userId = request.user;
        const tasks = await Task.find({
            user: userId,
        });
        
        return response.send(tasks);
    } catch (error) {
        console.log("Error fetching categories", error);
        response.status(500).send({message: "Error creating category"});
        throw error;
    }
}


const getAllTasksunfinished= async (request: AuthRequest, response: Response) => {
  try {
      const userId = request.user;
      const tasks = await Task.find({
          user: userId,
          isCompleted: false
      });
      
      return response.send(tasks);
  } catch (error) {
      console.log("Error fetching categories", error);
      response.status(500).send({message: "Error creating category"});
      throw error;
  }
}

const createTask = async (request: AuthRequest, response: Response) => {
    try {
        const {name,date,categoryId,description}: ITask= request.body
        const task = await Task.create(
            {
                name,
                date,
                categoryId,
                description,
                user: request.user,
            }
        )
        response.status(200).send(task);
    } catch (error) {
        console.log("Error creating task", error);
        response.status(500).send({message: "Error creating task"});
        
    }
}

const toggleTaskStatus = async (request: AuthRequest, response: Response) => {

    try {
        const {isCompleted} = request.body;
        const {id} = request.params;
        const task = await Task.findOneAndUpdate(
            {_id: id},
            {isCompleted},
        )
        response.status(200).send(task);
    } catch (error) {
        response.status(500).send({message: "Error updating task"});
    }
}

const getAllTaskbyCategory = async (request: AuthRequest, response: Response) => {
    try {
        const {id} = request.params;
        const tasks = await Task.find({
            categoryId: id,
            user: request.user
        }); 
        response.status(200).send(tasks);
    } catch (error) {
        console.log("Error fetching tasks", error);
        response.status(500).send({message: "Error fetching tasks"});
        
    }
}

const getAllTaskCompleted = async (request: AuthRequest, response: Response) => {
    try {
        const tasks = await Task.find({ 
            isCompleted: true, 
            user: request.user 
        });
        response.status(200).send(tasks);
    } catch (error) {
        response.status(500).send({message: "Error fetching tasks"});
    }
}

const getTasksForToday = async (
    request: AuthRequest,
    response: Response
  ) => {
    try {
      const userId = request.user
      const todaysISODate = new Date()
      todaysISODate.setHours(0, 0, 0, 0)
      const tasks = await Task.find({
        user: userId,
        date: todaysISODate.toISOString(),
      })
      response.send(tasks)
    } catch (error) {
      console.log("error in getTasksForToday", error)
      response.send({ error: "Error while fetching tasks" })
      throw error
    }
  }

const deleteTask = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params
      await Task.deleteOne({
        _id: id,
      })
      response.send({ message: "Task deleted" })
    } catch (error) {
      console.log("error in deleteTask", error)
      response.send({ error: "Error while deleting task" })
      throw error
    }
  }

const editTask = async (request: AuthRequest, response: Response) => {
    try {
      const { _id, categoryId, date, name,description }: ITask = request.body
      await Task.updateOne(
        {
          _id,
        },
        {
          $set: {
            name,
            categoryId,
            date,
            description
          },
        }
      )
      response.send({ message: "Task updated successfully" })
    } catch (error) {
      console.log("error in editTask", error)
      response.send({ error: " Error while updating the task" })
      throw error
    }
  }
  




export { 
    getAllTasks,
    createTask,
    toggleTaskStatus, 
    getAllTaskbyCategory, 
    getAllTaskCompleted, 
    getTasksForToday,
    deleteTask,
    editTask,
    getAllTasksunfinished
};