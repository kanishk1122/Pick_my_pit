const mongoose = require("mongoose");
const Breed = require("../model/breed");
const Species = require("../model/Species");
require("dotenv").config();

const initialBreeds = {
  dog: {
    name: "Dog",
    breeds: [
      {
        name: "Labrador Retriever",
        characteristics: ["Friendly", "Active", "Outgoing"],
        description: "Friendly, active and outgoing",
      },
      {
        name: "German Shepherd",
        characteristics: ["Loyal", "Intelligent", "Confident"],
        description: "Loyal and highly trainable",
      },
    ],
  },
  cat: {
    name: "Cat",
    breeds: [
      {
        name: "Persian",
        characteristics: ["Gentle", "Quiet", "Sweet"],
        description: "Gentle and sweet natured",
      },
      {
        name: "Siamese",
        characteristics: ["Intelligent", "Social", "Vocal"],
        description: "Social and very vocal",
      },
    ],
  },
  bird: {
    name: "Bird",
    breeds: [
      {
        name: "Budgerigar",
        characteristics: ["Social", "Active", "Intelligent"],
        description: "Small, social parakeet",
      },
      {
        name: "Cockatiel",
        characteristics: ["Friendly", "Vocal", "Affectionate"],
        description: "Friendly and affectionate",
      },
    ],
  },
};

async function seedBreeds() {
  let connection;
  try {
    console.log("Starting breed seeding process...");

    // Get database URL with fallbacks
    const dbUrl =
      process.env.DATABASE_URL ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URI;

    if (!dbUrl) {
      throw new Error(
        "No database connection string found in environment variables. Please set DATABASE_URL, MONGODB_URI, or MONGO_URI"
      );
    }

    console.log(`Connecting to MongoDB database...`);
    connection = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log("Database connection established");

    // First ensure all species exist
    console.log("Verifying species records...");
    const speciesPromises = Object.entries(initialBreeds).map(
      async ([speciesKey, speciesData]) => {
        // Try to find existing species
        const existingSpecies = await Species.findOne({ name: speciesKey });

        if (existingSpecies) {
          console.log(
            `✓ Found existing species: ${existingSpecies.displayName}`
          );
          return existingSpecies;
        } else {
          // Create the species if it doesn't exist
          console.log(`Creating missing species: ${speciesData.name}`);
          const newSpecies = new Species({
            name: speciesKey,
            displayName: speciesData.name,
            description: `${speciesData.name} pets`,
            // Add default icon based on species
            icon:
              speciesKey === "dog"
                ? "🐕"
                : speciesKey === "cat"
                ? "🐈"
                : speciesKey === "bird"
                ? "🦜"
                : "🐾",
          });
          return await newSpecies.save();
        }
      }
    );

    // Wait for all species to be verified/created
    const speciesRecords = await Promise.all(speciesPromises);
    console.log(`Verified ${speciesRecords.length} species records`);

    // Map for quick species lookup by name
    const speciesMap = {};
    speciesRecords.forEach((species) => {
      speciesMap[species.name] = species;
    });

    // Now seed the breeds with proper species references
    console.log("\nSeeding breeds...");
    let totalBreeds = 0;
    let successCount = 0;

    for (const [speciesKey, speciesData] of Object.entries(initialBreeds)) {
      const speciesRecord = speciesMap[speciesKey];

      if (!speciesRecord) {
        console.error(
          `Could not find species record for ${speciesKey}. Skipping its breeds.`
        );
        continue;
      }

      console.log(
        `\nProcessing ${speciesData.breeds.length} breeds for ${speciesData.name}...`
      );
      totalBreeds += speciesData.breeds.length;

      for (const breedData of speciesData.breeds) {
        try {
          const breedResult = await Breed.findOneAndUpdate(
            {
              name: breedData.name.toLowerCase(),
              species: speciesRecord._id,
            },
            {
              ...breedData,
              name: breedData.name.toLowerCase(),
              species: speciesRecord._id,
              speciesName: speciesRecord.displayName,
            },
            { upsert: true, new: true }
          );

          console.log(
            `✓ ${breedResult.isNew ? "Created" : "Updated"} breed: ${
              breedData.name
            }`
          );
          successCount++;
        } catch (breedError) {
          console.error(
            `Error seeding breed ${breedData.name}:`,
            breedError.message
          );
        }
      }
    }

    console.log(
      `\nBreed seeding completed: ${successCount}/${totalBreeds} breeds processed successfully`
    );
  } catch (error) {
    console.error("Error seeding breeds:", error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    // Always close the connection when done
    if (mongoose.connection.readyState === 1) {
      console.log("Closing database connection...");
      await mongoose.connection.close();
      console.log("Database connection closed");
    }
    process.exit(0);
  }
}

seedBreeds();
