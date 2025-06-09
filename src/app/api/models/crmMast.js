import * as mongoose from "mongoose";

const crmClientSchema = new mongoose.Schema(
  {
    oid: { type: String, require: false },
    date: { type: String, require: false },
    name: { type: String, require: false },
    email: { type: String, require: false },
    mobile: { type: String, require: false },
    companyname: { type: String, require: false },
    querytype: { type: String, require: false }, // price, Product Inquire, buy
    remarks: { type: String, require: false },
    leadtype: { type: String, require: false }, // hot , warm , cold
    salesperson: { type: String, require: false }, // sale person
    parent: { type: String, require: false },
    referencetype: { type: String, require: false }, // ref
    protentialvalue: { type: String, require: false }, // 5000, 10000,20000, 100000
    nextfollowdate: { type: String, require: false }, // date
    nextfollowtime: { type: String, require: false }, // time
    followupstage: { type: String, require: false }, // intial, poposal, negotiation
    followupType: { type: String, require: false }, // call , whatapp, email
    lastcontact: { type: String, require: false },
    status: { type: String, require: false }, // Open, Close
  },
  { timestamps: true }
);

export default mongoose.models.crmclientmast ||
  mongoose.model("crmclientmast", crmClientSchema);
