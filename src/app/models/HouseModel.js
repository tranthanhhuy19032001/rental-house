const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const houseSchema = new mongoose.Schema(
    {
        province: { type: String },
        district: { type: String },
        address: { type: String },
        title: { type: String },
        typeRoom: { type: String },
        area: { type: Number },
        money: { type: Number },
        description: { type: String },
        contactName: { type: String },
        phone: { type: Number },
        image: { type: String },
        slug: { type: String, slug: 'title', unique: true },
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        deletedAt: { type: Date },
    },
    {
        timestamps: true,
    },
);

//Add plugins
mongoose.plugin(slug);
houseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

houseSchema.virtual('users', {
    ref: 'User',
    foreignField: 'house',
    localField: '_id',
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
