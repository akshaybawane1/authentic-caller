const express = require("express");
const UserValidationSchema = require("../Helpers/Validations/UserValidationSchema");
const AuthController = require("../Controller/AuthController");
const router = express.Router();
const validator = require("express-joi-validation").createValidator({});

/**
 * @swagger
 * '/auth/register':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Register
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - phone
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - phone
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.post(
  "/register",
  validator.body(UserValidationSchema.RegisterUserSchema),
  AuthController.register
);

/**
 * @swagger
 * '/auth/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.post(
  "/login",
  validator.body(UserValidationSchema.loginSchema),
  AuthController.login
);

/**
 * @swagger
 * '/auth/send-otp':
 *  post:
 *     tags:
 *     - Auth
 *     summary: send otp
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *                description: SMS is not integrated so currently it won't work
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */
router.post(
  "/send-otp",
  validator.body(UserValidationSchema.sendOtpSchema),
  AuthController.sendOtp
);

/**
 * @swagger
 * '/auth/verify-otp':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Verify otp
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            required:
 *              - otp
 *            properties:
 *              otp:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - otp
 *            properties:
 *              otp:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */
router.post(
  "/verify-otp",
  validator.body(UserValidationSchema.verifyOtpSchema),
  AuthController.verifyOtp
);

/**
 * @swagger
 * '/auth/reset-password':
 *  put:
 *     tags:
 *     - Auth
 *     summary: Reset Password
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.put(
  "/reset-password",
  validator.body(UserValidationSchema.loginSchema),
  AuthController.resetPassword
);

module.exports = router;
