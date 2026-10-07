/* MELARE Construção Civil — interações do site */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Ano atual no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Títulos palavra por palavra ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var base = parseFloat(el.getAttribute("data-split-delay") || "0");
    var index = 0;
    var walk = function (node, innerClass) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            var outer = document.createElement("span");
            outer.className = "split-word";
            var inner = document.createElement("span");
            if (innerClass) inner.className = innerClass;
            inner.textContent = part;
            inner.style.setProperty("--delay", (base + index * 0.07).toFixed(2) + "s");
            outer.appendChild(inner);
            frag.appendChild(outer);
            index++;
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          // o gradiente dourado precisa ficar na própria palavra animada
          var cls = innerClass;
          if (child.classList.contains("gold-gradient-text")) {
            child.classList.remove("gold-gradient-text");
            cls = "gold-gradient-text";
          }
          walk(child, cls);
        }
      });
    };
    walk(el);
  });

  /* ---------- Animações ao rolar ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-split]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Atraso escalonado para grupos de itens */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var step = parseFloat(group.getAttribute("data-stagger")) || 0.1;
    group.querySelectorAll(":scope > [data-reveal]").forEach(function (el, i) {
      el.style.setProperty("--delay", (i * step).toFixed(2) + "s");
    });
  });

  /* ---------- Contadores animados ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    var duration = 1800;
    var start = null;
    var tick = function (now) {
      if (!start) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Brilho que segue o mouse nos cards ---------- */
  if (finePointer) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    /* Inclinação 3D suave */
    if (!reduceMotion) {
      document.querySelectorAll("[data-tilt]").forEach(function (el) {
        el.style.transformStyle = "preserve-3d";
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform =
            "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg) translateY(-6px)";
        });
        el.addEventListener("pointerleave", function () {
          el.style.transform = "";
        });
      });
    }
  }

  /* ---------- Cabeçalho, progresso, parallax e linha do tempo ---------- */
  var header = document.querySelector(".site-header");
  var progressBar = document.querySelector(".scroll-progress");
  var toTop = document.querySelector(".to-top");
  var parallaxEls = reduceMotion ? [] : document.querySelectorAll("[data-parallax]");
  var timeline = document.querySelector("[data-timeline]");
  var navLinks = document.querySelectorAll(".nav-link[href*='#']");
  var firstSection = document.getElementById("etapas");
  var lastY = window.scrollY;
  var ticking = false;

  var onScroll = function () {
    var y = window.scrollY;
    var max = doc.scrollHeight - window.innerHeight;
    var progress = max > 0 ? y / max : 0;

    if (header) {
      header.classList.toggle("is-scrolled", y > 24);
      var menuOpen = header.classList.contains("menu-open");
      header.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove("is-hidden");
    }
    if (progressBar) progressBar.style.setProperty("--progress", progress.toFixed(4));
    if (toTop) {
      toTop.classList.toggle("is-visible", y > 700);
      toTop.style.setProperty("--progress", progress.toFixed(4));
    }

    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      var r = el.parentElement.getBoundingClientRect();
      var offset = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
      // a imagem tem 15% de zoom: o deslocamento não pode passar dessa sobra
      var limit = r.height * 0.07;
      offset = Math.max(-limit, Math.min(limit, offset));
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0) scale(1.15)";
    });

    if (timeline) {
      var tr = timeline.getBoundingClientRect();
      var t = (window.innerHeight * 0.85 - tr.top) / (tr.height + window.innerHeight * 0.3);
      timeline.style.setProperty("--timeline", Math.max(0, Math.min(1, t)).toFixed(3));
    }

    // no topo da página nenhum item do menu fica ativo
    if (navLinks.length && firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * 0.5) {
      navLinks.forEach(function (link) {
        link.classList.remove("is-active");
      });
    }

    lastY = y;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.getElementById("mobile-menu");
  var setMenu = function (open) {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mobileMenu.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* ---------- Link ativo conforme a seção visível ---------- */
  if (navLinks.length && "IntersectionObserver" in window) {
    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").split("#")[1];
      var sec = id && document.getElementById(id);
      if (sec && sections.indexOf(sec) === -1) sections.push(sec);
    });
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href").split("#")[1] === entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  /* ---------- Balão do WhatsApp ---------- */
  var bubble = document.querySelector(".wa-bubble");
  if (bubble) {
    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("melare-wa-bubble") === "1";
    } catch (e) {}
    if (!dismissed) {
      setTimeout(function () {
        bubble.classList.add("is-visible");
      }, 4500);
    }
    var close = bubble.querySelector(".wa-bubble-close");
    if (close) {
      close.addEventListener("click", function () {
        bubble.classList.remove("is-visible");
        try {
          sessionStorage.setItem("melare-wa-bubble", "1");
        } catch (e) {}
      });
    }
  }
})();
