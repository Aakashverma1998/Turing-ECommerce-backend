const express = require('express');

const deparment = require('./routes/department')
const categories = require("./routes/categories")
const attributes = require("./routes/attributes")
const Products = require("./routes/products")
const customers = require("./routes/customers")
const shoppingcart = require("./routes/shoppingcart")
const orders = require("./routes/orders")
const tax = require("./routes/tax")
const shipping = require("./routes/shipping_region")


const port = process.env.port || 3000

const app = express();
app.use(express.json());
app.use("/route", deparment)
app.use("/route", categories)
app.use("/route", attributes)
app.use("/route", Products)
app.use("/route", customers)
app.use("/route", shoppingcart )
app.use("/route", orders )
app.use("/route", tax )
app.use("/route", shipping)


app.listen(port,() => {
    console.log(`connected through port ${port}`)
})