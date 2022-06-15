const mongoose = require("mongoose")
const Campground = require("../models/campground")
const {places, descriptors} = require("./seedHelpers")
const cities = require("./cities")
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error"))
db.once("open", () => {
    console.log("Database connected")
})
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    // await Campground.deleteMany()
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            discription: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur ipsum obcaecati recusandae, neque voluptatibus dolorem cupiditate asperiores labore, aliquam aspernatur eum, deserunt cum beatae reiciendis necessitatibus vitae laudantium eius nulla? Ullam voluptatum nostrum soluta commodi ut veniam veritatis voluptates adipisci. Molestiae laboriosam fugiat consectetur nisi repellendus. Quod non mollitia inventore ut nobis necessitatibus possimus est! Exercitationem nam voluptates eligendi labore?",
            price: price
        }) 
        await camp.save()
    }
}
seedDB()
    .then(() => {
        mongoose.connection.close()
    })