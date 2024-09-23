import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default function Signin(req, res) {
  const { email, password, type } = req.body.values;
    console.log(email, password, type);
    
}
