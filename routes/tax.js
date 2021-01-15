const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')

//get all tax.....
router.get("/tax", async(req,res)=>{
    try{
        const all_tax = await knex("tax")
        if(!all_tax[0]){
            res.status(400).json({
                message : "invalid tax....!"
            })
        }else{
            res.json(all_tax)
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get tax by id.......
router.get("/tax/:tax_id", async(req,res)=>{
    try{
        const tax_Id = req.params.tax_id
        const cus_tax = await knex("tax")
        .where("tax_id",tax_Id)
        if(!cus_tax[0]){
            res.status(400).json({
                message : "invalid tax...!"
            })
        }else{
            res.json(cus_tax[0])
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
module.exports = router