const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UsersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

UsersSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UsersSchema.methods.matchPassword = async function (password) {
    const comparacion = await bcrypt.compareSync(password, this.password);
    return comparacion;
}

module.exports = mongoose.model('User', UsersSchema)