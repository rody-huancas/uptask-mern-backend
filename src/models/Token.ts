import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: string;
  createdAt: string;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "10min",
  },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
