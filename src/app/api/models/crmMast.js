import * as mongoose from "mongoose";

const crmClientSchema = new mongoose.Schema(
  {
    oid: { type: String, require: false },
    date:{ type: String, require: false },
    name: { type: String, require: false },
    email: { type: String, require: false },
    mobile: { type: String, require: false },
    companyname: { type: String, require: false },
    querytype: { type: String, require: false },
    remarks: { type: String, require: false },
    leadtype: { type: String, require: false },
    salesperson: { type: String, require: false },
    parent: { type: String, require: false },
    referencetype: { type: String, require: false },
    protentialvalue: { type: String, require: false },
    nextfollowdate: { type: String, require: false },
    followupstage: { type: String, require: false },
    lastcontact: { type: String, require: false },
    status: { type: String, require: false },
  },
  { timestamps: true }
);

export default mongoose.models.crmclientmast   ||
  mongoose.model("crmclientmast", crmClientSchema);
