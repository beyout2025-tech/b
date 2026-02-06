document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            showLoader("جاري التحقق من البيانات...");

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // استخدام المتغير WEB_APP_URL المعرف في ملف url.js
            const url = `${WEB_APP_URL}?action=loginStudent&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&t=${new Date().getTime()}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    redirect: 'follow'
                });
                
                if (!response.ok) throw new Error("استجابة السيرفر غير صحيحة");

                const data = await response.json();

                if (data.result === "success") {
                    localStorage.setItem('studentInfo', JSON.stringify(data.data));
                    hideLoader();
                    showMainApp();
                } else {
                    hideLoader();
                    alert("❌ " + data.message);
                }
            } catch (error) {
                hideLoader();
                console.error("Error:", error);
                alert("⚠️ خطأ في الاتصال: تأكد من أن السكربت منشور كـ (Anyone) وأن الإنترنت يعمل.");
            }
        });
    }

    // دالة إظهار اللودر
    function showLoader(text) {
        if (document.getElementById('app-loader')) return;
        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.className = 'loader-overlay';
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="loader-text">${text}</div>
        `;
        document.body.appendChild(loader);
    }

    // دالة إخفاء اللودر
    function hideLoader() {
        const loader = document.getElementById('app-loader');
        if (loader) loader.remove();
    }

    function showMainApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        console.log("تم تسجيل الدخول بنجاح!");
    }
});
