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
    type: Number,
    default: 12
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
