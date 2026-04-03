const puppeteer = require("puppeteer");

async function startBot() {
    console.log("⏳ جاري تشغيل المتصفح...");
    const browser = await puppeteer.launch({
        headless: false, // يجب أن يكون false لتتمكن من تسجيل الدخول
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    
    // 1. التوجه لصفحة تسجيل الدخول
    await page.goto("https://www.tiktok.com/login", { waitUntil: 'networkidle2' });
    console.log("⚠️ سجل دخولك يدوياً الآن.. لديك 60 ثانية.");
    
    await new Promise(r => setTimeout(r, 60000)); // انتظر دقيقة لتسجل دخولك

    // 2. التوجه لغرفة البث المباشر (استبدل USERNAME باسم حسابك)
    const liveUrl = "https://www.tiktok.com/@USERNAME/live"; 
    await page.goto(liveUrl, { waitUntil: 'networkidle2' });
    console.log("✅ البوت الآن في صفحة البث المباشر.");

    // 3. فحص السيرفر كل 3 ثوانٍ لإرسال الرسائل
    setInterval(async () => {
        try {
            // استبدل الرابط أدناه برابط السيرفر الخاص بك على Render أو Replit
            const response = await fetch("https://your-app-name.onrender.com/get-next-message");
            const data = await response.json();

            if (data && data.message) {
                console.log("📤 جاري كتابة التعليق...");

                // السليكتور الخاص بمربع الدردشة (قد يحتاج تحديث إذا غير تيك توك التصميم)
                const chatSelector = 'div[data-e2e="chat-input"]'; 
                await page.waitForSelector(chatSelector);
                await page.click(chatSelector);
                
                // كتابة الرسالة حرفاً بحرف (أكثر أماناً من النسخ واللصق)
                await page.keyboard.type(data.message);
                await new Promise(r => setTimeout(r, 500)); 

                // ضغط مفتاح Enter للإرسال
                await page.keyboard.press('Enter');
                console.log("✅ تم إرسال التعليق بنجاح!");
            }
        } catch (err) {
            console.error("❌ خطأ أثناء محاولة الإرسال:", err.message);
        }
    }, 3000); 
}

startBot();
