const Region = require('../models/Region');
const State = require('../models/State');

const { ObjectId } = require('mongoose').Types;

module.exports = {
    async index(req, res) {
        try {
            const regions = await Region.find({}, 'name description')
            .populate({ path: 'states', select: 'name code population confirmed deaths officialUpdated' });

            return res.status(200).send({ regions });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error. Error listing regions.' });
        }
    },
    async find(req, res) {
        try {
            const regionDB = await Region.findById(req.params.regionId, 'name description')
                .populate({ path: 'states', select: 'name code population confirmed deaths officialUpdated' });

            if (!regionDB)
                return res.status(404).json({ error: 'Region not found.'});

            const totals = await State.aggregate(
                [
                    {
                        $match: {
                            "region": ObjectId(req.params.regionId), 
                        }
                    },
                    { 
                        $group: {
                            _id: null, 
                            confirmed:  { $sum: "$confirmed" },
                            deaths:   { $sum: "$deaths" },
                        }   
                    }
                ]);

            const region = JSON.parse(JSON.stringify(regionDB));

            region["confirmed"] = totals[0].confirmed;
            region["deaths"] = totals[0].deaths;

            return res.status(200).send({ region });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error finding the region. Check if the ID is correct.' });
        }
    },

    async findByName(req, res) {
        try {
            const regionDB = await Region.findOne(
                { name: req.params.name.toLowerCase() }, 
                'name description')
                    .populate({ path: 'states', select: 'name code population confirmed deaths officialUpdated' });
            
            if (!regionDB)
                return res.status(404).json({ error: 'Region not found.'});

            const totals = await State.aggregate(
                [
                    {
                        $match: {
                            "region": regionDB._id,
                        }
                    },
                    { 
                        $group: {
                            _id: null, 
                            confirmed:  { $sum: "$confirmed" },
                            deaths:   { $sum: "$deaths" },
                        }   
                    }
                ]);

            const region = JSON.parse(JSON.stringify(regionDB));

            region["confirmed"] = totals[0].confirmed;
            region["deaths"] = totals[0].deaths;

            return res.status(200).send({ region });

        } catch (error) {
            console.log('Error:', error);
            return res.status(5004).send({ error: 'Internal Server Error. Error finding the region.' });
        }
    },

    async create(req, res) {

        const { name } = req.body;

        const regionExists = await Region.findOne({ name });

        if (regionExists) {
            console.log(`Region with name: ${name} already exists.`);
            return res.status(403).json(regionExists);
        }

        try {
            const { name, description, states } = req.body;

            const region = await Region.create({ name, description });


            await Promise.all(states.map(async state => {
                const regionState = new State ({ ...state, region: region._id });

                await regionState.save();

                region.states.push(regionState);
            }));

            await region.save();


            return res.status(201).send({ region });

        } catch (error) {
            console.log('Error:',error);
            return res.status(404).send({ error: 'Error creating new region.' });
        }
    },

    async update(req, res) {
        try {
            const { name, description, states } = req.body;

            const region = await Region.findByIdAndUpdate(req.params.regionId, { 
                name, 
                description
            }, { new: true, useFindAndModify: false });

            region.states = [];
            await State.deleteMany({ region: region._id }, (error) => {
                if (error) return res.status(404).send({ error: 'Error removing previous states.' });
            });

            await Promise.all(states.map(async state => {
                const regionState = new State ({ ...state, region: region._id });

                await regionState.save();

                region.states.push(regionState);
            }));

            await region.save();


            return res.status(200).send({ region });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error updating region.' });
        }
    },

    async remove(req, res) {
        
        try {
            await Region.findByIdAndRemove(req.params.regionId, { useFindAndModify: false });

            await State.deleteMany({ region: req.params.regionId }, (error) => {
                if (error) return res.status(404).send({ error: 'Error removing states.' });
            });

            return res.status(200).send({ message: 'Region removed correctly.' });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error removing the region.' });
        }
    },


    };