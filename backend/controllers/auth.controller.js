import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import uploadBufferToCloudinary from "../lib/cloudinary-upload.js";
import dotenv from "dotenv"
dotenv.config();

function sign(userId) {
    return jwt.sign({}, process.env.JWT_SECRET, {
        subject: String(userId),
        expiresIn: "7d"
    });
}

export async function register(req, res) {
    try {
        // Body masih divalidasi Joi seperti biasa (email, password, name, avatar_url opsional).
        const exists = await User.findOne({ email: req.body.email });
        if (exists) return res.status(409).json({ message: "Email already registered" });

        let avatar_url = req.body.avatar_url || "";
        let avatar_public_id = "";

        // Jika ada file 'avatar' (multipart), upload ke Cloudinary
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, {
                folder: "avatars",
                // pakai public_id konsisten per user setelah dibuat; saat register user belum punya ID,
                // jadi biarkan Cloudinary generate; nanti saat update avatar, bisa pakai `avatars/<userId>`.
                publicId: undefined
            });
            avatar_url = result.secure_url;
            avatar_public_id = result.public_id;
        }

        const user = await User.create({
            email: req.body.email,
            password: req.body.password, // akan di-hash oleh pre('save')
            name: req.body.name,
            avatar_url,
            avatar_public_id
        });

        const token = sign(user._id);
        return res.status(201).json({ user, token });
    } catch (err) {
        if (err?.code === 11000) return res.status(409).json({ message: "Email already registered" });
        return res.status(400).json({ message: err.message });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = sign(user._id);
    res.json({ user, token });
}

export async function me(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
}
