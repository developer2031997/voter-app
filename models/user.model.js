const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        require:true
    },
    age :{
        type: Number,
        require:true
    },
    aadhar :{
        type: Number,
        require:true,
        unique : true
    },
    password :{
        type :String,
        require : true
    },
    role :{
        type : String,
        enum :['voter', 'admin'],
        default : "voter"
    },
    isVoted :{
        type : Boolean,
        require : true,
        default : false
    },
    token : {
        type : String,
        unique : true,
        require : true
    }
})


userSchema.pre('save', async function(next) {
    try {
    console.log('pre-save hook called');
    console.log('current password:', this.password);
    const user = this;

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    console.log("user.password",user.password);
    console.log("hashPassword",hashPassword);

    // Update the password with the hashed value
    user.password = hashPassword;

     // Move the isModified check here
    console.log('isModified:', user.isModified('password'));

    next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const trimmedCandidatePassword = candidatePassword.trim();
        const trimmedStoredPassword = this.password.trim();
        console.log("candidatePassword :- ",typeof trimmedCandidatePassword, trimmedCandidatePassword,trimmedCandidatePassword.length)
        console.log("this.password :- ", typeof trimmedStoredPassword, trimmedStoredPassword,trimmedStoredPassword.length)
        // Compare candidate password with the stored hashed password
        const isMatch = await bcrypt.compare(trimmedCandidatePassword, trimmedStoredPassword);

        console.log("isMatch",isMatch);

        if(!isMatch) {
            throw new Error('Password does not match');
        }
    } catch (error) {
        throw new Error('Invalid password comparison');
    }
};

const User = mongoose.model('User', userSchema);
module.exports= User;