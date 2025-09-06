import mongoose, {Schema} from "mongoose";


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    level: {
        type: String,
        enum: ["Begineer", "Intermediate", "Advanced"],
        default: "Begineer"
    },
    duration: {
        type: String
    },
    provider: {
        type: String
    },
    link: {
        type: String
    }
},
{
    timestamps: true
}
)

export const Course = mongoose.model("Course", courseSchema)