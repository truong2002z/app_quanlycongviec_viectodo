import express, { RequestHandler } from "express";
import { createCategory, getAllCategories,deleteCategory, updateCategory, getCategoryById } from "../controllers/category.controller";
import { authenticationMiddleware } from "../middleware"

const categoryRoutes = express.Router(); 

categoryRoutes.use(authenticationMiddleware as any )

categoryRoutes.route('/').get(getAllCategories as any )
categoryRoutes.route('/create').post(createCategory as any )
categoryRoutes.route('/delete/:id').delete(deleteCategory as any )
categoryRoutes.route('/update').put(updateCategory as any)
categoryRoutes.route("/:id").get(getCategoryById as any)




export default categoryRoutes;


