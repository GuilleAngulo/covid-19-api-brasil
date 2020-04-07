const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');
const authorization = require('../../src/config/auth.json').secret;

const { regionMock1, regionMock2, regionUpdateMock } = require('../../__mocks__/region');

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]
      await collection.deleteMany()
    }
}

async function loadInitialData(regionMock) {
    return await request
        .post('/region')
        .set('Authorization', authorization)
        .send(regionMock);
}


describe('REGION', () => {

    beforeEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.connection.close()
      })

    test.skip('GET /region', async () => {
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

    test.skip('GET /region/:name', async () => {
        await loadInitialData(regionMock1);
        
        const response = await request
            .get(`/region/${regionMock1.name}`);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionMock1.name);
        expect(response.body.region.description).toBe(regionMock1.description);
        expect(response.body.region.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('GET /region/id/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .get(`/region/id/${regionId}`);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionMock1.name);
        expect(response.body.region.description).toBe(regionMock1.description);
        expect(response.body.region.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('POST /region', async () => {
        const response = await request
            .post('/region')
            .set('Authorization', authorization)
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

    test.skip('PUT /region/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .put(`/region/${regionId}`)
            .set('Authorization', authorization)
            .send(regionUpdateMock);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionUpdateMock.name);
        expect(response.body.region.description).toBe(regionUpdateMock.description);
        expect(response.body.region.states[0].name).toBe(regionUpdateMock.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionUpdateMock.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('PUT /region/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .put(`/region/${regionId}`)
            .set('Authorization', authorization)
            .send(regionUpdateMock);

        expect(response.body.region).toHaveProperty('_id');
        expect(response.body.region._id).toHaveLength(24);
        expect(response.body.region.name).toBe(regionUpdateMock.name);
        expect(response.body.region.description).toBe(regionUpdateMock.description);
        expect(response.body.region.states[0].name).toBe(regionUpdateMock.states[0].name);
        expect(response.body.region.states[0].code).toBe(regionUpdateMock.states[0].code);
        expect(response.status).toBe(200);
    });

    test.skip('DELETE /region/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .delete(`/region/${regionId}`)
            .set('Authorization', authorization);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Region removed correctly.');
    });

   

});