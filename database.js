// جلب الإعلانات
function fetchAds() {
    const adsRef = database.ref('ads');
    adsRef.on('value', (snapshot) => {
        const ads = [];
        snapshot.forEach(childSnapshot => {
            ads.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        displayAds(ads);
    });
}

// عرض الإعلانات
function displayAds(ads) {
    const adsGrid = document.getElementById('ads-grid');
    adsGrid.innerHTML = '';
    
    ads.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'product-card';
        adCard.innerHTML = `
            <div class="product-image">
                <img src="${ad.image}" alt="${ad.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${ad.title}</h3>
                <div class="product-meta">
                    <div class="product-price">${ad.price} ر.س</div>
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${ad.location}
                    </div>
                </div>
                <div class="product-time">
                    <i class="far fa-clock"></i>
                    ${ad.time}
                </div>
            </div>
        `;
        
        adCard.addEventListener('click', () => {
            window.location.href = `ad-detail.html?adId=${ad.id}`;
        });
        
        adsGrid.appendChild(adCard);
    });
}

// إنشاء إعلان جديد
function createNewAd() {
    const user = auth.currentUser;
    
    if (!user) {
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return;
    }
    
    const title = document.getElementById('ad-title').value;
    const category = document.getElementById('ad-category').value;
    const price = document.getElementById('ad-price').value;
    const location = document.getElementById('ad-location').value;
    const description = document.getElementById('ad-description').value;
    
    // رفع الصور (يجب تطوير هذه الوظيفة لتحميل الصور إلى Firebase Storage)
    
    const newAd = {
        title,
        category,
        price,
        location,
        description,
        userId: user.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    database.ref('ads').push(newAd)
        .then(() => {
            alert('تم نشر الإعلان بنجاح');
            window.location.href = 'index.html';
        })
        .catch(error => {
            alert('حدث خطأ: ' + error.message);
        });
}