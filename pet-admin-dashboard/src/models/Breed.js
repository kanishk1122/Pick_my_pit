import mongoose from 'mongoose';

const BreedSchema = new mongoose.Schema({
  index: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this breed'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  species: {
    type: String,
    required: [true, 'Please specify the species'],
    enum: ['dog', 'cat', 'bird', 'fish', 'small_pet'],
  },
  description: {
    type: String,
    required: false,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  characteristics: {
    type: String,
    required: false,
    maxlength: [500, 'Characteristics cannot be more than 500 characters'],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'banned'],
    default: 'active',
  },
}, {
  timestamps: true,
});

BreedSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastBreed = await this.constructor.findOne({}, {}, { sort: { 'index': -1 } });
    this.index = lastBreed ? lastBreed.index + 1 : 1;
  }
  next();
});

BreedSchema.statics.insertMany = async function(breeds) {
  const lastBreed = await this.findOne({}, {}, { sort: { 'index': -1 } });
  let lastIndex = lastBreed ? lastBreed.index : 0;

  const breedsWithIndex = breeds.map(breed => ({
    ...breed,
    index: ++lastIndex,
    status: breed.status || 'active'
  }));

  return mongoose.model('Breed').insertMany(breedsWithIndex);
};

export default mongoose.models.Breed || mongoose.model('Breed', BreedSchema);
