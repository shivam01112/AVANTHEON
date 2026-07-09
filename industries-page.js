document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = navLinks
        .map((link) => {
            const href = link.getAttribute("href") || "";

            if (!href.startsWith("#")) {
                return null;
            }

            return document.querySelector(href);
        })
        .filter(Boolean);

    const setHeaderState = () => {
        header?.classList.toggle("scrolled", window.scrollY > 24);
    };

    const closeMenu = () => {
        if (!menuToggle || !nav || !header) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        header.classList.remove("menu-active");
        document.body.classList.remove("menu-open");
    };

    menuToggle?.addEventListener("click", () => {
        if (!nav || !header) {
            return;
        }

        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("open", !isOpen);
        header.classList.toggle("menu-active", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    if (sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    const href = link.getAttribute("href");

                    if (!href?.startsWith("#")) {
                        return;
                    }

                    link.classList.toggle("active", href === `#${entry.target.id}`);
                });
            });
        }, {
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0
        });

        sections.forEach((section) => navObserver.observe(section));
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14
    });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const industries = {
        "shipping-logistics": {
            name: "Shipping & Logistics",
            eyebrow: "Industry Intelligence",
            subtitle: "Keeping Global Cargo Moving Efficiently",
            teaser: "Flexible container access for global logistics providers that need reliable equipment without slowing down cargo movement.",
            challenge: "Keeping containers available when demand suddenly changes while avoiding large upfront investments and delays that can disrupt cargo movement.",
            helps: "Avantheon provides flexible Container Leasing, Container Trading, and Lease-to-Own solutions, giving logistics companies quick access to containers whenever they need them without unnecessary capital investment.",
            benefits: [
                "Reliable container availability",
                "Lower capital investment",
                "Flexible fleet expansion",
                "Faster operations",
                "Scalable growth"
            ],
            solutions: [
                "Container Leasing",
                "Container Trading",
                "Lease-to-Own"
            ],
            applications: [
                "Cross-border logistics",
                "Fleet expansion",
                "Peak season demand",
                "Intermodal transportation"
            ],
            image: "images/oil&gas.png"
        },
        "nvoccs": {
            name: "NVOCCs",
            eyebrow: "Industry Intelligence",
            subtitle: "Infrastructure Built For Agile Freight Operations",
            teaser: "Scalable support for freight operators that need flexible equipment access without carrying a large owned fleet.",
            challenge: "Managing customer bookings without owning a large container fleet, while handling changing cargo volumes and controlling costs.",
            helps: "Avantheon helps NVOCCs access containers whenever they need them through flexible leasing and ownership options, allowing them to serve customers without making large capital investments.",
            benefits: [
                "Flexible equipment access",
                "Reduced capital expenditure",
                "Faster response to customer demand",
                "Scalable operations",
                "Reliable support"
            ],
            solutions: [
                "Container Leasing",
                "Container Trading",
                "Lease-to-Own"
            ],
            applications: [
                "Export consolidation",
                "Regional expansion",
                "Equipment balancing",
                "Customer-specific projects"
            ],
            image: "images/about.png"
        },
        "freight-forwarders": {
            name: "Freight Forwarders",
            eyebrow: "Industry Intelligence",
            subtitle: "Supporting Efficient End-to-End Logistics",
            teaser: "Container access designed for forwarders that need flexibility at any scale without minimum demand barriers.",
            challenge: "Many freight forwarders struggle to access containers when their shipment volumes are low. Larger volume requirements in the market can make it difficult for small and growing businesses to secure the equipment they need, limiting their ability to take on new business and grow with confidence.",
            helps: "Avantheon supports freight forwarders of every size with flexible Container Leasing and Lease-to-Own solutions without minimum demand requirements. Whether you need one container or an entire fleet, we help you access the equipment you need so you can serve your customers and expand confidently.",
            benefits: [
                "Improved service reliability",
                "Flexible leasing options",
                "Lower upfront investment",
                "Scalable operations",
                "Responsive support"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Consolidated freight",
                "International forwarding",
                "Seasonal logistics",
                "Multi-modal transportation"
            ],
            image: "images/Defense Logistics.png"
        },
        "import-export": {
            name: "Import & Export Enterprises",
            eyebrow: "Industry Intelligence",
            subtitle: "Simplifying International Trade Operations",
            teaser: "Reliable container access that protects cash flow and keeps cargo commitments moving across borders.",
            challenge: "Buying containers ties up valuable capital, while relying on limited equipment availability can delay shipments and affect customer commitments.",
            helps: "Avantheon provides flexible access to containers through leasing, trading, and ownership solutions, helping importers and exporters move cargo without large upfront costs.",
            benefits: [
                "Reliable container access",
                "Better cash flow",
                "Lower upfront investment",
                "Smooth cargo movement",
                "Greater flexibility"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own",
                "Container Trading"
            ],
            applications: [
                "International exports",
                "Import logistics",
                "Distribution hubs",
                "Regional trade"
            ],
            image: "images/hero.jpg"
        },
        "manufacturing-industrial": {
            name: "Manufacturing & Industrial Enterprises",
            eyebrow: "Industry Intelligence",
            subtitle: "Infrastructure That Supports Continuous Production",
            teaser: "Flexible container infrastructure for manufacturers that need dependable storage, transport, and operational continuity.",
            challenge: "Manufacturers need reliable containers for transporting and storing goods without disrupting production or investing heavily in logistics assets.",
            helps: "Avantheon provides flexible container solutions that help manufacturers move raw materials, store inventory, and transport finished goods efficiently.",
            benefits: [
                "Continuous operations",
                "Better inventory management",
                "Flexible storage",
                "Lower capital investment",
                "Reliable logistics support"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Factory logistics",
                "Raw material storage",
                "Finished goods transportation",
                "Industrial expansion"
            ],
            image: "images/mining.png"
        },
        "infrastructure-construction": {
            name: "Infrastructure & Construction Companies",
            eyebrow: "Industry Intelligence",
            subtitle: "Supporting Projects From Groundbreaking To Completion",
            teaser: "Durable, deployable container support for projects that move across sites and timelines.",
            challenge: "Construction projects require secure storage and transport solutions that can be deployed quickly across different project locations.",
            helps: "Avantheon supplies durable containers for storage, transportation, and long-term project use with flexible leasing and ownership options.",
            benefits: [
                "Secure site storage",
                "Quick deployment",
                "Flexible ownership options",
                "Durable container solutions",
                "Reliable project support"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Construction sites",
                "Infrastructure projects",
                "Remote operations",
                "Equipment storage"
            ],
            image: "images/contruction.png"
        },
        "supply-chain-distribution": {
            name: "Supply Chain & Distribution Networks",
            eyebrow: "Industry Intelligence",
            subtitle: "Strengthening Supply Chain Resilience",
            teaser: "Scalable container infrastructure that adapts quickly to customer demand and supply chain disruptions.",
            challenge: "Changing customer demand and supply chain disruptions require businesses to quickly increase or reduce container capacity without affecting operations.",
            helps: "Avantheon provides flexible container infrastructure that allows businesses to scale capacity as demand changes while keeping supply chains moving.",
            benefits: [
                "Increased flexibility",
                "Better business continuity",
                "Faster response to demand",
                "Scalable operations",
                "Reliable infrastructure"
            ],
            solutions: [
                "Container Leasing",
                "Container Trading"
            ],
            applications: [
                "Distribution centres",
                "Warehousing",
                "Retail logistics",
                "Regional distribution"
            ],
            image: "images/Defense Logistics.png"
        },
        "container-traders-fleet": {
            name: "Container Traders & Fleet Operators",
            eyebrow: "Industry Intelligence",
            subtitle: "Optimizing Container Assets For Maximum Value",
            teaser: "Commercially agile support for sourcing, leasing, trading, and repositioning container assets more effectively.",
            challenge: "Finding reliable equipment, managing fleet utilization, and buying or selling containers at the right time can be difficult in a changing market.",
            helps: "Avantheon helps businesses source, lease, and trade containers efficiently, improving fleet utilization and maximizing asset value.",
            benefits: [
                "Better fleet utilization",
                "Easier equipment sourcing",
                "Improved asset value",
                "Flexible commercial options",
                "Reliable market access"
            ],
            solutions: [
                "Container Trading",
                "Container Leasing"
            ],
            applications: [
                "Fleet expansion",
                "Asset repositioning",
                "Container resale",
                "Regional trading"
            ],
            image: "images/about.png"
        }
    };

    const detailPanel = document.getElementById("industry-detail-panel");
    const industryButtons = Array.from(document.querySelectorAll(".industry-node"));
    const defaultPanelMarkup = detailPanel?.innerHTML || "";
    let activeIndustryId = "";

    const escapeHtml = (value) => value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");

    const renderList = (items) => items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

    const getSummary = (value, limit = 150) => {
        const cleanValue = value.replace(/\s+/g, " ").trim();

        if (cleanValue.length <= limit) {
            return cleanValue;
        }

        const trimmedValue = cleanValue.slice(0, limit).replace(/\s+\S*$/, "");
        return `${trimmedValue.replace(/[,.:\s]+$/, "")}.`;
    };

    const setPanelState = (isActive) => {
        detailPanel?.classList.toggle("has-active-detail", isActive);
        detailPanel?.classList.toggle("is-default", !isActive);
    };

    const updateIndustryButtons = () => {
        industryButtons.forEach((button) => {
            const isActive = button.dataset.industry === activeIndustryId;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));

            const action = button.querySelector(".industry-node-action");
            if (action) {
                action.textContent = isActive ? "-" : "+";
            }
        });
    };

    const attachDetailEvents = () => {
        const closeButton = detailPanel?.querySelector(".industry-detail-close");

        closeButton?.addEventListener("click", () => {
            activeIndustryId = "";
            updateIndustryButtons();

            if (!detailPanel) {
                return;
            }

            detailPanel.classList.add("is-switching");
            window.setTimeout(() => {
                detailPanel.innerHTML = defaultPanelMarkup;
                setPanelState(false);
                detailPanel.classList.remove("is-switching");
            }, 160);
        });
    };

    const renderIndustryPanel = (industryId, animate = true) => {
        const industry = industries[industryId];

        if (!industry || !detailPanel) {
            return;
        }

        const updatePanel = () => {
            setPanelState(true);
            detailPanel.innerHTML = `
                <div class="industry-detail-active">
                    <button class="industry-detail-close" type="button" aria-label="Close industry details">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>
                    </button>
                    <div class="industry-detail-visual">
                        <img src="${industry.image}" alt="${escapeHtml(industry.name)} operations banner">
                        <div class="industry-detail-heading">
                            <p><span></span>${escapeHtml(industry.eyebrow)}</p>
                            <h3>${escapeHtml(industry.name)}</h3>
                            <span>${escapeHtml(industry.subtitle)}</span>
                        </div>
                    </div>
                    <div class="industry-detail-body">
                        <div class="industry-detail-columns">
                            <article class="industry-detail-column">
                                <h4>Industry Challenge</h4>
                                <p>${escapeHtml(getSummary(industry.challenge, 155))}</p>
                            </article>
                            <article class="industry-detail-column">
                                <h4>How Avantheon Helps</h4>
                                <p>${escapeHtml(getSummary(industry.helps, 165))}</p>
                            </article>
                            <article class="industry-detail-column">
                                <h4>Operational Outcome</h4>
                                <p>${escapeHtml(getSummary(industry.teaser, 150))}</p>
                            </article>
                        </div>
                        <div class="industry-detail-grid">
                            <article class="industry-detail-list">
                                <h4>Business Benefits</h4>
                                <ul>${renderList(industry.benefits)}</ul>
                            </article>
                            <article class="industry-detail-list">
                                <h4>Solutions Most Used</h4>
                                <ul>${renderList(industry.solutions)}</ul>
                            </article>
                            <article class="industry-detail-list">
                                <h4>Typical Applications</h4>
                                <ul>${renderList(industry.applications)}</ul>
                            </article>
                        </div>
                        <div class="industry-detail-footer">
                            <span>Container infrastructure tailored for this industry</span>
                            <a class="button button-gold industry-detail-cta" href="mailto:info@avantheon.com">Explore Solutions -&gt;</a>
                        </div>
                    </div>
                </div>
            `;

            detailPanel.classList.remove("is-switching");
            attachDetailEvents();
        };

        if (!animate) {
            updatePanel();
            return;
        }

        detailPanel.classList.add("is-switching");
        window.setTimeout(updatePanel, 160);
    };

    industryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const industryId = button.dataset.industry || "";

            if (!industryId || !industries[industryId]) {
                return;
            }

            if (activeIndustryId === industryId) {
                return;
            }

            activeIndustryId = industryId;
            updateIndustryButtons();
            renderIndustryPanel(industryId);
        });
    });

    updateIndustryButtons();
    setPanelState(false);

    const scroller = document.getElementById("application-scroller");
    const prevButton = document.querySelector(".application-nav-prev");
    const nextButton = document.querySelector(".application-nav-next");
    const dotsContainer = document.getElementById("application-dots");
    let pageCount = 1;
    let isApplicationDragging = false;
    let applicationDragStartX = 0;
    let applicationDragStartScroll = 0;

    const updateApplicationDots = () => {
        if (!scroller || !dotsContainer) {
            return;
        }

        const currentPage = Math.min(pageCount - 1, Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth)));
        const dots = Array.from(dotsContainer.children);

        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === currentPage);
        });

        if (prevButton) {
            prevButton.disabled = currentPage === 0;
        }

        if (nextButton) {
            nextButton.disabled = currentPage >= pageCount - 1;
        }
    };

    const buildApplicationDots = () => {
        if (!scroller || !dotsContainer) {
            return;
        }

        pageCount = Math.max(1, Math.ceil(scroller.scrollWidth / scroller.clientWidth));
        dotsContainer.innerHTML = "";

        for (let index = 0; index < pageCount; index += 1) {
            const dot = document.createElement("span");
            dot.className = "application-dot";
            dot.setAttribute("aria-hidden", "true");
            dotsContainer.append(dot);
        }

        updateApplicationDots();
    };

    const scrollApplications = (direction) => {
        if (!scroller) {
            return;
        }

        scroller.scrollBy({
            left: scroller.clientWidth * 0.82 * direction,
            behavior: "smooth"
        });
    };

    prevButton?.addEventListener("click", () => scrollApplications(-1));
    nextButton?.addEventListener("click", () => scrollApplications(1));

    scroller?.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) {
            return;
        }

        isApplicationDragging = true;
        applicationDragStartX = event.clientX;
        applicationDragStartScroll = scroller.scrollLeft;
        scroller.classList.add("is-dragging");
        scroller.setPointerCapture?.(event.pointerId);
    });

    scroller?.addEventListener("pointermove", (event) => {
        if (!isApplicationDragging || !scroller) {
            return;
        }

        const dragDistance = event.clientX - applicationDragStartX;
        scroller.scrollLeft = applicationDragStartScroll - dragDistance;
        window.requestAnimationFrame(updateApplicationDots);
    });

    const stopApplicationDrag = (event) => {
        if (!isApplicationDragging || !scroller) {
            return;
        }

        isApplicationDragging = false;
        scroller.classList.remove("is-dragging");
        scroller.releasePointerCapture?.(event.pointerId);
        updateApplicationDots();
    };

    scroller?.addEventListener("pointerup", stopApplicationDrag);
    scroller?.addEventListener("pointercancel", stopApplicationDrag);
    scroller?.addEventListener("pointerleave", stopApplicationDrag);

    scroller?.addEventListener("scroll", () => {
        window.requestAnimationFrame(updateApplicationDots);
    });

    window.addEventListener("resize", buildApplicationDots);
    buildApplicationDots();

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();
});
