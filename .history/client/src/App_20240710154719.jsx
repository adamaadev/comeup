import { useEffect, useState } from "react";
import axios from "axios";
import Forget from "./pages/Auth/Forget";
import Home from "./pages/Home/Home";
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import Watchlist from "./pages/Home/Watchlist";
import Screener from "./pages/Home/Screener";
import Setting from './pages/Home/Setting';
import Details from "./pages/Home/Details";
import Dashboard from './pages/Home/Dashboard';
import Abonnement from "./pages/Home/Abonnement";
import Checkout from "./pages/Home/Checkout";
import Otp from "./pages/Auth/Otp";
import Recovery from "./pages/Auth/Recovery";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Foire from "./pages/Home/Details";
export default function App() {
  const [auth, setauth] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      if (res.data.success) {
        setauth(true);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="screener" element={<Screener />} />
          <Route path="details/:symbol" element={<Details />} />
          <Route path="setting" element={<Setting />}/>
        </Route>
        <Route path="/abonnement" element ={<Abonnement/>}/>
        <Route path="/checkout" element = {<Checkout/>} /> 
        <Route path="/code" element = {<Otp/>} /> 
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={auth ? <Navigate to="/" /> : <Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/recovery" element = {<Recovery/>}/>
        <Route path="*" element={auth ? <Navigate to="/" /> : <Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}
