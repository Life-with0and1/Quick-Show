import bookingModal from "../models/booking.model.js";
import { clerkClient } from "@clerk/express";
import movieModal from "../models/movie.model.js";


export const getUserBookings = async (req,res) => {
    try {
        const user = req.auth().userId;

        const bookings = await bookingModal.find({ user }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const updateFavorite = async (req,res) => {
    try {
        const userId = req.auth().userId;
        const { movieId } = req.body;

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata });

        res.json({ success: true, message: "Updated favorites movies." });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req,res) => {
    try {
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);

        const favorites = user.privateMetadata.favorites;

       const movies = await movieModal.find({_id:{$in:favorites}});

        res.json({ success: true, movies });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

