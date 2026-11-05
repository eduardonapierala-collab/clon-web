/* =========================================================
   Editor de banners: sustituye imágenes en caliente sin tocar
   el HTML. También acepta arrastrar y soltar sobre cada banner.
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const panel = $("#banner-panel");
  const openBtn = $("#open-panel");
  const closeBtn = $("#close-panel");
  const guidesToggle = $("#guides-toggle");
  const toastEl = $("#toast");

  const objectUrls = new Map();

  /* ---------- Utilidades ---------- */

  function slotsFor(name) {
    return $$('[data-banner="' + name + '"]');
  }

  function applyBanner(name, url) {
    slotsFor(name).forEach((el) => {
      if (el.tagName === "SOURCE") {
        el.setAttribute("srcset", url);
      } else {
        el.setAttribute("src", url);
      }
    });
  }

  function resetBanner(name) {
    slotsFor(name).forEach((el) => {
      if (el.tagName === "SOURCE") {
        el.setAttribute("srcset", el.dataset.defaultSrcset || "");
      } else {
        el.setAttribute("src", el.dataset.defaultSrc || "");
      }
    });

    const url = objectUrls.get(name);
    if (url) {
      URL.revokeObjectURL(url);
      objectUrls.delete(name);
    }
  }

  function labelFor(name) {
    const input = $('input[data-slot="' + name + '"]');
    const strong = input && input.closest(".slot")?.querySelector(".slot-head strong");
    return strong ? strong.textContent.trim() : name;
  }

  let toastTimer = null;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  /* ---------- Guardar valores originales ---------- */

  $$("[data-banner]").forEach((el) => {
    if (el.tagName === "SOURCE") {
      el.dataset.defaultSrcset = el.getAttribute("srcset") || "";
    } else {
      el.dataset.defaultSrc = el.getAttribute("src") || "";
    }
  });

  /* ---------- Cargar una imagen en un slot ---------- */

  function useFile(name, file) {
    if (!file || !file.type.startsWith("image/")) {
      toast("El archivo no es una imagen");
      return;
    }

    const previous = objectUrls.get(name);
    const url = URL.createObjectURL(file);

    applyBanner(name, url);
    objectUrls.set(name, url);

    // Liberamos la URL anterior un poco después, cuando ya no se está pintando.
    if (previous) {
      setTimeout(() => URL.revokeObjectURL(previous), 4000);
    }

    toast("Banner actualizado: " + labelFor(name));
  }

  /* ---------- Inputs del panel ---------- */

  $$("input[data-slot]").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (file) useFile(input.dataset.slot, file);
      input.value = "";
    });
  });

  $$("[data-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.reset;
      resetBanner(name);
      toast("Restaurado: " + labelFor(name));
    });
  });

  const resetAllBtn = $("#reset-all");
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
      const names = new Set($$("[data-banner]").map((el) => el.dataset.banner));
      names.forEach(resetBanner);
      toast("Todos los banners restaurados");
    });
  }

  /* ---------- Arrastrar y soltar sobre los banners ---------- */

  $$("[data-drop]").forEach((zone) => {
    const names = zone.dataset.drop.split(",").map((s) => s.trim()).filter(Boolean);

    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));

    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("dragover");

      const files = Array.from(event.dataTransfer ? event.dataTransfer.files : []);
      const image = files.find((f) => f.type.startsWith("image/"));
      if (!image) return;

      names.forEach((name) => useFile(name, image));
    });
  });

  /* ---------- Panel ---------- */

  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
  }

  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  }

  openBtn.addEventListener("click", () => {
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  });
  closeBtn.addEventListener("click", closePanel);

  /* ---------- Guías ---------- */

  function setGuides(on) {
    document.body.classList.toggle("guides", on);
    if (guidesToggle) guidesToggle.checked = on;
  }

  if (guidesToggle) {
    guidesToggle.addEventListener("change", () => setGuides(guidesToggle.checked));
  }

  document.addEventListener("keydown", (event) => {
    const typing = event.target.closest("input, textarea, select");

    if (event.key === "Escape" && panel.classList.contains("open")) {
      closePanel();
      return;
    }

    if (!typing && (event.key === "g" || event.key === "G")) {
      setGuides(!document.body.classList.contains("guides"));
    }
  });

  /* ---------- Carrusel: ocultar controles si solo hay un banner ---------- */

  $$(".hero-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".uk-slideshow-items > li");
    if (slides.length < 2) slider.classList.add("is-single");
  });

  /* ---------- Buscador (simulado, sin recargar) ---------- */

  $$(".topbar-search").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  /* ---------- Iconos UIkit ---------- */
  // UIkit arranca antes de cargar su librería de iconos, así que los <span uk-icon>
  // que ya están en el HTML se quedan sin SVG. Los inicializamos a mano.
  if (window.UIkit && window.UIkit.icon) {
    $$("[uk-icon]").forEach((el) => {
      if (!el.querySelector("svg")) window.UIkit.icon(el);
    });
  }

  /* ---------- Enlaces de mentira (vista previa) ---------- */

  $$('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
})();
