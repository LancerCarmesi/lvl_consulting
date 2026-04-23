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
        document.getElementById('sub-paginas').classList.remove('open');
        document.getElementById('arrow-paginas').style.transform = '';
    }
}

// Submenu
function toggleSubmenu(el) {
    if (collapsed) return;
    const sub = document.getElementById('sub-paginas');
    const arrow = document.getElementById('arrow-paginas');
    const isOpen = sub.classList.contains('open');
    sub.classList.toggle('open', !isOpen);
    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
}

// DummyJSON fetch helpers
async function fetchProducts() {
    const r = await fetch('https://dummyjson.com/products?limit=100&select=price,stock,discountPercentage,title');
    return (await r.json()).products;
}
async function fetchUsers() {
    const r = await fetch('https://dummyjson.com/users?limit=100&select=id');
    return (await r.json()).users;
}
async function fetchCarts() {
    const r = await fetch('https://dummyjson.com/carts?limit=30');
    return (await r.json()).carts;
}

// Build KPI cards
function buildKPI(products, users) {
    const totalRevenue = products.reduce((s, p) => s + p.price * p.stock, 0);
    const totalInversion = products.reduce((s, p) => s + p.price * (p.stock * .6), 0);
    const ganancia = totalRevenue * 0.08;
    const numClientes = users.length;

    const kpis = [
        { label: 'Ingresos', value: `S/ ${(totalRevenue / 1000).toFixed(2)}k`, badge: '+S/50k', up: true, note: 'Desde el mes pasado' },
        { label: 'Número de clientes', value: numClientes, badge: '-30 clientes', up: false, note: 'Desde el mes pasado' },
        { label: 'Inversión realizada', value: `S/ ${(totalInversion / 1000).toFixed(2)}k`, badge: '+S/32k', up: true, note: 'Desde el mes pasado' },
        { label: 'Relación de ganancia', value: `S/ ${(ganancia / 1000).toFixed(2)}k`, badge: '-S/50k', up: false, note: 'Desde el mes pasado' },
    ];

    document.getElementById('kpi-grid').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <p class="text-xs text-gray-600 font-medium mb-1">${k.label}</p>
      <p class="text-2xl font-bold text-gray-800 mb-2">${k.value}</p>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="${k.up ? 'kpi-badge-up' : 'kpi-badge-down'}">${k.badge}</span>
        <span class="text-xs text-gray-600">${k.note}</span>
      </div>
    </div>
  `).join('');
}

// grafico de lineas 
function buildLineChart(carts) {
    const days7 = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const totals = Array(7).fill(0);
    const counts = Array(7).fill(0);
    carts.forEach((c, i) => { totals[i % 7] += c.total; counts[i % 7]++; });
    const data1 = totals.map((t, i) => counts[i] ? +(t / counts[i] / 10).toFixed(1) : 0);
    const data2 = data1.map(v => +(v * 0.13).toFixed(1));

    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days7,
            datasets: [
                {
                    label: 'Total libre (GB)', data: data1, borderColor: '#00c896', backgroundColor: 'rgba(0,200,150,.08)',
                    tension: .45, fill: true, pointRadius: 3, pointBackgroundColor: '#00c896', borderWidth: 2
                },
                {
                    label: '% Libre (GB)', data: data2, borderColor: '#38bdf8', backgroundColor: 'transparent',
                    tension: .45, fill: false, pointRadius: 3, pointBackgroundColor: '#38bdf8', borderWidth: 2
                },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.raw}` } } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
                y: { position: 'left', grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
                y1: {
                    position: 'right', grid: { display: false }, ticks: { font: { size: 11 }, color: '#38bdf8' },
                    min: 0, max: 20,
                    afterDataLimits(scale) { scale.max = 20; }
                }
            }
        }
    });
}

// grafico de dona
function buildDonut(products) {
    const total = products.reduce((s, p) => s + p.price * p.stock, 0);
    const segments = [
        { label: 'Anual', pct: 1.00, color: '#00c896' },
        { label: 'Mensual', pct: 0.60, color: '#0ea5e9' },
        { label: 'Semanal', pct: 0.20, color: '#6366f1' },
        { label: 'Diario', pct: 0.30, color: '#1e293b' },
    ];

    const ctx = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: segments.map(s => s.label),
            datasets: [{
                data: segments.map(s => s.pct * 100),
                backgroundColor: segments.map(s => s.color),
                borderWidth: 2, borderColor: '#fff', hoverOffset: 4
            }]
        },
        options: {
            cutout: '72%',
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw}%` } } }
        }
    });

    document.getElementById('period-stats').innerHTML = segments.map(s => `
    <div>
      <div class="flex items-center gap-1.5 mb-0.5">
        <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${s.color}"></span>
        <span class="text-xs text-gray-500">${s.label}</span>
      </div>
      <p class="text-lg font-bold text-gray-800">${Math.round(s.pct * 100)}%</p>
      <p class="text-xs text-gray-400">S/${(total * s.pct / 1000).toFixed(0)}k</p>
    </div>
  `).join('');
}

// grafico de barras horizontales
function buildReferred(carts) {
    const top = carts.slice(0, 4).map((c, i) => ({
        id: 1024 + i,
        label: 'Referidos',
        pct: Math.round(70 + Math.random() * 25),
        color: i % 2 === 0 ? '#00c896' : '#0ea5e9'
    }));
    document.getElementById('referred-list').innerHTML = top.map(r => `
    <div>
      <div class="flex items-center justify-between mb-1">
        <div>
          <p class="text-sm font-semibold text-gray-800">${r.id}</p>
          <p class="text-xs text-gray-400">${r.label}</p>
        </div>
        <span class="text-xs text-gray-500 font-medium">${r.pct}%</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill" style="width:${r.pct}%;background:${r.color}"></div>
      </div>
    </div>
  `).join('');
}

// Bootstrap
(async () => {
    try {
        const [products, users, cartsData] = await Promise.all([
            fetchProducts(), fetchUsers(), fetchCarts()
        ]);
        const carts = cartsData;
        buildKPI(products, users);
        buildLineChart(carts);
        buildDonut(products);
        buildReferred(carts);
    } catch (e) {
        console.error('Data fetch error:', e);

        buildKPI(
            Array.from({ length: 30 }, (_, i) => ({ price: 15 + i * 3, stock: 10 + i, discountPercentage: 5 })),
            Array.from({ length: 4789 }, (_, i) => ({ id: i }))
        );
    }
})();