const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pet = require("../models/Pet");

router.get("/get-pets", (req, res, next) => {
  Pet.find()
    .select("_id name breed species gender age color weight location notes")
    .exec()
    .then(pets => {
      if (pets.length) {
        return res.status(200).json({
          totalPets: pets.length,
          pets: pets.map(pet => {
            return {
              _id: pet._id,
              name: pet.name,
              breed: pet.breed,
              species: pet.species,
              gender: pet.gender,
              age: pet.age,
              color: pet.gender,
              weight: pet.weight,
              location: pet.location,
              notes: pet.notes
            };
          })
        });
      }
      return res.status(200).json({
        totalPets: 0,
        pets: []
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/add-pet", (req, res, next) => {
  try {
    let {
      name,
      breed,
      species,
      gender,
      age,
      color,
      weight,
      location,
      notes
    } = req.body;
    const newPet = new Pet({
      _id: new mongoose.Types.ObjectId(),
      name,
      breed,
      species,
      gender,
      age,
      color,
      weight,
      location,
      notes
    });

    newPet
      .save()
      .then(result => {
        res.status(201).json({
          message: "New pet added!!",
          pet: {
            _id: result._id,
            name: result.name,
            breed: result.breed,
            species: result.species,
            gender: result.gender,
            age: result.age,
            color: result.color,
            weight: result.weight,
            location: result.location,
            notes: result.notes
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  } catch (erorr) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
