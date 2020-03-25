const express = require('express');

const Region = require('../models/Region');
const State = require('../models/State');


module.exports = {
    async index(req, res) {
        try {
            const regions = await Region.find().populate(['states']);

            return res.status(200).send({ regions });
        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error listing regions.' });
        }
    },
    async find(req, res) {
        try {
            const region = await Region.findById(req.params.regionId).populate(['states']);

            return res.status(200).send({ region });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error finding the region. Check if the ID is correct.' });
        }
    },

    async create(req, res) {

        const { name } = req.body;

        const regionExists = await Region.findOne({ name })

        if (regionExists) {
            console.log(`Region with name: ${code} already exists.`);
            return res.json(regionExists);
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
            await State.remove({ region: region._id });

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

            return res.status(200).send({ message: 'Region removed correctly.' });

        } catch (error) {
            console.log('Error:', error);
            return res.status(404).send({ error: 'Error removing the region.' });
        }
    },


    };