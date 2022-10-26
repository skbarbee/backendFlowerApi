const mongoose = require('mongoose')

const flowerSchema= new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		primaryColor: {
			type: String,
			required: true,
		},
		shouldPlant: {
			type: Number,
			enum:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Flower', flowerSchema)