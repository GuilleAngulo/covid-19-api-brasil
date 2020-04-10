const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const UserValidator = require('../validators/UserValidator');

router.post('/register', UserValidator.store, UserController.store);
router.post('/authenticate', UserValidator.authenticate, UserController.authenticate);
router.post('/forgot_password', UserValidator.forgotPassword, UserController.forgotPassword);
router.post('/reset_password', UserValidator.resetPassword, UserController.resetPassword);

module.exports = router;