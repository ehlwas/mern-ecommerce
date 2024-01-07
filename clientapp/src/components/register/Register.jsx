import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ItemPropsContext } from '../../context/itemPropsContext'

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import AGOYLogo from "../../assets/AGOY.svg";

import "./register.css";

const Register = () => {
  const { setFirstName } = useContext(ItemPropsContext);

  const navigate = useNavigate();

  const [firstName, setFirstNameForm] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  // const [termandagree, setTermandagree] = useState(true)
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [errorSignup, setErrorSignup] = useState(false);

  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadingBtn(true);
    setExistingUser(false);
    setErrorSignup(false);
    setEmptyFields([]);

    const data = {
      firstName,
      lastName,
      mobileNumber,
      email,
      birthday,
      gender,
      password,
      termandagree: true,
    };

    await axios
      .post("/api/register", data)
      .then((response) => {
        if (response.status === 201) {
          setFirstNameForm("");
          setLastName("");
          setMobileNumber("");
          setEmail("");
          setPassword("");

          // Assuming the response contains a token
          const token = response.data.token;
          const firstName = response.data.firstName;

          // Save the token to local storage or state for future use
          localStorage.setItem('firstName', firstName)
          localStorage.setItem('token', token)
          localStorage.setItem('cartCount', 0)

          setFirstName(firstName);
          
          window.location.replace(`${window.location.origin}/email-verification`)
        }
      })
      .catch((err) => {
        const response = err.response;

        if (response.status === 400) {
          setEmptyFields(response.data.emptyFields);
        } else if (response.status === 409) {
          setExistingUser(true);
        } else {
          setErrorSignup(true);
        }
      });

    setLoadingBtn(false);
  };

  const navigateToLogin = (e) => {
    e.stopPropagation;
    navigate("/login");
  };

  
  const handlePhoneChange = (value) => {
    setMobileNumber(value);
  };

  useEffect(() => {
    setMobileNumber("+971")
  }, [])

  return (
    <>
      <div className="register text-dim d-flex justify-content-center align-items-center">
        <form
          onSubmit={handleSubmit}
          className="w-md-50 px-3 px-md-5 pt-4 bg-white register-form"
        >
          <div className="text-center">
            <img
              src={AGOYLogo}
              className="mb-5"
              alt="AGOY LOGO"
              width="150px"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              className={`form-control input-black ${
                emptyFields.includes("firstName") ? "border-danger" : ""
              }`}
              onChange={(event) => setFirstNameForm(event.target.value)}
            />
            <label className="form-label">First name</label>
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              className={`form-control input-black ${
                emptyFields.includes("lastName") ? "border-danger" : ""
              }`}
              onChange={(event) => setLastName(event.target.value)}
            />
            <label className="form-label">Last name</label>
          </div>
          <div className="form-outline mb-4">
            {/* <input
              type="number"
              className={`form-control input-black ${
                emptyFields.includes("mobileNumber") ? "border-danger" : ""
              }`}
              onChange={(event) => setMobileNumber(event.target.value)}
            /> */}
            <PhoneInput
              international
              value={mobileNumber}
              onChange={handlePhoneChange}/>
            <label className="form-label">Mobile number</label>
          </div>
          <div className="form-outline mb-4">
            {existingUser && (
              <label className="text-danger mb-0">Email already exists</label>
            )}
            <input
              type="email"
              className={`form-control input-black ${
                emptyFields.includes("email") || existingUser
                  ? "border-danger"
                  : ""
              }`}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label className="form-label">Email address</label>
          </div>
          <div className="form-outline mb-4">
            <input
              type="password"
              className={`form-control input-black ${
                emptyFields.includes("password") ? "border-danger" : ""
              }`}
              onChange={(event) => setPassword(event.target.value)}
            />
            <label className="form-label">Password</label>
          </div>
          <div className="form-outline mb-4">
            <select
              className={`form-select input-black ${
                emptyFields.includes("gender") ? "border-danger" : ""
              }`}
              id="gender"
              name="gender"
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="" hidden selected>
                ---
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label className="form-label">Gender</label>
          </div>
          <div className="form-outline mb-4">
            <input
              type="date"
              className={`form-control input-black ${
                emptyFields.includes("birthday") ? "border-danger" : ""
              }`}
              id="birthdate"
              name="birthdate"
              onChange={(event) => setBirthday(event.target.value)}
            />
            <label className="form-label">Birthday</label>
          </div>

          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center">
              {/* Agreement text */}
              <p>
                By selecting &quot;Agree and Sign up&quot; you agree to the Agoy
                Terms.
              </p>
            </div>
          </div>
          {errorSignup && (
            <p className="text-danger">Error creating account!</p>
          )}
          {loadingBtn ? (
            <div className="text-center">
              {/* Loading button */}
              <button
                className="btn-gold py-2 px-5 text-center btn-block mb-4"
                disabled
              >
                <div className="snippet" data-title="dot-pulse">
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center">
              {/* Sign up button */}
              <button className="btn-gold py-1 px-3 btn-block mb-4">
                agree and sign up
              </button>
              <br />
              <button
                className="btn-gold py-1 px-3 btn-block mb-4"
                onClick={(e) => navigateToLogin(e)}
              >
                back to login
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Register;
