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
    setLink("connect-profile", resolvePath(config.profile));
    setLink("connect-meeting", resolvePath(config.meeting));
    setLink("connect-location", config.locationMap);
    setLink("connect-social-linkedin", config.linkedin);
    setLink("connect-social-instagram", config.instagram);
    setLink("connect-social-whatsapp", config.whatsapp);

    setLabel("connect-website-label", config.websiteDisplay);
    setLabel("connect-whatsapp-label", config.whatsappDisplay);
    setLabel("connect-linkedin-label", config.linkedinDisplay);
    setLabel("connect-email-label", config.email);
    setLabel("connect-profile-label", config.profileDisplay);
    setLabel("connect-meeting-label", config.meetingDisplay);
    setLabel("connect-location-label", config.locationDisplay || config.location);
    setLabel("connect-vcard-label", config.vcardDisplay);

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
