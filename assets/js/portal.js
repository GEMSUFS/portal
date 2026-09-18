/* ==========================================================================
   GEMS · Portal de notícias
   Monta as páginas a partir de conteudo.js. Não é preciso mexer aqui para
   publicar notícias — só no conteudo.js.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.GEMS || null;
  var pagina = document.body.getAttribute("data-pagina") || "inicio";
  var params = new URLSearchParams(location.search);

  var site = Object.assign({
    sigla: "GEMS",
    nome: "Grupo de Estudos em Melhoramento Vegetal do Semiárido",
    instituicao: "Universidade Federal de Sergipe",
    instituicaoSigla: "UFS",
    slogan: "Portal de notícias",
    chamada: "",
    sobre: []
  }, D && D.site);
  if (typeof site.sobre === "string") site.sobre = [site.sobre];
  var contato = Object.assign({}, D && D.contato);

  /* ---- utilidades ------------------------------------------------------- */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function capitaliza(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function corSegura(c) { return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c || "")) ? c : "#2F7542"; }
  function semAcento(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  var HOJE = new Date(); HOJE.setHours(0, 0, 0, 0);
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var fmtLonga = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  var fmtCurta = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" });
  var fmtHoje = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  // "2026-08-11" -> data local (sem o deslocamento de fuso do new Date("..."))
  function lerData(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "").trim());
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function quando(n, estilo) {
    if (!n._data) return "";
    var dias = Math.round((HOJE - n._data) / 864e5);
    if (dias >= 0 && dias < 7) return capitaliza(rtf.format(-dias, "day"));
    return (estilo === "longa" ? fmtLonga : fmtCurta).format(n._data);
  }

  function minutosDeLeitura(n) {
    var palavras = n.texto.join(" ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palavras / 200));
  }

  function ehLocal() {
    return location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  }

  /* ---- ícones (traço, 24x24) ------------------------------------------- */

  var ICONES = {
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    lua: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    local: '<path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.3 4.2 2.7-4.2 2.7z" fill="currentColor"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    whatsapp: '<path d="M4 20.5 5.3 16.6A8.5 8.5 0 1 1 8.6 19.5z"/><path d="M9.2 8.6c.3 2.8 2.6 5.3 5.6 5.9l1.2-1.3-1.8-.9-.8.7c-1-.4-2-1.4-2.4-2.4l.7-.8-.8-1.8z" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5H17.6V4.4a20 20 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.8v3h2.6V21"/>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.6v.01M11.6 16v-3.2a2.1 2.1 0 0 1 4.2 0V16M11.6 10.5V16"/>',
    link: '<path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1"/><path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1"/>',
    compartilhar: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16.2 9.5"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    semente: '<path d="M12 3.5c3.6 2.6 5.8 6.3 5.8 9.6a5.8 5.8 0 0 1-11.6 0c0-3.3 2.2-7 5.8-9.6z"/><path d="M12 9.5v9.3"/>',
    broto: '<path d="M12 21v-8.5"/><path d="M12 12.5c0-4.3 3-7.5 8-7.5 0 5-3.2 8-8 7.5z"/><path d="M12 14.5c0-3.3-2.5-5.8-7-5.8 0 4 2.6 6.3 7 5.8z"/>',
    codigo: '<path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.8 5.5l-3.6 13"/>',
    camera: '<path d="M4 8.2h3L8.8 5.5h6.4L17 8.2h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.2a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.6" r="3.6"/>',
    orcid: '<circle cx="12" cy="12" r="9.5"/><path d="M8.6 10.6v6M11.4 10.6v6h1.4a3 3 0 0 0 0-6h-1.4z"/><circle cx="8.6" cy="8.1" r=".95" fill="currentColor" stroke="none"/>',
    documento: '<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M14 3.5v5h5M8.5 13h7M8.5 16.5h5"/>',
    capelo: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.6v3.9c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-3.9M21.5 9.5V15"/>'
  };
  function icone(nome) {
    return '<svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONES[nome] || "") + "</svg>";
  }

  /* ---- categorias e notícias -------------------------------------------- */

  var avisos = [];
  var CATS = (D && Array.isArray(D.categorias) ? D.categorias : []).map(function (c) {
    return { id: String(c.id || "").trim().toLowerCase(), nome: c.nome || c.id, cor: corSegura(c.cor), descricao: c.descricao || "" };
  });

  function categoria(chave) {
    var k = semAcento(chave).trim();
    for (var i = 0; i < CATS.length; i++) {
      if (CATS[i].id === k || semAcento(CATS[i].nome) === k) return CATS[i];
    }
    return { id: k || "geral", nome: chave || "Geral", cor: "#2F7542", descricao: "", avulsa: true };
  }

  var NOTICIAS = [];
  var POR_ID = {};
  if (D && Array.isArray(D.noticias)) {
    D.noticias.forEach(function (bruta, i) {
      if (!bruta || !bruta.titulo) { avisos.push("A notícia nº " + (i + 1) + " da lista está sem título e foi ignorada."); return; }
      var id = String(bruta.id || "").trim();
      if (!id) { avisos.push("“" + bruta.titulo + "” está sem id e foi ignorada."); return; }
      if (!/^[a-z0-9-]+$/.test(id)) avisos.push("O id “" + id + "” tem espaço, acento ou maiúscula. Use só letras minúsculas, números e hífen.");
      if (POR_ID[id]) { avisos.push("Há duas notícias com o id “" + id + "”. A segunda foi ignorada."); return; }
      var n = Object.assign({}, bruta);
      n.id = id;
      n._data = lerData(n.data);
      if (!n._data) avisos.push("“" + n.titulo + "”: data “" + (n.data || "") + "” inválida. Use o formato AAAA-MM-DD, por exemplo 2026-09-15.");
      n._cat = categoria(n.categoria);
      if (n._cat.avulsa && n.categoria) avisos.push("“" + n.titulo + "”: a categoria “" + n.categoria + "” não está na lista de categorias.");
      n.texto = Array.isArray(n.texto) ? n.texto : (n.texto ? [String(n.texto)] : []);
      n.tags = Array.isArray(n.tags) ? n.tags : [];
      POR_ID[id] = n;
      NOTICIAS.push(n);
    });
    NOTICIAS.sort(function (a, b) { return (b._data || 0) - (a._data || 0); });
    // posição de cada notícia dentro da sua seção: alterna a arte da capa gerada
    var porSecao = {};
    NOTICIAS.forEach(function (n) { n._idx = porSecao[n._cat.id] = (porSecao[n._cat.id] === undefined ? 0 : porSecao[n._cat.id] + 1); });
  }

  function categoriasComNoticias() {
    var usadas = {};
    NOTICIAS.forEach(function (n) { usadas[n._cat.id] = (usadas[n._cat.id] || 0) + 1; });
    var lista = CATS.filter(function (c) { return usadas[c.id]; });
    NOTICIAS.forEach(function (n) {
      if (n._cat.avulsa && !lista.some(function (c) { return c.id === n._cat.id; })) lista.push(n._cat);
    });
    lista.forEach(function (c) { c.total = usadas[c.id] || 0; });
    return lista;
  }

  function urlNoticia(n) { return "noticia.html?id=" + encodeURIComponent(n.id); }
  function urlCategoria(c) { return "noticias.html?categoria=" + encodeURIComponent(c.id); }

  /* ---- texto das notícias (mini-markdown) -------------------------------- */

  function urlSegura(u) {
    var bruta = u.replace(/&amp;/g, "&");
    var esquema = /^([a-z][a-z0-9+.-]*):/i.exec(bruta);
    if (esquema && !/^(https?|mailto|tel)$/i.test(esquema[1])) return null;
    return u;
  }

  function inline(s) {
    var t = esc(s);
    t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*\s][^*]*?)\*/g, "<em>$1</em>");
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, txt, url) {
      var u = urlSegura(url);
      if (!u) return txt;
      var externo = /^https?:/i.test(u);
      return '<a href="' + u + '"' + (externo ? ' target="_blank" rel="noopener"' : "") + ">" + txt + "</a>";
    });
    return t;
  }

  function corpo(blocos) {
    var html = "", lista = [];
    function fechaLista() {
      if (lista.length) { html += "<ul>" + lista.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; lista = []; }
    }
    blocos.forEach(function (b) {
      var t = String(b == null ? "" : b).trim();
      if (!t) return;
      if (/^[-•]\s/.test(t)) { lista.push(inline(t.replace(/^[-•]\s+/, ""))); return; }
      fechaLista();
      var img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(t);
      if (/^##\s/.test(t)) html += "<h2>" + inline(t.replace(/^##\s+/, "")) + "</h2>";
      else if (/^>\s/.test(t)) html += "<blockquote><p>" + inline(t.replace(/^>\s+/, "")) + "</p></blockquote>";
      else if (img && urlSegura(esc(img[2]))) {
        html += '<figure><img src="' + esc(img[2]) + '" alt="' + esc(img[1]) + '" loading="lazy">' +
          (img[1] ? "<figcaption>" + esc(img[1]) + "</figcaption>" : "") + "</figure>";
      }
      else html += "<p>" + inline(t) + "</p>";
    });
    fechaLista();
    return html;
  }

  /* ---- capas geradas (quando a notícia não tem foto) --------------------- */

  // gerador pseudoaleatório com semente: a mesma notícia sempre ganha a mesma capa
  function aleatorio(texto) {
    var h = 1779033703 ^ texto.length;
    for (var i = 0; i < texto.length; i++) {
      h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    var a = h >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function rgb(h) {
    h = h.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mistura(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return "#" + x.map(function (v, i) { return Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0"); }).join("");
  }
  function f1(v) { return Math.round(v * 10) / 10; }

  var AMARELO = "#F6BF22";

  // Cada seção tem duas artes; notícias seguidas da mesma seção alternam entre elas.
  var VARIANTE_A = {
    // Pesquisa: dupla hélice, como no logo
    pesquisa: function (r, c) {
      var amp = 62 + r() * 26, per = 250 + r() * 90, fase = r() * 6.283, cy = 225;
      function trilha(sinal, amp2, x0, x1) {
        var d = "";
        for (var x = x0; x <= x1; x += 8) {
          var y = cy + sinal * Math.sin((x / per) * 6.283 + fase) * amp2;
          d += (x === x0 ? "M" : "L") + x + " " + f1(y);
        }
        return d;
      }
      var degraus = "";
      for (var x = -200; x <= 1000; x += 24) {
        var s = Math.sin((x / per) * 6.283 + fase) * amp;
        if (Math.abs(s) > 10) degraus += '<line x1="' + x + '" y1="' + f1(cy + s * 0.86) + '" x2="' + x + '" y2="' + f1(cy - s * 0.86) + '"/>';
      }
      var fundo = "";
      for (var k = 0; k < 2; k++) {
        fundo += '<path d="' + trilha(k ? -1 : 1, amp * 2.3, -200, 1000) + '" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="30"/>';
      }
      return '<g transform="rotate(' + f1(-16 + r() * 10) + ' 400 225)">' + fundo +
        '<g stroke="' + AMARELO + '" stroke-width="7" stroke-linecap="round" opacity=".6">' + degraus + "</g>" +
        '<path d="' + trilha(1, amp, -200, 1000) + '" fill="none" stroke="' + c.claro + '" stroke-width="15" stroke-linecap="round"/>' +
        '<path d="' + trilha(-1, amp, -200, 1000) + '" fill="none" stroke="#9BD58F" stroke-opacity=".75" stroke-width="15" stroke-linecap="round"/></g>';
    },

    // Campo: croqui de um ensaio 9 x 3, parcelas numeradas como no campo
    campo: function (r, c) {
      var cols = 9, lins = 3, w = 76, h = 104, gx = 10, gy = 16, g = "";
      var x0 = (800 - (cols * w + (cols - 1) * gx)) / 2, y0 = (450 - (lins * h + (lins - 1) * gy)) / 2;
      for (var l = 0; l < lins; l++) {
        for (var k = 0; k < cols; k++) {
          var x = x0 + k * (w + gx), y = y0 + l * (h + gy);
          g += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + c.claro + '" fill-opacity="' + (0.16 + r() * 0.5).toFixed(2) + '"/>';
          for (var q = 1; q <= 3; q++) {
            g += '<line x1="' + f1(x + q * w / 4) + '" y1="' + f1(y + 30) + '" x2="' + f1(x + q * w / 4) + '" y2="' + f1(y + h - 10) + '" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-dasharray="1 7" stroke-linecap="round"/>';
          }
          g += '<text x="' + f1(x + 8) + '" y="' + f1(y + 20) + '" font-family="ui-monospace,Consolas,monospace" font-size="12.5" font-weight="600" fill="#fff" fill-opacity=".78">' + ((l + 1) * 100 + k + 1) + "</text>";
        }
      }
      var sc = Math.floor(r() * cols), sl = Math.floor(r() * lins);
      g += '<rect x="' + f1(x0 + sc * (w + gx) - 5) + '" y="' + f1(y0 + sl * (h + gy) - 5) + '" width="' + (w + 10) + '" height="' + (h + 10) + '" rx="10" fill="none" stroke="' + AMARELO + '" stroke-width="4"/>';
      return '<g transform="translate(400 225) rotate(' + f1(-9 + r() * 5) + ') scale(1.2) translate(-400 -225)">' + g + "</g>";
    },

    // Germoplasma: grãos de uma espiga, alguns em destaque
    germoplasma: function (r, c) {
      var w = 44, h = 34, gx = 8, gy = 8, g = "", cols = 19, lins = 14;
      var cx = (cols * (w + gx)) / 2, cy = (lins * (h + gy)) / 2;
      for (var l = 0; l < lins; l++) {
        for (var k = 0; k < cols; k++) {
          var v = r();
          if (v < 0.05) continue;
          var x = k * (w + gx) + (l % 2 ? (w + gx) / 2 : 0), y = l * (h + gy);
          var am = v > 0.38;
          g += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + w + '" height="' + h + '" rx="15" fill="' + (am ? AMARELO : c.claro) +
            '" fill-opacity="' + (am ? 0.3 + r() * 0.6 : 0.14 + r() * 0.22).toFixed(2) + '"' +
            (v > 0.965 ? ' stroke="#fff" stroke-width="3"' : "") + "/>";
        }
      }
      return '<g transform="translate(400 225) rotate(' + f1(-20 + r() * 10) + ') translate(' + f1(-cx) + " " + f1(-cy) + ')">' + g + "</g>";
    },

    // Tecnologia: genealogia — cada progênie liga-se aos dois genitores
    tecnologia: function (r, c) {
      var topo = 5 + Math.floor(r() * 3);
      var gens = [topo, topo - 1, topo - 2, topo - 3], ys = [70, 180, 290, 400], esp = Math.min(140, 720 / (topo - 1));
      var nos = gens.map(function (q, k) {
        var linha = [];
        for (var i = 0; i < q; i++) linha.push({ x: 400 + (i - (q - 1) / 2) * esp, y: ys[k], f: r() < 0.5, sel: r() < 0.24 });
        return linha;
      });
      var pontos = "";
      for (var px = 10; px < 800; px += 26) for (var py = 10; py < 450; py += 26) pontos += '<circle cx="' + px + '" cy="' + py + '" r="1.3"/>';
      var lig = "";
      for (var k = 1; k < nos.length; k++) {
        nos[k].forEach(function (filho, i) {
          [nos[k - 1][i], nos[k - 1][i + 1]].forEach(function (p) {
            var my = (p.y + filho.y) / 2;
            lig += '<path d="M' + f1(p.x) + " " + p.y + " C" + f1(p.x) + " " + my + " " + f1(filho.x) + " " + my + " " + f1(filho.x) + " " + filho.y + '"/>';
          });
        });
      }
      var formas = "";
      nos.forEach(function (linha) {
        linha.forEach(function (n) {
          var cor = n.sel ? AMARELO : c.fundo, borda = n.sel ? AMARELO : c.claro;
          formas += n.f
            ? '<circle cx="' + f1(n.x) + '" cy="' + n.y + '" r="17" fill="' + cor + '" stroke="' + borda + '" stroke-width="4"/>'
            : '<rect x="' + f1(n.x - 16) + '" y="' + (n.y - 16) + '" width="32" height="32" rx="5" fill="' + cor + '" stroke="' + borda + '" stroke-width="4"/>';
        });
      });
      return '<g fill="#fff" fill-opacity=".14">' + pontos + "</g>" +
        '<g transform="translate(400 225) scale(' + f1(1.05 + r() * 0.12) + ') translate(-400 -225)">' +
        '<g fill="none" stroke="' + c.claro + '" stroke-opacity=".6" stroke-width="3.5">' + lig + "</g>" + formas + "</g>";
    },

    // Eventos: página de calendário com um dia marcado
    eventos: function (r, c) {
      var t = 70, gap = 12, g = "", alvo = 3 + Math.floor(r() * 26);
      var x0 = (800 - (7 * t + 6 * gap)) / 2, y0 = (450 - (5 * t + 4 * gap)) / 2;
      for (var i = 0; i < 35; i++) {
        var x = x0 + (i % 7) * (t + gap), y = y0 + Math.floor(i / 7) * (t + gap), dia = i + 1;
        g += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + t + '" height="' + t + '" rx="10" fill="' + c.claro + '" fill-opacity="' + (r() < 0.22 ? 0.42 : 0.12) + '"/>';
        if (dia <= 31) g += '<text x="' + f1(x + 10) + '" y="' + f1(y + 22) + '" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600" fill="#fff" fill-opacity=".72">' + dia + "</text>";
        if (i === alvo) g += '<circle cx="' + f1(x + t / 2) + '" cy="' + f1(y + t / 2) + '" r="' + (t / 2 + 7) + '" fill="none" stroke="' + AMARELO + '" stroke-width="4.5"/>';
      }
      return '<g transform="translate(400 225) rotate(' + f1(-7 + r() * 4) + ') scale(1.14) translate(-400 -225)">' + g + "</g>";
    },

    // Grupo: 11 pessoas em 4 departamentos, com ligações entre eles
    grupo: function (r, c) {
      var qtd = [3, 3, 3, 2], centros = [[215, 140], [575, 128], [250, 330], [600, 318]], nos = [];
      qtd.forEach(function (q, gi) {
        var base = r() * 6.283;
        for (var i = 0; i < q; i++) {
          var a = base + (i / q) * 6.283;
          nos.push({ x: centros[gi][0] + Math.cos(a) * 66, y: centros[gi][1] + Math.sin(a) * 52, g: gi });
        }
      });
      var lig = "";
      for (var i = 0; i < nos.length; i++) {
        for (var j = i + 1; j < nos.length; j++) {
          var mesmo = nos[i].g === nos[j].g;
          if (!mesmo && r() > 0.16) continue;
          lig += '<line x1="' + f1(nos[i].x) + '" y1="' + f1(nos[i].y) + '" x2="' + f1(nos[j].x) + '" y2="' + f1(nos[j].y) + '" stroke="' +
            (mesmo ? c.claro : AMARELO) + '" stroke-opacity="' + (mesmo ? 0.5 : 0.6) + '" stroke-width="' + (mesmo ? 3.5 : 2.5) + '"' +
            (mesmo ? "" : ' stroke-dasharray="2 8" stroke-linecap="round"') + "/>";
        }
      }
      var p = "";
      nos.forEach(function (n) {
        p += '<g transform="translate(' + f1(n.x) + " " + f1(n.y) + ')"><circle r="31" fill="' + c.fundo + '" stroke="' + c.claro + '" stroke-width="3.5"/>' +
          '<circle cy="-8" r="9" fill="' + c.claro + '"/><path d="M-16 18a16 13 0 0 1 32 0z" fill="' + c.claro + '"/></g>';
      });
      return "<g>" + lig + p + "</g>";
    }
  };

  var VARIANTE_B = {
    // Pesquisa: dispersão com reta de regressão (correlação entre caracteres)
    pesquisa: function (r, c) {
      var x0 = 120, y0 = 385, w = 580, h = 300, a = 0.5 + r() * 0.3, g = "", pts = "";
      for (var i = 1; i <= 4; i++) {
        g += '<line x1="' + x0 + '" y1="' + (y0 - i * h / 4) + '" x2="' + (x0 + w) + '" y2="' + (y0 - i * h / 4) + '" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>';
      }
      g += '<path d="M' + x0 + " " + (y0 - h) + " V" + y0 + " H" + (x0 + w) + '" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>';
      for (var k = 0; k < 44; k++) {
        var xv = r(), yv = Math.min(1, Math.max(0, 0.14 + a * xv + (r() - 0.5) * 0.34)), dest = r() < 0.1;
        pts += '<circle cx="' + f1(x0 + 24 + xv * (w - 48)) + '" cy="' + f1(y0 - 22 - yv * (h - 44)) + '" r="' + (dest ? 10 : 7) +
          '" fill="' + (dest ? AMARELO : c.claro) + '" fill-opacity="' + (dest ? 1 : 0.7) + '"/>';
      }
      var ya = y0 - 22 - 0.14 * (h - 44), yb = y0 - 22 - (0.14 + a) * (h - 44);
      var reta = '<line x1="' + (x0 + 24) + '" y1="' + f1(ya) + '" x2="' + (x0 + w - 24) + '" y2="' + f1(yb) + '" stroke="' + AMARELO + '" stroke-width="5" stroke-linecap="round" stroke-opacity=".9"/>';
      return '<g transform="translate(400 225) rotate(' + f1(-6 + r() * 4) + ') scale(1.1) translate(-410 -235)">' + g + pts + reta + "</g>";
    },

    // Campo: fileiras de plantio indo até o horizonte, com o sol
    campo: function (r, c) {
      var hz = 118 + r() * 40, vx = 400 + (r() - 0.5) * 220, g = "";
      g += '<rect width="800" height="' + f1(hz) + '" fill="#fff" fill-opacity=".08"/>';
      g += '<circle cx="' + f1(110 + r() * 580) + '" cy="' + f1(hz - 36) + '" r="30" fill="' + AMARELO + '" fill-opacity=".92"/>';
      g += '<line x1="0" y1="' + f1(hz) + '" x2="800" y2="' + f1(hz) + '" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>';
      for (var k = -9; k <= 9; k++) {
        var bx = vx + k * 120, tx = vx + k * 10;
        g += '<line x1="' + f1(bx) + '" y1="470" x2="' + f1(tx) + '" y2="' + f1(hz) + '" stroke="' + c.claro + '" stroke-opacity=".2" stroke-width="3"/>';
        [1, 1.3, 1.7, 2.2, 2.9, 3.8, 5, 6.6, 8.7].forEach(function (d) {
          var s = 1 / d, y = hz + (470 - hz) * s, x = tx + (bx - tx) * s, t = 14 * s + 2;
          g += '<path d="M' + f1(x) + " " + f1(y) + " q" + f1(-t) + " " + f1(-t * 0.6) + " " + f1(-t * 1.2) + " " + f1(-t * 1.6) +
            " M" + f1(x) + " " + f1(y) + " q" + f1(t) + " " + f1(-t * 0.6) + " " + f1(t * 1.2) + " " + f1(-t * 1.6) +
            '" fill="none" stroke="' + (r() < 0.9 ? c.claro : AMARELO) + '" stroke-width="' + f1(Math.max(1.2, 3.4 * s + 0.8)) + '" stroke-linecap="round" stroke-opacity=".85"/>';
        });
      }
      return g;
    },

    // Germoplasma: envelopes de sementes etiquetados, como na câmara fria
    germoplasma: function (r, c) {
      var w = 96, h = 124, gx = 22, gy = 24, cols = 7, lins = 3, g = "";
      var x0 = (800 - (cols * w + (cols - 1) * gx)) / 2, y0 = (450 - (lins * h + (lins - 1) * gy)) / 2;
      for (var l = 0; l < lins; l++) {
        for (var k = 0; k < cols; k++) {
          var x = x0 + k * (w + gx), y = y0 + l * (h + gy), am = r() < 0.2, tinta = am ? "#5A4300" : "#fff";
          g += '<g transform="rotate(' + f1((r() - 0.5) * 6) + " " + f1(x + w / 2) + " " + f1(y + h / 2) + ')">' +
            '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + w + '" height="' + h + '" rx="8" fill="' + (am ? AMARELO : c.claro) + '" fill-opacity="' + (am ? 0.88 : (0.18 + r() * 0.2).toFixed(2)) + '"/>' +
            '<path d="M' + f1(x + 6) + " " + f1(y + 6) + " L" + f1(x + w / 2) + " " + f1(y + 44) + " L" + f1(x + w - 6) + " " + f1(y + 6) + '" fill="none" stroke="' + tinta + '" stroke-opacity="' + (am ? 0.5 : 0.35) + '" stroke-width="3" stroke-linejoin="round"/>' +
            '<rect x="' + f1(x + 14) + '" y="' + f1(y + h - 42) + '" width="' + f1(40 + r() * 28) + '" height="8" rx="4" fill="' + tinta + '" fill-opacity=".5"/>' +
            '<rect x="' + f1(x + 14) + '" y="' + f1(y + h - 26) + '" width="' + f1(24 + r() * 26) + '" height="8" rx="4" fill="' + tinta + '" fill-opacity=".35"/></g>';
        }
      }
      return '<g transform="translate(400 225) rotate(' + f1(-8 + r() * 5) + ') scale(1.12) translate(-400 -225)">' + g + "</g>";
    },

    // Tecnologia: uma tela do sistema, com menu lateral e tabela
    tecnologia: function (r, c) {
      var X = 80, Y = 50, W = 640, H = 350, g = "", sel = Math.floor(r() * 6);
      g += '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="' + H + '" rx="16" fill="' + c.fundo + '" stroke="' + c.claro + '" stroke-opacity=".5" stroke-width="3"/>';
      g += '<line x1="' + X + '" y1="' + (Y + 44) + '" x2="' + (X + W) + '" y2="' + (Y + 44) + '" stroke="' + c.claro + '" stroke-opacity=".35" stroke-width="2"/>';
      for (var i = 0; i < 3; i++) g += '<circle cx="' + (X + 26 + i * 20) + '" cy="' + (Y + 22) + '" r="6" fill="#fff" fill-opacity=".35"/>';
      g += '<line x1="' + (X + 160) + '" y1="' + (Y + 44) + '" x2="' + (X + 160) + '" y2="' + (Y + H) + '" stroke="' + c.claro + '" stroke-opacity=".25" stroke-width="2"/>';
      for (var m = 0; m < 6; m++) {
        g += '<rect x="' + (X + 22) + '" y="' + (Y + 68 + m * 38) + '" width="' + f1(70 + r() * 50) + '" height="12" rx="6" fill="' + (m === sel ? AMARELO : "#fff") + '" fill-opacity="' + (m === sel ? 0.95 : 0.3) + '"/>';
      }
      for (var l = 0; l < 7; l++) {
        var y = Y + 66 + l * 40, am = r() < 0.25;
        g += '<rect x="' + (X + 186) + '" y="' + y + '" width="' + f1(50 + r() * 50) + '" height="12" rx="6" fill="#fff" fill-opacity=".45"/>';
        g += '<rect x="' + (X + 300) + '" y="' + y + '" width="' + f1(40 + r() * 80) + '" height="12" rx="6" fill="#fff" fill-opacity=".25"/>';
        g += '<rect x="' + (X + 440) + '" y="' + (y - 2) + '" width="' + f1(30 + r() * 170) + '" height="16" rx="4" fill="' + (am ? AMARELO : c.claro) + '" fill-opacity="' + (am ? 0.95 : 0.6) + '"/>';
        if (l < 6) g += '<line x1="' + (X + 180) + '" y1="' + (y + 26) + '" x2="' + (X + W - 20) + '" y2="' + (y + 26) + '" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>';
      }
      return '<g transform="translate(400 225) rotate(' + f1(-6 + r() * 4) + ') scale(1.12) translate(-400 -225)">' + g + "</g>";
    },

    // Eventos: plateia em semicírculos voltada para o palco
    eventos: function (r, c) {
      var cx = 400, cy = 480 + r() * 30, g = "";
      g += '<rect x="' + (cx - 110) + '" y="' + f1(cy - 90) + '" width="220" height="26" rx="13" fill="' + AMARELO + '" fill-opacity=".9"/>';
      for (var k = 0; k < 9; k++) {
        var R = 150 + k * 44, n = Math.floor((Math.PI * R) / 34);
        for (var i = 1; i < n; i++) {
          var a = Math.PI + (i / n) * Math.PI, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), v = r();
          if (y < -10) continue;
          g += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(8 - k * 0.3) + '" fill="' + (v < 0.06 ? AMARELO : c.claro) + '" fill-opacity="' + (v < 0.06 ? 1 : 0.25 + v * 0.45).toFixed(2) + '"/>';
        }
      }
      return g;
    },

    // Grupo: a escala de campo da semana — cada membro com dois dias
    grupo: function (r, c) {
      var dias = ["SEG", "TER", "QUA", "QUI", "SEX"], w = 92, h = 22, gx = 10, gy = 8, n = 11, g = "";
      var x0 = (800 - (5 * w + 4 * gx + 40)) / 2 + 40, y0 = (450 - (n * h + (n - 1) * gy + 30)) / 2 + 30;
      dias.forEach(function (d, i) {
        g += '<text x="' + f1(x0 + i * (w + gx) + w / 2) + '" y="' + f1(y0 - 12) + '" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="700" letter-spacing="1.5" fill="#fff" fill-opacity=".7">' + d + "</text>";
      });
      for (var l = 0; l < n; l++) {
        var y = y0 + l * (h + gy), a = Math.floor(r() * 5), b = (a + 1 + Math.floor(r() * 4)) % 5;
        g += '<circle cx="' + f1(x0 - 26) + '" cy="' + f1(y + h / 2) + '" r="9" fill="' + c.claro + '" fill-opacity=".6"/>';
        for (var k = 0; k < 5; k++) {
          var on = k === a || k === b, am = on && r() < 0.18;
          g += '<rect x="' + f1(x0 + k * (w + gx)) + '" y="' + f1(y) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (am ? AMARELO : c.claro) + '" fill-opacity="' + (on ? (am ? 0.95 : 0.7) : 0.1) + '"/>';
        }
      }
      return '<g transform="translate(400 225) rotate(' + f1(-5 + r() * 3) + ') scale(1.12) translate(-400 -225)">' + g + "</g>";
    }
  };

  var contadorCapas = 0;
  function capa(n) {
    var cat = n._cat || categoria("");
    var r = aleatorio(String(n.id));
    var cor = cat.cor;
    var fundo1 = mistura(cor, "#06110B", 0.58), fundo2 = mistura(cor, "#06110B", 0.18);
    var cores = { claro: mistura(cor, "#FFFFFF", 0.55), fundo: mistura(cor, "#06110B", 0.35) };
    var uid = "capa" + (++contadorCapas);
    var variante = (n._idx || 0) % 2 ? VARIANTE_B : VARIANTE_A;
    var desenho = (variante[cat.id] || variante.pesquisa)(r, cores);
    return '<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + uid + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + fundo2 + '"/><stop offset="1" stop-color="' + fundo1 + '"/></linearGradient>' +
      '<radialGradient id="' + uid + 'r" cx="' + Math.round(20 + r() * 60) + '%" cy="' + Math.round(15 + r() * 30) + '%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="450" fill="url(#' + uid + 'g)"/>' + desenho +
      '<rect width="800" height="450" fill="url(#' + uid + 'r)"/></svg>';
  }

  function midia(n, semLink, natural) {
    // "enquadramento" escolhe que parte da foto aparece no corte 16:9 dos cartões
    var pos = { topo: "top", baixo: "bottom", centro: "center" }[String(n.enquadramento || "").toLowerCase()];
    var dentro = n.imagem
      ? '<img src="' + esc(n.imagem) + '" alt="' + esc(n.legenda || "") + '" loading="lazy" decoding="async" data-capa="' + esc(n.id) + '"' +
        (pos ? ' style="object-position:' + pos + '"' : "") + ">"
      : capa(n);
    // na página da notícia a foto aparece inteira, sem corte (cartazes são verticais)
    var classe = "midia" + (natural && n.imagem ? " midia--inteira" : "");
    return semLink
      ? '<div class="' + classe + '">' + dentro + "</div>"
      : '<a class="' + classe + '" href="' + urlNoticia(n) + '" tabindex="-1" aria-hidden="true">' + dentro + "</a>";
  }

  // foto que não carregou (nome errado, arquivo faltando) vira capa gerada
  function consertarImagens(raiz) {
    $$("img[data-capa]", raiz).forEach(function (img) {
      function trocar() {
        var n = POR_ID[img.getAttribute("data-capa")];
        if (!n) return;
        avisos.push("A imagem “" + img.getAttribute("src") + "” de “" + n.titulo + "” não foi encontrada.");
        img.outerHTML = capa(n);
        mostrarAvisos();
      }
      if (img.complete && img.naturalWidth === 0) trocar();
      else img.addEventListener("error", trocar, { once: true });
    });
  }

  /* ---- peças reutilizáveis ---------------------------------------------- */

  function estiloCat(c) { return ' style="--cat:' + corSegura(c.cor) + '"'; }
  function chapeu(c) { return '<a class="chapeu" href="' + urlCategoria(c) + '">' + esc(c.nome) + "</a>"; }

  function cartao(n) {
    return '<article class="cartao"' + estiloCat(n._cat) + ">" + midia(n) + chapeu(n._cat) +
      '<h3><a class="titulo-link" href="' + urlNoticia(n) + '">' + esc(n.titulo) + "</a></h3>" +
      (n.linhaFina ? '<p class="linha-fina">' + esc(n.linhaFina) + "</p>" : "") +
      '<div class="meta"><span>' + icone("relogio") + quando(n) + "</span></div></article>";
  }

  function blocoEssenciais(excluir) {
    var ids = (D.essenciais || []).filter(function (id) { return POR_ID[id] && id !== excluir; });
    NOTICIAS.forEach(function (n) { if (ids.length < 5 && ids.indexOf(n.id) < 0 && n.id !== excluir) ids.push(n.id); });
    ids = ids.slice(0, 5);
    if (!ids.length) return "";
    return '<section class="bloco" aria-labelledby="t-essenciais"><div class="secao-titulo"><h2 id="t-essenciais">Leituras essenciais</h2></div><ol class="essenciais">' +
      ids.map(function (id) {
        var n = POR_ID[id];
        return "<li" + estiloCat(n._cat) + ">" + chapeu(n._cat) + '<a class="titulo-link" href="' + urlNoticia(n) + '">' + esc(n.titulo) + "</a></li>";
      }).join("") + "</ol></section>";
  }

  function blocoAgenda() {
    var itens = (D.agenda || []).map(function (a) { return Object.assign({}, a, { _d: lerData(a.data) }); })
      .filter(function (a) { return a.titulo && (!a._d || a._d >= HOJE); })
      .sort(function (a, b) { return (a._d ? +a._d : 9e15) - (b._d ? +b._d : 9e15); })
      .slice(0, 4);
    if (!itens.length) return "";
    return '<section class="bloco" aria-labelledby="t-agenda"><div class="secao-titulo"><h2 id="t-agenda">Agenda</h2></div><ul class="agenda">' +
      itens.map(function (a) {
        var data = a._d
          ? '<div class="agenda-data" aria-hidden="true"><div><b>' + a._d.getDate() + "</b><small>" + MESES[a._d.getMonth()] + "</small></div></div>"
          : '<div class="agenda-data sem-data" aria-hidden="true">' + icone("calendario") + "</div>";
        return "<li>" + data + "<div>" +
          (a._d ? '<span class="sr">' + esc(fmtLonga.format(a._d)) + ": </span>" : '<span class="agenda-quando">' + esc(a.quando || "Data a definir") + "</span>") +
          "<h3>" + esc(a.titulo) + "</h3>" +
          (a.local ? "<p>" + icone("local") + "<span>" + esc(a.local) + "</span></p>" : "") + "</div></li>";
      }).join("") + "</ul></section>";
  }

  /* ---- moldura: topo, menu e rodapé ------------------------------------- */

  function redes() {
    var h = "", de = " do " + esc(site.sigla);
    if (contato.instagram) h += '<a class="botao-icone" href="' + esc(contato.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram' + de + '">' + icone("instagram") + "</a>";
    if (contato.youtube) h += '<a class="botao-icone" href="' + esc(contato.youtube) + '" target="_blank" rel="noopener" aria-label="YouTube' + de + '">' + icone("youtube") + "</a>";
    if (contato.github) h += '<a class="botao-icone" href="' + esc(contato.github) + '" target="_blank" rel="noopener" aria-label="GitHub' + de + '">' + icone("github") + "</a>";
    if (contato.email) h += '<a class="botao-icone" href="mailto:' + esc(contato.email) + '" aria-label="E-mail' + de + '">' + icone("email") + "</a>";
    return h;
  }

  function topo(cats, catAtual) {
    var ativo = function (cond) { return cond ? ' aria-current="page"' : ""; };
    return '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' +
      '<div class="utilidades"><div class="container">' +
        '<div class="utilidades-data"><strong>' + esc(capitaliza(fmtHoje.format(new Date()))) + '</strong><span class="sep" aria-hidden="true"></span><span class="inst">' + esc(site.instituicao) + "</span></div>" +
        '<div class="utilidades-acoes">' + redes() +
          '<button class="botao-icone" type="button" id="alternar-tema" aria-label="Alternar tema">' + icone("lua") + "</button>" +
        "</div>" +
      "</div></div>" +
      '<header class="cabecalho"><div class="container">' +
        '<a class="marca" href="index.html" aria-label="' + esc(site.sigla) + ' — página inicial">' +
          '<img src="assets/img/gems-simbolo.png" alt="" width="181" height="453">' +
          '<span class="marca-nome">' + esc(site.sigla) + "</span>" +
          '<span class="marca-legenda"><span>' + esc(site.nome) + "</span><span>" + esc(site.slogan) + " · " + esc(site.instituicaoSigla) + "</span></span>" +
        "</a>" +
        '<div class="cabecalho-acoes">' +
          '<button class="botao busca-abrir" type="button" data-abre-busca aria-expanded="false" aria-controls="caixa-busca">' + icone("busca") + '<span class="botao-texto">Buscar</span></button>' +
          (contato.email ? '<a class="botao botao-primario" href="index.html#contato">' + icone("email") + '<span class="botao-texto">Fale com o ' + esc(site.sigla) + "</span></a>" : "") +
        "</div>" +
      "</div></header>" +
      '<nav class="menu" aria-label="Seções do portal"><div class="container">' +
        '<a class="menu-marca" href="index.html" tabindex="-1" aria-hidden="true"><img src="assets/img/gems-simbolo.png" alt="">' + esc(site.sigla) + "</a>" +
        '<ul class="menu-lista">' +
          '<li><a href="index.html"' + ativo(pagina === "inicio") + ">Início</a></li>" +
          cats.map(function (c) { return '<li><a href="' + urlCategoria(c) + '"' + ativo(c.id === catAtual) + ">" + esc(c.nome) + "</a></li>"; }).join("") +
          '<li><a href="noticias.html"' + ativo(pagina === "arquivo" && !catAtual) + ">Todas</a></li>" +
          '<li><a href="experimentos.html"' + ativo(pagina === "experimentos") + ">Experimentos</a></li>" +
          '<li><a href="membros.html"' + ativo(pagina === "membros") + ">Membros</a></li>" +
          '<li><a href="index.html#seeds">SEEDS</a></li>' +
        "</ul>" +
        '<div class="menu-busca"><button class="botao-icone" type="button" data-abre-busca aria-label="Buscar notícias" aria-expanded="false" aria-controls="caixa-busca">' + icone("busca") + "</button></div>" +
      "</div>" +
      '<div class="caixa-busca" id="caixa-busca" hidden><div class="container">' +
        '<form action="noticias.html" method="get" role="search">' +
          '<label class="sr" for="busca-topo">Buscar notícias</label>' +
          '<input id="busca-topo" name="q" type="search" placeholder="Buscar notícias do ' + esc(site.sigla) + '…" autocomplete="off">' +
          '<button class="botao botao-amarelo" type="submit">Buscar</button>' +
        "</form>" +
      "</div></div>" +
      "</nav>";
  }

  // logos das instituições, numa faixa clara logo acima do rodapé
  function faixaInstituicoes() {
    var lista = ((D && D.instituicoes) || []).filter(function (i) { return i && i.logo; });
    if (!lista.length) return "";
    return '<section class="instituicoes" aria-label="Vínculo institucional"><div class="container">' +
      '<p class="instituicoes-rotulo">Vínculo institucional</p><ul class="instituicoes-lista">' +
      lista.map(function (i) {
        var img = '<img src="' + esc(i.logo) + '" alt="' + esc(i.nome) + '" class="' + (i.monocromatico ? "logo-mono" : "logo-cor") +
          '" onerror="this.closest(\'li\').remove()">';
        return "<li>" + (i.link ? '<a href="' + esc(i.link) + '" target="_blank" rel="noopener" title="' + esc(i.nome) + '">' + img + "</a>" : img) + "</li>";
      }).join("") + "</ul></div></section>";
  }

  function rodape(cats) {
    var ano = new Date().getFullYear();
    var contatos = "";
    if (contato.email) contatos += "<li>" + icone("email") + '<a href="mailto:' + esc(contato.email) + '">' + esc(contato.email) + "</a></li>";
    if (contato.instagram) contatos += "<li>" + icone("instagram") + '<a href="' + esc(contato.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>';
    if (contato.youtube) contatos += "<li>" + icone("youtube") + '<a href="' + esc(contato.youtube) + '" target="_blank" rel="noopener">YouTube</a></li>';
    if (contato.github) contatos += "<li>" + icone("github") + '<a href="' + esc(contato.github) + '" target="_blank" rel="noopener">GitHub</a></li>';
    if (contato.endereco) contatos += "<li>" + icone("local") + "<span>" + esc(contato.endereco) + "</span></li>";
    return faixaInstituicoes() + '<footer class="rodape"><div class="container rodape-grade">' +
        "<div>" +
          '<div class="rodape-marca"><span class="selo"><img src="assets/img/gems-simbolo.png" alt="" width="181" height="453"></span>' +
          "<div><b>" + esc(site.sigla) + "</b><small>" + esc(site.nome) + "</small></div></div>" +
          (site.sobre[0] ? "<p>" + esc(site.sobre[0]) + "</p>" : "") +
        "</div>" +
        (cats.length ? '<div><h2>Seções</h2><ul>' + cats.map(function (c) { return '<li><a href="' + urlCategoria(c) + '">' + esc(c.nome) + "</a></li>"; }).join("") +
          '<li><a href="noticias.html">Todas as notícias</a></li></ul></div>' : "") +
        '<div><h2>O grupo</h2><ul><li><a href="index.html#grupo">Quem somos</a></li><li><a href="membros.html">Membros</a></li><li><a href="experimentos.html">Experimentos</a></li><li><a href="index.html#departamentos">Departamentos</a></li>' +
          '<li><a href="index.html#seeds">SEEDS</a></li><li><a href="index.html#contato">Contato</a></li></ul></div>' +
        (contatos ? "<div><h2>Contato</h2><ul>" + contatos + "</ul></div>" : "") +
      "</div>" +
      '<div class="container rodape-base"><span>© ' + ano + " " + esc(site.sigla) + " · " + esc(site.instituicao) + "</span><span>Portal de notícias do " + esc(site.sigla) + "</span></div>" +
      "</footer>";
  }

  function letreiro() {
    var itens = NOTICIAS.slice(0, 6);
    if (!itens.length) return "";
    var links = function (copia) {
      return itens.map(function (n) {
        return '<a href="' + urlNoticia(n) + '"' + estiloCat(n._cat) + (copia ? ' tabindex="-1"' : "") + ">" + esc(n.titulo) + "</a>";
      }).join("");
    };
    var letras = itens.reduce(function (s, n) { return s + n.titulo.length; }, 0);
    return '<div class="letreiro" role="region" aria-label="Últimas notícias"><div class="container">' +
      '<span class="letreiro-rotulo" aria-hidden="true">Últimas</span>' +
      '<div class="letreiro-trilho"><div class="letreiro-faixa" style="--duracao:' + Math.max(35, Math.round(letras * 0.2)) + 's">' +
      links(false) + '<span class="letreiro-copia" aria-hidden="true">' + links(true) + "</span></div></div>" +
      "</div></div>";
  }

  /* ---- tema claro/escuro ------------------------------------------------ */

  function temaEfetivo() {
    var t = document.documentElement.getAttribute("data-tema");
    if (t === "claro" || t === "escuro") return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
  }
  function ligarTema() {
    var b = $("#alternar-tema");
    if (!b) return;
    function pintar() {
      var escuro = temaEfetivo() === "escuro";
      b.innerHTML = icone(escuro ? "sol" : "lua");
      b.setAttribute("aria-label", escuro ? "Usar tema claro" : "Usar tema escuro");
      b.title = b.getAttribute("aria-label");
    }
    b.addEventListener("click", function () {
      var novo = temaEfetivo() === "escuro" ? "claro" : "escuro";
      document.documentElement.setAttribute("data-tema", novo);
      try { localStorage.setItem("gems-tema", novo); } catch (e) { /* navegador bloqueando armazenamento */ }
      pintar();
    });
    if (window.matchMedia) {
      var mq = matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", pintar);
    }
    pintar();
  }

  /* ---- comportamento da moldura ----------------------------------------- */

  function ligarMoldura() {
    ligarTema();

    // busca que abre sob o menu
    var caixa = $("#caixa-busca");
    var botoes = $$("[data-abre-busca]");
    function abrir(aberta) {
      caixa.hidden = !aberta;
      botoes.forEach(function (b) { b.setAttribute("aria-expanded", String(aberta)); });
      if (aberta) {
        var menu = $(".menu");
        if (menu && menu.getBoundingClientRect().top > 0) menu.scrollIntoView({ block: "start" });
        $("#busca-topo").focus();
      }
    }
    botoes.forEach(function (b) { b.addEventListener("click", function () { abrir(caixa.hidden); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !caixa.hidden) { abrir(false); botoes[0].focus(); }
    });

    // quando o cabeçalho sai da tela, o menu ganha um logo pequeno
    var cab = $(".cabecalho"), menu = $(".menu");
    if (cab && menu && "IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        menu.classList.toggle("menu--compacto", !e[0].isIntersecting);
      }).observe(cab);
    }
  }

  function montarMoldura(catAtual) {
    var cats = categoriasComNoticias();
    $("#topo").innerHTML = topo(cats, catAtual) + (pagina === "inicio" ? letreiro() : "");
    $("#fim").innerHTML = rodape(cats);
    ligarMoldura();
  }

  /* ---- erro no conteudo.js ---------------------------------------------- */

  function mostrarErro() {
    var e = window.__erroConteudo || {};
    var alvo = $("#conteudo");
    var texto = e.faltando
      ? "<p>O arquivo <code>conteudo.js</code> não foi encontrado. Ele precisa ficar na mesma pasta que o <code>index.html</code>.</p>"
      : "<p>Há um erro de digitação no arquivo <code>conteudo.js</code>" + (e.linha ? ", perto da <strong>linha " + e.linha + "</strong>" : "") +
        ". Quase sempre é uma vírgula esquecida entre dois itens, ou aspas que abriram e não fecharam.</p>" +
        (e.msg ? "<pre>" + esc(e.msg) + "</pre>" : "");
    alvo.innerHTML = '<div class="container"><div class="aviso-erro" role="alert"><h2>As notícias não puderam ser carregadas</h2>' + texto + "</div></div>";
  }

  // avisos de conteúdo: aparecem só no computador de quem edita (arquivo local ou localhost)
  function mostrarAvisos() {
    if (!avisos.length) return;
    if (!ehLocal()) { avisos.forEach(function (a) { console.warn("[conteudo.js] " + a); }); return; }
    var caixa = $(".avisos-locais");
    if (!caixa) {
      caixa = document.createElement("aside");
      caixa.className = "avisos-locais";
      caixa.setAttribute("role", "status");
      document.body.appendChild(caixa);
    }
    var unicos = avisos.filter(function (a, i) { return avisos.indexOf(a) === i; });
    caixa.innerHTML = '<button type="button" aria-label="Fechar avisos">' + icone("fechar") + "</button>" +
      "<strong>Avisos do conteudo.js</strong><small>Só aparecem no seu computador, não no site publicado.</small>" +
      "<ul>" + unicos.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>";
    caixa.querySelector("button").addEventListener("click", function () { caixa.remove(); });
  }

  /* ---- página inicial --------------------------------------------------- */

  function cicloSVG() {
    var etapas = ["População", "Progênies", "Ensaios de campo", "Seleção", "Recombinação"];
    var cx = 300, cy = 205, R = 138, n = etapas.length, folga = 0.24;
    var pos = etapas.map(function (_, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { a: a, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
    });
    var setas = "", nos = "";
    pos.forEach(function (p, i) {
      var q = pos[(i + 1) % n];
      var a1 = p.a + folga, a2 = (i === n - 1 ? q.a + 2 * Math.PI : q.a) - folga;
      setas += '<path class="seta" d="M' + f1(cx + R * Math.cos(a1)) + " " + f1(cy + R * Math.sin(a1)) + " A" + R + " " + R + " 0 0 1 " +
        f1(cx + R * Math.cos(a2)) + " " + f1(cy + R * Math.sin(a2)) + '" marker-end="url(#ciclo-ponta)"/>';
      var cos = Math.cos(p.a), sin = Math.sin(p.a), d = R + 38;
      var lx = cx + d * cos, ly = cy + d * sin;
      var ancora = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
      if (sin < -0.9) ly -= 2;
      nos += '<g class="' + (i === 3 ? "no-destaque" : "") + '"><circle class="no-fundo" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="23"/>' +
        '<text class="no-num" x="' + f1(p.x) + '" y="' + f1(p.y + 6) + '" text-anchor="middle">' + (i + 1) + "</text>" +
        '<text class="no-rotulo" x="' + f1(lx) + '" y="' + f1(ly + 5) + '" text-anchor="' + ancora + '">' + esc(etapas[i]) + "</text></g>";
    });
    return '<svg class="ciclo" viewBox="0 0 600 420" role="img" aria-labelledby="ciclo-titulo">' +
      '<title id="ciclo-titulo">Ciclo de seleção recorrente: população, progênies, ensaios de campo, seleção e recombinação, que forma a população do ciclo seguinte.</title>' +
      '<defs><marker id="ciclo-ponta" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse">' +
      '<path class="ponta" d="M0 0 L10 5 L0 10 z"/></marker></defs>' +
      '<circle class="anel" cx="' + cx + '" cy="' + cy + '" r="' + (R - 52) + '" stroke-dasharray="3 7"/>' +
      setas + nos +
      '<text class="centro-1" x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle">UM CICLO DE</text>' +
      '<text class="centro-2" x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle">seleção recorrente</text></svg>';
  }

  function heliceDecorativa() {
    var d1 = "", d2 = "", degraus = "", amp = 90, per = 300;
    for (var y = -40; y <= 640; y += 8) {
      var s = Math.sin((y / per) * 6.283) * amp;
      d1 += (y === -40 ? "M" : "L") + f1(300 + s) + " " + y;
      d2 += (y === -40 ? "M" : "L") + f1(300 - s) + " " + y;
    }
    for (var k = -30; k <= 630; k += 26) {
      var sk = Math.sin((k / per) * 6.283) * amp;
      if (Math.abs(sk) > 12) degraus += '<line x1="' + f1(300 + sk * 0.84) + '" y1="' + k + '" x2="' + f1(300 - sk * 0.84) + '" y2="' + k + '"/>';
    }
    return '<svg class="numeros-arte" viewBox="0 0 600 600" aria-hidden="true" focusable="false"><g transform="rotate(28 300 300)">' +
      '<g stroke="' + AMARELO + '" stroke-width="9" stroke-linecap="round">' + degraus + "</g>" +
      '<path d="' + d1 + '" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/>' +
      '<path d="' + d2 + '" fill="none" stroke="#9BD58F" stroke-width="20" stroke-linecap="round"/></g></svg>';
  }

  function paginaInicial() {
    var usados = {};
    function pegar(lista, qtd) {
      var saida = [];
      for (var i = 0; i < lista.length && saida.length < qtd; i++) {
        if (!usados[lista[i].id]) { usados[lista[i].id] = true; saida.push(lista[i]); }
      }
      return saida;
    }
    var destaques = NOTICIAS.filter(function (n) { return n.destaque; });
    var lider = pegar(destaques.length ? destaques : NOTICIAS, 1)[0];
    var laterais = pegar(destaques.concat(NOTICIAS), 3);
    var ultimas = pegar(NOTICIAS, 6);

    var h = '<h1 class="sr">' + esc(site.sigla) + " — " + esc(site.slogan) + " do " + esc(site.nome) + "</h1>";

    if (lider) {
      h += '<section class="manchete container" aria-label="Manchetes">' +
        '<article class="principal"' + estiloCat(lider._cat) + ">" + midia(lider) +
          '<div class="principal-texto">' + chapeu(lider._cat) +
            '<h2><a class="titulo-link" href="' + urlNoticia(lider) + '">' + esc(lider.titulo) + "</a></h2>" +
            (lider.linhaFina ? '<p class="linha-fina">' + esc(lider.linhaFina) + "</p>" : "") +
            '<div class="meta">' + (lider.autor ? "<span>Por <strong>" + esc(lider.autor) + "</strong></span>" : "") +
            "<span>" + icone("relogio") + quando(lider) + "</span><span>" + minutosDeLeitura(lider) + " min de leitura</span></div>" +
          "</div>" +
        "</article>" +
        (laterais.length ? '<div class="secundarias">' + laterais.map(function (n) {
          return '<article class="item"' + estiloCat(n._cat) + ">" + midia(n) + "<div>" + chapeu(n._cat) +
            '<h3><a class="titulo-link" href="' + urlNoticia(n) + '">' + esc(n.titulo) + "</a></h3>" +
            '<div class="meta"><span>' + icone("relogio") + quando(n) + "</span></div></div></article>";
        }).join("") + "</div>" : "") +
      "</section>";
    }

    h += '<section class="secao container" aria-labelledby="t-ultimas"><div class="grade-com-lateral"><div>' +
        '<div class="secao-titulo"><h2 id="t-ultimas">Últimas notícias</h2><a href="noticias.html">Ver todas' + icone("seta") + "</a></div>" +
        (ultimas.length ? '<div class="cartoes">' + ultimas.map(cartao).join("") + "</div>"
          : '<p class="resultado-info">As outras notícias aparecem aqui conforme forem publicadas.</p>') +
        (NOTICIAS.length > 10 ? '<div class="mais-noticias"><a class="botao botao-contorno" href="noticias.html">Ver todas as ' + NOTICIAS.length + " notícias" + icone("seta") + "</a></div>" : "") +
      "</div>" +
      '<aside class="coluna-lateral" aria-label="Destaques e agenda">' + blocoEssenciais() + blocoAgenda() + "</aside>" +
      "</div></section>";

    if (D.numeros && D.numeros.length) {
      h += '<section class="numeros" aria-labelledby="t-numeros">' + heliceDecorativa() + '<div class="container">' +
        '<h2 class="numeros-titulo" id="t-numeros">O ' + esc(site.sigla) + " em números</h2>" +
        '<div class="numeros-grade">' + D.numeros.map(function (x) {
          var valor = String(x.valor).replace("{membros}", String(MEMBROS.length));
          return '<div class="numero"><b>' + esc(valor) + "</b><span>" + esc(x.rotulo) + "</span></div>";
        }).join("") + "</div></div></section>";
    }

    h += secaoExperimentos();

    var deps = (D.departamentos || []).map(function (d) {
      var cat = d.categoria ? categoria(d.categoria) : null;
      var temNoticias = cat && NOTICIAS.some(function (n) { return n._cat.id === cat.id; });
      var cor = corSegura(d.cor || (cat && !cat.avulsa ? cat.cor : "#2F7542"));
      var chefe = MEMBROS.filter(function (m) { return m.coordena && semAcento(m.coordena) === semAcento(d.nome); })[0];
      return '<article class="departamento" style="--cat:' + cor + '"><span class="departamento-icone">' + icone(d.icone) + "</span>" +
        "<h3>" + esc(d.nome) + "</h3><p>" + esc(d.texto) + "</p>" +
        (chefe ? '<a class="dep-coord" href="membros.html#' + esc(chefe.id) + '">' +
          (chefe.foto ? '<span class="avatar-mini" style="background-image:url(\'' + esc(chefe.foto) + '\')" aria-hidden="true"></span>' : "") +
          "<span><small>Coordenação</small><b>" + esc(chefe.nome) + "</b></span></a>" : "") +
        (temNoticias ? '<a href="' + urlCategoria(cat) + '">Notícias de ' + esc(cat.nome) + icone("seta") + "</a>" : "") + "</article>";
    }).join("");

    h += '<section class="secao container" id="grupo" aria-labelledby="t-grupo">' +
      '<div class="secao-titulo"><span class="rotulo">O grupo</span></div>' +
      '<div class="grupo-grade"><div class="grupo-texto">' +
        '<span class="chapeu">Quem somos</span>' +
        '<h2 id="t-grupo">' + esc(site.chamada || "Melhoramento vegetal do campo ao código") + "</h2>" +
        site.sobre.map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("") +
        chamadaEquipe() +
      "</div>" +
      (deps ? '<div class="departamentos" id="departamentos" aria-label="Departamentos">' + deps + "</div>" : "") +
      "</div></section>";

    var S = D.seeds;
    if (S) {
      var rep = S.noticia && POR_ID[S.noticia];
      var tec = categoria("tecnologia");
      h += '<section class="seeds" id="seeds" aria-labelledby="t-seeds"><div class="container seeds-grade">' +
        '<div class="seeds-texto">' +
          '<span class="seeds-logo"><img src="assets/img/seeds-logo.png" alt="SEEDS" width="1390" height="408"></span>' +
          '<h2 id="t-seeds">' + esc(S.titulo) + "</h2>" +
          "<p>" + esc(S.texto) + "</p>" +
          (S.recursos && S.recursos.length ? '<ul class="recursos">' + S.recursos.map(function (r) { return "<li>" + icone("check") + "<span>" + esc(r) + "</span></li>"; }).join("") + "</ul>" : "") +
          '<div class="seeds-acoes">' +
            (rep ? '<a class="botao botao-primario" href="' + urlNoticia(rep) + '">Leia a reportagem' + icone("seta") + "</a>" : "") +
            (!tec.avulsa && NOTICIAS.some(function (n) { return n._cat.id === tec.id; }) ? '<a class="botao botao-contorno" href="' + urlCategoria(tec) + '">Notícias de ' + esc(tec.nome) + "</a>" : "") +
          "</div>" +
        "</div>" +
        '<figure class="ciclo-cartao">' + cicloSVG() +
          "<figcaption>Cada volta do ciclo fica registrada no SEEDS: as progênies selecionadas viram genitores do ciclo seguinte, e o pedigree acompanha tudo.</figcaption></figure>" +
      "</div></section>";
    }

    h += blocoContato("Fale com o " + site.sigla,
      "Dúvidas, parcerias, visitas ou interesse em conhecer o trabalho do grupo? Escreva para a gente.");

    $("#conteudo").innerHTML = h;
  }

  function blocoContato(titulo, texto) {
    if (!contato.email && !contato.instagram) return "";
    return '<section class="contato" id="contato" aria-labelledby="t-contato"><div class="container">' +
      '<div><h2 id="t-contato">' + esc(titulo) + "</h2><p>" + esc(texto) + "</p></div>" +
      '<div class="contato-acoes">' +
        (contato.email ? '<a class="botao botao-primario" href="mailto:' + esc(contato.email) + '">' + icone("email") + esc(contato.email) + "</a>" : "") +
        (contato.instagram ? '<a class="botao botao-contorno" href="' + esc(contato.instagram) + '" target="_blank" rel="noopener">' + icone("instagram") + "Instagram</a>" : "") +
      "</div></div></section>";
  }

  /* ---- experimentos ------------------------------------------------------- */

  var EXPERIMENTOS = (D && D.experimentos && Array.isArray(D.experimentos.lista))
    ? D.experimentos.lista.filter(function (e) { return e && e.nome; }) : [];
  EXPERIMENTOS.forEach(function (e, i) { if (!e.id) e.id = "experimento-" + (i + 1); e.cor = corSegura(e.cor); });

  // esquemas desenhados (viewBox 600 x 480), um por tipo de experimento
  var VERDE_CLARO = "#BFE3A8";
  var ICONE_USO = {
    grao: '<path d="M0 -26C15 -26 21 -8 21 5C21 19 11 26 0 26C-11 26-21 19-21 5C-21-8-15-26 0-26Z" fill="' + AMARELO + '"/>' +
          '<path d="M-3 -14C4 -14 8 -7 8 1" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="3" stroke-linecap="round"/>',
    forragem: '<g fill="none" stroke="' + VERDE_CLARO + '" stroke-width="4" stroke-linecap="round">' +
          '<path d="M0 26C0 6-4-12-16-26"/><path d="M0 26C2 4 8-14 20-24"/><path d="M-6 26C-10 12-20 2-28-4"/>' +
          '<path d="M6 26C12 14 22 6 30 2"/><path d="M0 26V-22"/></g>',
    espiga: '<ellipse cx="0" cy="-2" rx="11" ry="27" fill="' + AMARELO + '"/>' +
          '<g fill="#fff" fill-opacity=".55">' + [-18, -9, 0, 9, 18].map(function (y) {
            return '<circle cx="-4" cy="' + y + '" r="2.2"/><circle cx="4" cy="' + y + '" r="2.2"/>';
          }).join("") + "</g>" +
          '<path d="M-5 30C-27 10-25-20-9-34C-15-10-10 12-5 30Z" fill="#8FD18A"/>' +
          '<path d="M5 30C27 10 25-20 9-34C15-10 10 12 5 30Z" fill="#6FBF6A"/>'
  };

  function defsArte(u) {
    return '<defs><marker id="' + u + 'a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10z" fill="' + AMARELO + '"/></marker>' +
      '<marker id="' + u + 'b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10z" fill="#fff"/></marker>' +
      '<clipPath id="' + u + 'c"><circle cx="300" cy="222" r="34"/></clipPath></defs>';
  }

  var ARTES = {
    // VCU: genótipos e ambientes num gráfico de estabilidade
    ambientes: function (u) {
      var g = "";
      [80, 150, 220].forEach(function (r) {
        g += '<circle cx="300" cy="240" r="' + r + '" fill="none" stroke="#fff" stroke-opacity=".13" stroke-dasharray="4 8"/>';
      });
      g += '<path d="M50 240H550M300 30V440" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>';
      [[478, 138, "Amb. 1"], [520, 262, "Amb. 2"], [430, 360, "Amb. 3"], [196, 112, "Amb. 4"]].forEach(function (a) {
        var dir = a[0] > 300;
        g += '<line x1="300" y1="240" x2="' + a[0] + '" y2="' + a[1] + '" stroke="' + AMARELO + '" stroke-width="3" marker-end="url(#' + u + 'a)"/>';
        g += '<text class="arte-p" x="' + (a[0] + (dir ? 10 : -10)) + '" y="' + (a[1] - 12) + '" text-anchor="' + (dir ? "start" : "end") + '">' + a[2] + "</text>";
      });
      [[382, 186, 1], [436, 226, 1], [344, 302], [252, 206], [198, 286], [464, 300], [318, 158], [262, 334], [394, 262]].forEach(function (p, i) {
        if (p[2]) g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="17" fill="none" stroke="' + AMARELO + '" stroke-width="3"/>';
        g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="#fff" fill-opacity="' + (p[2] ? 1 : 0.8) + '"/>';
        g += '<text class="arte-p" x="' + (p[0] + 13) + '" y="' + (p[1] + 21) + '">G' + (i + 1) + "</text>";
      });
      return g;
    },

    // INTER: duas populações, F1, F2 segregando e os destinos da F2
    cruzamento: function (u) {
      var g = "";
      g += '<path d="M190 128Q214 190 276 204M410 128Q386 190 324 204" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>';
      g += '<circle cx="170" cy="86" r="50" fill="#fff"/><text class="arte-escuro" x="170" y="92" text-anchor="middle">Pop. A</text>';
      g += '<circle cx="430" cy="86" r="50" fill="' + AMARELO + '"/><text class="arte-escuro" x="430" y="92" text-anchor="middle">Pop. B</text>';
      g += '<text class="arte-x" x="300" y="100" text-anchor="middle">×</text>';
      g += '<g clip-path="url(#' + u + 'c)"><rect x="266" y="188" width="34" height="68" fill="#fff"/><rect x="300" y="188" width="34" height="68" fill="' + AMARELO + '"/></g>';
      g += '<circle cx="300" cy="222" r="34" fill="none" stroke="#fff" stroke-width="2"/>';
      g += '<text class="arte-escuro" x="300" y="228" text-anchor="middle">F1</text>';
      g += '<line x1="300" y1="258" x2="300" y2="294" stroke="#fff" stroke-width="3" marker-end="url(#' + u + 'b)"/>';
      g += '<text class="arte-p" x="314" y="282">autofecundação</text>';
      var r = aleatorio("inter-f2");
      for (var i = 0; i < 30; i++) {
        var ang = r() * 6.283, raio = Math.sqrt(r()), t = r();
        var cor = t < 0.34 ? "#fff" : t < 0.67 ? AMARELO : VERDE_CLARO;
        g += '<circle cx="' + f1(300 + Math.cos(ang) * raio * 118) + '" cy="' + f1(336 + Math.sin(ang) * raio * 26) + '" r="6.5" fill="' + cor + '"/>';
      }
      g += '<text class="arte-g" x="166" y="344" text-anchor="end">F2</text>';
      [[112, "Seleção recorrente"], [300, "Linhagens"], [488, "Novos híbridos"]].forEach(function (d) {
        var w = d[1].length * 9.4 + 30;
        g += '<line x1="300" y1="370" x2="' + d[0] + '" y2="410" stroke="#fff" stroke-opacity=".6" stroke-width="2.5" marker-end="url(#' + u + 'b)"/>';
        g += '<rect x="' + f1(d[0] - w / 2) + '" y="414" width="' + f1(w) + '" height="40" rx="20" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".5"/>';
        g += '<text class="arte-p" x="' + d[0] + '" y="440" text-anchor="middle">' + d[1] + "</text>";
      });
      return g;
    },

    // TOPCROSS: linhagem x testador = híbrido top cross, com três usos
    topcross: function (u) {
      var g = "";
      g += '<path d="M170 110Q176 150 250 170M430 110Q424 150 350 170" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>';
      g += '<rect x="80" y="54" width="180" height="56" rx="28" fill="#fff"/><text class="arte-escuro" x="170" y="88" text-anchor="middle">Linhagem</text>';
      g += '<rect x="340" y="54" width="180" height="56" rx="28" fill="' + AMARELO + '"/><text class="arte-escuro" x="430" y="88" text-anchor="middle">Testador</text>';
      g += '<text class="arte-x" x="300" y="98" text-anchor="middle">×</text>';
      g += '<rect x="160" y="168" width="280" height="66" rx="18" fill="#fff"/>';
      g += '<text class="arte-escuro" x="300" y="197" text-anchor="middle">Híbrido top cross</text>';
      g += '<text class="arte-escuro-p" x="300" y="219" text-anchor="middle">capacidade de combinação</text>';
      [[120, "Grãos", "grao"], [300, "Forragem", "forragem"], [480, "Milho verde", "espiga"]].forEach(function (d) {
        g += '<line x1="300" y1="234" x2="' + d[0] + '" y2="296" stroke="#fff" stroke-opacity=".6" stroke-width="2.5" marker-end="url(#' + u + 'b)"/>';
        g += '<circle cx="' + d[0] + '" cy="350" r="46" fill="#fff" fill-opacity=".13" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>';
        g += '<g transform="translate(' + d[0] + ' 350)">' + ICONE_USO[d[2]] + "</g>";
        g += '<text class="arte-r" x="' + d[0] + '" y="428" text-anchor="middle">' + d[1] + "</text>";
      });
      return g;
    },

    // BAC: bactérias, nitrogênio do ar e a planta de milho
    bacterias: function (u) {
      var g = "";
      g += '<line x1="30" y1="372" x2="570" y2="372" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 8"/>';
      // planta
      g += '<g fill="none" stroke-linecap="round">' +
        '<path d="M470 372C468 300 472 220 470 112" stroke="' + VERDE_CLARO + '" stroke-width="7"/>' +
        '<path d="M470 322C430 304 408 274 390 238M470 282C512 264 534 238 548 206M470 238C432 218 418 190 408 160M470 198C504 180 518 158 526 130" stroke="' + VERDE_CLARO + '" stroke-width="5"/>' +
        '<path d="M470 112L458 80M470 112L470 76M470 112L482 80" stroke="' + AMARELO + '" stroke-width="3"/>' +
        '<path d="M470 372C460 400 442 420 420 440M470 372C474 404 480 424 492 448M470 372C488 396 510 410 534 418M470 372C452 392 430 398 402 404" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>' +
        "</g>";
      g += '<ellipse cx="484" cy="262" rx="9" ry="23" fill="' + AMARELO + '" transform="rotate(16 484 262)"/>';
      [[440, 424], [496, 432], [520, 412], [414, 400], [452, 408]].forEach(function (p, i) {
        g += i % 2 ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#D9C7F5"/>'
                   : '<rect x="' + (p[0] - 9) + '" y="' + (p[1] - 4) + '" width="18" height="8" rx="4" fill="#FF9EC4"/>';
      });
      // bactérias em destaque
      var r = aleatorio("bac-colonia");
      for (var i = 0; i < 16; i++) {
        var x = 70 + r() * 170, y = 100 + r() * 190;
        g += i % 2
          ? '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="10" fill="#D9C7F5"/>'
          : '<rect x="' + f1(x - 19) + '" y="' + f1(y - 8) + '" width="38" height="16" rx="8" fill="#FF9EC4" transform="rotate(' + f1(r() * 180) + " " + f1(x) + " " + f1(y) + ')"/>';
      }
      // nitrogênio do ar
      [[300, 96], [346, 128], [290, 146]].forEach(function (p) {
        g += '<g fill="#fff"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="8"/><circle cx="' + (p[0] + 17) + '" cy="' + p[1] + '" r="8"/></g>';
      });
      g += '<text class="arte-p" x="318" y="78" text-anchor="middle">N₂ do ar</text>';
      g += '<path d="M318 164Q316 280 420 388" fill="none" stroke="' + AMARELO + '" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" marker-end="url(#' + u + 'a)"/>';
      g += '<rect x="286" y="246" width="70" height="34" rx="17" fill="' + AMARELO + '"/><text class="arte-escuro" x="321" y="269" text-anchor="middle">FBN</text>';
      // legenda
      g += '<circle cx="60" cy="424" r="9" fill="#D9C7F5"/><text class="arte-p" x="78" y="430">Gram-positivas</text>';
      g += '<rect x="42" y="444" width="36" height="14" rx="7" fill="#FF9EC4"/><text class="arte-p" x="88" y="458">Gram-negativas</text>';
      return g;
    }
  };

  var contadorArte = 0;
  function arteExperimento(e) {
    var u = "exp" + (++contadorArte);
    var desenho = ARTES[e.arte] || ARTES.ambientes;
    return '<svg class="experimento-desenho" viewBox="0 0 600 480" role="img" aria-label="Esquema ilustrativo do experimento ' + esc(e.sigla || e.nome) + '">' +
      defsArte(u) + desenho(u) + "</svg>";
  }

  function artigoExperimento(e, i) {
    return '<article class="experimento" id="' + esc(e.id) + '" style="--exp:' + e.cor + '">' +
      '<div class="experimento-arte">' + arteExperimento(e) +
        '<span class="experimento-sigla" aria-hidden="true">' + esc(e.sigla || "") + "</span></div>" +
      '<div class="experimento-texto">' +
        '<p class="experimento-num">Experimento ' + String(i + 1).padStart(2, "0") + (e.sigla ? " · " + esc(e.sigla) : "") + "</p>" +
        "<h2>" + esc(e.nome) + "</h2>" +
        (e.foco && e.foco.length ? '<ul class="experimento-foco" aria-label="Foco">' + e.foco.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" : "") +
        '<div class="experimento-corpo">' + corpo(e.texto || []) + "</div>" +
        (e.parceria ? '<p class="experimento-parceria"><span>Parceria</span><b>' + esc(e.parceria) + "</b></p>" : "") +
      "</div></article>";
  }

  function paginaExperimentos() {
    var X = D.experimentos || {};
    document.title = (X.titulo || "Experimentos") + " · " + site.sigla;
    definirDescricao(X.intro);
    var h = '<div class="container arquivo-cabeca">' +
      '<nav class="trilha" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">›</span><span>Experimentos</span></nav>' +
      '<span class="chapeu">Pesquisa</span>' +
      "<h1>" + esc(X.titulo || "Experimentos") + "</h1>" +
      (X.intro ? '<p class="arquivo-intro">' + esc(X.intro) + "</p>" : "") +
      (EXPERIMENTOS.length > 1 ? '<nav class="experimentos-indice" aria-label="Ir para o experimento">' + EXPERIMENTOS.map(function (e) {
        return '<a href="#' + esc(e.id) + '" style="--exp:' + e.cor + '">' + esc(e.sigla || e.nome) + "</a>";
      }).join("") + "</nav>" : "") +
      "</div>" +
      '<div class="container experimentos">' + EXPERIMENTOS.map(artigoExperimento).join("") + "</div>" +
      blocoContato("Quer conhecer os experimentos de perto?",
        "Visitas técnicas, parcerias e dias de campo: escreva para o grupo.");
    $("#conteudo").innerHTML = h;
  }

  // chamada da página inicial
  function secaoExperimentos() {
    if (!EXPERIMENTOS.length) return "";
    return '<section class="secao container" id="experimentos" aria-labelledby="t-exp">' +
      '<div class="secao-titulo"><h2 id="t-exp">Experimentos em campo</h2><a href="experimentos.html">Ver todos' + icone("seta") + "</a></div>" +
      '<div class="exp-cartoes">' + EXPERIMENTOS.map(function (e) {
        return '<a class="exp-cartao" href="experimentos.html#' + esc(e.id) + '" style="--exp:' + e.cor + '">' +
          '<span class="exp-sigla">' + esc(e.sigla || "") + "</span>" +
          "<h3>" + esc(e.nome) + "</h3>" +
          (e.resumo ? "<p>" + esc(e.resumo) + "</p>" : "") +
          (e.parceria ? '<small class="exp-parceria">Parceria: ' + esc(e.parceria) + "</small>" : "") +
          '<span class="exp-mais">Conheça' + icone("seta") + "</span></a>";
      }).join("") + "</div></section>";
  }

  /* ---- equipe ------------------------------------------------------------ */

  var EQUIPE = (D && D.equipe) || {};
  var GRUPOS = Array.isArray(EQUIPE.grupos) ? EQUIPE.grupos : [];
  var EMAIL_OK = /^[^\s@<>"'()]+@[^\s@<>"'()]+\.[a-z]{2,}$/i;
  var MEMBROS = (Array.isArray(EQUIPE.membros) ? EQUIPE.membros : []).filter(function (m) { return m && m.nome; });
  MEMBROS.forEach(function (m, i) {
    if (!m.id) m.id = "membro-" + (i + 1);
    if (!GRUPOS.some(function (g) { return g.id === m.grupo; })) {
      avisos.push("Em “equipe”, " + m.nome + " está no grupo “" + (m.grupo || "") + "”, que não existe na lista de grupos.");
    }
    if (m.coordena && !((D && D.departamentos) || []).some(function (d) { return semAcento(d.nome) === semAcento(m.coordena); })) {
      avisos.push("Em “equipe”, " + m.nome + " coordena “" + m.coordena + "”, que não está na lista de departamentos.");
    }
    m.email = String(m.email || "").trim();
    if (m.email && !EMAIL_OK.test(m.email)) {
      avisos.push("Em “equipe”, o e-mail “" + m.email + "” de " + m.nome + " não parece válido e não foi exibido.");
      m.email = "";
    }
  });

  var PARTICULAS = ["da", "de", "do", "das", "dos", "e"];
  function iniciais(nome) {
    var p = String(nome).split(/\s+/).filter(function (x) { return x && PARTICULAS.indexOf(x.toLowerCase()) < 0; });
    return ((p[0] || "").charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase();
  }

  // quem ainda não tem foto ganha uma silhueta com as iniciais, no mesmo enquadramento dos retratos
  var contadorMono = 0;
  function monograma(m) {
    var id = "mono" + (++contadorMono);
    return '<svg class="monograma" viewBox="0 0 640 800" role="img" aria-label="' + esc(m.nome) + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="currentColor" stop-opacity=".34"/><stop offset="1" stop-color="currentColor" stop-opacity=".52"/></linearGradient></defs>' +
      '<circle cx="320" cy="268" r="108" fill="url(#' + id + ')"/>' +
      '<path d="M84 800C90 560 196 398 320 398S550 560 556 800Z" fill="url(#' + id + ')"/>' +
      '<text x="320" y="296" text-anchor="middle" class="monograma-letras">' + esc(iniciais(m.nome)) + "</text></svg>";
  }

  function retrato(m, extra) {
    return '<div class="retrato">' + (m.foto
      ? '<img src="' + esc(m.foto) + '" alt="' + esc(m.nome) + '" width="640" height="800" loading="lazy" decoding="async" data-membro="' + esc(m.id) + '">'
      : monograma(m)) + (extra || "") + "</div>";
  }

  // departamento que a pessoa coordena (campo "coordena" no conteudo.js)
  function departamento(nome) {
    var k = semAcento(nome);
    return (D && D.departamentos || []).filter(function (d) { return semAcento(d.nome) === k; })[0] || null;
  }
  function corDepartamento(d) {
    var cat = d.categoria ? categoria(d.categoria) : null;
    return corSegura(d.cor || (cat && !cat.avulsa ? cat.cor : "#2F7542"));
  }
  function coordenacao(m) {
    if (!m.coordena) return null;
    var d = departamento(m.coordena);
    return {
      nome: d ? d.nome : m.coordena,
      icone: d ? d.icone : "check",
      cor: d ? corDepartamento(d) : "#2F7542",
      rotulo: "Coordenação de " + (d ? d.nome : m.coordena)
    };
  }
  function seloCoordenacao(c, sobreFoto) {
    return '<span class="selo-coord' + (sobreFoto ? " selo-foto" : " selo-texto") + '"' + (sobreFoto ? ' aria-hidden="true"' : "") + ">" +
      '<span class="selo-icone">' + icone(c.icone) + "</span>" + esc(c.rotulo) + "</span>";
  }

  function linksPerfil(m) {
    var h = "";
    if (m.lattes) h += '<a class="perfil-link" href="' + esc(m.lattes) + '" target="_blank" rel="noopener" aria-label="Currículo Lattes de ' + esc(m.nome) + '">' + icone("documento") + "Lattes</a>";
    if (m.orcid) h += '<a class="perfil-link perfil-orcid" href="https://orcid.org/' + esc(m.orcid) + '" target="_blank" rel="noopener" aria-label="ORCID de ' + esc(m.nome) + '">' + icone("orcid") + "ORCID</a>";
    return h ? '<div class="membro-links">' + h + "</div>" : "";
  }

  // e-mail visível no perfil; a quebra opcional antes do @ evita que endereços longos estourem o cartão
  function emailPerfil(m) {
    if (!m.email) return "";
    var arroba = m.email.lastIndexOf("@");
    return '<a class="membro-email" href="mailto:' + esc(m.email) + '" aria-label="E-mail de ' + esc(m.nome) + ": " + esc(m.email) + '">' +
      icone("email") + "<span>" + esc(m.email.slice(0, arroba)) + "<wbr>" + esc(m.email.slice(arroba)) + "</span></a>";
  }

  function contatoPerfil(m) {
    var h = emailPerfil(m) + linksPerfil(m);
    return h ? '<div class="perfil-contato">' + h + "</div>" : "";
  }

  function cartaoMembro(m) {
    var c = coordenacao(m);
    return '<article class="membro' + (c ? " membro--coord" : "") + '" id="' + esc(m.id) + '"' + (c ? ' style="--dep:' + c.cor + '"' : "") + ">" +
      retrato(m, c ? seloCoordenacao(c, true) : "") +
      '<div class="membro-texto">' + (c ? seloCoordenacao(c, false) : "") +
      '<p class="membro-cargo">' + esc(m.cargo || "") + "</p>" +
      "<h3>" + esc(m.nome) + "</h3>" +
      (m.bio ? '<p class="membro-bio">' + esc(m.bio) + "</p>" : "") +
      contatoPerfil(m) + "</div></article>";
  }

  function cartaoLider(m) {
    return '<article class="lider" id="' + esc(m.id) + '">' + retrato(m) +
      '<div class="lider-texto"><p class="lider-cargo">' + esc(m.cargo || "") + "</p>" +
      "<h3>" + esc(m.nome) + "</h3>" +
      (m.credenciais && m.credenciais.length ? '<ul class="credenciais">' + m.credenciais.map(function (c) {
        return "<li>" + icone("capelo") + "<span>" + esc(c) + "</span></li>";
      }).join("") + "</ul>" : "") +
      (m.bio ? '<p class="lider-bio">' + esc(m.bio) + "</p>" : "") +
      contatoPerfil(m) + "</div></article>";
  }

  // chamada da página inicial: rostos da equipe + link para a página de membros
  function chamadaEquipe() {
    if (!MEMBROS.length) return "";
    var rostos = MEMBROS.filter(function (m) { return m.foto; }).slice(0, 6);
    return '<a class="equipe-chamada" href="membros.html">' +
      '<span class="avatares" aria-hidden="true">' + rostos.map(function (m) {
        return '<span class="avatar" style="background-image:url(\'' + esc(m.foto) + '\')"></span>';
      }).join("") + "</span>" +
      '<span class="equipe-chamada-texto"><b>Conheça a equipe</b><small>' + MEMBROS.length + " integrantes, da graduação ao doutorado</small></span>" +
      icone("seta") + "</a>";
  }

  // quem coordena departamento vem primeiro, num bloco próprio, na ordem dos departamentos
  function gradeMembros(pessoas) {
    var ordem = (D.departamentos || []).map(function (d) { return semAcento(d.nome); });
    var coord = pessoas.filter(function (m) { return m.coordena; }).sort(function (a, b) {
      return ordem.indexOf(semAcento(a.coordena)) - ordem.indexOf(semAcento(b.coordena));
    });
    var demais = pessoas.filter(function (m) { return !m.coordena; });
    if (!coord.length) return '<div class="membros-grade">' + pessoas.map(cartaoMembro).join("") + "</div>";
    return '<h3 class="subgrupo">Coordenação de departamentos</h3>' +
      '<div class="membros-grade">' + coord.map(cartaoMembro).join("") + "</div>" +
      (demais.length ? '<h3 class="subgrupo">Integrantes</h3><div class="membros-grade">' + demais.map(cartaoMembro).join("") + "</div>" : "");
  }

  function paginaMembros() {
    document.title = "Membros · " + site.sigla;
    definirDescricao(EQUIPE.intro);

    var grupos = GRUPOS.slice();
    if (MEMBROS.some(function (m) { return !GRUPOS.some(function (g) { return g.id === m.grupo; }); })) {
      grupos.push({ id: "__outros", nome: "Outros integrantes", descricao: "" });
    }
    var lista = function (g) {
      return MEMBROS.filter(function (m) {
        return g.id === "__outros" ? !GRUPOS.some(function (x) { return x.id === m.grupo; }) : m.grupo === g.id;
      });
    };
    grupos = grupos.filter(function (g) { return lista(g).length; });
    var plural = function (n) { return n + (n === 1 ? " integrante" : " integrantes"); };

    var h = '<div class="container equipe-cabeca">' +
      '<nav class="trilha" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">›</span><span>Membros</span></nav>' +
      '<span class="chapeu">Equipe</span>' +
      "<h1>" + esc(EQUIPE.titulo || "Membros") + "</h1>" +
      (EQUIPE.intro ? '<p class="arquivo-intro">' + esc(EQUIPE.intro) + "</p>" : "") +
      '<dl class="equipe-resumo">' +
        "<div><dt>Integrantes</dt><dd>" + MEMBROS.length + "</dd></div>" +
        grupos.map(function (g) { return "<div><dt>" + esc(g.nome) + "</dt><dd>" + lista(g).length + "</dd></div>"; }).join("") +
      "</dl>" +
      '<div class="filtros"><div class="chips" role="group" aria-label="Mostrar por grupo">' +
        '<button class="chip" type="button" data-grupo="" aria-pressed="true">Todos <small>' + MEMBROS.length + "</small></button>" +
        grupos.map(function (g) {
          return '<button class="chip" type="button" data-grupo="' + esc(g.id) + '" aria-pressed="false">' + esc(g.nome) + " <small>" + lista(g).length + "</small></button>";
        }).join("") +
      "</div></div></div>" +
      '<div class="container">' +
      grupos.map(function (g) {
        var pessoas = lista(g);
        var lider = !!g.destaque;
        return '<section class="equipe-grupo" id="grupo-' + esc(g.id) + '" data-grupo="' + esc(g.id) + '" aria-labelledby="t-' + esc(g.id) + '">' +
          '<header class="equipe-grupo-cabeca"><div><h2 id="t-' + esc(g.id) + '">' + esc(g.nome) + "</h2>" +
          (g.descricao ? "<p>" + esc(g.descricao) + "</p>" : "") + "</div>" +
          '<span class="contagem">' + plural(pessoas.length) + "</span></header>" +
          (lider ? '<div class="orientacao">' + pessoas.map(cartaoLider).join("") + "</div>" : gradeMembros(pessoas)) +
          "</section>";
      }).join("") +
      "</div>" +
      blocoContato("Quer fazer parte do " + site.sigla + "?",
        "O grupo recebe estudantes interessados em melhoramento vegetal, do campo à análise de dados. Escreva para o grupo.");

    $("#conteudo").innerHTML = h;

    // filtro por grupo, sem recarregar a página
    var botoes = $$(".chips [data-grupo]");
    function mostrar(id) {
      botoes.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-grupo") === id)); });
      $$(".equipe-grupo").forEach(function (s) { s.hidden = !!id && s.getAttribute("data-grupo") !== id; });
      try { history.replaceState(null, "", "membros.html" + (id ? "?grupo=" + encodeURIComponent(id) : "")); } catch (e) { /* file:// */ }
    }
    botoes.forEach(function (b) { b.addEventListener("click", function () { mostrar(b.getAttribute("data-grupo")); }); });
    var inicial = params.get("grupo") || "";
    if (inicial && grupos.some(function (g) { return g.id === inicial; })) mostrar(inicial);

    // foto que não carregou vira monograma
    $$("img[data-membro]").forEach(function (img) {
      function trocar() {
        var m = MEMBROS.filter(function (x) { return x.id === img.getAttribute("data-membro"); })[0];
        if (!m) return;
        avisos.push("A foto “" + img.getAttribute("src") + "” de " + m.nome + " não foi encontrada.");
        img.outerHTML = monograma(m);
        mostrarAvisos();
      }
      if (img.complete && img.naturalWidth === 0) trocar();
      else img.addEventListener("error", trocar, { once: true });
    });
  }

  /* ---- página da notícia ------------------------------------------------ */

  function compartilhar(n) {
    var url = location.href.split("#")[0];
    var u = encodeURIComponent(url), t = encodeURIComponent(n.titulo);
    return '<div class="compartilhar"><span>Compartilhar</span>' +
      (navigator.share ? '<button class="botao-icone" type="button" data-compartilhar aria-label="Compartilhar">' + icone("compartilhar") + "</button>" : "") +
      '<a class="botao-icone" href="https://api.whatsapp.com/send?text=' + t + "%20" + u + '" target="_blank" rel="noopener" aria-label="Compartilhar no WhatsApp">' + icone("whatsapp") + "</a>" +
      '<a class="botao-icone" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '" target="_blank" rel="noopener" aria-label="Compartilhar no Facebook">' + icone("facebook") + "</a>" +
      '<a class="botao-icone" href="https://www.linkedin.com/sharing/share-offsite/?url=' + u + '" target="_blank" rel="noopener" aria-label="Compartilhar no LinkedIn">' + icone("linkedin") + "</a>" +
      '<button class="botao-icone" type="button" data-copiar aria-label="Copiar o link">' + icone("link") + "</button>" +
      '<span class="copiado" role="status" aria-live="polite"></span></div>';
  }

  function ligarCompartilhar(n) {
    $$("[data-copiar]").forEach(function (b) {
      b.addEventListener("click", function () {
        var url = location.href.split("#")[0];
        var aviso = b.parentNode.querySelector(".copiado");
        function ok() { aviso.textContent = "Link copiado!"; setTimeout(function () { aviso.textContent = ""; }, 2500); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(ok, function () { copiarAntigo(url); ok(); });
        } else { copiarAntigo(url); ok(); }
      });
    });
    $$("[data-compartilhar]").forEach(function (b) {
      b.addEventListener("click", function () {
        navigator.share({ title: n.titulo, text: n.linhaFina || "", url: location.href.split("#")[0] }).catch(function () {});
      });
    });
  }
  function copiarAntigo(texto) {
    var t = document.createElement("textarea");
    t.value = texto; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* sem área de transferência */ }
    t.remove();
  }

  function idYouTube(url) {
    var m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/.exec(String(url || ""));
    return m ? m[1] : null;
  }

  function definirDescricao(texto) {
    var m = $('meta[name="description"]');
    if (m && texto) m.setAttribute("content", texto);
  }

  function paginaNoticia() {
    var n = POR_ID[params.get("id") || ""];
    var alvo = $("#conteudo");

    if (!n) {
      document.title = "Notícia não encontrada · " + site.sigla;
      alvo.innerHTML = '<div class="container"><div class="vazio" style="margin-block:56px"><h2>Notícia não encontrada</h2>' +
        '<p>O endereço pode ter mudado ou a notícia foi retirada do ar.</p>' +
        '<p style="margin-top:14px"><a href="noticias.html">Ver todas as notícias</a> · <a href="index.html">Voltar ao início</a></p></div></div>';
      return;
    }

    document.title = n.titulo + " · " + site.sigla;
    definirDescricao(n.linhaFina);

    var i = NOTICIAS.indexOf(n);
    var anterior = NOTICIAS[i + 1], proxima = NOTICIAS[i - 1];
    var mesmas = NOTICIAS.filter(function (x) { return x !== n && x._cat.id === n._cat.id; });
    var outras = NOTICIAS.filter(function (x) { return x !== n && x._cat.id !== n._cat.id; });
    var relacionadas = mesmas.concat(outras).slice(0, 3);

    var yt = idYouTube(n.video);
    var topoMidia = yt
      ? '<figure class="artigo-capa"><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt + '" title="' + esc(n.titulo) +
        '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' +
        (n.legenda ? "<figcaption>" + esc(n.legenda) + "</figcaption>" : "") + "</figure>"
      : '<figure class="artigo-capa">' + midia(n, true, true) + (n.imagem && n.legenda ? "<figcaption>" + esc(n.legenda) + "</figcaption>" : "") + "</figure>";

    alvo.innerHTML =
      '<div class="container artigo-pagina"><div class="artigo-grade">' +
        '<article class="artigo"' + estiloCat(n._cat) + ">" +
          '<nav class="trilha" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">›</span>' +
            '<a href="' + urlCategoria(n._cat) + '">' + esc(n._cat.nome) + "</a></nav>" +
          '<header class="artigo-cabeca">' + chapeu(n._cat) +
            "<h1>" + esc(n.titulo) + "</h1>" +
            (n.linhaFina ? '<p class="linha-fina">' + esc(n.linhaFina) + "</p>" : "") +
            '<div class="artigo-assinatura"><div class="meta">' +
              (n.autor ? "<span>Por <strong>" + esc(n.autor) + "</strong></span>" : "") +
              (n._data ? "<span>" + icone("calendario") + '<time datetime="' + esc(n.data) + '">' + fmtLonga.format(n._data) + "</time></span>" : "") +
              "<span>" + icone("relogio") + minutosDeLeitura(n) + " min de leitura</span>" +
            "</div>" + compartilhar(n) + "</div>" +
          "</header>" +
          topoMidia +
          '<div class="artigo-corpo">' + corpo(n.texto) + "</div>" +
          (n.tags.length ? '<div class="etiquetas" aria-label="Assuntos">' + n.tags.map(function (t) {
            return '<a href="noticias.html?q=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>";
          }).join("") + "</div>" : "") +
          ((anterior || proxima) ? '<nav class="vizinhas" aria-label="Outras notícias">' +
            (anterior ? '<a href="' + urlNoticia(anterior) + '"><small>← Anterior</small><b>' + esc(anterior.titulo) + "</b></a>" : "<span></span>") +
            (proxima ? '<a class="proxima" href="' + urlNoticia(proxima) + '"><small>Próxima →</small><b>' + esc(proxima.titulo) + "</b></a>" : "") +
          "</nav>" : "") +
        "</article>" +
        '<aside class="coluna-lateral" aria-label="Destaques e agenda">' + blocoEssenciais(n.id) + blocoAgenda() + "</aside>" +
      "</div>" +
      (relacionadas.length ? '<section class="leia-tambem secao" aria-labelledby="t-leia"><div class="secao-titulo"><h2 id="t-leia">Leia também</h2>' +
        '<a href="' + urlCategoria(n._cat) + '">Mais de ' + esc(n._cat.nome) + icone("seta") + "</a></div>" +
        '<div class="cartoes">' + relacionadas.map(cartao).join("") + "</div></section>" : "") +
      "</div>";

    ligarCompartilhar(n);
  }

  /* ---- todas as notícias (arquivo e busca) ------------------------------ */

  // "genetica" encontra "genética": cada vogal aceita as versões acentuadas
  function regexTermo(termo) {
    var mapa = { a: "[aáàâãä]", e: "[eéèêë]", i: "[iíìîï]", o: "[oóòôõö]", u: "[uúùûü]", c: "[cç]" };
    return semAcento(termo).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[aeiouc]/g, function (l) { return mapa[l]; });
  }
  function destacar(texto, termos) {
    if (!termos.length) return esc(texto);
    var re = new RegExp("(" + termos.map(regexTermo).join("|") + ")", "gi");
    var partes = String(texto).split(re);
    return partes.map(function (p, i) { return i % 2 ? "<mark>" + esc(p) + "</mark>" : esc(p); }).join("");
  }

  function paginaArquivo() {
    var catId = (params.get("categoria") || "").trim();
    var cat = catId ? categoria(catId) : null;
    var cats = categoriasComNoticias();
    var alvo = $("#conteudo");

    var titulo = cat ? cat.nome : "Todas as notícias";
    document.title = titulo + " · " + site.sigla;
    definirDescricao(cat && cat.descricao ? cat.descricao : "Todas as notícias do " + site.sigla + ".");

    alvo.innerHTML =
      '<div class="container arquivo-cabeca"' + (cat ? estiloCat(cat) : "") + ">" +
        '<nav class="trilha" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">›</span>' +
          (cat ? '<a href="noticias.html">Notícias</a><span aria-hidden="true">›</span><span>' + esc(cat.nome) + "</span>" : "<span>Notícias</span>") + "</nav>" +
        (cat ? '<span class="chapeu">Seção</span>' : '<span class="chapeu">Arquivo</span>') +
        "<h1>" + esc(titulo) + "</h1>" +
        '<p class="arquivo-intro">' + esc(cat ? (cat.descricao || "Notícias da seção " + cat.nome + ".") : "Tudo o que o " + site.sigla + " publicou, da notícia mais recente à mais antiga.") + "</p>" +
        '<div class="filtros">' +
          '<nav class="chips" aria-label="Filtrar por seção">' +
            '<a class="chip" href="noticias.html"' + (!cat ? ' aria-current="page"' : "") + ">Todas <small>" + NOTICIAS.length + "</small></a>" +
            cats.map(function (c) {
              return '<a class="chip" href="' + urlCategoria(c) + '"' + (cat && c.id === cat.id ? ' aria-current="page"' : "") + ">" + esc(c.nome) + " <small>" + c.total + "</small></a>";
            }).join("") +
          "</nav>" +
          '<form class="busca-campo" role="search" action="noticias.html" method="get">' + icone("busca") +
            '<label class="sr" for="busca-arquivo">Buscar ' + (cat ? "em " + esc(cat.nome) : "notícias") + "</label>" +
            '<input id="busca-arquivo" name="q" type="search" autocomplete="off" placeholder="Buscar ' + (cat ? "em " + esc(cat.nome) : "notícias") + '…">' +
            (cat ? '<input type="hidden" name="categoria" value="' + esc(cat.id) + '">' : "") +
          "</form>" +
        "</div>" +
        '<p class="resultado-info" id="resultado-info" role="status" aria-live="polite"></p>' +
        '<ul class="lista-noticias" id="lista-noticias"></ul>' +
      "</div>";

    var campo = $("#busca-arquivo");
    campo.value = params.get("q") || "";

    function filtrar() {
      var q = campo.value.trim();
      var termos = semAcento(q).split(/\s+/).filter(Boolean);
      var lista = NOTICIAS.filter(function (n) {
        if (cat && n._cat.id !== cat.id) return false;
        if (!termos.length) return true;
        var alvoBusca = semAcento([n.titulo, n.linhaFina, n.autor, n._cat.nome, n.tags.join(" "), n.texto.join(" ")].join(" "));
        return termos.every(function (t) { return alvoBusca.indexOf(t) >= 0; });
      });

      $("#resultado-info").textContent = termos.length
        ? (lista.length ? lista.length + (lista.length === 1 ? " notícia encontrada" : " notícias encontradas") + " para “" + q + "”" : "")
        : lista.length + (lista.length === 1 ? " notícia" : " notícias");

      $("#lista-noticias").innerHTML = lista.length
        ? lista.map(function (n) {
            return "<li" + estiloCat(n._cat) + ">" + midia(n) +
              '<div class="texto">' + chapeu(n._cat) +
              '<h2><a class="titulo-link" href="' + urlNoticia(n) + '">' + destacar(n.titulo, termos) + "</a></h2>" +
              (n.linhaFina ? '<p class="linha-fina">' + destacar(n.linhaFina, termos) + "</p>" : "") +
              '<div class="meta">' + (n.autor ? "<span>Por <strong>" + esc(n.autor) + "</strong></span>" : "") +
              "<span>" + icone("relogio") + quando(n, "longa") + "</span></div></div></li>";
          }).join("")
        : '<li style="display:block;border:0"><div class="vazio"><h2>Nada encontrado</h2><p>' +
            (termos.length ? "Nenhuma notícia com “" + esc(q) + "”" + (cat ? " em " + esc(cat.nome) : "") + ". Tente outra palavra." : "Ainda não há notícias nesta seção.") +
            '</p><p style="margin-top:12px"><a href="noticias.html">Ver todas as notícias</a></p></div></li>';
      consertarImagens($("#lista-noticias"));

      // mantém a busca no endereço, para poder compartilhar o resultado
      var p = new URLSearchParams();
      if (cat) p.set("categoria", cat.id);
      if (q) p.set("q", q);
      var novo = "noticias.html" + (p.toString() ? "?" + p.toString() : "");
      try { history.replaceState(null, "", novo); } catch (e) { /* file:// em alguns navegadores */ }
    }

    var espera;
    campo.addEventListener("input", function () { clearTimeout(espera); espera = setTimeout(filtrar, 120); });
    campo.form.addEventListener("submit", function (e) { e.preventDefault(); filtrar(); });
    filtrar();
    return cat ? cat.id : null;
  }

  /* ---- 404 -------------------------------------------------------------- */

  function pagina404() {
    document.title = "Página não encontrada · " + site.sigla;
    var arte = { id: "404", _cat: categoria("germoplasma") };
    $("#conteudo").innerHTML =
      '<div class="container nao-achei"><div>' +
        '<div class="codigo">404</div>' +
        "<h1>Esta página não brotou.</h1>" +
        "<p>O endereço pode ter mudado, ou a página foi retirada do ar. As notícias continuam todas lá no portal.</p>" +
        '<div class="acoes"><a class="botao botao-primario" href="index.html">Ir para o início' + icone("seta") + '</a>' +
        '<a class="botao botao-contorno" href="noticias.html">Todas as notícias</a></div>' +
      "</div>" + '<div class="midia">' + capa(arte) + "</div></div>" +
      (NOTICIAS.length ? '<section class="secao container" aria-labelledby="t-recentes"><div class="secao-titulo"><h2 id="t-recentes">Notícias recentes</h2>' +
        '<a href="noticias.html">Ver todas' + icone("seta") + '</a></div><div class="cartoes">' + NOTICIAS.slice(0, 3).map(cartao).join("") + "</div></section>" : "");
  }

  /* ---- partida ---------------------------------------------------------- */

  if (!D || !Array.isArray(D.noticias)) {
    montarMoldura(null);
    mostrarErro();
    return;
  }

  if (D.essenciais) D.essenciais.forEach(function (id) { if (!POR_ID[id]) avisos.push("Em “essenciais”, não existe notícia com o id “" + id + "”."); });
  if (D.seeds && D.seeds.noticia && !POR_ID[D.seeds.noticia]) avisos.push("Em “seeds”, não existe notícia com o id “" + D.seeds.noticia + "”.");

  var catAtual = null;
  if (pagina === "noticia") paginaNoticia();
  else if (pagina === "arquivo") catAtual = paginaArquivo();
  else if (pagina === "404") pagina404();
  else if (pagina === "membros") paginaMembros();
  else if (pagina === "experimentos") paginaExperimentos();
  else paginaInicial();

  if (pagina === "noticia") { var atual = POR_ID[params.get("id") || ""]; catAtual = atual ? atual._cat.id : null; }
  montarMoldura(catAtual);
  consertarImagens(document);
  mostrarAvisos();

  // âncoras (#contato, #grupo...) vindas de outra página: o conteúdo só existe agora
  if (location.hash.length > 1) {
    var destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (destino) setTimeout(function () { destino.scrollIntoView(); }, 0);
  }
})();
