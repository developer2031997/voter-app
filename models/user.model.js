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
    }
})


userSchema.pre('save', async function(next) {
    try {
        console.log('pre-save hook called');
    console.log('isModified:', this.isModified('password'));
    console.log('current password:', this.password);
        const person = this;

        // Hash the password only if it's modified or new
        if (!person.isModified('password')) return next();

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(person.password, salt);
console.log("person.password",person.password)

console.log("hashPassword",hashPassword)
        // Update the password with the hashed value
        person.password = hashPassword;

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log("candidatePassword :- ",typeof candidatePassword, candidatePassword)
        console.log("this.password :- ", typeof this.password, this.password)

        // Compare candidate password with the stored hashed password
        const isMatch = await  bcrypt.compare(candidatePassword, this.password);
        console.log("isMatch",isMatch);
        return isMatch;
    } catch (error) {
        throw new Error('Invalid password comparison');
    }
};

const User = mongoose.model('User', userSchema);
module.exports= User;