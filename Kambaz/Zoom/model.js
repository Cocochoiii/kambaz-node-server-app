import mongoose from "mongoose";
import { ZoomMeetingSchema, PersonalRoomSchema, RecordingSchema } from "./schema.js";

export const ZoomMeetingModel = mongoose.model("ZoomMeetingModel", ZoomMeetingSchema);
export const PersonalRoomModel = mongoose.model("PersonalRoomModel", PersonalRoomSchema);
export const RecordingModel = mongoose.model("RecordingModel", RecordingSchema);
