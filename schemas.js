const Joi = require("joi")
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        decimal: Joi.number().required().min(0),
        image: Joi.string(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})