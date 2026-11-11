/* GRAPHdan multi-page interactions. Configure contact details before publishing. */
const CONTACT_SETTINGS = {
  // Digits only, including country code. Example Nigeria: 2348012345678
  whatsappNumber: "2348147679678",
  emailAddress: "danielolukunle4@gmail.com"
};

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const year = document.getElementById("current-year");
  const form = document.getElementById("project-form");
  const formMessage = document.getElementById("form-message");
  const whatsappLink = document.getElementById("whatsapp-link");
  const emailLink = document.getElementById("email-link");
  const dialog = document.getElementById("project-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogClose = document.querySelector(".dialog-close");
  const serviceSelect = document.getElementById("service");

  if (year) year.textContent = new Date().getFullYear();
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 800) closeMenu(); });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("is-visible"));

  // Portfolio filters work only on the portfolio page where these controls exist.
  const filterButtons = document.querySelectorAll(".filter-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    portfolioItems.forEach(item => { item.hidden = filter !== "all" && item.dataset.category !== filter; });
  }));

  document.querySelectorAll(".portfolio-open").forEach(button => button.addEventListener("click", () => {
    if (!dialog || !dialogTitle || !dialogDescription) return;
    dialogTitle.textContent = button.dataset.title || "Project preview";
    dialogDescription.textContent = button.dataset.description || "Project details.";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.alert(`${dialogTitle.textContent}\n\n${dialogDescription.textContent}`);
  }));
  dialogClose?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  const hasWhatsApp = () => /^\d{8,15}$/.test(CONTACT_SETTINGS.whatsappNumber);
  const hasEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_SETTINGS.emailAddress);
  if (whatsappLink) {
    if (hasWhatsApp()) {
      whatsappLink.href = `https://wa.me/${CONTACT_SETTINGS.whatsappNumber}`;
      whatsappLink.target = "_blank"; whatsappLink.rel = "noopener noreferrer";
      whatsappLink.removeAttribute("aria-disabled");
    } else {
      whatsappLink.href = "#"; whatsappLink.setAttribute("aria-disabled", "true");
      whatsappLink.title = "Configure your WhatsApp number in js/script.js";
      whatsappLink.addEventListener("click", event => { event.preventDefault(); showMessage("WhatsApp is not configured yet. Add your number in js/script.js.", "error"); });
    }
  }
  if (emailLink) {
    if (hasEmail()) { emailLink.href = `mailto:${CONTACT_SETTINGS.emailAddress}`; emailLink.removeAttribute("aria-disabled"); }
    else {
      emailLink.href = "#"; emailLink.setAttribute("aria-disabled", "true");
      emailLink.title = "Configure your email address in js/script.js";
      emailLink.addEventListener("click", event => { event.preventDefault(); showMessage("Email is not configured yet. Add your address in js/script.js.", "error"); });
    }
  }
  function showMessage(message, type = "") {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`.trim();
  }
  // A service can be preselected using contact.html?service=Website%20Development.
  if (serviceSelect) {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested) {
      const option = [...serviceSelect.options].find(item => item.value.toLowerCase() === requested.toLowerCase() || item.textContent.trim().toLowerCase() === requested.toLowerCase());
      if (option) serviceSelect.value = option.value;
    }
  }
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) { showMessage("Please complete all required fields with a valid email address.", "error"); return; }
    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const service = serviceSelect?.value || "Other";
    const details = document.getElementById("details")?.value.trim() || "";
    const subject = encodeURIComponent(`GRAPHdan project enquiry — ${service}`);
    const body = `Hello GRAPHdan,\n\nI'd like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${details}\n`;
    if (hasWhatsApp()) {
      showMessage("WhatsApp is opening with your project message prepared. Review it and press Send in WhatsApp. This website does not send it automatically.", "success");
      const waBody = encodeURIComponent(`Hello GRAPHdan! I'd like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${details}`);
      window.open(`https://wa.me/${CONTACT_SETTINGS.whatsappNumber}?text=${waBody}`, "_blank", "noopener,noreferrer");
    } else if (hasEmail()) {
      showMessage("Your email app is opening with the message prepared. Review it and press Send in your email app; this website does not send it automatically.", "success");
      window.location.href = `mailto:${CONTACT_SETTINGS.emailAddress}?subject=${subject}&body=${encodeURIComponent(body)}`;
    } else {
      showMessage("Your details are valid, but no contact destination is configured. Add your WhatsApp number or email address in js/script.js before using the form.", "error");
    }
  });
});
