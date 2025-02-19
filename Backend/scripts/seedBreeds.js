const mongoose = require('mongoose');
const Breed = require('../model/breed');
require('dotenv').config();

const initialBreeds = {
  dog: {
    name: 'Dog',
    breeds: [
      { 
        name: 'Labrador Retriever', 
        characteristics: ['Friendly', 'Active', 'Outgoing'],
        description: 'Friendly, active and outgoing'
      },
      { 
        name: 'German Shepherd', 
        characteristics: ['Loyal', 'Intelligent', 'Confident'],
        description: 'Loyal and highly trainable'
      },
    ]
  },
  cat: {
    name: 'Cat',
    breeds: [
      { 
        name: 'Persian', 
        characteristics: ['Gentle', 'Quiet', 'Sweet'],
        description: 'Gentle and sweet natured'
      },
      { 
        name: 'Siamese', 
        characteristics: ['Intelligent', 'Social', 'Vocal'],
        description: 'Social and very vocal'
      },
    ]
  },
  bird: {
    name: 'Bird',
    breeds: [
      { 
        name: 'Budgerigar', 
        characteristics: ['Social', 'Active', 'Intelligent'],
        description: 'Small, social parakeet'
      },
      { 
        name: 'Cockatiel', 
        characteristics: ['Friendly', 'Vocal', 'Affectionate'],
        description: 'Friendly and affectionate'
      },
    ]
  }
};

async function seedBreeds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    for (const [speciesKey, speciesData] of Object.entries(initialBreeds)) {
      for (const breedData of speciesData.breeds) {
        await Breed.findOneAndUpdate(
          { 
            name: breedData.name.toLowerCase(), 
            species: speciesKey 
          },
          { 
            ...breedData,
            name: breedData.name.toLowerCase(),
            species: speciesKey,
            speciesName: speciesData.name
          },
          { upsert: true, new: true }
        );
      }
    }
    
    console.log('Breeds seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding breeds:', error);
    process.exit(1);
  }
}

seedBreeds();
