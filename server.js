const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors()); // للسماح لصفحة الويب بإرسال البيانات من أي مكان

let messageQueue = []; // طابور الرسائل

// الرابط الذي تستخدمه في صفحة الويب لإرسال البيانات
app.post("/send-to-replit", (req, res) => {
    const msg = req.body.message;
    if (msg) {
        messageQueue.push(msg);
        console.log("📥 استلمت بيانات جديدة ووضعتها في الانتظار.");
        res.status(200).send({ status: "ok", message: "Data queued" });
    } else {
        res.status(400).send({ status: "error", message: "No message provided" });
    }
});

// الرابط الذي يستخدمه البوت (bot.js) لسحب الرسالة التالية
app.get("/get-next-message", (req, res) => {
    if (messageQueue.length > 0) {
        const nextMsg = messageQueue.shift(); // يأخذ أول رسالة ويمسحها من القائمة
        res.send({ message: nextMsg });
    } else {
        res.send({ message: null });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل الآن على المنفذ ${PORT}`);
});
