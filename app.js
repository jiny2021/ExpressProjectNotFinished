const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override")
const Campground = require("./models/campground")
const Joi = require("joi")
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}
const db = mongoose.connection
db.on("error", console.error.bind("Connection error"))
db.once("open", () => { console.log("Database connected") })
app.get("/", (req, res) => { res.render("home") })
app.get("/makecampground", catchAsync(async (req, res) => {
    const camp = new Campground({ title: "My backyard", decription: "Cheap camping!" })
    await camp.save()
    res.send(camp)
}))
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))
app.delete('/campgrounds', catchAsync(async (req, res) => {
    let allCampgrounds = await db.campgrounds.find()
    db.campgrounds.deleteMany()
}))
const validateCampground = async(req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = err.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
}
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    })
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground })
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
}))
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    campground.save();
    res.redirect(`/campgrounds/${id}`)
}))
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})
app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) {
        err.message = "We've had a problem here. Try again later. :("
    }
    res.status(statusCode).render("error")
})
app.listen(4806, () => {
    console.log("serving on port 4806")
})