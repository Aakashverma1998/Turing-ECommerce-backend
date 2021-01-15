const router = require('express').Router()
const knex = require('../Database/database')
const errors = require('../util/errorhandler')

//GET  data by department.....
router.get('/departments',async(req,res) => {
    try{
        const dep_data = await knex('department')
        res.json(dep_data)
        console.log(dep_data);
    }catch(error){
        res.status(500).json(errors.error500)
    }
     
})


//GET data by department_id......
router.get("/departments/:id", async(req,res)=>{
    const department_id = req.params.id
    try{
        Department_id = await knex("department")
        .where("department_id", department_id)
        console.log(Department_id[0]);
        if(!Department_id[0]){
            res.status(400).json({
                message: "No Department avaliable..!"
            })
        }else{
            res.json(Department_id[0])
        }
    }catch(error){
        res.status(500).json(errors.error500)
    }
})


module.exports = router
