import { useState } from "react";
import axios from 'axios'

import "./contactus.css";

const ContactUs = () => {
  const [formState, setFormState] = useState({
    formName: '',
    formEmail: '',
    formPhone: '',
    formSubject: '',
    formMessage: ''
  })

  const submitForm = async (e) => {
    e.preventDefault()
    
    await axios.post('/api/contactus', formState)
    .then(response => {
      console.log(response.data)
    }).catch(err => console.log(err))
  }

  return (
    <>
      <div className="margin-top-bar text-gold">
        <div className="d-flex justify-content-center align-items-center gap-5 mx-auto height-200">
          <div className="width-300">
            <p className="my-1">HOW CAN WE HELP?</p>
            <h1 className="mont-bold">CONTACT US</h1>
          </div>
          <div className="width-600">
            <p>
              At AGOY, we believe that the art of listening is the basis of good
              communication. That is why we&apos;re always ready to hear your
              questions, ideas or suggestions. Please fill out the contact form
              and we will come back to you as fast as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mb-5 form-contact-section bg-gold height-100vh text-white">
        <div style={{ backgroundColor: "green" }}></div>
        <div className="d-flex justify-content-center align-items-center">
          <form className="form-contact" onSubmit={submitForm}>
            <div className="form-outline mb-4">
              <input
                type="text"
                className="form-control input-white"
                placeholder="Name"
                onChange={e => setFormState(prev => ({ ...prev, formName: e.target.value}))}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control input-white"
                placeholder="Email"
                onChange={e => setFormState(prev => ({ ...prev, formEmail: e.target.value}))}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                type="number"
                className="form-control input-white"
                placeholder="Phone"
                onChange={e => setFormState(prev => ({ ...prev, formPhone: e.target.value}))}
              />
            </div>
            <div className="form-outline mb-4">
              <input
                type="text"
                className="form-control input-white"
                placeholder="Subject"
                onChange={e => setFormState(prev => ({ ...prev, formSubject: e.target.value}))}
              />
            </div>
            <div className="form-outline mb-4">
              <textarea
                type="text"
                className="form-control input-white"
                rows="3"
                maxLength="2500"
                placeholder="Message"
                onChange={e => setFormState(prev => ({ ...prev, formMessage: e.target.value}))}
              />
            </div>
            <button className="px-3 py-2 btn-white">send</button>
          </form>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-5 mb-5 contact-us-info">
        <div className="info-box">
          <img
            src="https://images.unsplash.com/photo-1601276174812-63280a55656e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="Address Image"
          />
        </div>
        <div className="info-box">
          <img
            src="https://images.unsplash.com/photo-1601276174812-63280a55656e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="Address Image"
          />
        </div>
        <div className="info-box">
          <img
            src="https://images.unsplash.com/photo-1601276174812-63280a55656e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="Address Image"
          />
        </div>
      </div>
    </>
  );
};

export default ContactUs;
