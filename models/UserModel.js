const mongoose = require("mongoose");
const crypto = require("crypto");
const UserModelName = "User";

const Schema = mongoose.Schema;

let User = new Schema(
  {
    title: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dyp0k8avo/image/upload/v1704997809/WhatsApp_Image_2024-01-11_at_10.27.49_AM_rudqst.jpg",
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    statusId: {
      type: String,
    },
    practitionerSpecialty: {
      type: String,
      default: "",
    },
    practitionerGroup: {
      type: String,
      default: "",
    },
    primaryPracticeName: {
      type: String,
      default: "",
    },
    registrationNumber: {
      type: String,
      default: "",
    },
/*    secretaryName: {
      type: String,
      default: "",
    },
        secretaryTelephone: {
      type: String,
      default: "",
    },
      secretaryEmail: {
      type: String,
      default: "",
    }, */
    street: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    postcode: {
      type: String,
      default: "",
    },
    landline: {
      type: String,
      default: "",
    },
    townCity: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "consultant",
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    collection: UserModelName,
  }
);

User.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

User.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model(UserModelName, User);
