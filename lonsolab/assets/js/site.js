(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pesos = n => '$' + new Intl.NumberFormat('es-AR').format(Math.round(n));
  const WA = 'https://wa.me/5493541337818?text=';
  document.documentElement.classList.add('js');

  // ---------- Encabezado con fondo al hacer scroll ----------
  const encabezado = $('.encabezado');
  const alScroll = () => encabezado && encabezado.classList.toggle('con-scroll', window.scrollY > 8);
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  // ---------- Menú móvil accesible ----------
  const menuBoton = $('.menu-boton'), menu = $('#menu-movil');
  if (menuBoton && menu) {
    const abrir = (abierto, devolverFoco = false) => {
      menu.hidden = !abierto;
      menuBoton.setAttribute('aria-expanded', String(abierto));
      menuBoton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-abierto', abierto);
      if (abierto) $('a', menu).focus();
      else if (devolverFoco) menuBoton.focus();
    };
    menuBoton.addEventListener('click', () => abrir(menu.hidden, true));
    $$('a', menu).forEach(a => a.addEventListener('click', () => abrir(false)));
    window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) abrir(false); });
    document.addEventListener('keydown', e => {
      if (menu.hidden) return;
      if (e.key === 'Escape') abrir(false, true);
      if (e.key === 'Tab') {
        const items = [menuBoton, ...$$('a', menu)];
        const i = items.indexOf(document.activeElement);
        const siguiente = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
        e.preventDefault();
        items[siguiente].focus();
      }
    });
  }

  // ---------- Observador genérico: marca .en-vista una sola vez ----------
  const alVer = (elementos, fn, opciones = { threshold: 0.35 }) => {
    if (!elementos.length) return;
    if (!('IntersectionObserver' in window)) { elementos.forEach(fn); return; }
    const obs = new IntersectionObserver(entradas => entradas.forEach(en => {
      if (en.isIntersecting) { fn(en.target); obs.unobserve(en.target); }
    }), opciones);
    elementos.forEach(el => obs.observe(el));
  };
  alVer($$('.perdida, .pasos'), el => el.classList.add('en-vista'));

  // ---------- Simulador de búsqueda en Google ----------
  const demo = $('.demo');
  if (demo) {
    const escenarios = [
      { q: 'ferretería cerca de mí', tuyo: 'Tu ferretería', rubro: 'Ferretería', otros: [['Ferretería Central', '4,6', '212', '650 m'], ['Corralón del Sur', '4,4', '98', '1,2 km'], ['Ferretería El Tornillo', '4,3', '61', '900 m']] },
      { q: 'pizzería abierta ahora', tuyo: 'Tu pizzería', rubro: 'Pizzería', otros: [['Pizzería La Esquina', '4,7', '530', '400 m'], ['Pizzas del Centro', '4,5', '214', '1,1 km'], ['La Pizzería de Siempre', '4,2', '87', '800 m']] },
      { q: 'peluquería en Córdoba', tuyo: 'Tu peluquería', rubro: 'Peluquería', otros: [['Estudio de Pelo', '4,8', '176', '550 m'], ['Corte y Estilo', '4,5', '92', '1 km'], ['Barbería Norte', '4,4', '140', '1,4 km']] },
      { q: 'taller mecánico cerca', tuyo: 'Tu taller', rubro: 'Taller mecánico', otros: [['Taller San José', '4,7', '301', '700 m'], ['Mecánica Integral', '4,5', '126', '1,3 km'], ['Lubricentro Ruta 20', '4,3', '74', '2 km']] },
    ];
    const texto = $('.buscador-texto', demo);
    const filas = $$('.resultado[data-orden]', demo);
    const tuyo = $('.resultado.tuyo', demo);
    const botones = $$('.conmutador button', demo);
    const pausa = $('.pausa', demo);
    let indice = 0, pausado = false, visible = true, temporizadores = [], actual = escenarios[0];
    const limpiar = () => { temporizadores.forEach(clearTimeout); temporizadores = []; };
    const luego = (ms, fn) => temporizadores.push(setTimeout(fn, ms));

    const pintar = esc => {
      filas.forEach((fila, i) => {
        const [nombre, nota, resenas, dist] = esc.otros[i];
        $('strong', fila).textContent = nombre;
        $('.nota', fila).textContent = nota;
        $('.resenas', fila).textContent = '(' + resenas + ')';
        $('.meta', fila).textContent = esc.rubro + ' · ' + dist;
      });
      $('strong', tuyo).textContent = esc.tuyo;
      actual = esc;
    };
    const estado = valor => {
      demo.dataset.estado = valor;
      botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === valor)));
      $('.estado-ficha', tuyo).textContent = valor === 'con'
        ? 'Ficha completa · reseñas respondidas'
        : 'Ficha incompleta · reseñas sin responder';
      $('.meta', tuyo).textContent = valor === 'con' ? actual.rubro + ' · Abierto ahora' : 'Fuera de los primeros resultados';
      demo.dataset.llamada = 'no';
    };
    const finalEstatico = () => {
      limpiar();
      pintar(escenarios[0]);
      texto.textContent = escenarios[0].q;
      demo.dataset.fase = 'lleno';
      estado('con');
    };
    const ciclo = () => {
      limpiar();
      if (pausado || !visible) return;
      const esc = escenarios[indice % escenarios.length];
      // Primero se desvanece todo; recién con la lista invisible se reordena y cambia de rubro.
      demo.dataset.fase = 'vacio';
      demo.dataset.llamada = 'no';
      luego(450, () => {
        pintar(esc);
        estado('hoy');
        texto.textContent = '';
        let n = 0;
        const tipear = () => {
          texto.textContent = esc.q.slice(0, ++n);
          if (n < esc.q.length) luego(48 + Math.random() * 50, tipear);
          else luego(350, () => {
            demo.dataset.fase = 'lleno';
            luego(2300, () => {
              estado('con');
              luego(1100, () => { demo.dataset.llamada = 'si'; });
              luego(5200, () => { indice++; ciclo(); });
            });
          });
        };
        tipear();
      });
    };
    botones.forEach(b => b.addEventListener('click', () => {
      detener(true);
      demo.dataset.fase = 'lleno';
      if (!texto.textContent) { pintar(escenarios[indice % escenarios.length]); texto.textContent = escenarios[indice % escenarios.length].q; }
      estado(b.dataset.estado);
      if (b.dataset.estado === 'con') luego(900, () => { demo.dataset.llamada = 'si'; });
    }));
    const detener = valor => {
      pausado = valor;
      pausa.setAttribute('aria-pressed', String(valor));
      $('span', pausa).textContent = valor ? 'Reanudar animación' : 'Pausar animación';
      $('.icono-pausa', pausa).style.display = valor ? 'none' : '';
      $('.icono-play', pausa).style.display = valor ? '' : 'none';
      if (valor) limpiar(); else { indice++; ciclo(); }
    };
    pausa.addEventListener('click', () => detener(!pausado));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        const antes = visible;
        visible = en.isIntersecting;
        if (reducido.matches) return;
        if (!visible) limpiar();
        else if (!antes && !pausado) ciclo();
      }, { threshold: 0.2 }).observe(demo);
    }
    document.addEventListener('visibilitychange', () => {
      if (reducido.matches || pausado) return;
      if (document.hidden) limpiar(); else ciclo();
    });
    if (reducido.matches) { finalEstatico(); pausa.hidden = true; }
    else ciclo();
  }

  // ---------- La pila de herramientas: caos → orden ----------
  const pila = $('.pila');
  if (pila) {
    const fichas = $$('.ficha', pila);
    const boton = $('.pila-boton');
    const azar = semilla => { const x = Math.sin(semilla * 9301 + 49297) * 233280; return x - Math.floor(x); };
    const calcular = () => {
      const ancho = pila.clientWidth, alto = pila.clientHeight;
      // Montaña desordenada apoyada en el piso de la caja: capas cada vez más chicas.
      const capas = ancho > 520 ? [5, 4, 3, 2] : [4, 3, 3, 2, 2];
      let capa = 0, enCapa = 0, porCapa = capas[0], y = alto - 4;
      fichas.forEach((f, i) => {
        const w = f.offsetWidth, h = f.offsetHeight;
        if (enCapa >= porCapa) { capa++; enCapa = 0; porCapa = capas[Math.min(capa, capas.length - 1)]; y -= h * 0.78; }
        const tramo = ancho * (0.98 - capa * 0.16);
        const inicio = (ancho - tramo) / 2;
        const x = inicio + (tramo / Math.max(1, porCapa)) * (enCapa + 0.5) - w / 2 + (azar(i + 1) - 0.5) * 50;
        const destinoX = Math.min(Math.max(0, x), ancho - w);
        const destinoY = y - h - (azar(i + 7) * 10);
        f.style.setProperty('--px', (destinoX - f.offsetLeft).toFixed(1) + 'px');
        f.style.setProperty('--py', (destinoY - f.offsetTop).toFixed(1) + 'px');
        f.style.setProperty('--pr', ((azar(i + 3) - 0.5) * 30).toFixed(1) + 'deg');
        f.style.setProperty('--retraso', (i * 0.07).toFixed(2) + 's');
        enCapa++;
      });
    };
    if (!reducido.matches) {
      pila.classList.add('esperando');
      calcular();
      alVer([pila], () => {
        requestAnimationFrame(() => requestAnimationFrame(() => pila.classList.remove('esperando')));
      }, { threshold: 0.3 });
      let espera;
      window.addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(calcular, 150); }, { passive: true });
    } else {
      pila.classList.add('ordenada');
    }
    if (boton) {
      if (reducido.matches) { boton.setAttribute('aria-pressed', 'true'); }
      boton.addEventListener('click', () => {
        const ordenada = !pila.classList.contains('ordenada');
        if (ordenada) fichas.forEach((f, i) => f.style.setProperty('--retraso', (i * 0.035).toFixed(2) + 's'));
        else calcular();
        pila.classList.toggle('ordenada', ordenada);
        boton.setAttribute('aria-pressed', String(ordenada));
        $('span', boton).textContent = ordenada ? 'Volver a hacerlo solo' : 'Dejalo en nuestras manos';
      });
    }
  }

  // ---------- Calculadora: cuánto cuesta tu tiempo ----------
  const calc = $('.calculadora');
  if (calc) {
    const horas = $('#horas'), valor = $('#valor-hora');
    const MAPS = 90000, REDES = 190000;
    const pintarRango = r => r.style.setProperty('--lleno', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
    const actualizar = () => {
      const h = Number(horas.value), v = Number(valor.value);
      const mensual = h * v * 4.33;
      $('#out-horas').textContent = h + (h === 1 ? ' hora' : ' horas');
      $('#out-valor').textContent = pesos(v);
      $('#costo-mensual').textContent = pesos(mensual);
      $('#horas-anuales').textContent = new Intl.NumberFormat('es-AR').format(h * 52);
      const tope = Math.max(mensual, REDES) * 1.05;
      $('.barra-tuya i').style.setProperty('--ancho-barra', (mensual / tope * 100) + '%');
      $('.barra-tuya b').textContent = pesos(mensual);
      $('.barra-maps i').style.setProperty('--ancho-barra', (MAPS / tope * 100) + '%');
      $('.barra-redes i').style.setProperty('--ancho-barra', (REDES / tope * 100) + '%');
      [horas, valor].forEach(pintarRango);
    };
    [horas, valor].forEach(r => r.addEventListener('input', actualizar));
    actualizar();
  }

  // ---------- Contador de la cifra del caso ----------
  alVer($$('[data-contar]'), el => {
    const final = Number(el.dataset.contar);
    if (reducido.matches) return;
    const dur = 1800, t0 = performance.now();
    const paso = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = new Intl.NumberFormat('es-AR').format(Math.round(final * (1 - Math.pow(2, -10 * p))));
      if (p < 1) requestAnimationFrame(paso); else el.textContent = new Intl.NumberFormat('es-AR').format(final);
    };
    requestAnimationFrame(paso);
  }, { threshold: 0.6 });

  // ---------- Reels: se reproducen en silencio cuando están a la vista ----------
  const videos = $$('video[data-auto]');
  if (videos.length && 'IntersectionObserver' in window && !reducido.matches) {
    const obs = new IntersectionObserver(entradas => entradas.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) { v.muted = true; const p = v.play(); if (p) p.catch(() => {}); }
      else v.pause();
    }), { threshold: 0.55 });
    videos.forEach(v => obs.observe(v));
  }

  // ---------- Calculadora de combos (Maps + Redes con 15%) ----------
  const maps = $('#plan-maps'), redes = $('#plan-redes'), combo = $('#combos');
  if (maps && redes) {
    const nombre = s => s.options[s.selectedIndex].text.split(' — ')[0];
    const actualizarCombo = () => {
      const base = Number(maps.value) + Number(redes.value), final = Math.round(base * 0.85);
      $('#combo-precio').textContent = pesos(final);
      $('#combo-ahorro').textContent = 'Ahorrás ' + pesos(base - final) + ' por mes';
      $('#combo-enlace').href = WA + encodeURIComponent(`Hola, me interesa el combo Maps ${nombre(maps)} + Redes ${nombre(redes)} a ${pesos(final)} ARS por mes (15% de descuento). ¿Cómo seguimos?`);
    };
    maps.addEventListener('change', actualizarCombo);
    redes.addEventListener('change', actualizarCombo);
    actualizarCombo();
  }
  const abrirCombo = () => { if (combo && location.hash === '#combos') combo.open = true; };
  abrirCombo();
  window.addEventListener('hashchange', abrirCombo);
  $$('a[href$="#combos"]').forEach(a => a.addEventListener('click', () => { if (combo) combo.open = true; }));

  // ---------- WhatsApp flotante: aparece después del primer pantallazo ----------
  const flotante = $('.wa-flotante');
  if (flotante) {
    let pasoHero = false, cierreVisible = false;
    const refrescar = () => flotante.classList.toggle('visible', pasoHero && !cierreVisible);
    window.addEventListener('scroll', () => { pasoHero = window.scrollY > window.innerHeight * 0.7; refrescar(); }, { passive: true });
    const cierre = $('.cierre'), pie = $('.pie-sitio');
    if ('IntersectionObserver' in window) {
      const vistos = new Set();
      const obs = new IntersectionObserver(entradas => {
        entradas.forEach(en => en.isIntersecting ? vistos.add(en.target) : vistos.delete(en.target));
        cierreVisible = vistos.size > 0; refrescar();
      }, { threshold: 0.15 });
      [cierre, pie].filter(Boolean).forEach(el => obs.observe(el));
    }
  }

  // ---------- Formulario: no simular un envío en la vista previa local ----------
  const form = $('form[name="auditoria"]');
  if (form && ['localhost', '127.0.0.1', '::1', ''].includes(location.hostname)) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const estadoForm = $('.estado-form', form);
      estadoForm.hidden = false;
      estadoForm.textContent = 'Esta es una vista previa local: tus datos no se enviaron. El formulario funciona al publicar en Netlify. También podés escribirnos por WhatsApp.';
    });
  }
})();
