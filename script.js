/**
 * VESPER ARQUITETURA - COMPORTAMENTO & INTERATIVIDADE (JS)
 * - Menu Responsivo (Hambúrguer)
 * - Filtro Dinâmico de Portfólio
 * - Modal / Lightbox de Projetos
 * - Validação de Formulário de Orçamento
 * - Rolagem Suave e Efeitos no Header
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBackgroundCanvas();
  initHeaderScroll();
  initMobileMenu();
  initPortfolioFilters();
  initProjectModal();
  initContactForm();
  initSmoothScroll();
  initScrollSpy();
  initHeroCursorTrail();
});

/* ==========================================================================
   0. ALTERNADOR DE TEMA CLARO / ESCURO (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // 1. Verificar tema salvo ou preferência do sistema
  const savedTheme = localStorage.getItem('vesper_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = 'light';
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    currentTheme = 'dark';
  }

  // 2. Aplicar estado inicial
  applyTheme(currentTheme);

  if (!themeToggle) return;

  // 3. Evento de clique para alternar
  themeToggle.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('vesper_theme', newTheme);
  });

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro');
    }
  }
}

/* ==========================================================================
   1. EFEITO DE SCROLL NO HEADER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(6, 18, 38, 0.98)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.backgroundColor = 'rgba(11, 29, 58, 0.92)';
      header.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   2. MENU MOBILE (HAMBÚRGUER)
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('open');
  });

  // Fechar menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. FILTRO DO PORTFÓLIO
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualizar classe ativa nos botões
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   4. MODAL / LIGHTBOX DE PROJETOS
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCat = document.getElementById('modalCat');
  const modalImg = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');
  const modalCtaBtn = document.getElementById('modalCtaBtn');

  // Abas e Containers
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const plan2dCanvas = document.getElementById('plan2dCanvas');
  const homebymeIframe = document.getElementById('homebymeIframe');
  const homebymeSpinner = document.getElementById('homebymeSpinner');
  const fallback3DWrapper = document.getElementById('fallback3DWrapper');
  const canvas3DFallback = document.getElementById('canvas3DFallback');

  let activeEngine3D = null;
  let currentProjectData = null;

  if (!modal) return;

  // Função para Alternar Abas
  function switchModalTab(tabName) {
    tabBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      pane.classList.remove('active');
    });

    if (tabName === 'photo') {
      const pane = document.getElementById('tabPanePhoto');
      if (pane) pane.classList.add('active');
    } else if (tabName === 'plan2d') {
      const pane = document.getElementById('tabPane2D');
      if (pane) pane.classList.add('active');
      if (plan2dCanvas && currentProjectData) {
        setTimeout(() => drawArchitecturalPlan2D(plan2dCanvas, currentProjectData.title, currentProjectData.cat), 50);
      }
    } else if (tabName === 'model3d') {
      const pane = document.getElementById('tabPane3D');
      if (pane) pane.classList.add('active');
      setup3DView(currentProjectData ? currentProjectData.homebymeUrl : '');
    }
  }

  // Configurar Visualização 3D (Iframe Embed Direto no Modal + Fallback 3D Nativo)
  function setup3DView(url) {
    if (url && url.trim().length > 0) {
      let embedUrl = url.trim();
      // Formatação automática para URL de Embed do HomeByMe se for link padrão do projeto
      if (embedUrl.includes('home.by.me') && !embedUrl.endsWith('/embed')) {
        embedUrl = embedUrl.replace(/\/$/, '') + '/embed';
      }

      if (fallback3DWrapper) fallback3DWrapper.style.display = 'none';
      if (homebymeIframe) {
        homebymeIframe.style.display = 'block';
        homebymeIframe.src = embedUrl;
      }
      if (homebymeSpinner) {
        homebymeSpinner.style.display = 'flex';
        homebymeSpinner.style.opacity = '1';
        homebymeIframe.onload = () => {
          homebymeSpinner.style.opacity = '0';
          setTimeout(() => { homebymeSpinner.style.display = 'none'; }, 400);
        };
      }
    } else {
      // Exibir Maquete 3D Interativa Nativa Vesper (Caso não haja URL configurada)
      if (homebymeIframe) homebymeIframe.style.display = 'none';
      if (homebymeSpinner) homebymeSpinner.style.display = 'none';
      if (fallback3DWrapper) fallback3DWrapper.style.display = 'block';

      if (canvas3DFallback && !activeEngine3D) {
        setTimeout(() => {
          activeEngine3D = create3DHouseEngine(canvas3DFallback);
        }, 50);
      }
    }
  }



  // Event Listeners das Abas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      switchModalTab(tabName);
    });
  });

  function openModal(data) {
    currentProjectData = data;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalCat) modalCat.textContent = data.cat;
    if (modalImg) {
      modalImg.src = data.img;
      modalImg.alt = data.title;
    }
    if (modalDesc) modalDesc.textContent = data.desc;

    // Resetar para a primeira aba (Foto) ao abrir
    switchModalTab('photo');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (activeEngine3D) {
      activeEngine3D.stop();
      activeEngine3D = null;
    }
    if (homebymeIframe) {
      homebymeIframe.src = '';
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const data = {
        title: btn.getAttribute('data-title'),
        cat: btn.getAttribute('data-cat'),
        img: btn.getAttribute('data-img'),
        img2d: btn.getAttribute('data-img-2d'),
        homebymeUrl: btn.getAttribute('data-homebyme-url'),
        desc: btn.getAttribute('data-desc')
      };
      openModal(data);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
      closeModal();
      const contatoSection = document.getElementById('contato');
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   FUNÇÕES AUXILIARES DE RENDERIZAÇÃO 2D E 3D PARA O MODAL
   -------------------------------------------------------------------------- */

// Desenha a Planta Baixa 2D Técnica no Canvas
function drawArchitecturalPlan2D(canvas, title, cat) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  canvas.width = rect.width * (window.devicePixelRatio || 1);
  canvas.height = rect.height * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const w = rect.width;
  const h = rect.height;

  // Fundo técnico estilo planta baixa
  ctx.fillStyle = '#070f1e';
  ctx.fillRect(0, 0, w, h);

  // Grade de alinhamento CAD (Grid)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 24;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Margens da Planta
  const marginX = w * 0.1;
  const marginY = h * 0.12;
  const houseW = w - marginX * 2;
  const houseH = h - marginY * 2.2;

  // Paredes Externas (Dourado Vesper)
  ctx.strokeStyle = '#c7a14a';
  ctx.lineWidth = 4;
  ctx.strokeRect(marginX, marginY, houseW, houseH);

  // Divisórias de Cômodos (Paredes Internas)
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Parede horizontal principal
  ctx.moveTo(marginX, marginY + houseH * 0.48);
  ctx.lineTo(marginX + houseW, marginY + houseH * 0.48);
  // Divisória vertical 1 (Suíte)
  ctx.moveTo(marginX + houseW * 0.45, marginY);
  ctx.lineTo(marginX + houseW * 0.45, marginY + houseH * 0.48);
  // Divisória vertical 2 (Serviço)
  ctx.moveTo(marginX + houseW * 0.65, marginY + houseH * 0.48);
  ctx.lineTo(marginX + houseW * 0.65, marginY + houseH);
  ctx.stroke();

  // Arcos de Abertura de Portas (Estilo Planta Baixa CAD)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(marginX + houseW * 0.45, marginY + 35, 22, 0, Math.PI * 0.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(marginX + houseW * 0.65, marginY + houseH * 0.48 + 35, 22, Math.PI * 0.5, Math.PI);
  ctx.stroke();

  // Rótulos e Cotas de Ambientes
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';

  // Cômodo 1
  ctx.fillText('SUÍTE PRINCIPAL', marginX + houseW * 0.22, marginY + houseH * 0.22);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('4.80m × 3.60m', marginX + houseW * 0.22, marginY + houseH * 0.32);

  // Cômodo 2
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LIVING & ESPAÇO INTEGRADO', marginX + houseW * 0.72, marginY + houseH * 0.22);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('6.50m × 4.80m', marginX + houseW * 0.72, marginY + houseH * 0.32);

  // Cômodo 3
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('COZINHA ARCH', marginX + houseW * 0.32, marginY + houseH * 0.7);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('4.20m × 3.50m', marginX + houseW * 0.32, marginY + houseH * 0.8);

  // Cômodo 4
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SAN. PNE / ACESSIBILIDADE', marginX + houseW * 0.82, marginY + houseH * 0.7);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('2.40m × 2.10m', marginX + houseW * 0.82, marginY + houseH * 0.8);

  // Marcações de Escala e Rosa dos Ventos
  ctx.fillStyle = '#c7a14a';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PLANTA BAIXA EXECUTIVA | VESPER ARCH - NBR 9050', marginX, h - 14);

  ctx.save();
  ctx.translate(w - marginX - 15, 30);
  ctx.beginPath();
  ctx.moveTo(0, -12); ctx.lineTo(5, 6); ctx.lineTo(0, 2); ctx.lineTo(-5, 6);
  ctx.closePath();
  ctx.fillStyle = '#d4af37';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N', 0, -15);
  ctx.restore();
}

// Engine Interativa de Maquete 3D em Canvas WebGL/2D
function create3DHouseEngine(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  let rotX = 0.45;
  let rotY = 0.65;
  let zoom = 1.0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let animationFrameId = null;

  // Vértices 3D da Estrutura da Casa
  const vertices = [
    // Corpo principal da casa
    [-1, -0.6, -1], [1, -0.6, -1], [1, 0.5, -1], [-1, 0.5, -1],
    [-1, -0.6, 1],  [1, -0.6, 1],  [1, 0.5, 1],  [-1, 0.5, 1],
    // Telhado moderno em duas águas
    [0, 1.2, -1], [0, 1.2, 1],
    // Bloco da varanda gourmet integrativa
    [1, -0.6, -1], [1.7, -0.6, -1], [1.7, 0.2, -1], [1, 0.2, -1],
    [1, -0.6, 0.4], [1.7, -0.6, 0.4], [1.7, 0.2, 0.4], [1, 0.2, 0.4]
  ];

  const edges = [
    // Estrutura principal
    [0,1], [1,2], [2,3], [3,0],
    [4,5], [5,6], [6,7], [7,4],
    [0,4], [1,5], [2,6], [3,7],
    // Cumeeira do telhado
    [3,8], [2,8], [7,9], [6,9], [8,9],
    // Anexo da varanda
    [10,11], [11,12], [12,13], [13,10],
    [14,15], [15,16], [16,17], [17,14],
    [10,14], [11,15], [12,16], [13,17]
  ];

  function project(v, width, height) {
    const x1 = v[0] * Math.cos(rotY) - v[2] * Math.sin(rotY);
    const z1 = v[0] * Math.sin(rotY) + v[2] * Math.cos(rotY);

    const y2 = v[1] * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = v[1] * Math.sin(rotX) + z1 * Math.cos(rotX);

    const scale = (340 * zoom) / (z2 + 4.5);
    const x2 = x1 * scale + width / 2;
    const y3 = -y2 * scale + height / 2;

    return { x: x2, y: y3, z: z2 };
  }

  function render() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const w = rect.width;
    const h = rect.height;

    ctx.fillStyle = '#070f1e';
    ctx.fillRect(0, 0, w, h);

    if (!isDragging) {
      rotY += 0.006;
    }

    // Grade 3D de terreno
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      const p1 = project([i, -0.6, -3], w, h);
      const p2 = project([i, -0.6, 3], w, h);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

      const p3 = project([-3, -0.6, i], w, h);
      const p4 = project([3, -0.6, i], w, h);
      ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    const projected = vertices.map(v => project(v, w, h));

    // Desenhando Arestas 3D Arquitetônicas
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    edges.forEach(edge => {
      const p1 = projected[edge[0]];
      const p2 = projected[edge[1]];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Pontos de Vértices 3D
    ctx.fillStyle = '#ffffff';
    projected.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  const onMouseMove = e => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    rotY += deltaX * 0.008;
    rotX += deltaY * 0.008;
    rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  };

  const onMouseUp = () => { isDragging = false; };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoom += e.deltaY * -0.001;
    zoom = Math.max(0.6, Math.min(2.2, zoom));
  }, { passive: false });

  render();

  return {
    stop: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
  };
}


/* ==========================================================================
   5. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Campos
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceSelect = document.getElementById('serviceType');
    const messageInput = document.getElementById('message');
    const termsCheckbox = document.getElementById('terms');

    // Validação Nome
    if (!nameInput.value.trim()) {
      showError(nameInput, 'nameError');
      isValid = false;
    } else {
      clearError(nameInput, 'nameError');
    }

    // Validação E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError');
      isValid = false;
    } else {
      clearError(emailInput, 'emailError');
    }

    // Validação Telefone
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'phoneError');
      isValid = false;
    } else {
      clearError(phoneInput, 'phoneError');
    }

    // Validação Serviço
    if (!serviceSelect.value) {
      showError(serviceSelect, 'serviceError');
      isValid = false;
    } else {
      clearError(serviceSelect, 'serviceError');
    }

    // Validação Mensagem
    if (!messageInput.value.trim()) {
      showError(messageInput, 'messageError');
      isValid = false;
    } else {
      clearError(messageInput, 'messageError');
    }

    // Validação Checkbox Termos
    const termsGroup = termsCheckbox.closest('.form-checkbox');
    if (!termsCheckbox.checked) {
      if (termsGroup) termsGroup.classList.add('error');
      isValid = false;
    } else {
      if (termsGroup) termsGroup.classList.remove('error');
    }

    if (isValid) {
      // Feedback visual de carregamento
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      if (btnText) btnText.hidden = true;
      if (btnSpinner) btnSpinner.hidden = false;
      submitBtn.disabled = true;

      // Simulação de envio rápido para demonstrador acadêmico
      setTimeout(() => {
        if (btnText) btnText.hidden = false;
        if (btnSpinner) btnSpinner.hidden = true;
        submitBtn.disabled = false;

        form.reset();

        if (toast) {
          toast.hidden = false;
          setTimeout(() => {
            toast.hidden = true;
          }, 5000);
        }
      }, 1000);
    }
  });

  function showError(inputElement, errorId) {
    const parent = inputElement.closest('.form-group');
    if (parent) {
      parent.classList.add('error');
    }
  }

  function clearError(inputElement, errorId) {
    const parent = inputElement.closest('.form-group');
    if (parent) {
      parent.classList.remove('error');
    }
  }
}

/* ==========================================================================
   6. ROLAGEM SUAVE (SMOOTH SCROLL)
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   7. SCROLLSPY (RASTREAMENTO DINÂMICO DA SEÇÃO ATIVA NO MENU)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 120; // Offset de 120px para compensar a altura do header fixo
    const windowBottom = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Se estiver no topo da página (< 100px)
    if (window.scrollY < 100) {
      setActiveNav('#inicio');
      return;
    }

    // Se estiver no final absoluto da página (rodapé/contato)
    if (windowBottom >= documentHeight - 40) {
      setActiveNav('#contato');
      return;
    }

    // Encontrar a seção visível atualmente
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = '#' + section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      setActiveNav(currentSectionId);
    }
  }

  function setActiveNav(targetHref) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Eventos de scroll e redimensionamento
  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);

  // Ativação inicial
  updateActiveLink();
}

/* ==========================================================================
   8. RASTRO DE COR INTERATIVO SOBRE A IMAGEM DO HERO (SPOTLIGHT TRAIL)
   ========================================================================== */
function initHeroCursorTrail() {
  const heroSection = document.querySelector('.hero-section');
  const canvas = document.getElementById('heroTrailCanvas');
  if (!heroSection || !canvas) return;

  const ctx = canvas.getContext('2d');

  // Canvas offscreen para criar a máscara alpha suavizada
  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');

  // Imagem colorida em alta definição para revelação sob o cursor
  const bgImg = new Image();
  bgImg.src = 'assets/images/hero.png';

  let points = [];
  let isImgLoaded = false;

  bgImg.onload = () => {
    isImgLoaded = true;
    resize();
  };

  function resize() {
    const w = heroSection.offsetWidth;
    const h = heroSection.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    maskCanvas.width = w;
    maskCanvas.height = h;
  }

  window.addEventListener('resize', resize);
  resize();

  function addPoint(x, y) {
    points.push({
      x: x,
      y: y,
      radius: 55, // Raio do holofote de cor (reduzido para maior precisão)
      alpha: 1.0   // Opacidade total inicial
    });
  }

  // Evento do mouse
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addPoint(x, y);
  });

  // Evento touch para mobile/tablets
  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      addPoint(x, y);
    }
  }, { passive: true });

  // Loop de animação 60fps
  function animate() {
    requestAnimationFrame(animate);

    if (!isImgLoaded || canvas.width === 0 || canvas.height === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    maskCtx.clearRect(0, 0, w, h);

    if (points.length === 0) return;

    // Desenhar pincéis gradientes no maskCanvas
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      p.alpha -= 0.025; // VELOCIDADE DO RASTRO: Aumente este valor para sumir mais rápido (ex: 0.05) ou diminua para sumir mais devagar (ex: 0.01)

      if (p.alpha <= 0) {
        points.splice(i, 1);
        continue;
      }

      const grad = maskCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${p.alpha * 0.65})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      maskCtx.fillStyle = grad;
      maskCtx.beginPath();
      maskCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      maskCtx.fill();
    }

    // Desenhar a imagem colorida
    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = w / h;
    let renderW, renderH, renderX, renderY;

    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      renderX = 0;
      renderY = (h - renderH) / 2;
    } else {
      renderW = h * imgRatio;
      renderH = h;
      renderX = (w - renderW) / 2;
      renderY = 0;
    }

    ctx.drawImage(bgImg, renderX, renderY, renderW, renderH);

    // Aplicar a máscara alpha para revelar a imagem colorida apenas onde o rastro passou
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  animate();
}

/* ==========================================================================
   10. ANIMAÇÃO DE FUNDO INTERATIVA (CANVAS PARTICLES - PALETA ADAPTATIVA VESPER)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let largura, altura;
  let estrelas = [];

  function redimensionar() {
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = largura;
    canvas.height = altura;
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();

  // Cores dinâmicas com base no tema ativo (data-theme)
  function getThemePalette() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      // Modo Escuro: Dourado Champanhe Vesper & Azul Estelar / Prata
      return [
        { r: 212, g: 175, b: 55 },  // #D4AF37 (Dourado Champanhe)
        { r: 199, g: 161, b: 74 },  // #C7A14A (Dourado Vesper)
        { r: 226, g: 232, b: 240 }, // #E2E8F0 (Azul/Prata Estelar)
      ];
    } else {
      // Modo Claro: Dourado Vesper & Azul Marinho Profundo Vesper
      return [
        { r: 199, g: 161, b: 74 },  // #C7A14A (Dourado Vesper)
        { r: 11, g: 29, b: 58 },  // #0B1D3A (Azul Marinho Profundo)
        { r: 169, g: 176, b: 183 }, // #A9B0B7 (Cinza Esquistoso)
      ];
    }
  }

  let palette = getThemePalette();

  // Atualiza a paleta de cores instantaneamente quando o tema for alterado
  const observer = new MutationObserver(() => {
    palette = getThemePalette();
    estrelas.forEach(e => e.atualizarCor(palette));
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Rastreamento do cursor do mouse para repulsão sutil de partículas
  let mouse = {
    x: null,
    y: null,
    // TAMANHO DA ÁREA DE REPULSÃO (em pixels):
    // Aumente este valor (ex: 200) para alcançar estrelas mais distantes
    // Diminua este valor (ex: 80) para afastar apenas estrelas muito próximas do cursor
    raio: 60
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Estrela {
    constructor() {
      this.reset();
      // Distribuição inicial aleatória por toda a altura da tela no carregamento
      this.y = Math.random() * altura;
    }

    reset() {
      this.x = Math.random() * largura;
      this.tamanho = Math.random() * 2 + 1; // Tamanho delicado de estrela de 5 pontas
      this.y = altura + this.tamanho;
      this.velocidade = this.tamanho * 0.3;
      this.opacidadeBase = Math.random() * 0.65 + 0.25;
      this.atualizarCor(palette);
    }

    atualizarCor(paletaCores) {
      const cor = paletaCores[Math.floor(Math.random() * paletaCores.length)];
      this.cor = cor;
    }

    atualizar() {
      // Repulsão interativa pelo cursor do mouse sem interromper a subida
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < mouse.raio && distancia > 0) {
          const força = (mouse.raio - distancia) / mouse.raio;
          const angulo = Math.atan2(dy, dx);
          // INTENSIDADE DO EMPURRÃO: Aumente o multiplicador (ex: 5.0 ou 8.0) para mover mais rápido
          const empurrao = força * 3.5;
          this.x += Math.cos(angulo) * empurrao;
          this.y += Math.sin(angulo) * empurrao;
        }
      }

      // Movimento contínuo de subida
      this.y -= this.velocidade;
      if (this.y < -this.tamanho) {
        this.reset();
      }
    }

    desenhar() {
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.x, this.y);

      const pontas = 5;
      const raioExterno = this.tamanho;
      const raioInterno = this.tamanho * 0.4;

      for (let i = 0; i < pontas * 2; i++) {
        const raioAtual = i % 2 === 0 ? raioExterno : raioInterno;
        const angulo = (i * Math.PI) / pontas;
        ctx.lineTo(Math.sin(angulo) * raioAtual, -Math.cos(angulo) * raioAtual);
      }

      ctx.closePath();
      ctx.fillStyle = `rgba(${this.cor.r}, ${this.cor.g}, ${this.cor.b}, ${this.opacidadeBase})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function criarEstrelas(quantidade) {
    estrelas = [];
    for (let i = 0; i < quantidade; i++) {
      estrelas.push(new Estrela());
    }
  }

  // Densidade de estrelinhas aumentada (entre 250 e 350 para alta riqueza visual)
  const numEstrelas = Math.min(Math.floor((largura * altura) / 3800), 350);
  criarEstrelas(numEstrelas);

  function animar() {
    ctx.clearRect(0, 0, largura, altura);
    estrelas.forEach(estrela => {
      estrela.atualizar();
      estrela.desenhar();
    });
    requestAnimationFrame(animar);
  }

  animar();
}




