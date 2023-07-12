import mongoose from 'mongoose';
const ObjectID = require('mongodb').ObjectID;

const postSchema = new mongoose.Schema(
    {
        content: {
            type: {},
            required: true
        },
        postedBy: {
            type: ObjectID,
            ref: "User"
        },
        image: {
            url: String,
            public_id: String
        },
        likes: [{ type: ObjectID, ref: "User" }],
        comments: [{
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: {
                type: ObjectID,
                ref: "User"
            }
        }]
    },
    { timestamps: true }
)

export default mongoose.model("Post", postSchema);