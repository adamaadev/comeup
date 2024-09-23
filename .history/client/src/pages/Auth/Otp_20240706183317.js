import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    const email = 'adamadieng289@gmail.com';
    
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
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/recovery' ,{state : email})
  };

  useEffect(()=>{
    if (!email) {
      return navigate('/')
    }
    axios.post('http://localhost:4000/sendemail', { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Email sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending email:', error);
    });
  },[])
  
  return (
    <div>
      <h2>Entrez le code OTP enoyés à {email}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={el => inputRefs.current[index] = el}
              style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                fontSize: '20px'
              }}
            />
          ))}
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Votre OTP</h3>
            <p>{otp.join("")}</p>
            <button onClick={handleClosePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
