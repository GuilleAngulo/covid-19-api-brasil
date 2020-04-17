const Region = require('../models/Region');
const State = require('../models/State');


module.exports = {
    async index(req, res) {
        try {
            const states = await State.find({}, 'name code population confirmed deaths officialUpdated')
                .populate({ path: 'region', select: 'description' });

            return res.status(200).send({ states });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error. Error listing states.' });
        }
    },
    async find(req, res) {
        try {
            const state = await State.findById(
                req.params.stateId, 
                'name code population confirmed deaths officialUpdated')
                    .populate({ path: 'region', select: 'description' });

            if (!state)
                return res.status(400).json({ error: 'State ID not found.'});

            return res.status(200).send({ state });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error finding the state. Check if the ID is correct.' });
        }
    },
    async findByCode(req, res) {
        try {
            const state = await State.findOne(
                { code: req.params.code.toUpperCase() },
                'name code population confirmed deaths officialUpdated')
                    .populate({ path: 'region', select: 'description' });

            if (!state)
                return res.status(404).json({ error: 'State code not found.'});

            return res.status(200).json({ state });

        } catch (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error. Error finding the state.' });
        }
    },

    async create(req, res) {

        const { code, region } = req.body;

        const stateExists = await State.findOne(
            { code }, 
            'name code population confirmed deaths officialUpdated')
                .populate({ path: 'region', select: 'description' });

        if (stateExists) {
            console.log(`Conflict error. State with code: ${code} already exists.`);
            return res.status(409).json(stateExists);
        }

        try {
            const state = await State.create({ ...req.body, code: code.toUpperCase() });

            await state.save();

            const regionById = await Region.findById(region);

            if (!regionById)
                return res.status(404).send({ error: 'Not found. Error finding the region.' });

            regionById.states.push(state);

            await regionById.save();

            const stateCreated = await State.findOne(
                { code }, 
                'name code population confirmed deaths officialUpdated')
                    .populate({ path: 'region', select: 'description' });

            return res.status(201).send({ stateCreated });

        } catch (error) {
            console.log('Error:',error);
            return res.status(500).send({ error: 'Internal Server Error. State creation failed.' });
        }
    },

    async update(req, res) {
        try {

            const state = await State.findByIdAndUpdate(req.params.stateId, 
                { ...req.body }, { 
                    new: true, 
                    useFindAndModify: false,
                    select: 'name code population confirmed deaths officialUpdated',
                }).populate({ path: 'region', select: 'description' });
            

            if (!state)
                return res.status(500).send({ error: 'Internal Server Error. State creation failed.' });

            await state.save();


            return res.status(200).send({ state });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error updating state.' });
        }
    },

    async updateByCode(req, res) {
        try {

            const state = await State.findOneAndUpdate(
                { code: req.params.code.toUpperCase() }, 
                { ...req.body }, 
                { 
                    new: true, 
                    useFindAndModify: false,
                    select: 'name code population confirmed deaths officialUpdated',
                }).populate({ path: 'region', select: 'description' });

            if (!state)
                return res.status(404).send({ error: 'Error finding the state. Check if the code is correct.' });

            await state.save();


            return res.status(200).send({ state });

        } catch (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error. Error updating state.' });
        }
    },

    async remove(req, res) {
        
        try {
            await State.findByIdAndRemove(req.params.stateId, { useFindAndModify: false });

            return res.status(200).send({ message: 'Successful operation. State removed correctly.' });

        } catch (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error. Error removing the state.' });
        }
    },


    };