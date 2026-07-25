document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setHeaderState = () => {
        header?.classList.toggle("scrolled", window.scrollY > 24);
    };

    const closeMenu = () => {
        if (!menuToggle || !nav || !header) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
        header.classList.remove("menu-active");
        document.body.classList.remove("menu-open");
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        nav?.classList.toggle("open", !isOpen);
        header?.classList.toggle("menu-active", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
    });

    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const solutions = {
        leasing: {
            number: "01",
            eyebrow: "Featured Solution · Container Leasing",
            title: "Stay Flexible. Scale With Demand.",
            overview: "Access dependable container capacity for short-term projects, seasonal peaks, or long-term operations—without tying up capital in assets you do not need to own.",
            need: "Respond quickly to changing volumes without carrying the cost and responsibility of ownership.",
            solution: "Flexible short- and long-term leasing terms backed by responsive access to quality equipment.",
            impact: "Protect working capital, maintain agility, and scale your fleet in step with real demand.",
            ideal: "Importers, exporters, project operators, and businesses with changing equipment demand.",
            benefits: [
                "Short and long-term options",
                "Lower upfront investment",
                "Fast container deployment",
                "Flexible fleet scaling"
            ],
            image: "images/solution-leasing.png",
            alt: "Blue containers in a flexible leasing yard at dusk",
            tag: "Flexible Capacity. Lower Capital Pressure.",
            cta: "Request A Leasing Quote",
            icon: "fa-calendar-days"
        },
        trading: {
            number: "02",
            eyebrow: "Featured Solution · Container Trading",
            title: "Procure Smarter. Trade With Confidence.",
            overview: "Source quality containers through a dependable global network with transparent commercial terms, responsive execution, and support from procurement through delivery.",
            need: "Secure dependable equipment at the right specification, price, location, and timeline.",
            solution: "Strategic sourcing and trading support that connects your business to verified container supply.",
            impact: "Expand your fleet with confidence, clearer commercial visibility, and reliable global execution.",
            ideal: "Businesses that need direct procurement, clear specifications, and immediate asset control.",
            benefits: [
                "Global procurement network",
                "Quality-assured sourcing",
                "Transparent commercial terms",
                "Reliable delivery support"
            ],
            image: "images/solution-trading.png",
            alt: "A teal container handled at an active global trading terminal",
            tag: "Global Sourcing. Trusted Trading.",
            cta: "Request A Trading Quote",
            icon: "fa-arrow-right-arrow-left"
        },
        "lease-to-own": {
            number: "03",
            eyebrow: "Featured Solution · Lease-to-Own",
            title: "Own Tomorrow. Operate Today.",
            overview: "Access the containers you need now through structured payments that create a clear path to ownership—without placing unnecessary pressure on working capital.",
            need: "Expand container capacity while preserving capital for core business priorities.",
            solution: "Structured commercial terms that convert regular payments into long-term asset ownership.",
            impact: "Build lasting fleet value without the burden of a large upfront purchase.",
            ideal: "Operators planning fleet growth with cash flow and ownership working together.",
            benefits: [
                "Minimal upfront investment",
                "Structured payments",
                "Ownership at term end",
                "Scalable asset growth"
            ],
            image: "images/solution-lease-to-own.png",
            alt: "A golden container representing a flexible path to ownership",
            tag: "Build Ownership. Preserve Cash Flow.",
            cta: "Request A Quote",
            icon: "fa-star"
        }
    };

    const solutionCards = Array.from(document.querySelectorAll(".solution-card[data-solution]"));
    const comparisonCards = Array.from(document.querySelectorAll(".comparison-card"));
    const featuredPanel = document.querySelector(".featured-solution");
    const featuredImage = document.querySelector("[data-featured-image]");
    const featuredEyebrow = document.querySelector("[data-featured-eyebrow]");
    const featuredTitle = document.querySelector("[data-featured-title]");
    const featuredNumber = document.querySelector("[data-featured-number]");
    const featuredOverview = document.querySelector("[data-featured-overview]");
    const featuredNeed = document.querySelector("[data-featured-need]");
    const featuredSolution = document.querySelector("[data-featured-solution]");
    const featuredImpact = document.querySelector("[data-featured-impact]");
    const featuredIdeal = document.querySelector("[data-featured-ideal]");
    const featuredBenefits = document.querySelector("[data-featured-benefits]");
    const featuredTag = document.querySelector(".featured-media-tag");
    const featuredCta = document.querySelector("[data-featured-cta]");
    let activeSolution = "lease-to-own";
    let transitionTimer = 0;

    const updateSolution = (solutionKey, options = {}) => {
        const { scrollToPanel = false } = options;
        const solution = solutions[solutionKey];

        if (!solution || !featuredPanel) {
            return;
        }

        activeSolution = solutionKey;

        solutionCards.forEach((card) => {
            const isActive = card.dataset.solution === solutionKey;
            card.classList.toggle("is-active", isActive);
            card.setAttribute("aria-selected", String(isActive));
            card.tabIndex = isActive ? 0 : -1;
        });

        comparisonCards.forEach((card) => {
            const isActive = card.dataset.solution === solutionKey;
            card.classList.toggle("is-active", isActive);
            card.setAttribute("aria-pressed", String(isActive));
        });

        featuredPanel.classList.add("is-changing");
        window.clearTimeout(transitionTimer);

        const applyContent = () => {
            if (featuredImage) {
                featuredImage.src = solution.image;
                featuredImage.alt = solution.alt;
            }

            if (featuredEyebrow) featuredEyebrow.textContent = solution.eyebrow;
            if (featuredTitle) featuredTitle.textContent = solution.title;
            if (featuredNumber) featuredNumber.textContent = solution.number;
            if (featuredOverview) featuredOverview.textContent = solution.overview;
            if (featuredNeed) featuredNeed.textContent = solution.need;
            if (featuredSolution) featuredSolution.textContent = solution.solution;
            if (featuredImpact) featuredImpact.textContent = solution.impact;
            if (featuredIdeal) featuredIdeal.textContent = solution.ideal;
            if (featuredTag) {
                featuredTag.innerHTML = `<i class="fa-solid ${solution.icon}" aria-hidden="true"></i> ${solution.tag}`;
            }
            if (featuredCta) featuredCta.innerHTML = `${solution.cta} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;

            if (featuredBenefits) {
                featuredBenefits.replaceChildren(...solution.benefits.map((benefit) => {
                    const item = document.createElement("span");
                    item.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${benefit}`;
                    return item;
                }));
            }

            featuredPanel.dataset.activeSolution = solutionKey;
            featuredPanel.classList.remove("is-changing");
        };

        if (prefersReducedMotion) {
            applyContent();
        } else {
            transitionTimer = window.setTimeout(applyContent, 180);
        }

        if (scrollToPanel) {
            window.setTimeout(() => {
                featuredPanel.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "center"
                });
            }, prefersReducedMotion ? 0 : 220);
        }
    };

    solutionCards.forEach((card, index) => {
        card.addEventListener("click", () => updateSolution(card.dataset.solution, { scrollToPanel: true }));
        card.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                return;
            }

            event.preventDefault();
            let targetIndex = index;

            if (event.key === "ArrowLeft") targetIndex = (index - 1 + solutionCards.length) % solutionCards.length;
            if (event.key === "ArrowRight") targetIndex = (index + 1) % solutionCards.length;
            if (event.key === "Home") targetIndex = 0;
            if (event.key === "End") targetIndex = solutionCards.length - 1;

            solutionCards[targetIndex].focus();
            updateSolution(solutionCards[targetIndex].dataset.solution);
        });
    });

    comparisonCards.forEach((card) => {
        card.addEventListener("click", () => updateSolution(card.dataset.solution, { scrollToPanel: true }));
    });

    const comparisonExperience = document.querySelector("[data-comparison]");
    const comparisonFilters = Array.from(document.querySelectorAll("[data-comparison-filter]"));
    const comparisonWinners = {
        upfront: ["leasing", "lease-to-own"],
        flexibility: ["leasing"],
        ownership: ["lease-to-own"],
        value: ["trading", "lease-to-own"]
    };

    const updateComparisonFilter = (filterKey) => {
        const winners = comparisonWinners[filterKey];
        if (!comparisonExperience || !winners) return;

        comparisonExperience.dataset.activeFilter = filterKey;
        comparisonFilters.forEach((filter) => {
            const isActive = filter.dataset.comparisonFilter === filterKey;
            filter.classList.toggle("is-active", isActive);
            filter.setAttribute("aria-selected", String(isActive));
        });
        comparisonCards.forEach((card) => {
            card.classList.toggle("is-filter-match", winners.includes(card.dataset.solution));
            card.classList.toggle("is-filter-muted", !winners.includes(card.dataset.solution));
        });
    };

    comparisonFilters.forEach((filter) => {
        filter.addEventListener("click", () => updateComparisonFilter(filter.dataset.comparisonFilter));
    });
    updateComparisonFilter("upfront");

    document.querySelectorAll("[data-footer-solution]").forEach((link) => {
        link.addEventListener("click", () => updateSolution(link.dataset.footerSolution));
    });

    const finderForm = document.querySelector("[data-finder-form]");
    const finderResult = document.querySelector("[data-finder-result]");
    const finderReason = document.querySelector("[data-finder-reason]");
    const finderExplore = document.querySelector("[data-finder-explore]");
    const finderProgress = Array.from(document.querySelectorAll(".finder-progress span"));
    const finderResultIcon = document.querySelector(".finder-result-icon i");
    const finderNames = {
        leasing: "Container Leasing",
        trading: "Container Trading",
        "lease-to-own": "Lease-to-Own"
    };
    const finderReasons = {
        leasing: "Keep capacity flexible, move quickly, and avoid unnecessary capital commitment.",
        trading: "Take immediate ownership through transparent, quality-assured container procurement.",
        "lease-to-own": "Build asset value over time while keeping your upfront investment low."
    };
    const finderIcons = {
        leasing: "fa-calendar-days",
        trading: "fa-arrow-right-arrow-left",
        "lease-to-own": "fa-star"
    };
    let recommendedSolution = "lease-to-own";

    const updateFinder = () => {
        if (!finderForm) {
            return;
        }

        const formData = new FormData(finderForm);
        const answers = ["goal", "timeline", "budget"]
            .map((field) => formData.get(field))
            .filter(Boolean);
        const scores = { leasing: 0, trading: 0, "lease-to-own": 0 };

        answers.forEach((answer) => {
            if (scores[answer] !== undefined) {
                scores[answer] += 1;
            }
        });

        recommendedSolution = Object.keys(scores).reduce((best, key) => (
            scores[key] > scores[best] ? key : best
        ), "lease-to-own");

        if (finderResult) finderResult.textContent = finderNames[recommendedSolution];
        if (finderReason) finderReason.textContent = finderReasons[recommendedSolution];

        if (finderResultIcon) {
            finderResultIcon.className = `fa-solid ${finderIcons[recommendedSolution]}`;
        }

        finderProgress.forEach((step, index) => {
            step.classList.toggle("is-complete", index < answers.length);
        });
    };

    finderForm?.addEventListener("change", updateFinder);
    finderExplore?.addEventListener("click", () => {
        updateSolution(recommendedSolution, { scrollToPanel: true });
    });
    updateFinder();

    updateSolution(activeSolution);
});
