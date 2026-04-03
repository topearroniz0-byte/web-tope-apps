const ADMIN_ACCESS_KEY = "tope123";
let allApps = [];
let currentFilter = 'all';

function trackDownload(appName) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'event': 'download_click', 'app_name': appName });
}

async function cargarRepositorio() {
    try {
        const response = await fetch('apps.json');
        if (!response.ok) throw new Error('Error JSON');
        allApps = await response.json();
        renderApps();
        setupFilters();
        setupSearch();
    } catch (error) {
        document.getElementById('appContainer').innerHTML = "<p style='color:red; text-align:center;'>Error de conexión.</p>";
    }
}

function renderApps(searchTerm = "") {
    const container = document.getElementById('appContainer');
    container.innerHTML = "";

    const filtered = allApps.filter(app => {
        const matchesFilter = (currentFilter === 'all' || app.category === currentFilter);
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filtered.forEach(app => {
        const card = document.createElement('article');
        card.className = "card";
        const isComingSoon = (app.url === "" || app.url === "#");
        
        const actionHTML = isComingSoon 
            ? `<div style="text-align:center; color: var(--accent-cyan); font-size: 0.8rem; border: 1px dashed var(--accent-blue); padding: 10px; border-radius: 10px;">PRÓXIMAMENTE</div>`
            : `<a href="${app.url}" target="_blank" class="action-btn-gold" onclick="trackDownload('${app.name}')">DESCARGAR</a>`;

        card.innerHTML = `
            <div>
                <span class="category-tag">${app.category}</span>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
            </div>
            ${actionHTML}
        `;
        container.appendChild(card);
    });
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-category');
            renderApps(document.getElementById('appSearch').value);
        });
    });
}

function setupSearch() {
    document.getElementById('appSearch').addEventListener('input', (e) => {
        renderApps(e.target.value);
    });
}

document.getElementById('btnAdminLogin').addEventListener('click', () => {
    if (prompt("ACCESS KEY:") === ADMIN_ACCESS_KEY) {
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminContent').innerHTML = "<p>Admin Mode Activo</p>";
    }
});

document.addEventListener('DOMContentLoaded', cargarRepositorio);