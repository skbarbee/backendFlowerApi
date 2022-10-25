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

module.exports = mongoose.model('Example', exampleSchema)