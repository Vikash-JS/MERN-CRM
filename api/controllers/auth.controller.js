import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const JWT_SECRET = "mern-admin";

export const signup = async (req, res, next) => {
	const { username, email, password } = req.body;

	if (
		!username ||
		!email ||
		!password ||
		username === "" ||
		email === "" ||
		password === ""
	) {
		next(errorHandler(400, "All fields are mandatory"));
	}

	const hashPassword = bcryptjs.hashSync(password, 10);

	const newUser = new User({ username, email, password: hashPassword });

	try {
		await newUser.save();
		res.json("Sign up successful");
	} catch (err) {
		next(err);
	}
};

export const signin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password || email === "" || password === "") {
		next(errorHandler(400, "All fields are required"));
	}

	try {
		const validUser = await User.findOne({ email });
		if (!validUser) {
			next(errorHandler(400, "User not found"));
		}
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) {
			return next(errorHandler(400, "Invalid password"));
		}
		const token = jwt.sign(
			{ id: validUser._id, isAdmin: validUser.isAdmin },
			process.env.JWT_SECRET || JWT_SECRET
		);
		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json(validUser);
	} catch (err) {
		next(err);
	}
};
