import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    shows: {
        type: String,
        required: true,
        ref: 'Show'
    },
    amount: {
        type: Number,
        required: true
    },
    bookedSeats: {
        type: Array,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentLink: {
        tyep: String
    }

}, { timestamps: true })

const bookingModal = mongoose.model("Booking", bookingSchema);

export default bookingModal;