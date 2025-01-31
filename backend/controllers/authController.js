import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import db from "./../database/firestore.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

//creare token JWT pentru autentificarea userului, 
//prin jsonwebtoken cu o cheie secreta si timp de expirare
//userId in payload
const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const register = async (req, res, next) => {
    try {
        const { name, surname, email, password, confirmedPassword } = req.body;
        if (!email || !password || !confirmedPassword) {// TODO adaugat validari pentru restul campurilor
            throw new AppError("All fields should be completed!", 400);
        } else if (password.length < 8) {
            throw new AppError("Passwords should have at least 8 characters!", 400);
        } else if (password !== confirmedPassword) {
            throw new AppError("Passwords should match!", 400);
        }

        //verificare ca user-ul nu exista deja
        const userRef = db.collection("Users");
        const userFound = await userRef.where("email", "==", email).get();
        if (!userFound.empty) {
            throw new AppError("User already registered!", 403);
        }

        //creare nou user, criptare parola cu bcrypt
        const newUser = {
            name,
            surname,
            email,
            password: await bcrypt.hash(password, 10),
            profilePicture: "https://plchldr.co/i/200x200?&bg=f2f2f2&fc=111111&text=BLOG%20IT" //placeholder
        };
        const user = await userRef.add(newUser);

        //crearea token-ului JWT 
        const token = createToken({
            userId: user.id, //adaugare userId in token
        });

        //trimitere token si mesaj succes
        res.status(201).json({
            status: "success",
            token,
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) { //validari campuri
            throw new AppError("All fields should be completed!", 400);
        }

        //cautare user in BD
        const userSnapshot = await db
            .collection("Users")
            .where("email", "==", email)
            .get();
        if (userSnapshot.empty) {
            throw new AppError("Incorrect email or password!");
        }

        //verificare parola
        const user = userSnapshot.docs[0].data();
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (!isSamePassword) {
            throw new AppError("Incorrect email or password!");
        }

        //creare token JWT
        const token = createToken({
            userId: userSnapshot.docs[0].id, //adaugare id in token
        });

        //trimitere token
        res.status(200).json({
            status: "success",
            token,
        });
    } catch (err) {
        next(err);
    }
};

const protectRoutes = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]; //extragere token din header
            if (!token) {
                throw new AppError(
                    "You are not logged in! Please log in to get access.",
                    401
                );
            }
        } else {
            throw new AppError("Not logged in!", 401);
        }

        //verificare si decodare token
        const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = jwtDecoded.userId; //atasare userId la request
        next();
    } catch (err) {
        if (
            [
                "invalid token",
                "jwt expired",
                "jwt malformed",
                "invalid signature",
                "jwt signature is required",
            ].includes(err.message)
        ) {
            err.statusCode = 401;
        }
        if ("jwt expired" === err.message) {
            console.log(err.message += ". Please login again.")
            err.message = "Sesiunea a expirat, pentru a continua trebuie să te autentifici.";
        }
        next(err);
    }
};

export { register, login, protectRoutes };
