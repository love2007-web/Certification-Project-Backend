const mongoose = require('mongoose');
const { isValidEmail } = require("validator")

// Define the schema for the company
const CompanySchema = new mongoose.Schema({
    CompanyName: {
        type: String, require: [true, "CompanyName is Required"]

    },
    Email: {
        type: String,
        require: [true, "Email is Required"],
        unqiue: [true, "Email already in use"]
      },
    Location: {
        type: String,
        required: true 
    },
    // PostalCode: {
    //     type: String,
        
    // },
    Password: {
        type: String,
        required: true,
        minlength: [10, "Password must not be less than 6 characters"],

    },
  
},{timestamps: true});

// Create the model for the company
let companyModel = mongoose.model('CompanyModel', CompanySchema);

module.exports = companyModel;
