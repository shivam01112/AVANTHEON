document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const setHeaderState = () => {
        header.classList.toggle("scrolled", window.scrollY > 24);
    };

    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        header.classList.remove("menu-active");
        document.body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("open", !isOpen);
        header.classList.toggle("menu-active", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
    });

    sections.forEach((section) => navObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.14
    });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    document.querySelectorAll(".type-button").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".type-button").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
        });
    });

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const value = entry.target;
            const target = Number(value.dataset.count || value.textContent.replace(/\D/g, ""));
            const suffix = value.dataset.suffix || "";
            const hasDecimal = !Number.isInteger(target);
            const duration = 900;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                value.textContent = `${hasDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
            observer.unobserve(value);
        });
    }, {
        threshold: 0.8
    });

    document.querySelectorAll("[data-count]").forEach((stat) => statObserver.observe(stat));

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();
});
