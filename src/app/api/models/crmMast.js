import * as mongoose from "mongoose";

const crmClientSchema = new mongoose.Schema(
  {
    cid: { type: String, require: false },
    name: { type: String, require: false },
    email: { type: String, require: false },
    mobile: { type: String, require: false },
    companyname: { type: String, require: false },
    billingaddress: { type: String, require: false },
    shippingaddress: { type: String, require: false },
    querytype: { type: String, require: false }, // price, Product Inquire, buy
    leadtype: { type: String, require: false }, // hot , warm , cold
    remarks: { type: String, require: false },
    salesperson: { type: String, require: false }, // sale person
    nextfollowdate: { type: String, require: false }, // date
    protentialvalue: { type: String, require: false }, // 5000, 10000,20000, 100000
    referencetype: { type: String, require: false }, // ref
    status: { type: String, require: false }, // intial, poposal, negotiation, close won , close lost
    // followupstage: { type: String, require: false }, // intial, poposal, negotiation
    nextfollowtime: { type: String, require: false }, // time
    followupType: { type: String, require: false }, // call , whatapp, email
    followupremarks: { type: [], require: false }, // follow up remarks
    closingtype: { type: String, require: false }, // closing type
    closingremarks: { type: String, require: false }, // closing remarks
    closingamount: { type: String, require: false }, // closing amount
    lastcontact: { type: String, require: false }, // last contact / update
    parent: { type: String, require: false },
  },
  { timestamps: true }
);

export default mongoose.models.crmclientmast ||
  mongoose.model("crmclientmast", crmClientSchema);
