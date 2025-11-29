import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    savedRecipes: [{
        recipeId: String,
        name: String,
        description: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        difficulty: String,
        servings: Number,
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],
    favoriteRecipes: [{
        recipeId: String,
        name: String,
        description: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        difficulty: String,
        servings: Number,
        favoritedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
