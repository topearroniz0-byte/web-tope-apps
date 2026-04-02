const ADMIN_ACCESS_KEY = "tope123";
let allApps = [];

// FUNCIÓN PARA ENVIAR LA DESCARGA A GOOGLE
function trackDownload(appName) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'download_click', // Este es el nombre que usaremos en la web de Google
        'app_name': appName
    });
    console.log("Rastreo enviado: " + appName);
}

async function cargarRepositorio() {
    try {
        const response = await fetch('apps.json');
        allApps = await response.json();
        renderApps('all');
        setupFilters();
    } catch (error) {
        document.getElementById('appContainer').innerHTML = "ERROR DE CARGA";
    }
}

// ... (Tus funciones de rastreo y carga inicial se mantienen igual) ...

function renderApps(filter) {
    const container = document.getElementById('appContainer');
    container.innerHTML = "";

    const appsFiltradas = allApps.filter(app => {
        if (filter === 'all') return true;
        if (app.category === 'multi') return true;
        return app.category === filter; 
    });
    
    // ESTE BLOQUE ESTABA FUERA, DEBE IR AQUÍ DENTRO:
    appsFiltradas.forEach(app => {
        const card = document.createElement('article');
        card.className = "card";
        
        let actionHTML = "";
        if (app.url === "" || app.url === "#") {
            actionHTML = `<p style="color: var(--primary-gold); font-weight: bold; margin-top: 20px; font-size: 0.8rem; text-transform: uppercase;">🚀 Próximamente</p>`;
        } else {
            actionHTML = `
                <div style="margin-top: 20px;">
                    <a href="${app.url}" target="_blank" class="action-btn-gold" onclick="trackDownload('${app.name}')">
                        DESCARGAR
                    </a>
                </div>`;
        }

        card.innerHTML = `
            <div class="card-info">
                <span class="category-tag">${app.category.toUpperCase()}</span>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                ${actionHTML}
            </div>`;
        container.appendChild(card);
    });
} // Aquí cierra correctamente la función renderApps

// ... (El resto del código de filtros y login se mantiene igual) ...

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderApps(btn.getAttribute('data-category'));
        });
    });
}

// ADMIN LOGIN
const btnAdmin = document.getElementById('btnAdminLogin');
if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        if (prompt("ACCESS:") === ADMIN_ACCESS_KEY) {
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('adminContent').innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <p>ADMIN MODE ONLINE</p>
                    <button onclick="location.reload()" class="auth-btn">CERRAR</button>
                </div>`;
        }
    });
}

window.onload = cargarRepositorio;