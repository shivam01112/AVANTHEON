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

    const setLabel = (id, text) => {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    };

    setLink("connect-website", resolvePath(config.website));
    setLink("connect-whatsapp", config.whatsapp);
    setLink("connect-linkedin", config.linkedin);
    setLink("connect-email", `mailto:${config.email}`);
    setLink("connect-phone", `tel:${config.phone}`);
    setLink("connect-enquiry", resolvePath(config.enquiry));

    setLabel("connect-website-label", config.websiteDisplay);
    setLabel("connect-whatsapp-label", config.whatsappDisplay);
    setLabel("connect-linkedin-label", config.linkedinDisplay);
    setLabel("connect-email-label", config.email);
    setLabel("connect-phone-label", config.phoneDisplay || config.phone);
    setLabel("connect-vcard-label", config.vcardDisplay);
    setLabel("connect-enquiry-label", config.enquiryDisplay);

    document.getElementById("connect-vcard")?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = resolvePath(config.vcardFile || "avantheon-connect.vcf");
        link.download = "AVANTHEON.vcf";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
});
