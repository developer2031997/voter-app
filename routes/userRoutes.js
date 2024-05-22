const express = require('express');
const router = express.Router();
const User = require("../models/user.model");
const {generateToken,JWTMiddleware} = require("../jwt")


// register user 
router.post('/register',async (req,res)=>{  
    try { 
        
       const body = req.body;
       console.log('Request Body:', body);
   
       const newUser = await new User(body);
   
       const response = await newUser.save();
       console.log('data saved sucessfully !!!');

       const payload = {
        id: response._id, // Use the newly created user's ID
        username: response.username,
        role: response.role
    };

       const token = generateToken(payload);
       console.log("token",token)
       // Save the token in the user document

       // Update the user document with the generated token
       response.token = token;
       await response.save();

       res.status(200).json({response:response,token:token});

   }
       catch (error) {
           console.log(error);
           res.status(500).json({error : "Internal server error"})
   }
   });
// register user 

// login as a admin to get token
router.post('/login', async (req, res) => {

    const { role } = req.user;

    if (role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only admins can login and acess tokens" });
    }

    try {
        const {aadhar} = req.body;

        const user = await User.findOne({aadhar: aadhar});

        const payload = {
            username: user.id
        }
        const token = generateToken(payload);

        res.status(200).json({ token: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
// login as a admin to get token

// view all list of user
router.get('/profile', JWTMiddleware,  async (req, res) => {
       try {

        const { role } = req.user;

        if (role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admins view all user profile" });
        }
           const result = await User.find();
           console.log(result);
           res.status(200).json({ message: 'Fetch data successfully.', result: result });
       } catch (error) {
        // const result = await Person.find();
           console.log(error);
           res.status(500).json({ error: "Internal server error" });
       }
   });
// view all list of user

// view perticular user using id
router.get('/profile/:id', JWTMiddleware,  async (req, res) => {
    try {

        const { role } = req.user;

        if (role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admins can view profile" });
        }

        const id = req.params.id;
        const result = await User.findById(id);
        console.log(result);
        res.status(200).json({ message: 'Fetch data successfully.', result: result });
    } catch (error) {
     // const result = await Person.find();
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// view perticular user using id

// update user data, Only admin can do with token
router.put('/profile/:id',JWTMiddleware,async (req,res)=>{
    try {
        const { role } = req.user;

        if (role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admins can update user data" });
        }
     
        const userId = req.params.id;
       const updates = req.body;

        const user = await User.findByIdAndUpdate(userId,updates,{new :true});
        const updateUser = await user.save();
        console.log("user",updateUser);

        if (!user) {
            res.status(404).json({
                error: "User not Found"
            });
        }

     

        console.log("user data updated succesfully!!!");
        res.status(200).json(updateUser);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})
// update user Only admin can do with token

// update  Only password of user, only admin can do with token
router.put('/profile/password/:id',JWTMiddleware,async (req,res)=>{
    try {
        const { role } = req.user;

        if (role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only admins can update user password" });
        }
     
        const userId = req.params.id;
     const {password} = req.body;
     

     console.log("password",password);


        const user = await User.findByIdAndUpdate(userId,password,{new:true});
        console.log("user",user);
     
        const updatePassword = await user.save();
        console.log("user password updated succesfully!!!");
        res.status(200).json(updatePassword.password);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})
// update  Only password of user, only admin can do with token

// delete user , only admin can do with token
router.delete('/profile/:id', JWTMiddleware,async (req,res)=>{
   try {
    const { role } = req.user;

    if (role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only admins can delete users" });
    }
    
    const id = req.params.id;
    const deleteUser = await User.findOneAndDelete(id);

    console.log("user data deleted succesfully!!!");
    res.status(200).json({"delete User ": deleteUser});
   } catch (error) {
    res.status(500).json({ error: "Internal server error" });
   }
})
// delete user , only admin can do with token

module.exports= router;
