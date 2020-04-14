const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');

const { regionStatesMock } = require('../../__mocks__/region');
const { userMock } = require('../../__mocks__/user');

let token;

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]
      await collection.deleteMany()
    }
}

async function loadInitialData(regionMock) {
    return await request
        .post('/regions')
        .set('Authorization', `Bearer ${token}`)
        .send(regionMock);
}


describe('STATS', () => {

    beforeAll(async () => {
        const response = await request
            .post('/users/register')
            .send(userMock);
    
        token = response.body.token;

    });

    beforeEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.connection.close()
      })

    test.skip('GET /stats/total', async () => {
        await loadInitialData(regionStatesMock);
        
        const response = await request
            .get('/stats/total');

        expect(response.body.confirmed).toBe(30);
        expect(response.body.deaths).toBe(15);
    });
    
});