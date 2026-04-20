(function () {
    // MOSTRAR/OCULTAR CONTRASEÑA
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // ELIMINAR RESALTADO DEL SELECT
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            this.blur();
        });
        categorySelect.addEventListener('blur', function () {
        });
    }

    // DATA DUMMY Y REGISTRO 
    let dummyUsers = [
        { email: "demo@lvl.com", username: "demouser", password: "123456" }
    ];

    if (!localStorage.getItem('lvl_users')) {
        localStorage.setItem('lvl_users', JSON.stringify(dummyUsers));
    }


    async function registerUser(email, username, password, category) {

        if (!email || !username || !password) {
            showToast("Por favor completa todos los campos obligatorios (*)", "error");
            return false;
        }

        if (!document.getElementById('terms').checked) {
            showToast("Debes aceptar los Términos de uso.", "error");
            return false;
        }

        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailRegex.test(email)) {
            showToast("Ingresa un correo electrónico válido.", "error");
            return false;
        }

        if (password.length < 4) {
            showToast("La contraseña debe tener al menos 4 caracteres.", "error");
            return false;
        }


        let users = JSON.parse(localStorage.getItem('lvl_users')) || [];

        const emailExists = users.some(u => u.email === email);
        const userExists = users.some(u => u.username === username);
        if (emailExists) {
            showToast("Ya existe una cuenta con este correo electrónico.", "error");
            return false;
        }
        if (userExists) {
            showToast("El nombre de usuario ya está en uso.", "error");
            return false;
        }

        // Generar avatar usando UI Avatars (API externa de imágenes)
        const avatarUrl = `https://ui-avatars.com/api/?background=0D8F81&color=fff&rounded=true&size=128&bold=true&name=${encodeURIComponent(username)}`;

        // Preparar para futura integración con imgbb (comentado)
        /*
        // Ejemplo de integración con imgbb (requiere API Key)
        const formData = new FormData();
        formData.append('image', 'BASE64_STRING_DE_IMAGEN');
        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=TU_API_KEY', { 
                method: 'POST', 
                body: formData 
            });
            const data = await response.json();
            if (data.success) {
                avatarUrl = data.data.url;
            }
        } catch (error) {
            console.log('Error al subir imagen a imgbb, usando avatar por defecto');
        }
        */

        // Crear nuevo objeto usuario
        const newUser = {
            id: Date.now(),
            email: email,
            username: username,
            password: password,
            category: category || 'Sin categoría',
            avatar: avatarUrl,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('lvl_users', JSON.stringify(users));

        localStorage.setItem('lvl_current_user', JSON.stringify({
            email,
            username,
            avatar: avatarUrl,
            category: category || 'Sin categoría'
        }));

        return true;
    }

    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const categorySelect = document.getElementById('category');
            const category = categorySelect ? categorySelect.value : '';

            const success = await registerUser(email, username, password, category);
            if (success) {
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
                successMsg.innerHTML = '<i class="fas fa-check-circle mr-2"></i> ¡Cuenta creada exitosamente! Redirigiendo...';
                document.body.appendChild(successMsg);

                setTimeout(() => {
                    window.location.href = "assets/partes/dashboard.html";
                }, 1500);
            }
        });
    }

    // Simulacion con data dummy para iniciar con otro tipo de cuenta 
    const googleBtn = document.getElementById('googleBtn');
    const facebookBtn = document.getElementById('facebookBtn');
    const adobeBtn = document.getElementById('adobeBtn');

    function socialSignUp(provider) {

        const dummySocialEmail = `usuario_${provider.toLowerCase()}_${Date.now()}@${provider.toLowerCase()}.com`;
        const dummySocialUser = `${provider}_user_${Math.floor(Math.random() * 10000)}`;
        const tempPass = Math.random().toString(36).slice(-10);

        let users = JSON.parse(localStorage.getItem('lvl_users')) || [];
        const avatarUrl = `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${dummySocialUser}`;

        const newSocialUser = {
            id: Date.now(),
            email: dummySocialEmail,
            username: dummySocialUser,
            password: tempPass,
            category: `Registro con ${provider}`,
            avatar: avatarUrl,
            provider: provider,
            createdAt: new Date().toISOString()
        };

        users.push(newSocialUser);
        localStorage.setItem('lvl_users', JSON.stringify(users));
        localStorage.setItem('lvl_current_user', JSON.stringify({
            email: dummySocialEmail,
            username: dummySocialUser,
            avatar: avatarUrl
        }));

        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMsg.innerHTML = `<i class="fab fa-${provider.toLowerCase()} mr-2"></i> Cuenta creada con ${provider}. Redirigiendo...`;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            window.location.href = "assets/partes/dashboard.html";
        }, 1500);
    }

    if (googleBtn) googleBtn.addEventListener('click', () => socialSignUp('Google'));
    if (facebookBtn) facebookBtn.addEventListener('click', () => socialSignUp('Facebook'));
    if (adobeBtn) adobeBtn.addEventListener('click', () => socialSignUp('Adobe'));


    const termsLink = document.querySelector('a[href="#"]');
    if (termsLink) termsLink.addEventListener('click', (e) => e.preventDefault());

    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('scale-101');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('scale-101');
        });
    });
})();

function showToast(message, type = "success") {
    const toast = document.createElement('div');

    const baseStyles = "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 text-white flex items-center gap-2 animate-fade-in";

    const typeStyles = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500 text-black"
    };

    const icons = {
        success: "fas fa-check-circle",
        error: "fas fa-times-circle",
        warning: "fas fa-exclamation-triangle"
    };

    toast.className = `${baseStyles} ${typeStyles[type]}`;
    toast.innerHTML = `<i class="${icons[type]}"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2", "transition");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}