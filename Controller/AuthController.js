const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const CreateError = require("../Helpers/CreateError");
const { generateAccessToken } = require("../Helpers/jwt_auth");
const { where } = require("sequelize");
const GlobalContact = require("../Models/GlobalContact");
const Otp = require("../Models/Otp");
const { sendEmail } = require("../Helpers/mail_helper");
require("dotenv").config();

/**
 * Register new user
 * @param name
 * @param email
 * @param phone
 * @param password
 */
const register = asyncHandler(async (req, res, next) => {
  try {
    let user = req.body;
    //   check if registered user exists
    const existingUser = await GlobalContact.findOne({
      where: { phone: user.phone, isRegistered: true },
    });

    if (existingUser) {
      return next(
        new CreateError("User with this phone number already registered", 409)
      );
    }

    //Create hashed password
    encryptedPassword = await bcrypt.hash(user.password, 10);
    user.password = encryptedPassword;
    user.isRegistered = true;
    //Create User
    const newGlobalUser = await GlobalContact.create(user);
    delete user["password"];
    //send response with token
    let token = await generateAccessToken(user);
    res.send({ status: true, data: user, token });
  } catch (error) {
    return next(error);
  }
});

/**
 * Login with registered user
 * @param email
 * @param phone
 * @param password
 * either email or phone is required to proceed
 */
const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    if (!email & !phone) {
      return next(new CreateError("Please provide email or phone", 401));
    }
    let existingUser = "";
    if (email) {
      existingUser = await GlobalContact.findOne({
        where: { email: email, isRegistered: true },
      });
    }
    if (phone) {
      existingUser = await GlobalContact.findOne({
        where: { phone: phone, isRegistered: true },
      });
    }

    if (existingUser) {
      let passCheck = await bcrypt.compare(password, existingUser.password);
      if (passCheck) {
        let userData = { ...existingUser };
        delete userData["password"];
        let token = await generateAccessToken(userData);
        return res.send({ status: true, token: token });
      } else {
        throw new CreateError("Password is incorrect", 401);
      }
    } else {
      return next(new CreateError("User does not exists", 404));
    }
  } catch (error) {
    return next(error);
  }
});

/**
 * Send otp to reset password of registered user
 * @param email
 * @param phone
 * either email or phone is required to proceed
 */
const sendOtp = asyncHandler(async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    if (!email & !phone) {
      return next(new CreateError("Please provide email or phone", 400));
    }

    let existingUser = "";
    if (email) {
      existingUser = await GlobalContact.findOne({
        where: { email: email, isRegistered: true },
      });
    }
    if (phone) {
      existingUser = await GlobalContact.findOne({
        where: { phone: phone, isRegistered: true },
      });
    }

    if (existingUser) {
      let otpObj = {};
      if (email) {
        otpObj.email = email;
      }
      if (phone) {
        otpObj.phone = phone;
      }
      let otp = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      otpObj.otp = otp;

      const oldOtp = await Otp.findOne({
        where: { email },
      });

      if (oldOtp) {
        await oldOtp.destroy();
      }

      const newOtp = await Otp.create(otpObj);
      let mailContent = `Dear user, Your otp to reset password is ${otp}`;

      if (email) {
        //Send otp to email
        let smtpUrl = "smtp.gmail.com";
        let port = 587;
        let secure = false;
        let username = process.env.EMAIL_USERNAME;
        let password = process.env.EMAIL_PASSWORD;
        let mailTo = email;
        let mailSubject = "Reset Password";

        const mailResponse = await sendEmail(
          mailTo,
          mailSubject,
          mailContent,
          smtpUrl,
          port,
          secure,
          username,
          password
        );
      }

      if (phone) {
        //Send otp to phone (currently haven't integrated sms so it won't work)
        return res.send({ status: true, message: "Otp sent successfully" });
      }
    } else {
      return next(new CreateError("User does not exists", 404));
    }

    res.send({ status: true, message: "Otp sent successfully" });
  } catch (error) {
    return next(error);
  }
});

/**
 * Verify otp to reset password of registered user
 * @param email
 * @param phone
 * @param otp
 * either email or phone is required to proceed
 */
const verifyOtp = asyncHandler(async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;

    if (!email & !phone) {
      return next(new CreateError("Please provide email or phone", 400));
    }

    let otpObj = {};
    if (email) {
      otpObj.email = email;
    }
    if (phone) {
      otpObj.phone = phone;
    }
    const existingOtp = await Otp.findOne({
      where: otpObj,
      order: [["createdAt", "DESC"]],
    });

    if (existingOtp) {
      if (Number(existingOtp.otp) == Number(otp)) {
        res.send({ status: true, data: "OTP verified successfully." });
        await existingOtp.destroy();
      } else {
        return next(new CreateError("Incorrect code, Please re-enter.", 401));
      }
    } else {
      return next(new CreateError("Please send otp first.", 404));
    }
  } catch (error) {
    return next(error);
  }
});

/**
 * Reset password of registered user
 * @param email
 * @param phone
 * @param password
 * either email or phone is required to proceed
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    if (!email & !phone) {
      return next(new CreateError("Please provide email or phone", 401));
    }
    let existingUser = "";
    if (email) {
      existingUser = await GlobalContact.findOne({
        where: { email: email, isRegistered: true },
      });
    }
    if (phone) {
      existingUser = await GlobalContact.findOne({
        where: { phone: phone, isRegistered: true },
      });
    }

    if (existingUser) {
      //check old password match with new password
      let passCheck = await bcrypt.compare(password, existingUser.password);
      if (passCheck) {
        return next(new CreateError("Please set new password", 409));
      }
      //Create new hashed password
      encryptedPassword = await bcrypt.hash(password, 10);
      existingUser.password = encryptedPassword;
      await existingUser.save();
      res.send({ status: true, data: "Password successfully reset." });
    } else {
      return next(new CreateError("User does not exists", 404));
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = { register, login, sendOtp, verifyOtp, resetPassword };
