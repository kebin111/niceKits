import mongoose from 'mongoose';

const kitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  league: {
    type: String
  },
  country: {
    type: String,
    required: true
  }, 
  category: {
    type: String,
    enum: ['Club', 'National', 'Limited', 'Other'],
    default: 'Club'
  },
  jerseyType: {
    type: String,
    enum: ['Home', 'Away', 'Third', 'Training', 'Other'],
    default: 'Home'
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.length === 3;
      },
      message: 'Stock must be an array of exactly 3 numbers (small, medium, large).'
    },
    default: [0, 0, 0]
  },
  description: String,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  players: {
    type: [String],
    default: []
  }
});

const Kit = mongoose.model('Kit', kitSchema, 'items');

export default Kit;
