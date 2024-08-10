import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isEditable: {
        type: Boolean,
        required: false,
        default: true
    },

    color:{
        id: String,
        name: String,
        code: String,
    },

    icon:{
        id: String,
        name: String,
        symbol: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
});


const Category = mongoose.model("Category", categorySchema);

export default Category;