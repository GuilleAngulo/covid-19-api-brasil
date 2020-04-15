const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');

const { stateUpdateMock } = require('../../__mocks__/state');
const { regionMock1 } = require('../../__mocks__/region');
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


describe('STATE', () => {

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
    });

    test.skip('GET /states', async () => {
        await loadInitialData(regionMock1);
        
        const response = await request
            .get('/states');

        expect(response.body.states[0]).toHaveProperty('_id');
        expect(response.body.states[0]._id).toHaveLength(24);
        expect(response.body.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.states[0].description).toBe(regionMock1.states[0].description);
        expect(response.body.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.body.states[0].population).toBe(regionMock1.states[0].population);
        expect(response.body.states[0].confirmed).toBe(regionMock1.states[0].confirmed);
        expect(response.body.states[0].deaths).toBe(0);
        expect(response.body.states[0]).toHaveProperty('_id');
        expect(response.body.states[0].region).toHaveProperty('_id');
        expect(response.body.states[0].region.description).toBe(regionMock1.description);
        expect(response.status).toBe(200);
    });
      
    test.skip('GET states/id/:stateId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateId = loadResponse.body.region.states[0]._id;
        const regionId = loadResponse.body.region._id;

        const response = await request
            .get(`/states/id/${stateId}`);

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state._id).toBe(stateId);
        expect(response.body.state.name).toBe(regionMock1.states[0].name);
        expect(response.body.state.description).toBe(regionMock1.states[0].description);
        expect(response.body.state.code).toBe(regionMock1.states[0].code);
        expect(response.body.state.population).toBe(regionMock1.states[0].population);
        expect(response.body.state.region._id).toBe(regionId);
        expect(response.status).toBe(200);
    });

    test.skip('GET states/:code', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateCode = loadResponse.body.region.states[0].code;

        const response = await request
            .get(`/states/${stateCode}`);

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state.name).toBe(regionMock1.states[0].name);
        expect(response.body.state.description).toBe(regionMock1.states[0].description);
        expect(response.body.state.code).toBe(stateCode);
        expect(response.body.state.population).toBe(regionMock1.states[0].population);
        expect(response.status).toBe(200);
    });


    
    test.skip('POST /states', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;

        const response = await request
            .post('/states')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                name: 'State 2',
                code: 'SA',
                population: 999999,
                region: regionId,
            });

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state.name).toBe('State 2');
        expect(response.body.state.code).toBe('SA');
        expect(response.body.state.population).toBe(999999);
        expect(response.body.state.region).toBe(regionId);
        expect(response.status).toBe(201);
    });


    test.skip('PUT states/id/:stateId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateId = loadResponse.body.region.states[0]._id;
        
        const response = await request
            .put(`/states/id/${stateId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(stateUpdateMock);

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state._id).toBe(stateId);
        expect(response.body.state.confirmed).toBe(stateUpdateMock.confirmed);
        expect(response.body.state.deaths).toBe(stateUpdateMock.deaths);
        expect(response.body.state.officialUpdated).toBe(stateUpdateMock.officialUpdated);
        expect(response.status).toBe(200);
    });

    test.skip('PUT states/:code', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateCode = loadResponse.body.region.states[0].code;
        
        const response = await request
            .put(`/states/${stateCode}`)
            .set('Authorization', `Bearer ${token}`)
            .send(stateUpdateMock);

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state.code).toBe(stateCode);
        expect(response.body.state.confirmed).toBe(stateUpdateMock.confirmed);
        expect(response.body.state.deaths).toBe(stateUpdateMock.deaths);
        expect(response.body.state.officialUpdated).toBe(stateUpdateMock.officialUpdated);
        expect(response.status).toBe(200);
    });

    test.skip('DELETE /states/:stateId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateId = loadResponse.body.region.states[0]._id;
        
        const response = await request
            .delete(`/states/${stateId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('State removed correctly.');
    });


});