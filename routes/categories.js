const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')

//get all categories of list.....
router.get("/categories",async(req,res)=>{
    try{
        const all_categories = await knex("category")
        console.log(all_categories);
        res.json({
            count:all_categories.length,
            rows:all_categories
        })

    }catch(error){
        res.status(500).send(errors.error500)
    }
})

//get category by id.........
router.get("/categories/:category_id", async(req,res)=>{
    const Category_id = req.params.category_id
    try{
        const cat_id = await knex("category")
        .where("category_id",  Category_id)
        console.log(cat_id)
        if(!cat_id[0]){
            res.status(400).json({
                message:"No category avaliable..!"
            })
        }else{
            res.status(200).json(cat_id[0])
        }
    }catch(error){
        res.status(500).json(errors.error500)
    }
})

//get category by product id.....
router.get("/categories/inProduct/:product_id", async(req,res)=>{
    const product_id = req.params.product_id
    console.log(product_id);
    try{
        const Products = await knex("category")
        .join('product_category','category.category_id',"=",'product_category.category_id')
        .where("product_id",product_id)
        .select("category.category_id","department_id","name")
        console.log(Products);
        if(!Products[0]){
            res.status(400).json({
                message:"No category product_id avaliable..!"
            })
        }else{
            res.json(Products)
        }

    }catch(err){
        console.log(err)
        res.status(500).json(errors.error500)
    }
})

//get category by department_id.....
router.get("/categories/inDepartment/:department_id", async(req,res)=>{
    const Department_id = req.params.department_id
    console.log(Department_id)
    try{
        const cat_dep_id = await knex("category")
        .where("department_id",Department_id)
        console.log(cat_dep_id);
        if(!cat_dep_id[0]){
            res.status(400).json({
                message:"No category department product_id avaliable..!"
            })
        }else{
            res.json(cat_dep_id)
        }
    }catch(error){
        res.status(500).json(errors.error500)
    }
})
module.exports = router