const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');
const authorization = require('../../src/config/auth.json').secret;


const { regionStatesMock } = require('../../__mocks__/region');

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
}

async function loadInitialData(regionMock) {
    return await request
        .post('/region')
        .set('Authorization', authorization)
        .send(regionMock);
}


describe('Update Service', () => {

    beforeEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.connection.close()
      })

    it.skip('should update the database with the given array', async () => {       
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
            .get(`/state/${update[0].code}`);

        const response2 = await request
            .get(`/state/${update[1].code}`);


        expect(response1.body.state.confirmed).toBe(update[0].confirmed);
        expect(response2.body.state.confirmed).toBe(update[1].confirmed);
        expect(response1.body.state.deaths).toBe(update[0].deaths);
        expect(response2.body.state.deaths).toBe(update[1].deaths);
        expect(response1.body.state.officialUpdated).toBe(update[0].officialUpdated);
        expect(response2.body.state.officialUpdated).toBe(update[1].officialUpdated);
    });
    
    /**it('should get the stored official update', async () => {      
        const State = require('../../src/app/models/State'); 
        const { getStoredUpdate } = require('../../src/app/services/UpdateService');

        await loadInitialData(regionStatesMock);

        const date = await getStoredUpdate()

        console.log(date);

        expect(date.getMonth()).toBe(Date.now().getMonth());
    });**/

});