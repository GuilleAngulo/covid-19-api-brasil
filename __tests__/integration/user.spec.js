const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const bcrypt = require('bcryptjs');

const mongoose = require('../../src/database/index');
const User = require('../../src/app/models/User');

const { userMock } = require('../../__mocks__/user');

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]
      await collection.deleteMany()
    }
}

async function loadInitialData(userMock) {
    return await request
        .post('/users/register')
        .send(userMock);
}


describe('USER', () => {

    beforeEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.connection.close()
    });

    test.skip('POST /users/register', async () => {
        
        const response = await request
            .post('/users/register')
            .send(userMock);
        
        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.user._id).toHaveLength(24);
        expect(response.body.user.username).toBe(userMock.username);
        expect(response.body.user.email).toBe(userMock.email);
        expect(response.body).toHaveProperty('token');
        expect(response.status).toBe(200);
    });

    test.skip('POST /users/authenticate', async () => {
        
        await loadInitialData(userMock);

        const response = await request
            .post('/users/authenticate')
            .send({
                email: userMock.email,
                password: userMock.password,
            });
        
        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.user._id).toHaveLength(24);
        expect(response.body.user.username).toBe(userMock.username);
        expect(response.body.user.email).toBe(userMock.email);
        expect(response.body).toHaveProperty('token');
        expect(response.status).toBe(200);
    });

    test.skip('POST /users/forgot_password', async () => {
        
        await loadInitialData(userMock);

        const response = await request
            .post('/users/forgot_password')
            .send({ email: userMock.email });
        
        expect(response.body.message).toBe('Password recovery email sent successfully.');
        expect(response.status).toBe(200);
    });

    test.skip('POST /users/reset_password', async () => {
        
        await loadInitialData(userMock);

        await request
            .post('/users/forgot_password')
            .send({ email: userMock.email });

        let user = await User
            .findOne({ email: userMock.email })
            .select('+passwordResetToken');

        const response = await request
            .post('/users/reset_password')
            .send({
                email: userMock.email,
                password: 'newPassword',
                token: user.passwordResetToken,
            });

        user = await User
            .findOne({ email: userMock.email })
            .select('+password');
        ;
        
        const passwordLegit =  await bcrypt.compare('newPassword', user.password);

        expect(response.body.message).toBe('Password changed successfully.');
        expect(passwordLegit).toBe(true);
        expect(response.status).toBe(200);
    });

});