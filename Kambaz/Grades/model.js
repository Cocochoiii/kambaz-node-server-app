import mongoose from "mongoose";
import { gradeSchema, categorySchema } from "./schema.js";

const gradeModel = mongoose.model("GradeModel", gradeSchema);
const categoryModel = mongoose.model("GradeCategoryModel", categorySchema);

export { gradeModel, categoryModel };
