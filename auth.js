// تسجيل الدخول
function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تم تسجيل الدخول بنجاح
            window.location.href = 'index.html';
        })
        .catch((error) => {
            // خطأ في تسجيل الدخول
            alert(error.message);
        });
}

// إنشاء حساب جديد
function signUpUser() {
    const fullName = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('كلمة المرور غير متطابقة');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تم إنشاء الحساب بنجاح
            const user = userCredential.user;
            
            // حفظ معلومات إضافية للمستخدم
            database.ref('users/' + user.uid).set({
                fullName: fullName,
                phone: phone,
                email: email,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
            
            window.location.href = 'account.html';
        })
        .catch((error) => {
            // خطأ في إنشاء الحساب
            alert(error.message);
        });
}

// تسجيل الخروج
function logoutUser() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        alert(error.message);
    });
}

// تحميل بيانات المستخدم
function loadUserData() {
    const user = auth.currentUser;
    
    if (user) {
        database.ref('users/' + user.uid).once('value').then((snapshot) => {
            const userData = snapshot.val();
            
            document.getElementById('user-name').textContent = userData.fullName;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-phone').textContent = userData.phone;
            document.getElementById('user-email-info').textContent = user.email;
            document.getElementById('user-phone-info').textContent = userData.phone;
            
            // تحويل تاريخ التسجيل
            const signupDate = new Date(userData.createdAt);
            document.getElementById('signup-date').textContent = signupDate.toLocaleDateString('ar-SA');
        });
    } else {
        window.location.href = 'login.html';
    }
}