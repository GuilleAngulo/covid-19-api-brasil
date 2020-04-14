const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');

const { regionMock1, regionMock2, regionUpdateMock } = require('../../__mocks__/region');
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

describe('REGION', () => {
    
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

    test.skip('GET /regions', async () => {
        await loadInitialData(regionMock1);
        
        const response = await request
            .get('/region');

        expect(response.body.regions[0]).toHaveProperty('_id');
        expect(response.body.regions[0]._id).toHaveLength(24);
        expect(response.body.regions[0].name).toBe(regionMock1.name);
        expect(response.body.regions[0].description).toBe(regionMock1.description);
        expect(response.body.regions[0].states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.regions[0].states[0].code).toBe(regionMock1.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('GET /regions/:name', async () => {
        await loadInitialData(regionMock1);
        
        const response = await request
            .get(`/regions/${regionMock1.name}`);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionMock1.name);
        expect(response.body.region.description).toBe(regionMock1.description);
        expect(response.body.region.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('GET /regions/id/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .get(`/regions/id/${regionId}`);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionMock1.name);
        expect(response.body.region.description).toBe(regionMock1.description);
        expect(response.body.region.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('POST /regions', async () => {
        const response = await request
            .post('/regions')
            .set('Authorization', `Bearer ${token}`)
            .send(regionMock2);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionMock2.name);
        expect(response.body.region.description).toBe(regionMock2.description);
        expect(response.body.region.states[0].name).toBe(regionMock2.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionMock2.states[0].code);
        expect(response.body.region.states[0].population).toBe(regionMock2.states[0].population);
        expect(response.status).toBe(201);
    });

    test.skip('PUT /regions/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .put(`/regions/${regionId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(regionUpdateMock);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionUpdateMock.name);
        expect(response.body.region.description).toBe(regionUpdateMock.description);
        expect(response.body.region.states[0].name).toBe(regionUpdateMock.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionUpdateMock.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('PUT /regions/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .put(`/regions/${regionId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(regionUpdateMock);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionUpdateMock.name);
        expect(response.body.region.description).toBe(regionUpdateMock.description);
        expect(response.body.region.states[0].name).toBe(regionUpdateMock.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionUpdateMock.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('DELETE /regions/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .delete(`/regions/${regionId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Region removed correctly.');
    });

   

});