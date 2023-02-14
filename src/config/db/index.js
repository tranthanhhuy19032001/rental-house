const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://127.0.0.1/rental-houses', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect DB successfully!!!');
    } catch (error) {
        console.log('Connect Failed!');
    }
}

module.exports = { connect };
