const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')


//create order.......
router.post("/orders", async(req,res)=>{
    try{
        const cart_id = req.body.cart_id
        const shipping_id = req.body.shipping_id
        const tax_id = req.body.tax_id
        const customer_id = req.body.customer_id
        const total_amount = req.body.total_amount
        const quantity = req.body .quantity
        const order_id = req.body.order_id
        const product_id = req.body.product_id
        const attributes = req.body.attributes
        const product_name = req.body.product_name
        const unit_cost = req.body.unit_cost

        await knex("shopping_cart")
        .where("cart_id",cart_id)
        .join("product", function(){
            this.on("shopping_cart.product_id","product.product_id")
        })
        const data1 = await knex("orders")
        .insert({
            "created_on":new Date(),
            "customer_id":customer_id,
            "shipping_id":shipping_id,
            "tax_id":tax_id,
            "total_amount":total_amount+unit_cost*quantity
        })
        // console.log(data1);
        const data2 = await knex("order_detail")
        .join("orders","order_detail.order_id","orders.order_id")
        .join("product","order_detail.product_id","product.prosuct_id")
        .insert({
            'order_id':order_id,
            'product_id':product_id,
            'attributes':attributes,
            'product_name': product_name,
            "quantity":quantity,
            'unit_cost': unit_cost
        })
        res.json(data2)

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
   
})


//get info about order....
router.get("/orders/:order_id", async(req,res)=>{
    try{
        const order_Id = req.params.order_id
        const order_status = await knex("orders")
        .where("orders.order_id", order_Id)
        .join("order_detail","orders.order_id","orders.order_id")
        .select("orders.order_id","total_amount", "created_on", "customer_id", "shipping_id", "tax_id", "item_id", "product_id", "attributes","product_name","product_name","unit_cost","quantity")
        if(!order_status[0]){
            res.status(400).json({
                message :"inavlid order id..!"
            })
        }else{
            res.json(order_status[0])
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
1
//GET  shortINFO.. ABOUT ORDER........
router.get("/orders/shortDetail/:order_id",async(req,res)=>{
    try{
        const order_Id = req.params.order_id
        const short_order_status = await knex("orders")
        .where("order_id",order_Id)
        .select("order_id","total_amount", "customer_id", "shipping_id","tax_id")
        if(!short_order_status[0]){
            res.status(400).json({
                message :"invalid order_id..!"
            })
        }else{
            res.json(short_order_status[0])
        }
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
module.exports = router