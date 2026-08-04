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
    const status = document.getElementById("contact-form-status");

    if (!form) {
        return;
    }

    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    const consent = form.querySelector('input[name="consent"]');
    const consentError = form.querySelector(".contact-consent-error");

    const isFieldValid = (field) => {
        if (field.type === "checkbox") {
            return field.checked;
        }

        return field.checkValidity() && field.value.trim() !== "";
    };

    const updateFieldState = (field) => {
        if (field.type === "checkbox") {
            consentError?.classList.toggle("is-visible", !field.checked);
            return field.checked;
        }

        const wrapper = field.closest(".contact-field");
        const isValid = isFieldValid(field);
        wrapper?.classList.toggle("is-invalid", !isValid);
        field.setAttribute("aria-invalid", String(!isValid));
        return isValid;
    };

    requiredFields.forEach((field) => {
        field.addEventListener("blur", () => updateFieldState(field));
        field.addEventListener(field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input", () => {
            if (field.type === "checkbox" || field.closest(".contact-field")?.classList.contains("is-invalid")) {
                updateFieldState(field);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const invalidFields = requiredFields.filter((field) => !updateFieldState(field));

        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            status?.classList.remove("is-visible");
            return;
        }

        const data = new FormData(form);
        const subject = `Avantheon Enquiry - ${data.get("interest")}`;
        const body = [
            "Hello Avantheon Team,",
            "",
            "I would like to submit the following business enquiry:",
            "",
            `Name: ${data.get("name")}`,
            `Company: ${data.get("company") || "Not provided"}`,
            `Email: ${data.get("email")}`,
            `Phone: ${data.get("phone") || "Not provided"}`,
            `Country / Market: ${data.get("country") || "Not provided"}`,
            `Solution: ${data.get("interest")}`,
            `Estimated Quantity: ${data.get("quantity") || "Not provided"}`,
            "",
            "Requirement:",
            data.get("message"),
            "",
            "Regards,",
            data.get("name")
        ].join("\n");

        if (status) {
            status.textContent = "Your enquiry is ready. Your email application will open so you can review and send it.";
            status.classList.add("is-visible");
        }

        window.location.href = `mailto:info@avantheon.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
});
