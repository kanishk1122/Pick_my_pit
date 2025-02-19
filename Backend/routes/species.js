const express = require('express');
const router = express.Router();
const Species = require('../model/Species');
const { checkSessionId } = require('../helper/Functions.js');

// Get all active species
router.get('/', async (req, res) => {
    try {
        const species = await Species.find({ active: true })
            .select('name displayName description icon')
            .sort('displayName');

        res.status(200).json({
            success: true,
            species
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching species',
            error: error.message
        });
    }
});

// Add new species (admin only)
router.post('/add', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const { name, displayName, description, icon } = req.body;

        const existingSpecies = await Species.findOne({ name: name.toLowerCase() });
        if (existingSpecies) {
            return res.status(400).json({
                success: false,
                message: 'Species already exists'
            });
        }

        const species = new Species({
            name,
            displayName,
            description,
            icon
        });

        await species.save();

        res.status(201).json({
            success: true,
            message: 'Species added successfully',
            species
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding species',
            error: error.message
        });
    }
});

// Update species (admin only)
router.put('/update/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const species = await Species.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!species) {
            return res.status(404).json({
                success: false,
                message: 'Species not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Species updated successfully',
            species
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating species',
            error: error.message
        });
    }
});

// Deactivate species (admin only)
router.put('/deactivate/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication
        const species = await Species.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!species) {
            return res.status(404).json({
                success: false,
                message: 'Species not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Species deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deactivating species',
            error: error.message
        });
    }
});

// Increment species popularity
router.post('/increment-popularity/:id', async (req, res) => {
    try {
        const species = await Species.findByIdAndUpdate(
            req.params.id,
            { $inc: { popularity: 1 } },
            { new: true }
        );

        if (!species) {
            return res.status(404).json({
                success: false,
                message: 'Species not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Popularity incremented',
            popularity: species.popularity
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
