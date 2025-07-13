import bookingModel from "../models/booking.model.js"
import showModel from "../models/show.model.js";
import userModel from "../models/user.model.js";

export const isAdmin = (req, res) => {
    res.json({ success: true, isAdmin: true });
}


export const getDashboardData = async (req, res) => {
    try {
        const booking = await bookingModel.find({ isPaid: true });
        const activeShows = await showModel.find({ showDateTime: { $gte: new Date() } }).populate('movie');

        const totalUser = await userModel.countDocuments();

        const dashBoardData = {
            totalBooking: booking.length,
            totalRevenue: booking.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };

        res.json({ success: true, dashBoardData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getAllShows = async (req, res) => {
    try {
        const shows = await showModel.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showsDateTime: 1 });

        res.json({ success: true, shows });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({}).populate('user').populate({ path: "show", populate: { path: "movie" } }).sort({ createdAt: -1 });


        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}