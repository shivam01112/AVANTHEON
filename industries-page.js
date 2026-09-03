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

    const processSection = document.getElementById("process");
    const processTrack = processSection?.querySelector(".about-process-track");
    const processSteps = Array.from(processSection?.querySelectorAll(".about-process-step") || []);
    const processTimeline = processSection?.querySelector(".process-timeline");
    const processTimelineSteps = Array.from(processSection?.querySelectorAll(".process-timeline-step") || []);
    const processRouteSparks = Array.from(processSection?.querySelectorAll(".process-route-spark") || []);

    if (processSection && processTrack && processTimeline && processSteps.length > 0) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stepDurationMs = 3000;
        const routeTravelDurationMs = 900;
        let activeProcessIndex = 0;
        let processTimer = 0;
        let processTransitionTimer = 0;
        let pendingProcessIndex = null;
        let processIsVisible = false;

        const updateProcessRoute = (index) => {
            const lastStepIndex = processSteps.length - 1;
            const progress = lastStepIndex > 0 ? index / lastStepIndex : 1;
            const runnerPosition = 12.5 + (progress * 75);

            processTimeline.style.setProperty("--process-progress", progress.toFixed(4));
            processTimeline.style.setProperty("--runner-position", `${runnerPosition}%`);
            processTimeline.dataset.activeStep = String(index + 1);

            processRouteSparks.forEach((spark, segmentIndex) => {
                spark.classList.toggle("is-complete-segment", segmentIndex < index - 1);
                spark.classList.toggle("is-active-segment", segmentIndex === index - 1);
            });
        };

        const renderProcessStates = (index) => {
            activeProcessIndex = index;

            processSteps.forEach((step, stepIndex) => {
                const isActive = stepIndex === index;
                step.classList.toggle("is-active-step", isActive);
                step.classList.toggle("is-complete-step", stepIndex < index);

                if (isActive) {
                    step.setAttribute("aria-current", "step");
                } else {
                    step.removeAttribute("aria-current");
                }
            });

            processTimelineSteps.forEach((step, stepIndex) => {
                const isActive = stepIndex === index;
                step.classList.toggle("is-active-step", isActive);
                step.classList.toggle("is-complete-step", stepIndex < index);
                step.setAttribute("aria-pressed", String(isActive));
            });
        };

        const applyProcessStep = (index) => {
            updateProcessRoute(index);
            renderProcessStates(index);
        };

        const advanceProcess = () => {
            const nextIndex = (activeProcessIndex + 1) % processSteps.length;

            if (nextIndex === 0) {
                processTimeline.classList.add("is-resetting");
                applyProcessStep(0);

                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => processTimeline.classList.remove("is-resetting"));
                });
                return;
            }

            pendingProcessIndex = nextIndex;
            processTimeline.classList.add("is-advancing");
            updateProcessRoute(nextIndex);
            window.clearTimeout(processTransitionTimer);
            processTransitionTimer = window.setTimeout(() => {
                renderProcessStates(nextIndex);
                pendingProcessIndex = null;
                processTransitionTimer = 0;
                processTimeline.classList.remove("is-advancing");
            }, routeTravelDurationMs);
        };

        const stopProcess = () => {
            window.clearInterval(processTimer);
            processTimer = 0;

            if (processTransitionTimer) {
                window.clearTimeout(processTransitionTimer);
                processTransitionTimer = 0;
            }

            if (pendingProcessIndex !== null) {
                renderProcessStates(pendingProcessIndex);
                pendingProcessIndex = null;
            }

            processTimeline.classList.remove("is-running");
            processTimeline.classList.remove("is-advancing");
        };

        const startProcess = () => {
            if (prefersReducedMotion || processTimer || !processIsVisible || document.hidden) {
                return;
            }

            processTimeline.classList.add("is-running");
            processTimer = window.setInterval(advanceProcess, stepDurationMs);
        };

        applyProcessStep(0);

        processTimelineSteps.forEach((step, stepIndex) => {
            step.addEventListener("click", () => {
                stopProcess();
                applyProcessStep(stepIndex);
                startProcess();
            });
        });

        if (!prefersReducedMotion) {
            const processObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    processIsVisible = entry.isIntersecting;

                    if (processIsVisible) {
                        startProcess();
                    } else {
                        stopProcess();
                    }
                });
            }, {
                threshold: 0.22
            });

            processObserver.observe(processSection);

            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    stopProcess();
                } else {
                    startProcess();
                }
            });
        }
    }

    const industries = {
        "shipping-logistics": {
            name: "Shipping & Logistics",
            eyebrow: "Industry Intelligence",
            subtitle: "Keeping Global Cargo Moving Efficiently",
            teaser: "Flexible container access for global logistics providers that need reliable equipment without slowing down cargo movement.",
            challenge: "Managing changing container demand, seasonal peaks and evolving trade lanes while keeping equipment available without tying up capital in an oversized fleet.",
            helps: "Flexible Container Leasing, Container Trading and Lease-to-Own solutions provide equipment for new routes, peak demand and fleet expansion without a large upfront purchase.",
            benefits: [
                "Reliable container availability",
                "Flexible fleet capacity",
                "Lower capital exposure",
                "Faster response to demand",
                "Scalable growth"
            ],
            solutions: [
                "Container Leasing",
                "Container Trading",
                "Lease-to-Own"
            ],
            applications: [
                "New trade lanes",
                "Peak demand",
                "Fleet expansion",
                "Intermodal transportation"
            ],
            image: "images/Industry-Intelligence-Hub/SHIPPING.png"
        },
        "nvoccs": {
            name: "NVOCCs",
            eyebrow: "Industry Intelligence",
            subtitle: "Infrastructure Built For Agile Freight Operations",
            teaser: "Scalable support for freight operators that need flexible equipment access without carrying a large owned fleet.",
            challenge: "NVOCCs must manage changing cargo volumes and customer requirements without operating their own vessel fleet. Limited container access can complicate consolidation, delay bookings and increase costs.",
            helps: "Flexible Container Leasing, Container Trading and Lease-to-Own options provide equipment for consolidated loads, peak demand and new customer requirements without significant upfront fleet investment.",
            benefits: [
                "Dependable equipment access",
                "Flexible capacity",
                "Lower capital exposure",
                "Faster response to demand",
                "Scalable operations"
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
                "Customer projects"
            ],
            image: "images/Industry-Intelligence-Hub/NVOCCS.png"
        },
        "freight-forwarders": {
            name: "Freight Forwarders",
            eyebrow: "Industry Intelligence",
            subtitle: "Supporting Efficient End-to-End Logistics",
            teaser: "Container access designed for forwarders that need flexibility at any scale without minimum demand barriers.",
            challenge: "Growing freight forwarders may not have predictable volumes on every trade lane. Sourcing containers booking by booking can delay confirmations, limit consolidation opportunities and restrict new business.",
            helps: "Avantheon removes the equipment-side minimum-demand barrier. Container Leasing and Lease-to-Own provide access based on actual requirements, from individual containers to larger fleet needs, without fixed volume commitments.",
            benefits: [
                "Flexible equipment access",
                "Improved service reliability",
                "Lower upfront investment",
                "Faster response to demand",
                "Scalable capacity"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Consolidated freight",
                "International forwarding",
                "Seasonal shipments",
                "Multi-modal transportation"
            ],
            image: "images/Industry-Intelligence-Hub/FREIGHT-FORWARDERS.png"
        },
        "import-export": {
            name: "Import & Export Enterprises",
            eyebrow: "Industry Intelligence",
            subtitle: "Simplifying International Trade Operations",
            teaser: "Reliable container access that protects cash flow and keeps cargo commitments moving across borders.",
            challenge: "Importers and exporters depend on specific cargo-ready and delivery dates. Container shortages can cause missed cut-offs, warehouse delays and customer disruption, while ownership can unnecessarily tie up capital.",
            helps: "Flexible Container Leasing, Container Trading and Lease-to-Own solutions provide equipment for individual shipments, seasonal requirements and expanding trade lanes without a large upfront purchase.",
            benefits: [
                "Reliable container access",
                "Better dispatch planning",
                "Lower capital requirements",
                "Fewer equipment-related delays",
                "Flexible capacity growth"
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
            image: "images/Industry-Intelligence-Hub/IMPORT-AND-EXPORT.png"
        },
        "manufacturing-industrial": {
            name: "Manufacturing & Industrial Enterprises",
            eyebrow: "Industry Intelligence",
            subtitle: "Infrastructure That Supports Continuous Production",
            teaser: "Flexible container infrastructure for manufacturers that need dependable storage, transport, and operational continuity.",
            challenge: "Manufacturers depend on reliable movement and storage of raw materials, inventory and finished goods. Container shortages can disrupt production, consume factory space and put customer deliveries at risk.",
            helps: "Flexible container solutions support raw-material movements, inventory overflow, storage and finished-goods dispatch. Businesses can add equipment during peaks or expansion without purchasing a fleet for temporary demand.",
            benefits: [
                "Reliable material flow",
                "Smoother goods dispatch",
                "Flexible storage capacity",
                "Reduced capital tied to equipment",
                "Support for production growth"
            ],
            solutions: [
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Factory logistics",
                "Raw-material storage",
                "Inventory overflow",
                "Finished-goods transportation"
            ],
            image: "images/Industry-Intelligence-Hub/Manufacturing-Industrial.png"
        },
        "infrastructure-construction": {
            name: "Infrastructure & Construction Companies",
            eyebrow: "Industry Intelligence",
            subtitle: "Supporting Projects From Groundbreaking To Completion",
            teaser: "Durable, deployable container support for projects that move across sites and timelines.",
            challenge: "Construction and infrastructure projects require secure storage and material staging before permanent facilities are available. Equipment requirements can also change throughout mobilisation, construction and completion.",
            helps: "Flexible Container Leasing and Lease-to-Own solutions support site storage, material staging and project transport. Companies can deploy equipment when needed, add capacity as projects expand and avoid idle assets between projects.",
            benefits: [
                "Rapid site deployment",
                "Secure on-site storage",
                "Flexible project capacity",
                "Better material control",
                "Reduced investment in underused assets"
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
            image: "images/Industry-Intelligence-Hub/Infrastructure-Construction.png"
        },
        "supply-chain-distribution": {
            name: "Supply Chain & Distribution Networks",
            eyebrow: "Industry Intelligence",
            subtitle: "Strengthening Supply Chain Resilience",
            teaser: "Scalable container infrastructure that adapts quickly to customer demand and supply chain disruptions.",
            challenge: "Distribution networks must respond to seasonal peaks, supplier delays and uneven regional demand. When container capacity is unavailable where needed, inbound goods can back up and outbound dispatches can be delayed.",
            helps: "Flexible Container Leasing, Container Trading and Lease-to-Own solutions allow businesses to increase capacity where demand rises without purchasing equipment for every potential peak.",
            benefits: [
                "Flexible network capacity",
                "Fewer storage bottlenecks",
                "Faster response to demand",
                "Better inventory flow",
                "Scalable infrastructure"
            ],
            solutions: [
                "Container Leasing",
                "Container Trading",
                "Lease-to-Own"
            ],
            applications: [
                "Distribution centres",
                "Warehousing",
                "Retail logistics",
                "Regional distribution"
            ],
            image: "images/Industry-Intelligence-Hub/Supply-Chain-Distribution.png"
        },
        "container-traders-fleet": {
            name: "Container Traders & Fleet Operators",
            eyebrow: "Industry Intelligence",
            subtitle: "Optimizing Container Assets For Maximum Value",
            teaser: "Commercially agile support for sourcing, leasing, trading, and repositioning container assets more effectively.",
            challenge: "Container traders and fleet operators must balance equipment availability, utilization, location and capital. Buying too many units creates idle inventory, while buying too few can mean missed sales and costly sourcing.",
            helps: "Avantheon combines Container Trading, Leasing and Lease-to-Own to align equipment decisions with market demand. Trading supports fleet changes, Leasing covers short-term needs and Lease-to-Own supports gradual fleet growth.",
            benefits: [
                "Better fleet utilization",
                "Flexible equipment sourcing",
                "Reduced idle inventory",
                "Greater capital flexibility",
                "Improved asset value"
            ],
            solutions: [
                "Container Trading",
                "Container Leasing",
                "Lease-to-Own"
            ],
            applications: [
                "Fleet expansion",
                "Asset repositioning",
                "Container resale",
                "Regional trading"
            ],
            image: "images/Industry-Intelligence-Hub/Container-Traders-Fleet.png"
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
                                <p>${escapeHtml(getSummary(industry.challenge, 230))}</p>
                            </article>
                            <article class="industry-detail-column">
                                <h4>How Avantheon Helps</h4>
                                <p>${escapeHtml(getSummary(industry.helps, 240))}</p>
                            </article>
                            <article class="industry-detail-column">
                                <h4>Operational Outcome</h4>
                                <p>${escapeHtml(getSummary(industry.teaser, 108))}</p>
                            </article>
                        </div>
                        <div class="industry-detail-grid">
                            <article class="industry-detail-list">
                                <h4>Operational Advantage</h4>
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
                            <a class="button button-gold industry-detail-cta" href="contact.html#enquiry-form">Explore Solutions -&gt;</a>
                        </div>
                    </div>
                </div>
            `;

            detailPanel.classList.remove("is-switching");
            attachDetailEvents();

            if (window.matchMedia("(max-width: 1180px)").matches) {
                const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                window.requestAnimationFrame(() => {
                    detailPanel.scrollIntoView({
                        behavior: reduceMotion ? "auto" : "smooth",
                        block: "start"
                    });
                });
            }
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
    let applicationPagePositions = [0];
    let activeApplicationPage = 0;
    let isApplicationDragging = false;
    let applicationDragStartX = 0;
    let applicationDragStartScroll = 0;
    let applicationScrollFrame = 0;
    let applicationResizeFrame = 0;
    let applicationTargetPage = null;

    const closestApplicationPage = () => {
        if (!scroller) {
            return 0;
        }

        return applicationPagePositions.reduce((closestIndex, position, index) => {
            const closestDistance = Math.abs(scroller.scrollLeft - applicationPagePositions[closestIndex]);
            const currentDistance = Math.abs(scroller.scrollLeft - position);
            return currentDistance < closestDistance ? index : closestIndex;
        }, 0);
    };

    const updateApplicationControls = (requestedPage) => {
        if (!scroller || !dotsContainer) {
            return;
        }

        activeApplicationPage = Number.isInteger(requestedPage) ? requestedPage : closestApplicationPage();
        const dots = Array.from(dotsContainer.children);

        dots.forEach((dot, index) => {
            const isActive = index === activeApplicationPage;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });

        if (prevButton) {
            prevButton.disabled = applicationPagePositions.length <= 1;
        }

        if (nextButton) {
            nextButton.disabled = applicationPagePositions.length <= 1;
        }
    };

    const buildApplicationDots = () => {
        if (!scroller || !dotsContainer) {
            return;
        }

        const card = scroller.querySelector(".application-card");
        const cardWidth = card?.getBoundingClientRect().width || scroller.clientWidth;
        const scrollerStyles = window.getComputedStyle(scroller);
        const cardGap = Number.parseFloat(scrollerStyles.columnGap || scrollerStyles.gap) || 0;
        const cardSpan = Math.max(1, cardWidth + cardGap);
        const visibleCardCount = Math.max(1, Math.floor((scroller.clientWidth + cardGap) / cardSpan));
        const pageStep = Math.max(cardSpan, visibleCardCount * cardSpan);
        const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

        applicationPagePositions = [0];

        while (applicationPagePositions[applicationPagePositions.length - 1] < maxScroll) {
            const nextPosition = Math.min(maxScroll, applicationPagePositions[applicationPagePositions.length - 1] + pageStep);

            if (nextPosition === applicationPagePositions[applicationPagePositions.length - 1]) {
                break;
            }

            applicationPagePositions.push(nextPosition);
        }

        dotsContainer.innerHTML = "";

        applicationPagePositions.forEach((position, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "application-dot";
            dot.setAttribute("aria-label", `Show application group ${index + 1} of ${applicationPagePositions.length}`);
            dot.addEventListener("click", () => scrollApplicationsToPage(index));
            dotsContainer.append(dot);
        });

        activeApplicationPage = Math.min(activeApplicationPage, applicationPagePositions.length - 1);
        applicationTargetPage = null;
        scroller.scrollLeft = applicationPagePositions[activeApplicationPage];
        updateApplicationControls(activeApplicationPage);
    };

    const scrollApplicationsToPage = (pageIndex) => {
        if (!scroller) {
            return;
        }

        const pageTotal = applicationPagePositions.length;
        const targetPage = ((pageIndex % pageTotal) + pageTotal) % pageTotal;
        activeApplicationPage = targetPage;
        applicationTargetPage = targetPage;
        updateApplicationControls(targetPage);

        scroller.scrollTo({
            left: applicationPagePositions[targetPage],
            behavior: "smooth"
        });
    };

    const scrollApplications = (direction) => {
        scrollApplicationsToPage(activeApplicationPage + direction);
    };

    prevButton?.addEventListener("click", () => scrollApplications(-1));
    nextButton?.addEventListener("click", () => scrollApplications(1));

    scroller?.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
        }

        event.preventDefault();
        scrollApplications(event.key === "ArrowLeft" ? -1 : 1);
    });

    scroller?.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) {
            return;
        }

        isApplicationDragging = true;
        applicationTargetPage = null;
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
        window.cancelAnimationFrame(applicationScrollFrame);
        applicationScrollFrame = window.requestAnimationFrame(() => updateApplicationControls());
    });

    const stopApplicationDrag = (event) => {
        if (!isApplicationDragging || !scroller) {
            return;
        }

        isApplicationDragging = false;
        scroller.classList.remove("is-dragging");
        scroller.releasePointerCapture?.(event.pointerId);
        scrollApplicationsToPage(closestApplicationPage());
    };

    scroller?.addEventListener("pointerup", stopApplicationDrag);
    scroller?.addEventListener("pointercancel", stopApplicationDrag);
    scroller?.addEventListener("pointerleave", stopApplicationDrag);

    scroller?.addEventListener("scroll", () => {
        window.cancelAnimationFrame(applicationScrollFrame);
        applicationScrollFrame = window.requestAnimationFrame(() => {
            if (Number.isInteger(applicationTargetPage)) {
                const targetPosition = applicationPagePositions[applicationTargetPage];

                if (Math.abs(scroller.scrollLeft - targetPosition) < 2) {
                    applicationTargetPage = null;
                }

                updateApplicationControls(activeApplicationPage);
                return;
            }

            updateApplicationControls();
        });
    });

    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(applicationResizeFrame);
        applicationResizeFrame = window.requestAnimationFrame(buildApplicationDots);
    });
    buildApplicationDots();

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();
});
