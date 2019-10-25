const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Pet", petSchema);
