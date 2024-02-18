const express = require("express");
const router = express.Router();
const validator = require("express-joi-validation").createValidator({});
const upload = require("../Helpers/multer");
const { authenticateToken } = require("../Helpers/jwt_auth");
const GlobalContactController = require("../Controller/GlobalContactController");

/**
 * @swagger
 * '/global/upload-contacts':
 *  post:
 *     security:
 *     - BearerAuth: []
 *     tags:
 *     - Global Database
 *     summary: Upload contacts
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - contactcsv
 *            properties:
 *              contactcsv:
 *                type: string
 *                format: binary
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
 *     securitySchemes:
 *       BearerAuth:  # Define the security scheme
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT  # Specify the bearer format if applicable (e.g., JWT)
 */
router.post(
  "/upload-contacts",
  upload.single("contactcsv"),
  authenticateToken,
  GlobalContactController.UploadContacts
);

/**
 * @swagger
 * '/global/report-spam':
 *  post:
 *     security:
 *     - BearerAuth: []
 *     tags:
 *     - Global Database
 *     summary: Report Spam
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              userId:
 *                type: number
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              userId:
 *                type: number
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
 *     securitySchemes:
 *       BearerAuth:  # Define the security scheme
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT  # Specify the bearer format if applicable (e.g., JWT)
 */
router.post(
  "/report-spam",
  authenticateToken,
  GlobalContactController.ReportSpam
);

/**
 * @swagger
 * '/global/search/{searchStr}':
 *  get:
 *     security:
 *     - BearerAuth: []
 *     tags:
 *     - Global Database
 *     summary: Search user globally
 *     parameters:
 *       - name: searchStr
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     content:
 *       application/x-www-form-urlencoded:
 *         schema:
 *           type: object
 *           required:
 *           properties:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *           properties:
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
 *     securitySchemes:
 *       BearerAuth:  # Define the security scheme
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT  # Specify the bearer format if applicable (e.g., JWT)
 */
router.get(
  "/search/:searchStr",
  authenticateToken,
  GlobalContactController.Search
);

/**
 * @swagger
 * '/global/get-user-by-id/{id}':
 *  get:
 *     security:
 *     - BearerAuth: []
 *     tags:
 *     - Global Database
 *     summary: Get User by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     content:
 *       application/x-www-form-urlencoded:
 *         schema:
 *           type: object
 *           required:
 *           properties:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *           properties:
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
 *     securitySchemes:
 *       BearerAuth:  # Define the security scheme
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT  # Specify the bearer format if applicable (e.g., JWT)
 */
router.get(
  "/get-user-by-id/:id",
  authenticateToken,
  GlobalContactController.GetUserById
);

module.exports = router;
