const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')


// to generate a unique cart_id...........
router.get("/shoppingcart/generateUniqueId", (req,res)=>{
    var text = "",
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (var i = 0; i < 18; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
}
console.log('your cart_id has been sent!');
res.send({ cart_id: text });
})


// Add a Product in the cart........
router.post("/shoppingcart/add",async(req,res)=>{
    const {cart_id,product_id,attributes} = req.body
    // display cart to user
    const displayUserCart = () => {
        knex('shopping_cart')
            .join('product','shopping_cart.product_id','product.product_id')
            .where('shopping_cart.cart_id',cart_id)
            .andWhere('product.product_id',product_id)
            .select('name','attributes','product.product_id','price','quantity','image')
            .then(shoppingData => {
                return res.send(shoppingData)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(error.error500)
            })
    }
    // add product to cart
    return knex('shopping_cart')
        .join('product','shopping_cart.product_id','product.product_id')
        .where('cart_id',cart_id)
        .andWhere('product.product_id',product_id)
        .then(cartData => {
            
            if (cartData.length == 0) {
                return knex('shopping_cart')
                    .join('product','shopping_cart.product_id','product.product_id')
                    .where('cart_id',cart_id)
                    .andWhere('product.product_id',product_id)
                    .insert({
                        cart_id: cart_id,
                        product_id: product_id,
                        attributes: attributes,
                        quantity: 1,
                        added_on: new Date()
                    })
                    .then(() => {
                        return displayUserCart()
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json(error.error500)
                    })
            }
            knex('shopping_cart')
                .join('product','shopping_cart.product_id','product.product_id')
                .where('cart_id',cart_id)
                .andWhere('product.product_id',product_id)
                .update({
                    quantity: cartData[0].quantity + 1,
                    added_on: new Date()
                })
                .then(() => {
                    return displayUserCart()
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json(error.error500)
                })
        })
})

//// get list of products by cart_id........
router.get("/shoppingcart/:cart_id", async(req,res)=>{
    try{
        const cart_Id = req.params.cart_id
        const data = await knex("shopping_cart")
        .join('product','product.product_id','shopping_cart.product_id')
        .where("cart_id",cart_Id)
        .select('item_id','name','attributes','product.product_id','price','quantity','image')
        if(!data[0]){
            res.status(400).json({
                message:"cart_id does't exist...!"
            })
        }else{
            res.json(data)
        }


    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }

})


//update cart by item_id..............
router.put("/shoppingcart/update/:item_id",(req,res)=>{
    const itemId = req.params.item_id
    const {quantity} = req.body
    knex('shopping_cart')
    .where('item_id',itemId)
    .update({
        quantity: quantity
    })
    .then(() => {
        knex('shopping_cart')
            .join('product','product.product_id','shopping_cart.product_id')
            .where('item_id',itemId)
            .then(shoppingData => {
                return res.send(shoppingData)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(error.error500)
            })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(error.error500)
    })
})


//// empty cart by cart_id.............
router.delete("/shoppingcart/empty/:cart_id", async(req,res)=>{
    try{
        const cart_Id = req.params.cart_id
        const del_data = await knex("shopping_cart")
        .where('shopping_cart.cart_id',cart_Id)
        .del()
        res.json(del_data)

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }

})

//get totalAmount from Cart....
router.get("/shoppingcart/totalAmount/:cart_id", async(req,res)=>{
    try{
        const cart_Id = req.params.cart_id
        const cartData = await knex("shopping_cart")
        .join('product','product.product_id','shopping_cart.product_id')
        .where('cart_id',cart_Id)
         // using bitwise operator('~~') for whole number...
         const totalAmount = ~~cartData.map(p => p.quantity*p.price).reduce((total,element) => total+element,0)
         res.json({
            totalAmount: totalAmount
         })
    }catch(err){
        console.log((err));
        res.status(500).json(errors.error500)
    }
})

//Save a Product for latter............
router.get("/shoppingcart/saveForLater/:item_id",(req,res)=>{
    const {item_id} = req.params
    const saveProductForLatter = () => {
            knex('shopping_cart')
                .where('item_id',item_id)
                .select('item_id','cart_id','product_id','attributes','quantity')
                .then(cartData => {
                    knex('save_product_for_later')
                        .insert(cartData[0])
                        .then(() => {
                            knex('shopping_cart')
                                .where('item_id',item_id)
                                .del()
                                .then(() => {
                                    res.json({
                                        note: 'product_saved for latter'
                                    })
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(500).json(error.error500)
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json(error.error500)
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json(error.error500)
                })
    }
    knex.schema.hasTable('save_product_for_later')
        .then(exists => {
            if (!exists){
                return  knex.schema.createTable('save_product_for_later',table => {
                    table.integer('item_id').primary()
                    table.string('cart_id')
                    table.integer('product_id')
                    table.string('attributes')
                    table.string('quantity')   
                })
                .then(() => {
                    saveProductForLatter()
                })                 
            }else{
                saveProductForLatter()
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json(error.error500)
        })
})

//// get products from save_product by cart_id..........
router.get("/shoppingcart/getSaved/:cart_id",async(req,res)=>{
    try{
        const cart_Id = req.params.cart_id
        const cartData = await knex('save_product_for_later')
        .join('product','product.product_id','save_product_for_later.product_id')
        .where('cart_id',cart_Id)
        .select('item_id','name','attributes','price')
        res.json(cartData[0])
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})


// remove a product from shopping by item_id..............
router.delete("/shoppingcart/removeProduct/:item_id",async(req,res)=>{
    try{
        const {item_id} = req.params
        await knex("shopping_cart")
        .where('item_id',item_id)
        .del()
        res.json({
            message:"product deleted."
        })

    }catch(err){
        res.status(500).json(errors.error500)
    }

})
module.exports = router 