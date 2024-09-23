import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyparser from 'body-parser';
import cookieParser from "cookie-parser";
import sgMail from '@sendgrid/mail';
import dovnet from 'dotenv';

export default function Signin(){
  const { email, password , type } = req.body.values;
  con.query("SELECT * FROM utilisateurs WHERE email = ? AND type = ?", [email , type], (err, result) => {
    if (result.length === 0) {
      res.send({message : "Utilisateur non inscrit !"})
    }else{
      bcrypt.compare(password, result[0].password, (err, match) => {
        if (match) {
          const {id , username , email, status , type} = result[0];
          if (type === "user") {
            const token = jwt.sign({id,  username , email, status }, "token___user", { expiresIn: "14d" });
            res.cookie("token_user", token); 
          }else{
            const token = jwt.sign({id,  username , email, status }, "token___admin", { expiresIn: "14d" });
            res.cookie("token_admin", token); 
          }
          res.send({ success: true , id , email, status});
        } else {
          res.send({ success: false  , message : "Identifiants incorrects !"});
        }
      });
    }
  });
}