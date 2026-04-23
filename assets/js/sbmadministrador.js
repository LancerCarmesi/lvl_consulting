// Fecha
const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const now = new Date();
document.getElementById('today-date').textContent =
    `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;

// Sidebar
let collapsed = false;

function toggleSidebar() {
    collapsed = !collapsed;
    const sb = document.getElementById('sidebar');
    const icon = document.getElementById('toggle-icon');
    sb.classList.toggle('collapsed', collapsed);
    icon.className = collapsed ? 'ri-arrow-right-s-line text-lg' : 'ri-menu-line text-lg';
    if (collapsed) {
        closeAllSubmenus();
    }
}

function closeAllSubmenus() {
    ['sub-paginas', 'sub-apps'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('open');
    });
    const ap = document.getElementById('arrow-paginas');
    const aa = document.getElementById('arrow-apps');
    if (ap) ap.style.transform = '';
    if (aa) aa.style.transform = '';
}

function toggleSubmenu(el) {
    if (collapsed) return;
    const sub = document.getElementById('sub-paginas');
    const arrow = document.getElementById('arrow-paginas');
    const isOpen = sub.classList.contains('open');
    sub.classList.toggle('open', !isOpen);
    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
}

function toggleSubmenuApps(el) {
    if (collapsed) return;
    const sub = document.getElementById('sub-apps');
    const arrow = document.getElementById('arrow-apps');
    const isOpen = sub.classList.contains('open');
    sub.classList.toggle('open', !isOpen);
    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
}

// Cargar empresas desde DummyJSON
async function loadEmpresas() {
    try {
        const res = await fetch('https://dummyjson.com/users?limit=20&select=company');
        const data = await res.json();
        const select = document.getElementById('f-empresa');

        const empresas = [...new Set(data.users.map(u => u.company?.name).filter(Boolean))];

        empresas.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (e) {
        const fallback = ['LVL Consulting S.A.C', 'Tech Solutions S.R.L', 'Global Corp E.I.R.L', 'Innovate S.A', 'DataPrime S.A.C'];
        const select = document.getElementById('f-empresa');
        fallback.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    }
}

// Manejo de archivos
let uploadedFiles = [];

function handleFileSelect(event) {
    addFiles(Array.from(event.target.files));
    event.target.value = '';
}

function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.add('drag-over');
}

function handleDragLeave(event) {
    document.getElementById('drop-zone').classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.remove('drag-over');
    addFiles(Array.from(event.dataTransfer.files));
}

function addFiles(files) {
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push(file);
        }
    });
    renderFileList();
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
}

function renderFileList() {
    const list = document.getElementById('file-list');
    const count = document.getElementById('file-count');

    if (uploadedFiles.length === 0) {
        list.innerHTML = '';
        count.classList.add('hidden');
        return;
    }

    list.innerHTML = uploadedFiles.map((f, i) => `
        <div class="file-item">
            <i class="file-icon ${getFileIcon(f.name)}"></i>
            <span class="file-name truncate max-w-[120px]" title="${f.name}">${f.name}</span>
            <span class="file-size">${formatSize(f.size)}</span>
            <button class="file-remove" onclick="removeFile(${i})" title="Quitar">
                <i class="ri-close-line"></i>
            </button>
        </div>
    `).join('');

    count.textContent = `${uploadedFiles.length} archivo${uploadedFiles.length > 1 ? 's' : ''} seleccionado${uploadedFiles.length > 1 ? 's' : ''}`;
    count.classList.remove('hidden');
}

function getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    const map = {
        pdf: 'ri-file-pdf-2-line text-red-500',
        doc: 'ri-file-word-line text-blue-500',
        docx: 'ri-file-word-line text-blue-500',
        png: 'ri-image-line text-purple-500',
        jpg: 'ri-image-line text-purple-500',
        jpeg: 'ri-image-line text-purple-500',
    };
    return map[ext] || 'ri-file-line text-gray-400';
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// Campos del formulario de contacto
const CF_FIELDS = [
    { key: 'nombres', label: 'Nombres y apellidos', mostrar: true, obligatorio: false },
    { key: 'telefono', label: 'Número de teléfono', mostrar: false, obligatorio: false },
    { key: 'correo', label: 'Correo electrónico', mostrar: false, obligatorio: true },
    { key: 'empresa', label: 'Nombre de empresa', mostrar: true, obligatorio: true },
    { key: 'pais', label: 'País', mostrar: true, obligatorio: true },
    { key: 'mensaje', label: 'Mensaje', mostrar: true, obligatorio: true },
];

function renderCFCampos() {
    const container = document.getElementById('cf-campos');
    container.innerHTML = CF_FIELDS.map((f, i) => `
        <div class="grid grid-cols-[1fr_auto_auto] gap-x-6 items-center py-2.5">
            <span class="text-sm text-gray-600">${f.label}</span>
 
            <!-- Checkbox Mostrar -->
            <div class="flex justify-center w-16">
                <input type="checkbox" id="cf-show-${i}"
                    ${f.mostrar ? 'checked' : ''}
                    onchange="syncObligatorio(${i})"
                    class="w-4 h-4 rounded accent-blue-800 cursor-pointer">
            </div>
 
            <!-- Toggle Obligatorio -->
            <div class="flex justify-center w-16">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="cf-req-${i}"
                        ${f.obligatorio ? 'checked' : ''}
                        ${!f.mostrar ? 'disabled' : ''}
                        class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-200 rounded-full peer
                                peer-checked:bg-blue-800 transition-colors duration-200
                                peer-disabled:opacity-40
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                after:bg-white after:rounded-full after:h-4 after:w-4
                                after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
            </div>
        </div>
    `).join('');
}

// Si desmarcan "Mostrar", desactivar Obligatorio automáticamente
function syncObligatorio(i) {
    const show = document.getElementById(`cf-show-${i}`);
    const req = document.getElementById(`cf-req-${i}`);
    if (!show.checked) {
        req.checked = false;
        req.disabled = true;
    } else {
        req.disabled = false;
    }
}
function toggleTermsLink() {
    const checked = document.getElementById('cf-terms').checked;
    document.getElementById('cf-terms-link').classList.toggle('hidden', !checked);
}

// Abrir / cerrar modal de contacto
function openContactModal() {
    renderCFCampos();
    document.getElementById('cf-nombre').value = '';
    document.getElementById('cf-gracias').value = '¡Gracias!';
    document.getElementById('cf-terms').checked = false;
    document.getElementById('cf-terms-link').classList.add('hidden');
    document.getElementById('contact-modal').classList.remove('hidden');
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.add('hidden');
}

// Crear formulario (desde el modal)
function crearFormulario() {
    const nombre = document.getElementById('cf-nombre').value.trim();
    if (!nombre) {
        document.getElementById('cf-nombre').focus();
        document.getElementById('cf-nombre').style.borderColor = '#ef4444';
        setTimeout(() => document.getElementById('cf-nombre').style.borderColor = '', 1500);
        return;
    }

    const campos = CF_FIELDS.map((f, i) => ({
        campo: f.key,
        mostrar: document.getElementById(`cf-show-${i}`).checked,
        obligatorio: document.getElementById(`cf-req-${i}`).checked,
    }));

    const payload = {
        nombre,
        campos,
        mensajeAgradecimiento: document.getElementById('cf-gracias').value.trim(),
        terminos: document.getElementById('cf-terms').checked
            ? document.getElementById('cf-link')?.value.trim()
            : null,
    };

    console.log('Formulario de contacto creado:', payload);
    closeContactModal();
    showToast(`Formulario "${nombre}" creado correctamente.`, true);
}

// Guardar formulario principal → abre modal
function guardarFormulario() {
    const nombre1 = document.getElementById('f-nombre1').value.trim();
    const nombre2 = document.getElementById('f-nombre2').value.trim();
    const empresa = document.getElementById('f-empresa').value;

    if (!nombre1 || !nombre2 || !empresa) {
        showToast('Por favor completa los campos obligatorios.', false);
        return;
    }

    window._formData = {
        nombre1, nombre2, empresa,
        tipo1: document.getElementById('f-tipo1').value,
        tipo2: document.getElementById('f-tipo2').value,
        descripcion: document.getElementById('f-desc').value.trim(),
        archivos: uploadedFiles.map(f => f.name),
    };

    console.log('Form principal guardado:', window._formData);

    // Abrir el modal del formulario de contacto
    openContactModal();
}

// Toast
function showToast(msg, success = true) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const text = document.getElementById('toast-msg');

    icon.className = success
        ? 'ri-checkbox-circle-line text-green-400 text-base'
        : 'ri-error-warning-line text-yellow-400 text-base';
    text.textContent = msg;

    toast.classList.remove('hidden');
    toast.classList.add('flex');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('flex');
    }, 3000);
}

// Bootstrap
loadEmpresas();