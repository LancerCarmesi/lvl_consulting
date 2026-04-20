// assets/js/dashboard.js
// Funcionalidades del sidebar y menús desplegables

document.addEventListener('DOMContentLoaded', function() {
    // ==================== SIDEBAR COLLAPSE ====================
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    const mainContent = document.getElementById('mainContent');
    const menuTexts = document.querySelectorAll('.menu-text');
    const logoText = document.getElementById('logoText');
    
    let isCollapsed = false;
    
    if (collapseBtn) {
        collapseBtn.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            
            if (isCollapsed) {
                // Colapsar sidebar
                sidebar.style.width = '80px';
                mainContent.style.marginLeft = '0';
                menuTexts.forEach(text => {
                    text.style.display = 'none';
                });
                if (logoText) logoText.style.display = 'none';
                collapseBtn.innerHTML = '<i class="fas fa-chevron-right text-xl"></i>';
                
                // Ajustar submenús colapsados
                const submenu = document.getElementById('submenu');
                if (submenu && submenu.classList.contains('show')) {
                    submenu.classList.remove('show');
                    const dropdownIcon = document.getElementById('dropdownIcon');
                    if (dropdownIcon) dropdownIcon.classList.remove('rotated');
                }
            } else {
                // Expandir sidebar
                sidebar.style.width = '260px';
                mainContent.style.marginLeft = '0';
                menuTexts.forEach(text => {
                    text.style.display = 'inline';
                });
                if (logoText) logoText.style.display = 'inline';
                collapseBtn.innerHTML = '<i class="fas fa-chevron-left text-xl"></i>';
            }
        });
    }
    
    // ==================== DROPDOWN PÁGINAS WEBS ====================
    const websitesBtn = document.getElementById('websitesBtn');
    const submenu = document.getElementById('submenu');
    const dropdownIcon = document.getElementById('dropdownIcon');
    
    if (websitesBtn && submenu && dropdownIcon) {
        websitesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Alternar la clase 'show' en el submenú
            submenu.classList.toggle('show');
            dropdownIcon.classList.toggle('rotated');
        });
    }
    
    // ==================== EFECTOS DE HOVER EN MENÚ ====================
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('dropdown-btn')) {
                // Mostrar alerta de que la funcionalidad está en desarrollo
                Swal.fire({
                    title: 'En desarrollo',
                    text: 'Esta funcionalidad estará disponible próximamente',
                    icon: 'info',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'Entendido',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    });
    
    // ==================== NOTIFICACIONES ====================
    const notifBtn = document.querySelector('.fa-bell')?.parentElement;
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            Swal.fire({
                title: 'Notificaciones',
                html: `
                    <div class="text-left">
                        <p class="py-2 border-b">📊 <strong>Nuevo reporte disponible</strong><br><small class="text-gray-500">Hace 2 horas</small></p>
                        <p class="py-2 border-b">👥 <strong>3 nuevos clientes registrados</strong><br><small class="text-gray-500">Ayer</small></p>
                        <p class="py-2">🚀 <strong>Meta de ventas alcanzada al 87%</strong><br><small class="text-gray-500">Hace 1 día</small></p>
                    </div>
                `,
                icon: 'info',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Cerrar',
                width: '400px'
            });
        });
    }
    
    // ==================== ANIMACIÓN DE CARGA ====================
    // Mostrar efecto de carga suave
    const main = document.querySelector('main');
    if (main) {
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        setTimeout(() => {
            main.style.transition = 'all 0.5s ease';
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // ==================== ACTUALIZACIÓN EN TIEMPO REAL (SIMULADA) ====================
    // Simular actualización de datos cada 30 segundos
    setInterval(() => {
        // Pequeña animación de refresco en las tarjetas
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 300);
        });
        
        // Actualizar el porcentaje de referidos aleatoriamente (simulación)
        const referidosPercent = document.getElementById('referidosPercent');
        const referidosBar = document.getElementById('referidosBar');
        if (referidosPercent && referidosBar) {
            const newPercent = Math.min(100, parseInt(referidosPercent.innerText) + Math.floor(Math.random() * 3));
            referidosPercent.innerText = `${newPercent}%`;
            referidosBar.style.width = `${newPercent}%`;
        }
    }, 30000);
});