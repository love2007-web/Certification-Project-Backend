const mongoose = require("mongoose");
const { isValidEmail } = require("validator")

const Userschema = new mongoose.Schema({
    FirstName: {
        type: String, require: [true, "FirstName is Required"]
    },
    LastName: {
        type: String, require: [true, "LastName is Required"]
    },
    Email: {
        type: String,
        require: [true, "Email is Required"],
        unqiue: [true, "Email already in use"]
      },
      Password: {
        type: String,
        require: true,
        minlength: [6, "Password must not be less than 6 characters"],
      },
      ConfirmPassword: {
        type: String,
        require: true,
        minlength: [6, "Password must not be less than 6 characters"],
      },
},{timestamps: true});

let userModel = mongoose.model("UserModel", Userschema);

module.exports = userModel;