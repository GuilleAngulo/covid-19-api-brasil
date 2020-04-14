const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const UserValidator = require('../validators/UserValidator');

router.post('/register', UserValidator.store, UserController.store);
router.post('/authenticate', UserValidator.authenticate, UserController.authenticate);
router.post('/forgot_password', UserValidator.forgotPassword, UserController.forgotPassword);
router.post('/reset_password', UserValidator.resetPassword, UserController.resetPassword);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * path:
 *  /users/register:
 *    post:
 *      tags: [Users]
 *      summary: Register User
 *      description: This resource **creates** an individual **user** in the system. The response includes a `token`, a requirement at *POST* or *PUT* requests to **Region** and **State** entities.
 *      operationId: createUser
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/UserRegister'
 *      responses:
 *        "200":
 *          description: Successful operation. User created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/UserResponse'
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "409":
 *          description: Conflict error. User already exists.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Conflict error. User already exists.
 *        "500":
 *          description: Internal Server Error. Registration failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Registration failed.
 *
 *  /users/authenticate:
 *    post:
 *      tags: [Users]
 *      summary: Authenticate User
 *      description: This resource **authenticates** a **user** stored in the system. The response includes a `token`, a requirement at *POST* or *PUT* requests to **Region** and **State** entities. 
 *      operationId: authenticateUser
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/UserAuthenticate'
 *      responses:
 *        "201":
 *          description: Successful operation. User created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/UserResponse'
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "401":
 *          description: Unauthorized. Invalid password.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Unauthorized. Invalid password.
 *        "404":
 *          description: User not found.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: User not found.
 *        "500":
 *          description: Internal Server Error. Authentication failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Authentication failed.
 * 
 *  /users/forgot_password:
 *    post:
 *      tags: [Users]
 *      summary: User Forgot Password
 *      description:  This resource **sends** an **email** *(to user´s registered email account)* with a temporary `token` *(10 mins)* to be used to change user´s password.  
 *      operationId: forgotPassword
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/UserForgotPassword'
 *      responses:
 *        "200":
 *          description: Successful operation. User created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/Success'
 *              example: 
 *                  message: Password recovery email sent successfully.
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "401":
 *          description: Unauthorized. Invalid password.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Unauthorized. Token invalid.
 *        "404":
 *          description: User not found. 
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: User not found.
 *        "500":
 *          description: Internal Server Error. Authentication failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Unable to reset passsword.
 * 
 * 
 * 
 *  /users/reset_password:
 *    post:
 *      tags: [Users]
 *      summary: Reset User Password
 *      description:  This resource **resets** the user´s **password**. The request must have the temporary `token`, as received by email, and the new password. 
 *      operationId: resetPassword
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/UserResetPassword'
 *      responses:
 *        "200":
 *          description: Successful operation. User created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/Success'
 *              example: 
 *                  message: Password changed successfully.
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "401":
 *          description: Unauthorized. Invalid password.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Unauthorized. Invalid password.
 *        "404":
 *          description: User not found. 
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: User not found.
 *        "500":
 *          description: Internal Server Error. Authentication failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Authentication failed.
*/