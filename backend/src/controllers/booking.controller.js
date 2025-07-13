import showModal from "../models/show.model.js";
import bookingModal from "../models/booking.model.js"

const checkSeatAvailablity = async (showId, selectedSeats) => {
    try {
        const show = await showModal.findById(showId);

        if (!show) {
            return false;
        }

        const occupiedSeats = show.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        if (isAnySeatTaken) {
            return false;
        }
        return true;

    } catch (error) {
        console.log(error.message);
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;

        const { origin } = req.headers;

        const isAvailable = await checkSeatAvailablity(showId, selectedSeats);


        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are not available." })
        }

        const showData = await showModal.findById(showId).populate("movieId");

        const booking = await bookingModal.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified("occupiedSeats");
        await showData.save();

        res.json({ success: true, message: "Booked succesfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;

        const showData = await showModal.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);


        res.json({ success: true, occupiedSeats });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

