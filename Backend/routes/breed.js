const express = require('express');
const router = express.Router();
const Breed = require('../model/breed');
const { checkSessionId } = require('../helper/Functions.js');

// Get all breeds for a species
router.get('/:species', async (req, res) => {
    try {
        const { species } = req.params;
        const breeds = await Breed.find({ species: species.toLowerCase() })
            .select('name description characteristics speciesName')
            .sort('name');

        // Get the species name from the first breed (they all have the same species name)
        const speciesName = breeds[0]?.speciesName || species;

        res.status(200).json({
            success: true,
            species: speciesName,
            breeds: breeds.map(breed => breed.name),
            details: breeds
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching breeds',
            error: error.message
        });
    }
});

// Add new breed (admin only)
router.post('/add', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const { name, species, speciesName, description, characteristics } = req.body;

        if (!speciesName) {
            return res.status(400).json({
                success: false,
                message: 'Species name is required'
            });
        }

        const existingBreed = await Breed.findOne({
            name: name.toLowerCase(),
            species: species.toLowerCase()
        });

        if (existingBreed) {
            return res.status(400).json({
                success: false,
                message: 'Breed already exists for this species'
            });
        }

        const breed = new Breed({
            name,
            species,
            speciesName,
            description,
            characteristics
        });

        await breed.save();

        res.status(201).json({
            success: true,
            message: 'Breed added successfully',
            breed
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding breed',
            error: error.message
        });
    }
});

// Update breed (admin only)
router.put('/update/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const breed = await Breed.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: 'Breed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Breed updated successfully',
            breed
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating breed',
            error: error.message
        });
    }
});

// Delete breed (admin only)
router.delete('/delete/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const breed = await Breed.findByIdAndDelete(req.params.id);

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: 'Breed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Breed deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting breed',
            error: error.message
        });
    }
});

// Increment breed popularity
router.post('/increment-popularity/:id', async (req, res) => {
    try {
        const breed = await Breed.findByIdAndUpdate(
            req.params.id,
            { $inc: { popularity: 1 } },
            { new: true }
        );

        if (!breed) {
            return res.status(404).json({
                success: false,
                message: 'Breed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Popularity incremented',
            popularity: breed.popularity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating popularity',
            error: error.message
        });
    }
});

module.exports = router;
