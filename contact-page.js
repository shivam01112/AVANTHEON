document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");

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

    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const form = document.getElementById("contact-form");
    const formShell = document.getElementById("contact-form-shell");
    const successPanel = document.getElementById("contact-success");
    const stepper = document.querySelector(".contact-stepper");
    const track = document.getElementById("contact-steps-track");
    const messageField = document.getElementById("contact-message");
    const messageCount = document.getElementById("message-count");
    const stepPanels = Array.from(document.querySelectorAll(".contact-step-panel"));
    const stepIndicators = Array.from(document.querySelectorAll("[data-step-indicator]"));
    const stepLines = Array.from(document.querySelectorAll("[data-step-line]"));
    const stepsViewport = document.querySelector(".contact-steps-viewport");

    if (!form || !track) {
        return;
    }

    let currentStep = 1;
    let maxVisitedStep = 1;

    const syncStepHeight = () => {
        if (!stepsViewport) {
            return;
        }

        const activePanel = stepPanels.find((panel) => Number(panel.dataset.step) === currentStep);
        if (!activePanel) {
            return;
        }

        stepsViewport.style.height = `${activePanel.scrollHeight}px`;
    };

    const updateMessageCount = () => {
        if (!messageField || !messageCount) {
            return;
        }

        messageCount.textContent = String(messageField.value.length);
    };

    messageField?.addEventListener("input", updateMessageCount);
    updateMessageCount();

    const getStepFields = (step) => {
        const panel = stepPanels.find((item) => Number(item.dataset.step) === step);
        if (!panel) {
            return [];
        }

        return Array.from(panel.querySelectorAll("[required]"));
    };

    const isFieldValid = (field) => {
        if (field.type === "checkbox") {
            return field.checked;
        }

        if (field.type === "radio") {
            return Boolean(form.querySelector(`input[name="${field.name}"]:checked`));
        }

        if (field.type === "number") {
            return field.value.trim() !== "" && Number(field.value) > 0;
        }

        return field.checkValidity() && field.value.trim() !== "";
    };

    const updateFieldState = (field) => {
        if (field.type === "radio") {
            const wrapper = field.closest(".contact-field");
            const groupValid = isFieldValid(field);
            wrapper?.classList.toggle("is-invalid", !groupValid);
            return groupValid;
        }

        if (field.type === "checkbox") {
            const consentError = form.querySelector(".contact-consent-error");
            consentError?.classList.toggle("is-visible", !field.checked);
            return field.checked;
        }

        const wrapper = field.closest(".contact-field");
        const isValid = isFieldValid(field);
        wrapper?.classList.toggle("is-invalid", !isValid);
        field.setAttribute("aria-invalid", String(!isValid));
        return isValid;
    };

    const validateStep = (step) => {
        const fields = getStepFields(step);
        const checkedGroups = new Set();
        let firstInvalid = null;

        fields.forEach((field) => {
            if (field.type === "radio") {
                if (checkedGroups.has(field.name)) {
                    return;
                }

                checkedGroups.add(field.name);
            }

            const isValid = updateFieldState(field);

            if (!isValid && !firstInvalid) {
                firstInvalid = field.type === "radio"
                    ? form.querySelector(`input[name="${field.name}"]`)
                    : field;
            }
        });

        firstInvalid?.focus();
        return !firstInvalid;
    };

    const updateStepUI = () => {
        track.style.transform = `translateX(-${(currentStep - 1) * (100 / stepPanels.length)}%)`;

        stepIndicators.forEach((item) => {
            const step = Number(item.dataset.stepIndicator);
            item.classList.toggle("is-active", step === currentStep);
            item.classList.toggle("is-complete", step < currentStep);
            item.setAttribute("aria-selected", String(step === currentStep));
            if (step === currentStep) {
                item.setAttribute("aria-current", "step");
            } else {
                item.removeAttribute("aria-current");
            }
        });

        stepLines.forEach((line) => {
            const lineStep = Number(line.dataset.stepLine);
            line.classList.toggle("is-complete", lineStep < currentStep);
        });

        stepPanels.forEach((panel) => {
            const isActive = Number(panel.dataset.step) === currentStep;
            panel.classList.toggle("is-active", isActive);
            panel.setAttribute("aria-hidden", String(!isActive));
            panel.inert = !isActive;
        });

        window.requestAnimationFrame(syncStepHeight);
    };

    const goToStep = (targetStep) => {
        if (targetStep < 1 || targetStep > stepPanels.length || targetStep === currentStep) {
            return;
        }

        if (targetStep > currentStep) {
            for (let step = currentStep; step < targetStep; step += 1) {
                if (!validateStep(step)) {
                    return;
                }
            }
        }

        currentStep = targetStep;
        maxVisitedStep = Math.max(maxVisitedStep, currentStep);
        updateStepUI();

        const activePanel = stepPanels.find((panel) => Number(panel.dataset.step) === currentStep);
        const firstField = activePanel?.querySelector("input, select, textarea, button");
        firstField?.focus({ preventScroll: true });

        if (window.innerWidth <= 720) {
            document.querySelector(".contact-enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    form.querySelectorAll("[required]").forEach((field) => {
        const eventName = field.tagName === "SELECT" || field.type === "checkbox" || field.type === "radio"
            ? "change"
            : "input";

        field.addEventListener("blur", () => updateFieldState(field));
        field.addEventListener(eventName, () => {
            if (field.type === "checkbox" || field.type === "radio" || field.closest(".contact-field")?.classList.contains("is-invalid")) {
                updateFieldState(field);
            }
        });
    });

    form.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.action;

            if (action === "next") {
                goToStep(currentStep + 1);
                return;
            }

            if (action === "prev") {
                goToStep(currentStep - 1);
            }
        });
    });

    stepIndicators.forEach((indicator) => {
        indicator.addEventListener("click", () => {
            const targetStep = Number(indicator.dataset.stepIndicator);

            if (targetStep <= maxVisitedStep || targetStep <= currentStep) {
                currentStep = targetStep;
                maxVisitedStep = Math.max(maxVisitedStep, currentStep);
                updateStepUI();
                return;
            }

            goToStep(targetStep);
        });
    });

    document.querySelectorAll(".contact-faq-item").forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) {
                return;
            }

            document.querySelectorAll(".contact-faq-item[open]").forEach((openItem) => {
                if (openItem !== item) {
                    openItem.removeAttribute("open");
                }
            });
        });
    });

    const showSuccess = () => {
        formShell?.classList.add("is-hidden");
        stepper?.setAttribute("hidden", "");
        successPanel?.removeAttribute("hidden");
        successPanel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        const submitButton = form.querySelector(".contact-submit");
        submitButton?.setAttribute("disabled", "true");

        showSuccess();
    });

    updateStepUI();
    syncStepHeight();
    window.addEventListener("resize", syncStepHeight, { passive: true });
});
