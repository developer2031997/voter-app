const express = require('express');
const routes = express.Router();
const Candidate = require("../models/candidate.model");
const User = require("../models/user.model");

const {generateToken,JWTMiddleware} = require("../jwt")

const checkRoles = async(userId)=>{

    console.log("userId",userId)
    try{
        const user = await User.findById(userId)
         if(user.role === 'admin'){
            return true;
         }
    }
    catch(error){
        return false;   
    }
}

routes
.post('/',JWTMiddleware,async (req,res)=>{
    try {   
console.log("req.user",req.user)
    if(await !checkRoles(req.user.id)){
        return res.status(400).json({message:"user does not have admin"});
}else {

      const body = req.body;
       console.log('Request Body:', body);
   
       const newcandidates = await new Candidate(body);
   
       const response = await newcandidates.save();
       console.log('New Candidated saved sucessfully !!!');
       res.status(200).json({response:response});

   }
}
       catch (error) {
           console.log(error);
           res.status(500).json({error : "Internal server error"})
   }
   })
// routes
// .put('/:id',async (req,res)=>{
//     try {
//         const id = req.params.id;
//         const updatedId = req.body;
//         console.log("id",id);
//         console.log(updatedId);


//         const result = await Person.findByIdAndUpdate(id,updatedId,{
//             new : true,
//             runValidators : true
//         });

//         if(!result){
//             res.status(400).json({error : "Person not Found"});
//         }

//         console.log("data updated !!!");
//         res.status(200).json(result);
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// })


module.exports= routes;

// .get('/', JWTMiddleware,  async (req, res) => {
//     try {
//         const result = await Person.find();
//         console.log(result);
//         res.status(200).json({ message: 'Fetch data successfully.', result: result });
//     } catch (error) {
//      // const result = await Person.find();
//         console.log(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// })