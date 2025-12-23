'use strict';

require('dotenv').config();

const { where } = require('sequelize');
const { User, Account, Session, sequelize } = require('../models');
const bcrypt = require('bcrypt')
const JWT_SECRETE = process.env.JWT_SECRETE;

module.exports = {
    // Register: Create User and Account together
    register: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { phone_number, email, password, role } = req.body; 


            // check if the acc is already exist
            const existingAccount = await Account.findOne({ where: { email } });
            if (existingAccount) {
                return res.status(400).json({ message: "Email already in use" }); 
            }

            // create user profile
            const newUser = await User.create({
                phone_number,
                role: role || 'Customer',
            }, { transaction: t });

            // hash password

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            //create acc linked to user
            await Account.create({
                user_id: newUser.user_id,
                email,
                password_hash: hashedPassword
            }, {transaction: t });


            await t.commit();
            res.status(201).json({ message: "User and Account created successfully!" });
        } catch (error){
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    },


    login: async (req, res) => {

        try{

            const { email, password } = req.body;


            const account = await Account.findOne({
                where: { email },
                include: [{ model: User, as: 'User'}]
            });

            if(!Account) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, account.password_hash);
            if(!isMatch){
                return res.status(404).json({ message: "Invalid credentials" });
            }


            const token =  jwt.sign(
                { user_id: account.user_id, role: account.User.role },
                JWT_SECRETE, 
                { expiresIn: '24h'}
            );


            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 24);

            await Session.create({
                session_token: token,
                user_id: account.user_id,
                expiry: expiryDate
            });


            res.status(200).json({
                message: "Login Successfully!",
                token,
                user: {
                    id: account.user_id,
                    role: account.User.role
                }
            });



        } catch (error){
            res.status(500).json({ error: error.message });
        }
    }
};
