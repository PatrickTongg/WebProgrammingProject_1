var express = require('express');
const { celebrate, Joi, errors, Segments } = require('celebrate');
// Dont remove
const { db, userDb, User } = require('../utils/mongooseModule');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


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


router.get('/', (req, res) => {
  console.log(crypto.randomBytes(64).toString('hex'))
})

router.post('/restaurants', celebrate({
  [Segments.BODY] : createRestaurantSchema
}), async (req, res, next) => {
  try {
    const restaurant = await db.addNewRestaurant(req.body);
    res.status(201).send({restaurant: restaurant, message: 'Restaurant added to MongoDB.'});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create restaurant' });
  }
})

router.get('/restaurants', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer(),
    perPage: Joi.number().integer(),
    borough: Joi.string()
  })
}), async (req, res) => {
  const page = Math.max(0, parseInt(req.query.page, 10) || 1);
  const perPage = Math.min(100, parseInt(req.query.perPage, 10) || 10);
  const borough = req.query.borough || null;

  try {
    const restaurants = await db.getAllRestaurants(page, perPage, borough);
    res.render('restaurants',{
      restaurants: restaurants,
      user : req.user.username,
      perPageOptions: [5, 10, 15],
      boroughLabel : borough||'',
      selectedPerPage: perPage});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/restaurants/:id', async function (req, res, next) {
  try {
    const restaurant = await db.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).send({ message: 'Restaurant not found' });
    }

    res.render('addRestaurant', {
      title: 'Edit Restaurant',
      restaurant,
      editMode: true,
      actionUrl: `/api/restaurants/${req.params.id}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch restaurant' });
  }
});

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

router.delete('/restaurants/:id', async function (req, res, next) {
  try {
    const deletedRestaurant = await db.deleteRestaurantById(req.params.id);

    if (deletedRestaurant) {
      return res.status(204).send();
    } else {
      return res.status(404).send({message: 'Restaurant not found'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: 'Failed to delete'});
  }
})

router.post('/register', async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).send('username or password is missing');
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const user = {username, password: hashedPass};
    const savedUser = await userDb.addUser(user);
    res.status(201).send(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).send({message: 'Username already exists'});
    } else {
      console.error(error);
      res.status(500).send({message: 'Error occurred while creating the user'});
    }
  }
})

router.post('/login', async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).send('username or password is missing');
  }

  var user = new User({username: username, password: password});

  var response = await userDb.checkUser(user);
  if (response) {
    let token = generateAccessToken(username);
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true, // Accessible only by the server
    });
    return res.status(200).send({token});
  } else {
    return res.status(401).send({message: 'Incorrect user credentials'});
  }

})

function generateAccessToken(username) {
  return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

module.exports = router;
