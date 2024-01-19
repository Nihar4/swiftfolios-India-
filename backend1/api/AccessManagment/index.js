const AccessManagment = require("express").Router()
const { singleUpload } = require("../../middlewares/multer")
const { SignupValidationController, GenerateOtpController, ValidateOtpController, CreateUserAccountController } = require("./controllers/CustomerSignup")

AccessManagment.post("/signup/validation", SignupValidationController)
AccessManagment.post("/signup/create", singleUpload, CreateUserAccountController)
AccessManagment.post("/generate-otp", GenerateOtpController)
AccessManagment.post("/validate-otp", ValidateOtpController)



exports.AccessManagment = AccessManagment;