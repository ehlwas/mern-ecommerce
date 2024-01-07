const Appointment = require("../models/appointmentModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const createAppointment = async (req, res) => {
  try {
    const { userId, firstName, userEmail } = req.user
    const appointment = req.body; 
    

    const newAppointment = new Appointment({
      userId,
      scheduledDateTime: appointment.dateTime
    });
    await newAppointment.save();

    // THIS IS GMAIL SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'agoysleep@gmail.com', // Gmail email address
        pass: 'zzmxltzipifuqici', // Gmail email password
      },
    });

    const setupDate = new Date(appointment.stringDate)
    
    await transporter.sendMail({
      from: `"AGOY Sleep Experience" <support@agoysleep.com>`, // sender address
      to: `${userEmail}`, // list of receivers
      subject: `Your AGOY Journey Awaits!`,
      html: `
      <p>Hello ${firstName},</p>

      <p>Exciting news! Your AGOY Yoga session is set:<br/>
      Date: ${setupDate.toLocaleDateString()}<br/>
      Time: ${appointment.stringTime}</p>

      <p>Get ready to unwind and find your balance.</p>

      <p>Namaste,</p>
      <p>AGOY Sleep Experience<br>
        support@agoysleep.com</p>`,
    });

    res.status(200).json({ message: "Appointment Scheduled." });
  } catch (error) {
    console.error("Error saving objects:", error);
    res.status(500).json({ message: "Error setting Appointment" });
  }
};

const getUnavailableDates = async (req, res) => {
  try {
    const { selectedDateTime } = req.body;
    const setDate = new Date(selectedDateTime);

    // Get the start and end dates for the selected month
    const startDate = new Date(setDate.getFullYear(), setDate.getMonth(), 1);
    const endDate = new Date(setDate.getFullYear(), setDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const existingAppointments = await Appointment.aggregate([
      {
        $match: {
          scheduledDateTime: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledDateTime" } },
          appointments: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    let unavailabledate = []

    await existingAppointments.map(item => {
      if (item.appointments.length >= 9) {
        const setDate = new Date(item.appointments[0].scheduledDateTime).toLocaleDateString()
        unavailabledate.push(setDate)
      }
    })

    res.status(200).json(unavailabledate);
  } catch (err) {
    res.status(500).json({ message: "Error getting unavailable dates" });
  }
}

const getUnavailableTime = async (req, res) => {
  try {
    const { selectedDateTime } = req.body;
    const setDate = new Date(selectedDateTime);

    // Get the start and end times for the selected day
    const startDate = new Date(setDate.getFullYear(), setDate.getMonth(), setDate.getDate());
    const endDate = new Date(setDate.getFullYear(), setDate.getMonth(), setDate.getDate(), 23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      scheduledDateTime: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const unavailableTime = []

    await existingAppointments.map(item => {
      const setTime = new Date(item.scheduledDateTime)
      unavailableTime.push(setTime.toLocaleTimeString())
    })

    res.status(200).json(unavailableTime);
  } catch (error) {
    res.status(500).json({ message: "Error getting unavailable time" })
  }
}

module.exports = {
  createAppointment,
  getUnavailableDates,
  getUnavailableTime
};
