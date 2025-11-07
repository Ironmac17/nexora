const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const sharp = require("sharp");
const {
    loginUser,
    getUserInfo,
    requestOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    resendOtp,
} = require("../controllers/authControllers");

const router = express.Router();


router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);


router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


router.post("/resend-otp", resendOtp);

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const mimeType = req.file.mimetype;
        let buffer = req.file.buffer;

        const MAX_SIZE = 1 * 1024 * 1024;
        if (buffer.length > MAX_SIZE) {
            buffer = await sharp(buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .jpeg({ quality: 70 })
                .toBuffer();
        }

        const base64Image = buffer.toString("base64");
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        res.status(200).json({ imageUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Image processing failed" });
    }
});

module.exports = router;
