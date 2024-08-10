
import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
   const connecttion = await mongoose.connect("mongodb+srv://codetoanbugx99:LpxcPU939yRBFG68@internship.vonpzuz.mongodb.net/internship?retryWrites=true&w=majority&appName=Internship");
    if(connecttion) {
      console.log("Connected to database")
    }
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}

export default connectToDatabase;