import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const [generatedOTP, setGeneratedOTP] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      axios.post('http://localhost:4000/sendemail', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        // Mocking generated OTP for demo
        const mockGeneratedOTP = generateOTP();
        setGeneratedOTP(mockGeneratedOTP);
        console.log('Generated OTP:', mockGeneratedOTP);
      }).catch((error) => {
        console.error('Error sending email:', error);
        // Handle error
      });
    }
  }, [email, navigate]);

  const generateOTP = () => {
    // Générer un code OTP aléatoire à quatre chiffres
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  console.log(generatedOTP);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Joining OTP array into a string
    const enteredOTP = otp.join('');

    if (enteredOTP === generatedOTP) {
      // Redirect to the second page
      navigate('/second-page');
    } else {
      setShowPopup(true); // Or handle incorrect OTP scenario
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center">Entrez le code OTP envoyé à {email}</h2>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="form-control text-center"
                  style={{ width: '40px', height: '40px', fontSize: '20px' }}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary mt-3 d-block mx-auto">Valider</button>
          </form>
        </div>
      </div>
    </div>
  );
}
