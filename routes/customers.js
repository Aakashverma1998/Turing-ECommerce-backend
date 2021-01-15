const router = require('express').Router()
const knex = require('../Database/database')
const bcrypt = require('bcryptjs')
const errors = require('../util/errorhandler')
const jwt = require("jsonwebtoken")

//everything about customer......
router.put("/customer", async(req,res)=>{
    try{
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password,10)
        
        const customer_detail = await knex("customer")
        .where("email",email)
        if(customer_detail[0]){
            res.status(400).json({
                message : "customer is already exist..."
            })
          
        }else{
              await knex("customer")
              .insert({
                  name: name,
                  email : email,
                  password: hashedPassword
                })
                const send_user_data = await knex("customer")
                .where("email",email)
                res.send(send_user_data)
        }
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
//customer signup.......
router.post("/customer/signup", async(req,res)=>{
    try{
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password,10)
        const accesstoken = jwt.sign({email:email},"navgurukul",{expiresIn:"1h"})
        var data2  = await knex("customer").select("name","email","password").where("email",email)
        if(data2.length > 0){
            res.status(400).json({
                message:"customer already existed..!"
            })
        }
        await knex("customer")
        .insert({name:name, password:hashedPassword,email:email})
        .where("email",email)
        const data = await knex("customer").select().where("email",email)
        res.json({
            "customer":{
                "schema": data
            },
            "accessToken":accesstoken,
            "expiresIn":"1h"
        })
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

//customer login......
router.post("/customer/login", async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password
        const cus_login = await knex("customer").select("email", "password").where("email",email)
        var Password = await bcrypt.compare( password , cus_login[0].password )
        if(cus_login[0].email == email && Password){
            const accesstoken = jwt.sign({email:email, password:password},"navgurukul",{expiresIn:"1h"})
            res.json({
                "customer":{
                    "schema": cus_login,
                    "accessToken": accesstoken,
                    "expiresIn":"1h"
                },
                "message":"customer login sucessfully......"
            })

        }else{
            res.status(400).json({
                message : "invalid customer...."
            })
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
    
})
    

//customer udpate.........
router.put("/customer/update", async(req,res)=>{
    try{
        const name = req.body.name
        const customer_id = req.body.customer_id
        const email = req.body.email
        const password = req.body.password
        const address_1 = req.body.address_1
        const city = req.body.city
        const region = req.body.region
        const postal_code = req.body.postal_code
        const country = req.body.country
        const shipping_region_id = req.body.shipping_region_id
        const day_phone = req.body.day_phone
        const eve_phone = req.body.eve_phone
        const mob_phone = req.body.mob_phone
        const credit_card = req.body.credit_card
        await knex("customer")
        .where("email",email)
        .insert({
            customer_id:customer_id,
            name:name,
            email:email,
            password:password,
            address_1:address_1,
            city:city,
            region:region,
            postal_code:postal_code,
            country:country,
            shipping_region_id:shipping_region_id,
            day_phone:day_phone,
            eve_phone:eve_phone,
            mob_phone:mob_phone,
            credit_card:credit_card
        })
        const data = await knex("customer")
        .where("email",email)
        .select()
        res.json(data)

        
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})

// get a customer by id........
router.get("/customer/:customer_id", async(req,res)=>{
    const customer_Id = req.params.customer_id
    try{
        const customer = await knex("customer")
        .where("customer_id",customer_Id)
        if(!customer[0]){
            res.status(400).json({
                message : "invalid customer_id......"
            })
        }else{
            res.json(customer)
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json(errors.error500)
    }
})
module.exports = router 