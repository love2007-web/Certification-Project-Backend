const UserModel = require("../Models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CompanyModel = require("../Models/CompanyModels")
const {sendMail, SendOtp} = require("../Config/mailer");

let genRandomNum = ()=> {
    let six = ''
  
    for (let index = 0; index < 6; index++) {
        let randomNum = Math.floor(Math.random() * 10)
        six += randomNum  
      
  }
  return six
   }

//    FUNCTION FOR USER SIGN UP

const signUp = async (req, res, next) => {
    const {FirstName, LastName, Email, Password, ConfirmPassword, } = req.body;

    if(!FirstName || !LastName || !Email || !Password || !ConfirmPassword) {
        res.status(400);
        return next(new Error("All Field Are Mandandory"));
    }
    const ValidateUser = await UserModel.findOne({ Email });
    if (ValidateUser){
        res.status(403).send({ message: "User Already Exist, Try Logging In To Your Account"});
    }else{
        try {
           const hashPassword = await bcrypt.hash(Password, 12);
           const createUser = await UserModel.create({
            FirstName,
            LastName,
            Email,
            Password: hashPassword,
            ConfirmPassword: hashPassword
           });

           if (createUser){
           sendMail(FirstName,Email)
              res.status(200).send({  message: `Account created successfully for ${createUser.FirstName}`, status : "success"});
           }else{
            res.status.send({ message: "User Already Exist Try Logging In To Your Account"});
           }
        } catch (error) {
            console.log("Error", error);
        }
    }
};
  
  
//    FUNCTION FOR USER LOGIN DETAILS
const Login = async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      res.status(404).send({ message: "All Fields are mandatory" });
      return;
    } else {
      try {
        const validateUser = await UserModel.findOne({ Email });
        if (validateUser) {
          const comparePassword = await bcrypt.compare(
            Password,
            validateUser.Password
          );
  
          // Generate JWT token

          // Use a secure secret key
          let SecretKey = process.env.JWT_SECRET;
          const generateToken = jwt.sign(
            {
              user: {
                FullName: validateUser.FullName,
                Email: validateUser.Email
              },
            },
            // Use a secure secret key
            SecretKey,
            { expiresIn: "1d" } // Token expiration time
          );
  
          if (comparePassword) {
            res.status(200).send({ message: `Welcome ${validateUser.FirstName}` , generateToken, status : "success"}); 
          } else {
            res.status(403).send({ message: "Password does not match" });
          }
        } else {
          res.status(403).send({
            message: "Invalid Email, User not found, Try creating an account",
          });
        }
      } catch (error) {
        res.status(403).send({ message: "Internal Server error", error });
      }
    }
  }

  // FUNCTION TO GETCURRENTUSER
  const getCurrentUser = async (req, res) =>{
    const user = req.user;
    try {
      const fetchCurrentUser =  await userModel.findOne({ Email: user.Email});
         if (fetchCurrentUser){
          const userDetails = {
            FullName: fetchCurrentUser.FirstName,
            Email: fetchCurrentUser.Email,
          };
          res.status(200).send({message: "User userDetails", userDetails});
         }
       
    } catch (error) {
      res.status(500).send({message : "Internal Server Error"})
      
    }
  };
  // FUNCTION TO GETOTP

  const getOtp = async(req,res)=> {
    const {Email} = req.body
    if (!Email){
        res.status(400).send({message:"email is mandatory"})
    }else{
        try {
        const validateEmail = await userModel.findOne({Email})
        if(!validateEmail){
            res.status(400).send({message:"User doesnt exist"})  
        }else{
          let otp = genRandomNum()
        SendOtp( otp , validateEmail.FirstName , Email )
        res.status(200).send({message:"Your OTP has been sent Successfully"}) 
        }
         
        } catch (error) {
            res.status(500).send({message:"internal server error"})  
            console.log(error);
        }
    }
  }

  // FUNCTION FOR COMPANY SIGNUP
  
  const companysignUp = async (req, res, next) => {
    const { CompanyName, Email, Location, Password  } = req.body;

    if (!CompanyName || !Email || !Location || !Password) {
        res.status(400);
        return next(new Error("All fields are mandatory"));
    }
    console.log(Email)
    const validateCompany = await CompanyModel.findOne({Email});
    console.log(validateCompany)
   
    if (validateCompany) {
      return  res.status(409).send({ message: "Company already exists. Please log in to your account." });
    }  
        try {
            const hashPassword = await bcrypt.hash(Password, 12);
            const createCompany = await CompanyModel.create({
                CompanyName : CompanyName,
                Email : Email,
                Location : Location,
                Password  : hashPassword
            });

            if (createCompany) {
                // Assuming sendMail function is defined elsewhere
                sendMail(CompanyName, Email);
                res.status(200).send({ message: `Account created successfully for ${CompanyName}`, status: "success" });
            } else {
                res.status(500).send({ message: "Error creating company account." });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({ message: "Internal server error." });
        }
    
};

//    FUNCTION FOR COMPANY LOGIN DETAILS
const companylogin = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400).send({ message: "All fields are mandatory" });
    return;
  } else {
    try {
      const validateCompany = await CompanyModel.findOne({ Email });
      if (validateCompany) {
        const comparePassword = await bcrypt.compare(Password, validateCompany.Password);

        if (comparePassword) {
          // Generate JWT token
          const SecretKey = process.env.JWT_SECRET;
          const generateToken = jwt.sign(
            {
              company: {
                CompanyName: validateCompany.CompanyName,
                Email: validateCompany.Email,
                Location: validateCompany.Location
              },
            },
            SecretKey,
            { expiresIn: "1d" }
          );

          res.status(200).send({ message: `Welcome ${validateCompany.CompanyName}`, token: generateToken, status: "success" });
        } else {
          res.status(403).send({ message: "Password does not match" });
        }
      } else {
        res.status(404).send({ message: "Invalid Email, Company not found. Please sign up for an account." });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
}


 
  module.exports = {signUp, Login, getCurrentUser, getOtp, companysignUp, companylogin};