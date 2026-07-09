document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = navLinks
        .map((link) => {
            const href = link.getAttribute("href") || "";
            return href.startsWith("#") ? document.querySelector(href) : null;
        })
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
                const href = link.getAttribute("href") || "";
                link.classList.toggle("active", href === `#${entry.target.id}`);
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

    const networkMapElement = document.getElementById("global-network-map");
    const mapTooltip = document.getElementById("network-map-tooltip");
    const mapPins = Array.from(document.querySelectorAll(".map-pin"));

    const showMapTooltip = (pin) => {
        if (!mapTooltip || !pin) {
            return;
        }

        const title = pin.dataset.location || pin.textContent.trim();
        const detail = pin.dataset.detail || "";
        mapTooltip.innerHTML = `<strong>${title}</strong>${detail}`;
        mapTooltip.classList.add("is-visible");
        mapPins.forEach((item) => item.classList.toggle("is-active", item === pin));
    };

    const hideMapTooltip = () => {
        if (!mapTooltip) {
            return;
        }

        mapTooltip.classList.remove("is-visible");
        mapPins.forEach((item) => item.classList.remove("is-active"));
    };

    mapPins.forEach((pin) => {
        pin.addEventListener("mouseenter", () => showMapTooltip(pin));
        pin.addEventListener("focus", () => showMapTooltip(pin));
        pin.addEventListener("mouseleave", hideMapTooltip);
        pin.addEventListener("blur", hideMapTooltip);
    });

    if (networkMapElement && window.L) {
        const networkMapWrap = networkMapElement.closest(".network-map-wrap");

        const networkMap = L.map(networkMapElement, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false
        }).setView([18, 25], 2);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 5,
            minZoom: 2
        }).addTo(networkMap);

        const mapLocations = [
            { label: "Europe", detail: "Regional access across European trade corridors", coords: [50.1109, 8.6821] },
            { label: "Asia", detail: "Procurement and container movement across Asian gateways", coords: [23.5, 103.8] },
            { label: "Middle East - UAE Hub", detail: "Primary coordination hub for global container solutions", coords: [25.2048, 55.2708] },
            { label: "Africa", detail: "Connected trade support for African supply networks", coords: [-1.2921, 36.8219] },
            { label: "South America", detail: "Container access across South American trade markets", coords: [-23.5505, -46.6333] }
        ];

        const hub = mapLocations[2].coords;

        mapLocations.forEach((location) => {
            const isHub = location.label.includes("UAE");
            const marker = L.circleMarker(location.coords, {
                radius: isHub ? 8 : 5,
                color: "#FFFFFF",
                weight: 3,
                fillColor: isHub ? "#B8902B" : "#D4AF37",
                fillOpacity: 0.92,
                className: "leaflet-network-marker"
            }).addTo(networkMap);

            marker.bindTooltip(`<strong>${location.label}</strong><br>${location.detail}`, {
                direction: "top",
                offset: [0, -10],
                opacity: 1,
                className: "leaflet-network-tooltip"
            });

            if (!isHub) {
                L.polyline([hub, location.coords], {
                    color: "#D4AF37",
                    weight: 1.6,
                    opacity: 0.5,
                    dashArray: "7 11",
                    className: "leaflet-network-route"
                }).addTo(networkMap);
            }
        });

        networkMapElement.classList.add("is-ready");
        networkMapWrap?.classList.add("map-ready");
    }

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
