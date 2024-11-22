var express = require('express');
const fs = require("fs");
const {mongoose,db} = require('../utils/mongooseModule');
const { celebrate, Joi, errors, Segments } = require('celebrate');


var router = express.Router();

const restaurantAddressSchema = Joi.object().keys({
  building: Joi.string().required(),
  street: Joi.string().required(),
  zipcode: Joi.string().required(),
  coord: Joi.array().items(Joi.number()).length(2).optional()
});

const restaurantGradeSchema = Joi.object().keys({
  date: Joi.date().optional(),
  grade: Joi.string().optional(),
  score: Joi.number().optional()
});

const createRestaurantSchema = Joi.object().keys({
  restaurant_id: Joi.string().required(),
  name: Joi.string().required(),
  cuisine: Joi.string().required(),
  borough: Joi.string().optional(),
  address: restaurantAddressSchema.required(),
  grades: Joi.array().items(restaurantGradeSchema).optional()
});

const updateRestaurantSchema = Joi.object().keys({
  restaurant_id: Joi.string().optional(),
  name: Joi.string().optional(),
  cuisine: Joi.string().optional(),
  borough: Joi.string().optional(),
  address: restaurantAddressSchema.optional(),
  grades: Joi.array().items(restaurantGradeSchema).optional()
});




router.post('/restaurants', celebrate({
  [Segments.BODY] : createRestaurantSchema
}), async (req, res, next) => {
  try {
    const restaurant = await db.addNewRestaurant(req.body);
    res.status(201).send(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create restaurant' });
  }
})

router.get('/restaurants', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().required(),
    perPage: Joi.number().integer().required(),
    borough: Joi.string().required()
  })
}), async (req, res) => {
  const page = Math.max(0, parseInt(req.query.page, 10) || 0);
  const perPage = Math.min(100, parseInt(req.query.perPage, 10) || 10);
  const borough = req.query.borough;
  try {
    const restaurants = await db.getAllRestaurants(page, perPage, borough);
    res.status(200).send(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/restaurants/:id', async function(req, res, next) {
  try {
    const restaurant = await db.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).send({ message: 'Restaurant not found' });
    }
    res.status(200).send(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
})

router.put('/restaurants/:id', celebrate({
    [Segments.BODY]: updateRestaurantSchema
  }), async (req, res, next) => {
  try {
    console.log('Updating restaurant with ID:', req.params.id);
    const updatedRestaurant = await db.updateRestaurantById(req.params.id, req.body);
    if (!updatedRestaurant) {
      return res.status(404).send({ message: 'Restaurant not found' });
    }
    res.status(200).send(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update restaurant' });
  }
})

router.delete('/restaurants/:id', function(req, res, next) {
  try {
    db.deleteRestaurantById(req.params.id);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete' });
  }
})

module.exports = router;
