import { Request, Response } from 'express';
import Category from '../models/category-model';
import { ICategory } from '../types';
import { AuthRequest } from '../middleware';



const getAllCategories = async (request: AuthRequest, response: Response) => {
    try {
        const {user} = request;
        const categories = await Category.find({
            user: user
        });
        
        return response.send(categories);
    } catch (error) {
        console.log("Error fetching categories", error);
        response.status(500).send({message: "Error creating category"});
        throw error;
    }
}


const createCategory = async (request: AuthRequest, response: Response) => {
    try {
        const { name, icon, color, isEditable}: ICategory = request.body
        const {user}  = request;
        const category = await Category.create(
            { 
                name, 
                icon, 
                color, 
                isEditable,
                user
            })
            response.status(200).send(category);

    } catch (error) {
        console.log("Error creating category", error);
        response.status(500).send({message: "Error creating category"});
        throw error;
    }
}


const deleteCategory = async (
    request: AuthRequest, 
    response: Response) => {
        try {
            const {id} = request.params;
            await Category.deleteMany({_id: id});   
            response.status(200).send({message: "Category deleted successfully"});
        } catch (error) {
            console.log("Error deleting category", error);
            response.status(500).send({message: "Error deleting category"});
            throw error;
        }
}

const updateCategory = async (request: AuthRequest, response: Response) => {
    try {
        const {_id,name,isEditable,color,icon}: ICategory = request.body;
        await Category.updateOne(
            {_id}, 
            {name,isEditable,color,icon});
        response.status(200).send({message: "Category updated successfully"});
    } catch (error) {
        response.status(500).send({message: "Error updating category"});
    }
}

const getCategoryById = async (
    request: AuthRequest,
    response: Response
  ) => {
    try {
      const { user } = request
      const { id } = request.params
      const category = await Category.findOne({
        user: user,
        _id: id,
      })
      return response.send(category)
    } catch (error) {
      response.send({ error: "Something went wrong" })
      console.log("error in getAllCategories", error)
      throw error
    }
  }



export { 
    getAllCategories, 
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryById
 }