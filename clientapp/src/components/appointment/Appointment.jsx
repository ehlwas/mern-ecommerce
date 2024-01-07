import { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import { ItemPropsContext } from "../../context/itemPropsContext";

import { DotSpinner } from '@uiball/loaders'

import './appointment.css';

const Appointment = () => {
  const { token } = useContext(ItemPropsContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [notavailableDate, setNotavailableDate] = useState([]);
  const [notavailableTime, setNotavailableTime] = useState([]);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false)

  const [hoursHandler, setHoursHandler] = useState()
  const [minutesHandler, setMinutesHandler] = useState()
  const [meridiemHandler, setMeridiemHandler] = useState("AM")

  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const minutes = Array.from({ length: 59 }, (_, index) => index + 1);

  const tileClassName = ({ date }) => {
    const dateOnly = date.toLocaleDateString()

    if (notavailableDate.includes(dateOnly.toString())) {
      return 'not-available'
    }

    return null;
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTime(); // Reset selected time when the date changes
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const submitTime = async () => {
    if (!hoursHandler || !minutesHandler) {
      return
    }
    setSubmitLoading(true)
    const formattedDateAndTime = `${selectedDate.toLocaleDateString()}, ${hoursHandler}:${minutesHandler}:00 ${meridiemHandler}`

    const originalDateTime = new Date(formattedDateAndTime);
    const isoString = originalDateTime.toISOString();

    const isoDate = isoString.split('T')[0];
    const isoTime = isoString.split('T')[1].split('.')[0];

    const finalISOFormat = `${isoDate}T${isoTime}.190+00:00`;

    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const data = {
      dateTime: finalISOFormat,
      stringDate: selectedDate,
      stringTime: selectedTime
    }

    await axios.post('/api/appointment/setAppointment', data, config)
    .then(response => {
      console.log(response)
      setAppointmentSuccess(true)
    }).catch(err => {
      setSubmitLoading(false)
    })
  }

  const getAvailableDateByMonth = async () => {
    setNotavailableDate([])
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const data = {
      selectedDateTime: selectedDate
    }

    await axios.post('/api/appointment/getUnavailableDates', data, config)
    .then(response => {
      setNotavailableDate(response.data)
    }).catch(err => console.log(err))
  }

  const getAvailableTime = async () => {
    setNotavailableTime([])
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const data = {
      selectedDateTime: selectedDate
    }

    await axios.post('/api/appointment/getUnavailableTime', data, config)
    .then(response => {
      setNotavailableTime(response.data)
    }).catch(err => console.log(err))
  }

  const handleViewChange = async ({ activeStartDate }) => {
    await setSelectedMonth(activeStartDate);
  };

  useEffect(() => {
    getAvailableDateByMonth()
  }, [selectedMonth])

  useEffect(() => {
    getAvailableTime()
  }, [selectedDate])

  const isCalendarDisabled = () => {
    return false;
  };

  return (
    <>
      <div className={`appointment-header-container d-flex align-items-center justify-content-center text-white shadow-sm}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url('https://plus.unsplash.com/premium_photo-1663047487227-0f3cd88ed8aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')` }}>
        <div className='header-one-content text-center'>
          <div className='m-auto width-100 height-10 bg-white ' />
          <h2 className='title'>Learn more</h2>
          <h6>Set appointment for AGOY lessons</h6>
        </div>
      </div>

      {appointmentSuccess ? (
        <div className='py-5 text-center'>
          <h2 className='text-gold'>Appointment Success!</h2>
          <Link to="/" className='btn-gold text-decoration-none'>Go back to Homepage</Link>
        </div>
      ) : (
        <div className="d-flex appointment-container text-dim">
          {submitLoading ? (
            <div className="loading-content mx-auto width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <DotSpinner 
                size={100}
                speed={0.9} 
                color="#D39E6C" 
              />
              <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
            </div> 
          ) : (
            <div className='row mx-auto py-5 w-75'>
              <div className='col'>
                <h2 className='text-center'>Select an Appointment Date:</h2>
                <Calendar
                  className='mont-regular mx-auto shadow'
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileClassName={tileClassName}
                  minDate={new Date()}
                  locale="en-US"
                  onActiveStartDateChange={handleViewChange}
                  tileDisabled={isCalendarDisabled}
                />
              </div>
              
              <div className="col d-flex align-items-center justify-content-center time-slots text-center">
                <div>
                  <h2 className='text-center'>Select a Time Slot:</h2>
                  <div className='d-flex justify-content-center align-items-center gap-3'>
                    <select className='input-black' onChange={e => setHoursHandler(e.target.value)}>
                      <option selected hidden>HH</option>
                      {hours.map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))}
                    </select>
                    <h5 className='mb-0'>:</h5>
                    <select className='input-black' onChange={e => setMinutesHandler(e.target.value)}>
                      <option selected hidden>MM</option>
                      {minutes.map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))}
                    </select>
                    <h5 className='mb-0'>:</h5>
                    <select className='input-black' onChange={e => setMeridiemHandler(e.target.value)}>
                      <option value="AM" selected>AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {/* <div className='d-flex flex-column width-200 mx-auto'>
                    <label>
                      <input
                        type="radio"
                        value="8:00:00 AM"
                        checked={selectedTime === '8:00:00 AM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('8:00:00 AM')}
                      />
                      8:00AM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="9:00:00 AM"
                        checked={selectedTime === '9:00:00 AM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('9:00:00 AM')}
                      />
                      9:00AM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="10:00:00 AM"
                        checked={selectedTime === '10:00:00 AM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('10:00:00 AM')}
                      />
                      10:00AM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="11:00:00 AM"
                        checked={selectedTime === '11:00:00 AM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('11:00:00 AM')}
                      />
                      11:00AM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="12:00:00 PM"
                        checked={selectedTime === '12:00:00 PM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('12:00:00 PM')}
                      />
                      12:00PM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="1:00:00 PM"
                        checked={selectedTime === '1:00:00 PM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('1:00:00 PM')}
                      />
                      1:00PM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="2:00:00 PM"
                        checked={selectedTime === '2:00:00 PM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('2:00:00 PM')}
                      />
                      2:00PM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="3:00:00 PM"
                        checked={selectedTime === '3:00:00 PM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('3:00:00 PM')}
                      />
                      3:00PM
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="4:00:00 PM"
                        checked={selectedTime === '4:00:00 PM'}
                        onChange={handleTimeChange}
                        disabled={notavailableTime.includes('4:00:00 PM')}
                      />
                      4:00PM
                    </label>
                  </div> */}
                </div>
              </div>

              <div className='col text-center d-flex justify-content-center align-items-center'>
                <div>
                  <h2 className='text-center'>Schedule of Appointment:</h2>
                  <select className='w-100 input-black mb-3'>
                    <option selected hidden>-APPOINTMENT SUBJECT-</option>
                    <option>Pre-Sleep Experience</option>
                    <option>Sleep Experience</option>
                    <option>Post-Sleep Experience</option>
                    <option>Appointment in Person</option>
                    <option>Appointment in Online</option>
                  </select>
                  <p className='mb-0'>Selected Date: {selectedDate.toLocaleDateString()}</p>
                  {selectedTime && <p>Selected Time: {selectedTime}</p>}
                  {submitLoading ?
                    <button className="btn-gold py-2 px-5 text-center btn-block mb-4" disabled>
                      <div className="snippet" data-title="dot-pulse">
                          <div className="stage">
                          <div className="dot-pulse"></div>
                          </div>
                      </div>
                    </button>
                    :
                    <button className='btn-gold' onClick={() => submitTime()}>Set Appointment</button>}
                </div>
              </div>
            </div>)}
        </div>)}
    </>
  );
};

export default Appointment;
