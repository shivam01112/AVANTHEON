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

    const serviceCards = Array.from(document.querySelectorAll(".service-card"));
    const enableServiceCardTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resetServiceCardTilt = (card) => {
        card.style.setProperty("--card-rotate-x", "0deg");
        card.style.setProperty("--card-rotate-y", "0deg");
        card.style.setProperty("--card-shine-x", "50%");
        card.style.setProperty("--card-shine-y", "20%");
        card.classList.remove("is-tilting");
    };

    serviceCards.forEach((card) => {
        resetServiceCardTilt(card);

        if (!enableServiceCardTilt) {
            return;
        }

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const relativeX = (event.clientX - rect.left) / rect.width;
            const relativeY = (event.clientY - rect.top) / rect.height;
            const rotateY = (relativeX - 0.5) * 16;
            const rotateX = (0.5 - relativeY) * 14;

            card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
            card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
            card.style.setProperty("--card-shine-x", `${(relativeX * 100).toFixed(2)}%`);
            card.style.setProperty("--card-shine-y", `${(relativeY * 100).toFixed(2)}%`);
            card.classList.add("is-tilting");
        });

        card.addEventListener("pointerleave", () => {
            resetServiceCardTilt(card);
        });

        card.addEventListener("pointercancel", () => {
            resetServiceCardTilt(card);
        });
    });

    const catalogueSection = document.getElementById("container-catalogue");

    if (catalogueSection) {
        const autoAdvanceDelayMs = 8000;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stage = catalogueSection.querySelector("[data-catalogue-stage]");
        const stageImage = catalogueSection.querySelector(".catalogue-hero-image");
        const activeLabel = catalogueSection.querySelector("[data-catalogue-active]");
        const activeMeta = catalogueSection.querySelector("[data-catalogue-active-meta]");
        const descriptionLabel = catalogueSection.querySelector("[data-catalogue-description]");
        const stageType = catalogueSection.querySelector("[data-catalogue-stage-type]");
        const stageMeta = catalogueSection.querySelector("[data-catalogue-stage-meta]");
        const usageLabel = catalogueSection.querySelector("[data-catalogue-usage]");
        const specsWrap = catalogueSection.querySelector("[data-catalogue-specs]");
        const activePosition = catalogueSection.querySelector("[data-catalogue-position]");
        const activeTotal = catalogueSection.querySelector("[data-catalogue-total]");
        const autoAdvanceLabel = catalogueSection.querySelector("[data-catalogue-auto-interval]");
        const rail = catalogueSection.querySelector("[data-catalogue-rail]");
        const cards = Array.from(catalogueSection.querySelectorAll(".catalogue-card"));
        const prevButton = catalogueSection.querySelector("[data-catalogue-nav=\"prev\"]");
        const nextButton = catalogueSection.querySelector("[data-catalogue-nav=\"next\"]");
        let activeIndex = Math.max(cards.findIndex((card) => card.classList.contains("active")), 0);
        let autoAdvanceEnabled = cards.length > 1;
        let autoAdvanceTimer = 0;
        let transitionTimer = 0;

        if (activeTotal) {
            activeTotal.textContent = String(cards.length).padStart(2, "0");
        }

        if (autoAdvanceLabel) {
            autoAdvanceLabel.textContent = `Auto-updating every ${autoAdvanceDelayMs / 1000} seconds`;
        }

        const renderSpecs = (list) => {
            if (!specsWrap) {
                return;
            }

            const fragment = document.createDocumentFragment();

            list.forEach((spec) => {
                const item = document.createElement("span");
                item.textContent = spec;
                fragment.appendChild(item);
            });

            specsWrap.replaceChildren(fragment);
        };

        const scheduleAutoAdvance = () => {
            if (!autoAdvanceEnabled) {
                return;
            }

            window.clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = window.setTimeout(() => {
                applyCatalogueState(activeIndex + 1);
            }, autoAdvanceDelayMs);
        };

        const applyCatalogueState = (index, options = {}) => {
            if (!cards.length) {
                return;
            }

            const { userTriggered = false, shouldScrollRail = true } = options;
            const normalizedIndex = (index + cards.length) % cards.length;
            const selectedCard = cards[normalizedIndex];
            const specs = (selectedCard.dataset.specs || "")
                .split("|")
                .map((value) => value.trim())
                .filter(Boolean);

            activeIndex = normalizedIndex;
            stage?.classList.add("is-transitioning");

            cards.forEach((card, cardIndex) => {
                const isActive = cardIndex === normalizedIndex;
                card.classList.toggle("active", isActive);
                card.setAttribute("aria-pressed", String(isActive));
            });

            window.clearTimeout(transitionTimer);
            transitionTimer = window.setTimeout(() => {
                if (activeLabel) {
                    activeLabel.textContent = selectedCard.dataset.type || "";
                }

                if (descriptionLabel) {
                    descriptionLabel.textContent = selectedCard.dataset.description || "";
                }

                if (activeMeta) {
                    activeMeta.textContent = selectedCard.dataset.stageMeta || "";
                }

                if (stageType) {
                    stageType.textContent = selectedCard.dataset.type || "";
                }

                if (stageMeta) {
                    stageMeta.textContent = selectedCard.dataset.stageMeta || "";
                }

                if (usageLabel) {
                    usageLabel.textContent = selectedCard.dataset.usage || "";
                }

                if (activePosition) {
                    activePosition.textContent = String(normalizedIndex + 1).padStart(2, "0");
                }

                if (stageImage) {
                    stageImage.alt = `${selectedCard.dataset.type || "AVANTHEON"} shipping container with AVANTHEON branding`;
                    if (selectedCard.dataset.image) {
                        stageImage.src = selectedCard.dataset.image;
                    }
                }

                renderSpecs(specs);
                stage?.classList.remove("is-transitioning");
            }, prefersReducedMotion ? 0 : 150);

            if (rail && shouldScrollRail) {
                const nextLeft = selectedCard.offsetLeft - ((rail.clientWidth - selectedCard.clientWidth) / 2);

                rail.scrollTo({
                    left: Math.max(nextLeft, 0),
                    behavior: prefersReducedMotion ? "auto" : "smooth"
                });
            }

            if (userTriggered) {
                autoAdvanceEnabled = cards.length > 1;
            }

            scheduleAutoAdvance();
        };

        prevButton?.addEventListener("click", () => {
            applyCatalogueState(activeIndex - 1, { userTriggered: true });
        });

        nextButton?.addEventListener("click", () => {
            applyCatalogueState(activeIndex + 1, { userTriggered: true });
        });

        cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                applyCatalogueState(index, { userTriggered: true });
            });
        });

        applyCatalogueState(activeIndex, { shouldScrollRail: false });
    }

    const networkMapElement = document.getElementById("global-network-map");
    const vectorMapTooltip = document.getElementById("network-map-tooltip");
    const vectorMapPins = Array.from(document.querySelectorAll(".vector-map-pin"));

    const showVectorMapTooltip = (pin) => {
        if (!pin || !vectorMapTooltip) {
            return;
        }

        const wrap = pin.closest(".network-map-wrap");
        const title = pin.dataset.location || "";

        vectorMapTooltip.innerHTML = `<strong>${title}</strong>`;

        if (wrap) {
            const wrapRect = wrap.getBoundingClientRect();
            const pinRect = pin.getBoundingClientRect();
            const tooltipWidth = Math.min(vectorMapTooltip.getBoundingClientRect().width || vectorMapTooltip.scrollWidth || 0, wrapRect.width - 28);
            const rawLeft = pinRect.left - wrapRect.left + pinRect.width / 2;
            const rawTop = pinRect.top - wrapRect.top;
            const left = Math.min(Math.max(rawLeft, tooltipWidth / 2 + 14), wrapRect.width - tooltipWidth / 2 - 14);
            const top = Math.max(rawTop - 68, 16);

            vectorMapTooltip.style.setProperty("--vector-tooltip-left", `${left}px`);
            vectorMapTooltip.style.setProperty("--vector-tooltip-top", `${top}px`);
        }

        vectorMapTooltip.classList.add("is-visible");
        vectorMapPins.forEach((item) => item.classList.toggle("is-active", item === pin));
    };

    const hideVectorMapTooltip = () => {
        if (!vectorMapTooltip) {
            return;
        }

        vectorMapTooltip.classList.remove("is-visible");
        vectorMapPins.forEach((item) => item.classList.remove("is-active"));
    };

    vectorMapPins.forEach((pin) => {
        pin.addEventListener("mouseenter", () => showVectorMapTooltip(pin));
        pin.addEventListener("focus", () => showVectorMapTooltip(pin));
        pin.addEventListener("mouseleave", hideVectorMapTooltip);
        pin.addEventListener("blur", hideVectorMapTooltip);
    });

    if (networkMapElement && window.jsVectorMap) {
        const networkMapWrap = networkMapElement.closest(".network-map-wrap");
        const mapOptions = {
            selector: "#global-network-map",
            map: "world",
            backgroundColor: "transparent",
            zoomButtons: false,
            zoomOnScroll: false,
            draggable: false,
            regionStyle: {
                initial: {
                    fill: "#33577F",
                    stroke: "rgba(255, 255, 255, 0.18)",
                    strokeWidth: 0.7,
                    fillOpacity: 0.82
                },
                hover: {
                    fill: "#3E6A98",
                    cursor: "default"
                }
            },
            onRegionTooltipShow(event) {
                event.preventDefault();
            }
        };

        try {
            const networkMap = new jsVectorMap(mapOptions);
            networkMapElement.classList.add("is-ready");
            networkMapWrap?.classList.add("map-ready");

            window.addEventListener("resize", () => {
                networkMap.updateSize?.();
            });
        } catch (error) {
            networkMapElement.classList.add("is-ready", "is-fallback");
            networkMapWrap?.classList.add("map-ready");
            console.warn("jsVectorMap could not initialize.", error);
        }
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
