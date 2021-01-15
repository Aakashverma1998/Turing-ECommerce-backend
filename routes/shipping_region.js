const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')


//Return shippings regions......
router.get("/shipping/regions",async(req,res)=>{
    try{
        const shipping = await knex("shipping_region")
        res.json(shipping)
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//return shippings regions......
router.get("/shipping/regions/:shipping_region_id", async(req,res)=>{
    try{
        const shipping_region_Id = req.params.shipping_region_id
        const shopping_id = await knex("shipping_region")
        .join("shipping","shipping_region.shipping_region_id","shipping.shipping_region_id ")
        .where("shipping.shipping_region_id",shipping_region_Id)
        .select("shipping_id","shipping_type", "shipping_cost","shipping.shipping_region_id")
        if(!shopping_id[0]){
            res.status(400).json({
                message : "invalid shipping_region_id"
            })
        }else{
            res.json(shopping_id)
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
module.exports = router