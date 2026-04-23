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
    document.getElementById('sidebar').classList.toggle('collapsed', collapsed);
    document.getElementById('toggle-icon').className = collapsed ? 'ri-arrow-right-s-line text-lg' : 'ri-menu-line text-lg';
    if (collapsed) {
        document.getElementById('sub-paginas').classList.remove('open');
        document.getElementById('arrow-paginas').style.transform = '';
    }
}
function toggleSubmenu(el) {
    if (collapsed) return;
    const sub = document.getElementById('sub-paginas');
    const arrow = document.getElementById('arrow-paginas');
    const isOpen = sub.classList.contains('open');
    sub.classList.toggle('open', !isOpen);
    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
}

// State
let allRows = [];
let page = 1;
let perPage = 10;
let selected = new Set();

// Badge helper
const TYPE_BADGE = {
    'Imágenes': { cls: 'badge-img', icon: 'ri-image-line' },
    'Documento': { cls: 'badge-doc', icon: 'ri-file-text-line' },
    'Videos': { cls: 'badge-vid', icon: 'ri-video-line' },
};
function badgeHTML(type) {
    const b = TYPE_BADGE[type] || TYPE_BADGE['Videos'];
    return `<span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${b.cls}">
            <i class="${b.icon}"></i>${type}</span>`;
}

// imagenes + DummyJSON
async function fetchData() {
    const types = ['Imágenes', 'Documento', 'Videos'];
    // para las imagenes y evitar repeticiones
    const imgIds = Array.from({ length: 30 }, (_, i) => 10 + i * 7);

    // 19 datos
    const names = [
        'Recursos gráficos', 'Plantillas web', 'Galería corporativa', 'Manuales digitales',
        'Videos promocionales', 'Branding assets', 'Fondos de pantalla', 'Iconografía UI',
        'Presentaciones PPT', 'Catálogos PDF', 'Animaciones SVG', 'Contenido social',
        'Mockups de producto', 'Tutoriales en video', 'Reportes anuales', 'Infografías',
        'Banners publicitarios', 'Stories redes', 'Fotografías HD',
    ];
    const descs = [
        'Recursos gráficos que se usarán en páginas que se deberán usar en su momento',
        'Plantillas editables para páginas institucionales y comerciales',
        'Colección de fotografías del equipo y oficinas de LVL Consulting',
        'Documentación técnica y manuales de usuario en formato digital',
        'Videos corporativos y spots publicitarios para campañas',
        'Elementos de identidad de marca: logos, paletas y tipografías',
        'Fondos optimizados para escritorio y dispositivos móviles',
        'Set de íconos vectoriales para interfaces de usuario',
        'Decks de presentación con plantillas aprobadas por marketing',
        'Catálogos de productos y servicios en formato PDF',
        'Animaciones ligeras en SVG para landing pages',
        'Piezas gráficas listas para publicar en redes sociales',
        'Mockups 3D para presentación de productos al cliente',
        'Videos paso a paso para capacitación interna',
        'Informes anuales de gestión con visualizaciones de datos',
        'Infografías para comunicados internos y externos',
        'Banners en formatos IAB para campañas digitales',
        'Historias animadas para Instagram y Facebook',
        'Banco de fotografías en alta resolución para web y prensa',
    ];

    const rows = names.map((name, i) => {
        const typeIndex = Math.floor(i / 7) % 3;
        const type = types[typeIndex];
        const date = `15/04/24 - 6:${String(30 + i).padStart(2, '0')} hrs.`;
        const imgSeed = imgIds[i % imgIds.length];
        return {
            id: i + 1,
            name,
            sub: name,
            desc: descs[i],
            desc2: `${name} que se usarán en páginas web`,
            date,
            type,
            img: `https://picsum.photos/seed/${imgSeed}/40/40`,
        };
    });
    return rows;
}

// renderizar tabla
function renderTable() {
    const start = (page - 1) * perPage;
    const slice = allRows.slice(start, start + perPage);
    const total = allRows.length;
    const totalPages = Math.ceil(total / perPage);

    const body = document.getElementById('table-body');
    body.innerHTML = slice.map(r => `
            <div class="tbl-row" id="row-${r.id}">
                <div>
                    <input type="checkbox" class="w-3.5 h-3.5 accent-blue-700 cursor-pointer"
                        ${selected.has(r.id) ? 'checked' : ''}
                        onchange="toggleSelect(${r.id}, this.checked)">
                </div>
                <div class="text-sm text-gray-500 font-medium">${r.id}</div>
                <div class="flex items-center gap-2 min-w-0">
                    <img src="${r.img}" alt="" class="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                         onerror="this.src='https://picsum.photos/seed/${r.id * 13}/40/40'">
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-800 truncate">${r.name}</p>
                        <p class="text-xs text-gray-400 truncate">${r.sub}</p>
                    </div>
                </div>
                <div class="min-w-0">
                    <p class="text-xs text-gray-500 truncate">${r.desc}</p>
                    <p class="text-xs text-gray-400 truncate">${r.desc2}</p>
                </div>
                <div class="text-xs text-gray-500">${r.date}</div>
                <div>${badgeHTML(r.type)}</div>
                <div class="flex items-center gap-2 text-gray-400">
                    <button onclick="editRow(${r.id})" title="Editar"
                        class="hover:text-blue-600 transition text-base"><i class="ri-pencil-line"></i></button>
                    <button onclick="viewRow(${r.id})" title="Ver"
                        class="hover:text-green-600 transition text-base"><i class="ri-eye-line"></i></button>
                    <button onclick="deleteRow(${r.id})" title="Eliminar"
                        class="hover:text-red-500 transition text-base"><i class="ri-delete-bin-6-line"></i></button>
                </div>
            </div>
        `).join('');

    // Paginacion 
    document.getElementById('pagination-info').textContent =
        `Mostrando ${start + 1} a ${Math.min(start + perPage, total)} de ${total} datos`;
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const ctrl = document.getElementById('pagination-controls');
    let html = '';

    html += `<button class="pg-btn" ${page === 1 ? 'disabled' : ''} onclick="goPage(${page - 1})">
                    <i class="ri-arrow-left-s-line"></i></button>`;

    for (let p = 1; p <= totalPages; p++) {
        html += `<button class="pg-btn ${p === page ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
    }

    html += `<button class="pg-btn" ${page === totalPages ? 'disabled' : ''} onclick="goPage(${page + 1})">
                    <i class="ri-arrow-right-s-line"></i></button>`;

    ctrl.innerHTML = html;
}

function goPage(p) {
    const totalPages = Math.ceil(allRows.length / perPage);
    if (p < 1 || p > totalPages) return;
    page = p;
    renderTable();
}

function changePerPage(val) {
    perPage = parseInt(val);
    page = 1;
    renderTable();
}

// detalle
function viewRow(id) {
    const r = allRows.find(x => x.id === id);
    if (!r) return;
    document.getElementById('view-content').innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <img src="${r.img}" class="w-14 h-14 rounded-xl object-cover">
                <div>
                    <p class="font-bold text-gray-800">${r.name}</p>
                    <p class="text-xs text-gray-400 mt-0.5">${r.date}</p>
                </div>
            </div>
            <p><span class="font-semibold text-gray-700">Descripción:</span> ${r.desc}</p>
            <p><span class="font-semibold text-gray-700">Tipo:</span> ${badgeHTML(r.type)}</p>
        `;
    document.getElementById('view-modal').classList.remove('hidden');
}
function closeViewModal() { document.getElementById('view-modal').classList.add('hidden'); }

// Bootstrap
(async () => {
    try {
        allRows = await fetchData();
    } catch (e) {
        console.warn('Fetch error, using fallback', e);
        allRows = Array.from({ length: 19 }, (_, i) => ({
            id: i + 1, name: 'Recursos gráficos', sub: 'Recursos gráficos',
            desc: 'Recursos gráficos que se usarán en páginas que se deberán usar en su momento',
            desc2: 'Recursos gráficos que se usarán en páginas web',
            date: '15/04/24 - 6:30 hrs.',
            type: ['Imágenes', 'Documento', 'Videos'][Math.floor(i / 7) % 3],
            img: `https://picsum.photos/seed/${i * 17 + 5}/40/40`
        }));
    }
    renderTable();
})();