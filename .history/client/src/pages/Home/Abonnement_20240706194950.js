import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const navigate = useNavigate();
  const [pricemensuel, setPricemensuel] = useState('price_monthly_id'); // Replace with your Stripe price ID
  const [priceannuel, setPriceannuel] = useState('price_yearly_id'); // Replace with your Stripe price ID
  const [selectedPlan, setSelectedPlan] = useState('mensuel');
  const [subscriptionClicked, setSubscriptionClicked] = useState(false);

  const handleLogout = () => {
    axios.get('http://localhost:4000/logoutuser')
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      console.log(res);
      if (!res.data.success) {
        navigate('/signin');
      }
      if (res.data.status === 'true') {
        navigate('/');
      }
    });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSubscribe = () => {
    const selectedPrice = selectedPlan === 'mensuel' ? pricemensuel : priceannuel;
    navigate('/checkout', { state: { price: selectedPrice, plan: selectedPlan } });
    setSubscriptionClicked(true);
  };

  return (
    <div>
      <Link to="#">Besoin d'aide ? Contactez nous !</Link>
      <button className="btn btn-outline-danger my-2 my-sm-0 ml-2" onClick={handleLogout}>Se déconnecter</button>
      <div>
        <label>
          <span>Choisir un plan: </span>
          <select value={selectedPlan} onChange={handleSelectChange}>
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
          </select>
        </label>
      </div>
      <p>Prix: {selectedPlan === 'mensuel' ? `${pricemensuel} € par mois` : `${priceannuel} € par an`}</p>
      <button className="btn btn-primary" onClick={handleSubscribe}>S'abonner</button>
    </div>
  );
}
