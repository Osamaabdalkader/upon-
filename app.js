// البحث عن الإعلانات
function searchAds(query) {
    const adsGrid = document.getElementById('ads-grid');
    const ads = adsGrid.querySelectorAll('.product-card');
    
    ads.forEach(ad => {
        const title = ad.querySelector('.product-title').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            ad.style.display = 'block';
        } else {
            ad.style.display = 'none';
        }
    });
}

// جلب تفاصيل الإعلان
function loadAdDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get('adId');
    
    if (adId) {
        database.ref('ads/' + adId).once('value').then(snapshot => {
            const ad = snapshot.val();
            
            document.getElementById('ad-title').textContent = ad.title;
            document.getElementById('ad-price').textContent = ad.price + ' ر.س';
            document.getElementById('ad-location').textContent = ad.location;
            document.getElementById('ad-description').textContent = ad.description;
            
            // حساب الوقت المنقضي
            const now = new Date().getTime();
            const createdAt = new Date(ad.createdAt).getTime();
            const diff = now - createdAt;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            
            document.getElementById('ad-time').textContent = `منذ ${hours} ساعات`;
            
            // تعيين مبلغ الطلب
            document.getElementById('order-amount').textContent = ad.price + ' ر.س';
        });
    }
}

// تأكيد الطلب
function confirmOrder() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    const receipt = document.getElementById('receipt').files[0];
    
    if (!name || !phone || !address || !receipt) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // رفع إيصال الدفع (يجب تطوير هذه الوظيفة لتحميل الملفات إلى Firebase Storage)
    
    // حفظ بيانات الطلب
    const user = auth.currentUser;
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get('adId');
    
    if (user && adId) {
        const newOrder = {
            adId,
            userId: user.uid,
            name,
            phone,
            address,
            status: 'pending',
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        database.ref('orders').push(newOrder)
            .then(() => {
                document.getElementById('success-message').style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            })
            .catch(error => {
                alert('حدث خطأ: ' + error.message);
            });
    }
}