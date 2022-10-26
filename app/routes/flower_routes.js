// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Flower = require('../models/flower')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()


// INDEX
// GET /flowers
router.get('/flowers', requireToken, (req, res, next) => {
	Flower.find()
		.then((flowers) => {
			return flowers.map(flower => flower)
		})
		.then((flowers) => res.status(200).json({ flowers: flowers }))
		// if an error occurs, pass it to the handler
		.catch(next)
})


// SHOW
// GET /flowers/5a7db6c74d55bc51bdf39793
router.get('/flowers/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Flower.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((flower) => res.status(200).json({ flower: flower }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// Create
// /FLOWER
router.post('/flowers', requireToken, (req, res, next) => {
    req.body.flower.owner = req.user.id

    // one the front end I HAVE TO SEND a flower as the top level key
    // flower: {name: '', color: ''}
   Flower.create(req.body.flower)
    .then(flower => {
        res.status(201).json({ flower: flower })
    })
    .catch(next)
    // .catch(error => next(error))

})

// UPDATE
// PATCH /flowers/5a7db6c74d55bc51bdf39793
router.patch('/flowers/:id', requireToken, removeBlanks, (req,res,next)=>{
	delete req.body.flower.owner

	Flower.findById(req.params.id)
		.then(handle404)
		.then((flower)=>{
			requireOwnership(req, flower)
			return flower.updateOne(req.body.flower)

		})
		.then(()=>res.sendStatus(204))
		.catch(next)
})


module.exports = router