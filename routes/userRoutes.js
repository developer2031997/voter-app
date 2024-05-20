const express = require('express');
const routes = express.Router();
const User = require("../models/user.model");
const {generateToken,JWTMiddleware} = require("../jwt")

routes
.post('/signup',async (req,res)=>{  
    try { 
          const body = req.body;
       console.log('Request Body:', body);
   
       const newUser = await new User(body);
   
       const response = await newUser.save();
       console.log('data saved sucessfully !!!');

       const payload = {
        username : body.id
       }

       const token = generateToken(payload);
       console.log("token",token)
       res.status(200).json({response:response,token:token});

   }
       catch (error) {
           console.log(error);
           res.status(500).json({error : "Internal server error"})
   }
   }).get('/', JWTMiddleware,  async (req, res) => {
       try {
           const result = await Person.find();
           console.log(result);
           res.status(200).json({ message: 'Fetch data successfully.', result: result });
       } catch (error) {
        // const result = await Person.find();
           console.log(error);
           res.status(500).json({ error: "Internal server error" });
       }
   })
   .post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
  
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

const payload = {
    username : user.id
}
const token = generateToken(payload);

      res.status(200).json({ token : token});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

routes
.put('/profile/password',JWTMiddleware,async (req,res)=>{
    try {
     
        const userId = user.id;
     const {currrentPass, newPassword} = req.body;


        const user = await user.findById(UserId);

        if (!user || !(await user.comparePassword(currrentPass))) {
            return res.status(401).json({ error: 'Invalid username or password' });
          }
     
          user.password = newPassword;
          await user.save();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Profile route
routes.get('/profile', JWTMiddleware, async (req, res) => {
    try{
    const userdata = req.user;
    const userId = userData.id;
    const user = await Person.findById(userId) ;
    res.status(200).json({user});
    }catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    }})

module.exports= routes;
