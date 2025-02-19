const mongoose = require('mongoose');
const Species = require('../model/Species');
require('dotenv').config();

const initialSpecies = [
    {
        name: 'dog',
        displayName: 'Dog',
        description: 'Loyal and friendly companions',
        icon: '🐕'
    },
    {
        name: 'cat',
        displayName: 'Cat',
        description: 'Independent and graceful pets',
        icon: '🐈'
    },
    {
        name: 'bird',
        displayName: 'Bird',
        description: 'Colorful and musical companions',
        icon: '🦜'
    },
    {
        name: 'fish',
        displayName: 'Fish',
        description: 'Peaceful aquatic pets',
        icon: '🐠'
    },
    {
        name: 'rabbit',
        displayName: 'Rabbit',
        description: 'Gentle and quiet pets',
        icon: '🐰'
    }
];

async function seedSpecies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        for (const speciesData of initialSpecies) {
            await Species.findOneAndUpdate(
                { name: speciesData.name.toLowerCase() },
                speciesData,
                { upsert: true, new: true }
            );
        }
        
        console.log('Species seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding species:', error);
        process.exit(1);
    }
}

seedSpecies();
