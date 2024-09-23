import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const [email, setEmail] = useState();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      if (res.data.success) {
        setEmail(res.data.email);
      }
    });
  }, []);

  if (!location.state || !location.state.price || !location.state.plan) {
    return <Navigate to="/" />;
  }

  const { price, plan } = location.state;

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post('http://localhost:4000/create-checkout-session', { priceId: price });
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div>
      <h1>Souscription</h1>
      <p>Vous avez sélectionné le plan {plan} avec un prix de {price}</p>
      <input type="text" value={email} readOnly />
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
