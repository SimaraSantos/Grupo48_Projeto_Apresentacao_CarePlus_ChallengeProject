const CARE_PLUS_PAGES = {
    login: 'login.html',
    home: 'tela01-dashboard.html',
    notificacoes: 'tela01-popupautorizacao.html',
    agendamento: 'tela02-agendamento.html',
    reagendamento: 'tela03-reagendamento.html',
    progresso: 'tela06-progresso.html',
    extrato: 'tela07-extratoperfil.html'
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Interface Care Plus carregada!");

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = CARE_PLUS_PAGES.home;
        });
    }

    initPerfilSidebarTabs();

    document.querySelectorAll('a[href="login.html"]').forEach((link) => {
        link.addEventListener('click', () => {
            sessionStorage.removeItem(PERFIL_TAB_STORAGE_KEY);
        });
    });

    document.querySelectorAll('[data-nav]').forEach((element) => {
        const page = element.getAttribute('data-nav');
        const href = CARE_PLUS_PAGES[page];

        if (!href) return;

        if (element.tagName === 'A') {
            element.setAttribute('href', href);
            return;
        }

        element.addEventListener('click', () => {
            window.location.href = href;
        });

        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = href;
            }
        });
    });

    const countdownDisplay = document.getElementById("countdown-timer");
    
    if (countdownDisplay) { 
        function startCountdown() {
            const targetDate = new Date("June 20, 2026 14:30:00").getTime();

            const timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                countdownDisplay.innerHTML = `${days}d ${hours}h ${minutes}m`;

                if (distance < 0) {
                    clearInterval(timer);
                    countdownDisplay.innerHTML = "Em andamento";
                }
            }, 1000);
        }
        startCountdown();
    }

    const btnAjudaCarePlus = document.querySelector('.btn-care-hover');
    
    if (btnAjudaCarePlus) {
        btnAjudaCarePlus.addEventListener('click', () => {
            console.log("O usuário solicitou informações sobre como obter pontos.");
        });
    }

    const avisoPopover = document.getElementById('avisoPopover');
    const fecharPopover = document.getElementById('fecharPopover');
    const btnProsseguir = document.getElementById('btnProsseguir');

    if (avisoPopover && fecharPopover) {
        
        const fecharBalao = () => {
            avisoPopover.style.opacity = '0';
            setTimeout(() => {
                avisoPopover.style.display = 'none';
            }, 300); 
        };

        fecharPopover.addEventListener('click', fecharBalao);
        
        if(btnProsseguir) {
            btnProsseguir.addEventListener('click', () => {
                fecharBalao();
                console.log("O usuário aceitou os riscos do reagendamento.");
            });
        }
    }

    const browserNotif = document.getElementById('browserNotification');
    if (browserNotif) {
        const fecharBrowser = () => {
            browserNotif.style.opacity = '0';
            setTimeout(() => browserNotif.style.display = 'none', 300);
        };
        document.getElementById('btnPermitirBrowser')?.addEventListener('click', fecharBrowser);
        document.getElementById('btnBloquearBrowser')?.addEventListener('click', fecharBrowser);
    }

    const systemNotif = document.getElementById('systemNotification');
    if (systemNotif) {
        const fecharSystem = () => {
            systemNotif.style.opacity = '0';
            setTimeout(() => systemNotif.style.display = 'none', 300);
        };
        document.getElementById('fecharSystemNotif')?.addEventListener('click', fecharSystem);
        document.getElementById('btnExcluirNotif')?.addEventListener('click', fecharSystem);
        document.getElementById('btnIgnorarNotif')?.addEventListener('click', fecharSystem);
    }
});

const PERFIL_TAB_STORAGE_KEY = 'careplus_perfil_tab';

function initPerfilSidebarTabs() {
    const sidebar = document.querySelector('[data-perfil-sidebar]');
    if (!sidebar) return;

    const fallbackTab = sidebar.getAttribute('data-perfil-default') || 'dados';
    const buttons = sidebar.querySelectorAll('[data-perfil-tab]');
    const panels = sidebar.querySelectorAll('[data-perfil-panel]');
    const availableTabs = [...panels].map((panel) => panel.getAttribute('data-perfil-panel'));

    const getSavedTab = () => {
        const saved = sessionStorage.getItem(PERFIL_TAB_STORAGE_KEY);
        return availableTabs.includes(saved) ? saved : null;
    };

    const setActiveButton = (button, isActive) => {
        button.classList.toggle('btn-info', isActive);
        button.classList.toggle('text-white', isActive);
        button.classList.toggle('active', isActive);
        button.classList.toggle('fw-bold', isActive);
        button.classList.toggle('shadow-sm', isActive);
        button.classList.toggle('btn-light', !isActive);
        button.classList.toggle('text-muted', !isActive);
        button.classList.toggle('border', !isActive);
        button.classList.toggle('transition-hover', !isActive);

        if (isActive) {
            button.style.backgroundColor = '#5d9cec';
            button.style.border = 'none';
        } else {
            button.style.backgroundColor = '';
            button.style.border = '';
        }
    };

    const showTab = (tabName, persist = true) => {
        if (!availableTabs.includes(tabName)) return;

        buttons.forEach((button) => {
            setActiveButton(button, button.getAttribute('data-perfil-tab') === tabName);
        });

        panels.forEach((panel) => {
            panel.classList.toggle('d-none', panel.getAttribute('data-perfil-panel') !== tabName);
        });

        if (persist) {
            sessionStorage.setItem(PERFIL_TAB_STORAGE_KEY, tabName);
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            showTab(button.getAttribute('data-perfil-tab'));
        });
    });

    showTab(getSavedTab() || fallbackTab, false);
}