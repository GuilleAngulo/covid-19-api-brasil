const { Schema, model } = require('../../database/index');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    }, 
    passwordResetExpires: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function(next) {
    const hash =  await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = model('User', UserSchema);



/**
 * @swagger
 *  components:
 * 
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            description: User´s name or nickname.
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            description: Password for authentication.
 *        example:
 *           username: JohnDoe
 *           email: johndoe@email.com
 *           password: johndoe1234
 * 
 * 
 * 
 *    requests:    
 *      UserRegister:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            description: User´s name or nickname.
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            description: Password for authentication.
 *        example:
 *           username: JohnDoe
 *           email: johndoe@email.com
 *           password: johndoe1234
 * 
 *      UserAuthenticate:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: User Email.
 *          password:
 *            type: string
 *            description: Password for authentication.
 *        example:
 *           email: johndoe@email.com
 *           password: johndoe1234
 * 
 *      UserForgotPassword: 
 *        type: object
 *        required:
 *          - email
 *          - password
 *          - token
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: User Email.
 *        example:
 *           email: johndoe@email.com
 * 
 *      UserResetPassword: 
 *        type: object
 *        required:
 *          - email
 *          - passsword
 *          - token
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: User Email.
 *          password:
 *            type: string
 *            description: New password to replace previous.
 *          token:
 *             type: string
 *             format: jwt
 *             description: Token received by email
 *        example:
 *          email: johndoe@email.com
 *          password: newjohndoe1234
 *          token: 8a8dcffa4978c43db054fe36da6ce6a217cb9d0c
 * 
 * 
 * 
 * 
 * 
 *    responses:
 *      UserResponse:
 *        type: object
 *        example:
 *          user:
 *              _id: 5e94b6de3f16662e2c3133b7
 *              username: JohnDoe
 *              email: johndoe@email.com
 *              createdAt: 2020-04-13T19:00:46.552Z
 *          token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTRiNmRlM2YxNjY2MmUyYzMxMzNiNyIsImlhdCI6MTU4NjgwNDQ0NiwiZXhwIjoxNTg2ODkwODQ2fQ.4VaGAIfQXuv2eKd7aIl4LvpMe5ejpCtmLMGRnJl3JMg
 *        properties:
 *          user:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                format: uuid
 *                description: User ID
 *              username:
 *                type: string
 *                description: User´s Name or Nickname.
 *              email:
 *                type: string
 *                format: email
 *                description: User Email.
 *              createdAt:
 *                type: string
 *                format: date-time
 *            example:
 *              _id: 5e94b6de3f16662e2c3133b7
 *              username: JohnDoe
 *              email: johndoe@email.com
 *              createdAt: 2020-04-13T19:00:46.552Z
 *          token:    
 *              type: string
 *              format: jwt
 *              description: User Token
 * 
 * 
 * 
 *      BadRequest:
 *          example:
 *             statusCode: 400
 *             error: Bad Request
 *             message: \"username\" must be a string
 *             validation: 
 *                source: body
 *                keys: 
 *                  [username]
 *          properties:
 *             statusCode:
 *               type: integer
 *               description: Error status code
 *             error:
 *               type: string
 *               description: Error type
 *             message:
 *               type: string
 *               description: Error description
 *             validation:
 *               type: object
 *               properties:
 *                  source:
 *                      type: string
 *                      description: Error source
 *                  keys:
 *                      type: array
 *                      items:
 *                          type: string
 *                          description: Error validation key
 * 
 * 
 *      Success:
 *          type: object
 *          properties:
 *             message:
 *                type: string
 *                description: Success message.     
 * 
 *      Error:
 *          type: object
 *          properties:
 *             error:
 *                type: string
 *                description: Error description.
 * 
 */