import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    lastLogin: { type: Date },
    agree: { type: Boolean, default: false },
    phone: { type: String },
    plocation: { type: mongoose.Schema.Types.Mixed, default: [] },
    ptype: { type: mongoose.Schema.Types.Mixed, default: [] },
    ppaymenttype: { type: mongoose.Schema.Types.Mixed, default: [] },
    pprice: { type: mongoose.Schema.Types.Mixed, default: [] },
    pinventory: { type: mongoose.Schema.Types.Mixed, default: [] },
    pstockin: { type: mongoose.Schema.Types.Mixed, default: [] },
    pcustomer: { type: mongoose.Schema.Types.Mixed, default: [] },
    pbreakage: { type: mongoose.Schema.Types.Mixed, default: [] },
    pitemstatus: { type: mongoose.Schema.Types.Mixed, default: [] },
    pmorbi: { type: mongoose.Schema.Types.Mixed, default: [] },
    pquotation: { type: mongoose.Schema.Types.Mixed, default: [] },
    ppermission: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

