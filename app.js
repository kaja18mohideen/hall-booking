const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
;

app.use(bodyParser.json());

const rooms = [];
const bookings = [];

// Endpoint to create a room
app.post('/rooms', (req, res) => {
    const { name, seats, amenities, pricePerHour } = req.body;
    const newRoom = { id: rooms.length + 1, name, seats, amenities, pricePerHour };
    rooms.push(newRoom);
    res.json(newRoom);
});

// Endpoint to get all rooms
app.get('/rooms', (req, res) => {
    res.json(rooms);
});

// Endpoint to book a room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const newBooking = { 
        id: bookings.length + 1,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        bookingDate: new Date(),
        bookingStatus: 'Confirmed'
    };
    bookings.push(newBooking);
    res.json(newBooking);
});

// Endpoint to get all rooms with booked data
app.get('/rooms/booked', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        const bookedStatus = roomBookings.length > 0;
        return {
            roomName: room.name,
            bookedStatus,
            bookings: bookedStatus ? roomBookings : null
        };
    });
    res.json(roomsWithBookings);
});

// Endpoint to get all customers with booked data
app.get('/customers/booked', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room ? room.name : 'Room Not Found',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        };
    });
    res.json(customersWithBookings);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
