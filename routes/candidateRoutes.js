const express = require('express');
const router = express.Router();
const Candidate = require("../models/candidate.model");
const User = require("../models/user.model");

const {JWTMiddleware} = require("../jwt")


// register candidates only admin can do
router.post('/register', JWTMiddleware, async (req, res) => {
		try {
		
				const body = req.body;
				console.log('Request Body:', body);

				const newcandidates = await new Candidate(body);

				const response = await newcandidates.save();
				console.log('New Candidated saved sucessfully !!!');
				res.status(200).json({
					response: response
				});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "Internal server error"
			})
		}
	});
// register candidates only admin can do

// get all list of candidates 
router.get("/", async (req, res) => {
		const allUsers = await Candidate.find();
		res.status(200).json(allUsers);
	});
// get all list of candidates 

// update candidate only admin can do
 router.put('/:id', JWTMiddleware, async (req, res) => {
		try {
			const id = req.params.id;
			const updates = req.body;

			const result = await Candidate.findByIdAndUpdate(id, updates, {
				new: true
			});

			if (!result) {
				res.status(404).json({
					error: "Candidates not Found"
				});
			}

			console.log("candidate data updated succesfully!!!");
			res.status(200).json(result);

		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "Internal server error"
			});
		}
	})
// update candidate only admin can do


// delete candidate only admin can do
router.delete('/:id', JWTMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Candidate.findOneAndDelete(id);

        console.log("candidate delted succesfully!!!");
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
})
// update candidate only admin can do

// voting
router.post('/vote/:candidateId',JWTMiddleware, async (req,res)=>{
  try{  
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    const candidate = await Candidate.findById(candidateId);

    const user = await User.findById(userId);

    if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
    }
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (user.isVoted) {
        return res.status(404).json({ error: 'User Haved already Voted !!' });
    }
    if (user.role=== 'admin') {
        return res.status(404).json({ error: 'admin is not allowed Voted !!' });
    }
       // Create a new vote object
       const vote = {
        user: userId, // Associate the user who voted
        votedAt: new Date() // Timestamp when the vote was cast
    };

    if(candidate){
           // Push the vote object to the candidate's votes array
    candidate.votes.push(vote);

       // Increment the vote count for the candidate
       candidate.voteCount++;
       user.isVoted = true;

        await candidate.save();
        await user.save(); 

        console.log('Candidate after voting:', candidate);
        res.status(201).json(candidate);
    }

}catch(error){
         console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
}})
// voting


// vote count 
router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
// count vote



module.exports = router;