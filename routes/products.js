const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')

//Get All Products...........
router.get("/products",async(req,res)=>{
    try{
        const all_products = await knex("product")

        res.json({
            "count":all_products.length,
            "rows": all_products
        })
        console.log(all_products);
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})


//Search products...........
router.get("/products/search",async(req,res)=>{
    const Search_product = req.query.name
    try{
        const products = await knex("product")
        .where("name","like" ,`%${Search_product}%`)
        .orWhere("description","like" ,`%${Search_product}%`)
        .select("product_id", "name", "description", "price","discounted_price", "thumbnail")
        res.json(products)
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get products by product_id.....
router.get("/products/:product_id", async(req,res)=>{
    const product_Id = req.params.product_id
    try{
        const product = await knex("product")
        .where("product_id", product_Id)
        if(!product[0]){
            res.status(400).json({
                message: "invalid product_id"
            })
        }else{
            res.json(product[0])
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get list of products of categories............
router.get("/products/inCategory/:category_id", async(req,res)=>{
    const category_Id = req.params.category_id
    try{
        const categorys = await knex("product")
        .join("product_category","product.product_id", "product_category.product_id")
        .where("category_id",category_Id)
        .select("product.   product_id", "name", "description", "price","discounted_price", "thumbnail")
        if(!categorys[0]){
            res.status(400).json({
                message : "invalid product category_id.....!"
            })
        }else{
            res.json({
                "count": categorys.length,
                "rows": categorys
            })

        }
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
    
})

//get a list of products on department......
router.get("/products/inDepartment/:department_id", async(req,res)=>{
    const department_Id = req.params.department_id
    try{
        const departments = await knex("product")
        .where("department_id", department_Id)
        .join("product_category","product.product_id ","product_category.product_id")
        .join("category","product_category.category_id","category.category_id")
        .select("product.product_id", "product.name", "product.description", "price","discounted_price", "thumbnail")
        if(!departments[0]){
            res.status(400).json({
                message :"invalid product department_id....!"
            })
        }else{
            res.json({
                "count": departments.length,
                "rows": departments
            })
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//get details of product...........
router.get("/products/:product_id/details", async(req,res)=>{
    const product_Id = req.params.product_id
    try{
        const products = await knex("product")
        .where("product_id", product_Id)
        .select("product_id ","name", "description", "price", "discounted_price", "image", "image_2 ")
        if(!products[0]){
            res.status(400).json({
                message : "invalid product_id.....!"
            })
        }else{
            res.json(products)
        }

    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }

    
})

//get locations of  a product......
router.get("/products/:product_id/locations",async(req,res)=>{
    const product_Id = req.params.product_id
    try{
        const product_location = await knex("product")
        .join("product_category","product.product_id", "product_category.product_id")
        .join("category","product_category.category_id", "category.category_id ")
        .join("department","category.department_id","department.department_id")
        .where("product.product_id", product_Id)
        .select("category.category_id", "category.name as category_name", "category.department_id", "department.name as department_name")
        if(!product_location[0]){
            res.status(400).json({
                message : "invalid product location...!"
            })
        }
        res.json(product_location[0])
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

module.exports = router