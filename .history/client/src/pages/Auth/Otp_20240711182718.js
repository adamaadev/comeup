import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      // Envoi de l'email avec le code OTP généré
      axios.post('http://localhost:4000/sendemail', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        console.log('Email sent successfully');
      })
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
    setError(false);
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOTP = otp.join('');

    // Envoi de la requête de vérification OTP au serveur
    axios.post('http://localhost:4000/verifyotp', { otp: enteredOTP }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('OTP verified successfully');
      navigate('/recovery', { state: email });
    }).catch((error) => {
      console.error('Error verifying OTP:', error);
      setError(true); // Afficher le widget d'erreur
    });
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
            {error && <p className="text-danger text-center mt-2">Le code OTP saisi est incorrect. Veuillez réessayer.</p>}
            <button type="submit" className="btn btn-primary mt-3 d-block mx-auto">Valider</button>
          </form>
        </div>
      </div>
    </div>
  );
}
