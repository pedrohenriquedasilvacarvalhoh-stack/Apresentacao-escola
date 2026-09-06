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

  if (!modal) return;

  function openModal(data) {
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalCat) modalCat.textContent = data.cat;
    if (modalImg) {
      modalImg.src = data.img;
      modalImg.alt = data.title;
    }
    if (modalDesc) modalDesc.textContent = data.desc;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const data = {
        title: btn.getAttribute('data-title'),
        cat: btn.getAttribute('data-cat'),
        img: btn.getAttribute('data-img'),
        desc: btn.getAttribute('data-desc')
      };
      openModal(data);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Fechar ao clicar no overlay escuro
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar com a tecla ESC
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



