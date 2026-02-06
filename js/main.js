document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // التحقق مما إذا كان المستخدم مسجلاً للدخول مسبقاً
    const savedUser = localStorage.getItem('studentInfo');
    if (savedUser && document.getElementById('main-app')) {
        showMainApp();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            showLoader("جاري فتح البوابة...");

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // بناء الرابط كما يتوقعه السكربت الخاص بك
            const url = `${WEB_APP_URL}?action=loginStudent&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

            try {
                // ملاحظة: مع جوجل سكربت يفضل استخدام الإعدادات الافتراضية للـ fetch في حالة الـ GET
                const response = await fetch(url);
                
                if (!response.ok) throw new Error("السيرفر لا يستجيب");

                const data = await response.json();

                if (data.result === "success") {
                    // تخزين البيانات بنفس المفتاح الذي سنستخدمه في index.html
                    localStorage.setItem('studentInfo', JSON.stringify(data.data));
                    
                    setTimeout(() => {
                        hideLoader();
                        showMainApp();
                        // تحديث بيانات الصفحة فوراً بعد تسجيل الدخول
                        if (window.loadSection) loadSection('profile', document.querySelector('.nav-item'));
                    }, 800);
                } else {
                    hideLoader();
                    alert("❌ " + data.message);
                }
            } catch (error) {
                hideLoader();
                console.error("Fetch Error:", error);
                alert("⚠️ فشل الاتصال بالسيرفر.\nتأكد من:\n1- نشر السكربت كـ (Anyone).\n2- الرابط في url.js ينتهي بـ /exec");
            }
        });
    }

    // --- الوظائف المساعدة ---

    function showLoader(text) {
        if (document.getElementById('app-loader')) return;
        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(30, 60, 114, 0.9); backdrop-filter: blur(5px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 9999; color: white; font-family: 'Tajawal', sans-serif;
        `;
        loader.innerHTML = `
            <div class="spinner" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #f39c12; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div style="margin-top: 20px; font-weight: bold;">${text}</div>
            <style> @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>
        `;
        document.body.appendChild(loader);
    }

    function hideLoader() {
        const loader = document.getElementById('app-loader');
        if (loader) loader.remove();
    }

    function showMainApp() {
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        // إذا كان هناك عنوان في الهيدر، نقوم بتحديثه
        const title = document.getElementById('section-title');
        if (title) title.innerText = "لوحة التحكم";
    }
});

// دالة تسجيل الخروج العالمية
function logout() {
    localStorage.removeItem('studentInfo');
    location.reload();
}
