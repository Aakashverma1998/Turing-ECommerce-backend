const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')

//get all attributes list....
router.get("/attributes", async(req,res)=>{
    try{
        const attributes = await knex("attribute")
        res.json(attributes)
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get attributes list by id.......
router.get("/attributes/:attribute_id", async(req,res)=>{
    const Attribute_id = req.params.attribute_id
    try{
        const attributes = await knex("attribute")
        .where("attribute_id", Attribute_id)
        console.log(attributes);
        if(!attributes[0]){
            res.status(400).json({
                message:" No attributes id avaliable...! "
            })
        }else{
            res.json(attributes)
        }
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get attributes list by attribute_id....
router.get("/attributes/values/:attribute_id", async(req,res)=>{
    const attribute_Id= req.params.attribute_id
    try{
        const attributes = await knex("attribute_value")
        .where("attribute_id", attribute_Id)
        .select("attribute_value_id","value")
        if(!attributes[0]){
            res.status(400).json({
                message:"invalid attribute product_id....!"
            })
        }else{
            res.json(attributes)
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get all attributes with product id....
router.get("/attributes/inProduct/:product_id",async(req,res)=>{
    const product_Id = req.params.product_id
    console.log(product_Id)
    try{
        const all_productId = await knex("attribute")
        .join("attribute_value","attribute.attribute_id","=","attribute_value.attribute_id")
        .join("product_attribute","product_attribute.attribute_value_id ","=", "attribute_value.attribute_value_id")
        .where("product_id", product_Id)
        .select("name","attribute_value.attribute_value_id","value")
        console.log(all_productId);
        if(!all_productId[0]){
            res.status(400).json({
                message:"invalid attribute product_id....!"
            })
        }else{
            res.json(all_productId)
        }
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }

})
module.exports = router