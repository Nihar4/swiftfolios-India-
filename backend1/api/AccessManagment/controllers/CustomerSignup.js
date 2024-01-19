const { CustomerValidation } = require("../services/CustomerValidation")
const { isEmpty, validateEmail, checkLength, validatePhoneNumber, validatePan } = require("../../../utils/Validation");
const { CustomerGenerateOtp } = require("../services/CustomerGenerateOtp");
const { CustomerValidateOtp } = require("../services/CustomerValidateOtp");
const { LoginOTPEmail } = require("../../../utils/Templetes/LoginOtpEmail");
const { SendEmail } = require("../../../utils/SendEmail");
const { InsertUserData } = require("../services/insertUserData");
const S3 = require('aws-sdk/clients/s3')

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

const SignupValidationController = async (req, res, next) => {
  const { type, value } = req.body;

  if (type == "email" && !validateEmail(value)) {
    return res.json({ error: true, message: "Enter Valid Email" })
  }
  if (type == "number" && !validatePhoneNumber(value)) {
    return res.json({ error: true, message: "Enter Valid MobileNumber" })
  }
  if (type == "pan" && !validatePan(value)) {
    return res.json({ error: true, message: "Enter Valid PanNumber" })
  }

  const idColumnName = type == "email" ? "primaryemail" : type == "number" ? "mobile" : "pan"

  try {
    const data = await CustomerValidation(value, idColumnName);
    if (checkLength(data, 0)) {
      return res.json({ error: false, message: `${type} is validated` });
    }
    else {
      return res.json({ error: true, message: `${type} is already registered` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error });
  }
}

const GenerateOtpController = async (req, res, next) => {
  const { type, value } = req.body;
  const otp = Math.floor(Math.random() * 900000) + 100000;

  if (type == "email" && !validateEmail(value)) {
    return res.json({ error: true, message: "Enter Valid Email" })
  }
  if (type == "number" && !validatePhoneNumber(value)) {
    return res.json({ error: true, message: "Enter Valid MobileNumber" })
  }

  const table = type == "email" ? "frontend_emailotp" : "frontend_mobileotp";
  const idColumnName = type == "email" ? "email" : "mobileNo";
  const idColumnName2 = type == "email" ? "otp" : "OTP";

  if (type == "email") {
    const subject = `${otp} is your Swiftfolios OTP`
    const html = LoginOTPEmail(otp);
    const to = value
    SendEmail({ to, subject, html });
  }
  else {
    // TODO :- ADD API FOR SEND OTP
  }

  try {
    await CustomerGenerateOtp(value, otp, table, idColumnName, idColumnName2);
    return res.json({ error: false, message: 'OTP Generated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error });
  }
};

const ValidateOtpController = async (req, res, next) => {
  const { type, value, otp } = req.body;

  if (type == "email" && !validateEmail(value)) {
    return res.json({ error: true, message: "Enter Valid Email" })
  }
  if (type == "number" && !validatePhoneNumber(value)) {
    return res.json({ error: true, message: "Enter Valid MobileNumber" })
  }
  if (!checkLength(otp, 6))
    return res.json({ error: true, message: "OTP should be 6 length" });

  const table = type == "email" ? "frontend_emailotp" : "frontend_mobileotp";
  const idColumnName = type == "email" ? "email" : "mobileNo";

  try {
    const data = await CustomerValidateOtp(value, otp, table, idColumnName);
    console.log(data);
    if (data.length > 0 && (data[0].otp === otp || data[0].OTP === otp)) {
      return res.json({ error: false, message: 'OTP Valid' });
    } else {
      return res.json({ error: true, message: 'OTP is incorrect' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error });
  }
};

const CreateUserAccountController = async (req, res, next) => {
  const userData = req.body;
  const file = req.file;

  console.log(userData, file)
  if (!file) {
    return res.status(200).json({ error: true, message: 'No file uploaded.' });
  }

  const filename = `${Date.now().toString().substr(0, 11)}${Math.random().toString(36).substr(2, 2)}`;
  const fileExtension = file.originalname.split('.').pop();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: process.env.AWS_BUCKET_FILE_PATH + '/' + filename + '.' + fileExtension,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    userData.pan_image = uploadResult.Location;
    await InsertUserData(userData);

    return res.json({ error: false, message: 'User account created successfully.', imageUrl: uploadResult.Location });
  } catch (error) {
    return res.status(500).json({ error: true, message: error });
  }
};

module.exports = { SignupValidationController, CreateUserAccountController, GenerateOtpController, ValidateOtpController };
