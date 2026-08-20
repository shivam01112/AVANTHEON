document.addEventListener("DOMContentLoaded", () => {
    const config = window.AVANTHEON_CONNECT;

    if (!config) {
        return;
    }

    const path = window.location.pathname;
    const base = /\/connect\//.test(path) ? "../" : "";

    const resolvePath = (value) => {
        if (!value || /^https?:\/\//.test(value) || value.startsWith("mailto:") || value.startsWith("tel:")) {
            return value;
        }

        return `${base}${value.replace(/^\//, "")}`;
    };

    const setLink = (id, href) => {
        const element = document.getElementById(id);
        if (element && href) {
            element.setAttribute("href", href);
        }
    };

    setLink("connect-website", resolvePath(config.website));
    setLink("connect-whatsapp", config.whatsapp);
    setLink("connect-linkedin", config.linkedin);
    setLink("connect-email", `mailto:${config.email}`);
    setLink("connect-phone", `tel:${config.phone}`);
    setLink("connect-enquiry", resolvePath(config.enquiry));

    const emailLabel = document.getElementById("connect-email-label");
    const phoneLabel = document.getElementById("connect-phone-label");

    if (emailLabel) {
        emailLabel.textContent = config.email;
    }

    if (phoneLabel) {
        phoneLabel.textContent = config.phoneDisplay || config.phone;
    }

    const vcardButton = document.getElementById("connect-vcard");

    vcardButton?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = resolvePath(config.vcardFile || "avantheon-connect.vcf");
        link.download = "AVANTHEON.vcf";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
});
