const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);

const mongoose = require('../../src/database/index');

const { regionStatesMock } = require('../../__mocks__/region');
const { userMock } = require('../../__mocks__/user');

let token;

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
}

async function loadInitialData(regionMock) {
    return await request
        .post('/regions')
        .set('Authorization', `Bearer ${token}`)
        .send(regionMock);
}

describe('Update Service', () => {

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

    test.skip('should update the database with the given array', async () => {       
        const { updateDatabase } = require('../../src/app/services/UpdateService');

        await loadInitialData(regionStatesMock);

        const update = [
            {
                code: 'SP',
                confirmed: 50,
                deaths: 20,
                officialUpdated: "2020-04-01T20:00:00.000Z",
            },
            {
                code: 'RJ',
                confirmed: 45,
                deaths: 20,
                officialUpdated: "2020-04-01T20:00:00.000Z",
            },
        ];

        await updateDatabase(update);

        const response1 = await request
            .get(`/states/${update[0].code}`);

        const response2 = await request
            .get(`/states/${update[1].code}`);

        expect(response1.body.state.confirmed).toBe(update[0].confirmed);
        expect(response2.body.state.confirmed).toBe(update[1].confirmed);
        expect(response1.body.state.deaths).toBe(update[0].deaths);
        expect(response2.body.state.deaths).toBe(update[1].deaths);
        expect(response1.body.state.officialUpdated).toBe(update[0].officialUpdated);
        expect(response2.body.state.officialUpdated).toBe(update[1].officialUpdated);
    });

});