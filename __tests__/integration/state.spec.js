const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app)

const mongoose = require('../../src/database/index');
const authorization = require('../../src/config/auth.json').secret;

const { stateMock1, stateMock2, stateUpdateMock } = require('../../__mocks__/state');
const { regionMock1 } = require('../../__mocks__/region');

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


describe('STATE', () => {

    beforeEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.connection.close()
      })
      
    test('GET state/id/:stateId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const stateId = loadResponse.body.region.states[0]._id;
        const regionId = loadResponse.body.region._id;

        const response = await request
            .get(`/state/id/${stateId}`);

        expect(response.body.state).toHaveProperty('_id');
        expect(response.body.state._id).toHaveLength(24);
        expect(response.body.state._id).toBe(stateId);
        expect(response.body.state.name).toBe(regionMock1.states[0].name);
        expect(response.body.state.description).toBe(regionMock1.states[0].description);
        expect(response.body.state.code).toBe(regionMock1.states[0].code);
        expect(response.body.state.population).toBe(regionMock1.states[0].population);
        expect(response.body.state.region).toBe(regionId);
        expect(response.status).toBe(200);
    });

    test('GET /state', async () => {
        await loadInitialData(regionMock1);
        
        const response = await request
            .get('/state');

        expect(response.body.states[0]).toHaveProperty('_id');
        expect(response.body.states[0]._id).toHaveLength(24);
        expect(response.body.states[0].name).toBe(regionMock1.states[0].name);
        expect(response.body.states[0].description).toBe(regionMock1.states[0].description);
        expect(response.body.states[0].code).toBe(regionMock1.states[0].code);
        expect(response.body.states[0].population).toBe(regionMock1.states[0].population);
        expect(response.body.states[0].region).toHaveProperty('_id');
        expect(response.body.states[0].region.description).toBe(regionMock1.description);
        expect(response.status).toBe(200);
    });
    
    test('POST /state', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;

        const response = await request
            .post('/state')
            .set('Authorization', authorization)
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


    /**

    it('PUT /region/:regionId', async () => {
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

    it('PUT /region/:regionId', async () => {
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

    it('DELETE /region/:regionId', async () => {
        const loadResponse = await loadInitialData(regionMock1);
        const regionId = loadResponse.body.region._id;
        
        const response = await request
            .delete(`/region/${regionId}`)
            .set('Authorization', authorization);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Region removed correctly.');
    });

    */

});