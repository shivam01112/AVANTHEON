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

    const COUNTRIES = [
        ["Afghanistan", "AF", "93"], ["Albania", "AL", "355"], ["Algeria", "DZ", "213"],
        ["Andorra", "AD", "376"], ["Angola", "AO", "244"], ["Antigua and Barbuda", "AG", "1268"],
        ["Argentina", "AR", "54"], ["Armenia", "AM", "374"], ["Australia", "AU", "61"],
        ["Austria", "AT", "43"], ["Azerbaijan", "AZ", "994"], ["Bahamas", "BS", "1242"],
        ["Bahrain", "BH", "973"], ["Bangladesh", "BD", "880"], ["Barbados", "BB", "1246"],
        ["Belarus", "BY", "375"], ["Belgium", "BE", "32"], ["Belize", "BZ", "501"],
        ["Benin", "BJ", "229"], ["Bhutan", "BT", "975"], ["Bolivia", "BO", "591"],
        ["Bosnia and Herzegovina", "BA", "387"], ["Botswana", "BW", "267"], ["Brazil", "BR", "55"],
        ["Brunei", "BN", "673"], ["Bulgaria", "BG", "359"], ["Burkina Faso", "BF", "226"],
        ["Burundi", "BI", "257"], ["Cambodia", "KH", "855"], ["Cameroon", "CM", "237"],
        ["Canada", "CA", "1"], ["Cape Verde", "CV", "238"], ["Central African Republic", "CF", "236"],
        ["Chad", "TD", "235"], ["Chile", "CL", "56"], ["China", "CN", "86"],
        ["Colombia", "CO", "57"], ["Comoros", "KM", "269"], ["Congo", "CG", "242"],
        ["Congo (DRC)", "CD", "243"], ["Costa Rica", "CR", "506"], ["Croatia", "HR", "385"],
        ["Cuba", "CU", "53"], ["Cyprus", "CY", "357"], ["Czech Republic", "CZ", "420"],
        ["Denmark", "DK", "45"], ["Djibouti", "DJ", "253"], ["Dominica", "DM", "1767"],
        ["Dominican Republic", "DO", "1809"], ["Ecuador", "EC", "593"], ["Egypt", "EG", "20"],
        ["El Salvador", "SV", "503"], ["Equatorial Guinea", "GQ", "240"], ["Eritrea", "ER", "291"],
        ["Estonia", "EE", "372"], ["Eswatini", "SZ", "268"], ["Ethiopia", "ET", "251"],
        ["Fiji", "FJ", "679"], ["Finland", "FI", "358"], ["France", "FR", "33"],
        ["Gabon", "GA", "241"], ["Gambia", "GM", "220"], ["Georgia", "GE", "995"],
        ["Germany", "DE", "49"], ["Ghana", "GH", "233"], ["Greece", "GR", "30"],
        ["Grenada", "GD", "1473"], ["Guatemala", "GT", "502"], ["Guinea", "GN", "224"],
        ["Guinea-Bissau", "GW", "245"], ["Guyana", "GY", "592"], ["Haiti", "HT", "509"],
        ["Honduras", "HN", "504"], ["Hong Kong", "HK", "852"], ["Hungary", "HU", "36"],
        ["Iceland", "IS", "354"], ["India", "IN", "91"], ["Indonesia", "ID", "62"],
        ["Iran", "IR", "98"], ["Iraq", "IQ", "964"], ["Ireland", "IE", "353"],
        ["Israel", "IL", "972"], ["Italy", "IT", "39"], ["Ivory Coast", "CI", "225"],
        ["Jamaica", "JM", "1876"], ["Japan", "JP", "81"], ["Jordan", "JO", "962"],
        ["Kazakhstan", "KZ", "7"], ["Kenya", "KE", "254"], ["Kiribati", "KI", "686"],
        ["Kosovo", "XK", "383"], ["Kuwait", "KW", "965"], ["Kyrgyzstan", "KG", "996"],
        ["Laos", "LA", "856"], ["Latvia", "LV", "371"], ["Lebanon", "LB", "961"],
        ["Lesotho", "LS", "266"], ["Liberia", "LR", "231"], ["Libya", "LY", "218"],
        ["Liechtenstein", "LI", "423"], ["Lithuania", "LT", "370"], ["Luxembourg", "LU", "352"],
        ["Macau", "MO", "853"], ["Madagascar", "MG", "261"], ["Malawi", "MW", "265"],
        ["Malaysia", "MY", "60"], ["Maldives", "MV", "960"], ["Mali", "ML", "223"],
        ["Malta", "MT", "356"], ["Marshall Islands", "MH", "692"], ["Mauritania", "MR", "222"],
        ["Mauritius", "MU", "230"], ["Mexico", "MX", "52"], ["Micronesia", "FM", "691"],
        ["Moldova", "MD", "373"], ["Monaco", "MC", "377"], ["Mongolia", "MN", "976"],
        ["Montenegro", "ME", "382"], ["Morocco", "MA", "212"], ["Mozambique", "MZ", "258"],
        ["Myanmar", "MM", "95"], ["Namibia", "NA", "264"], ["Nauru", "NR", "674"],
        ["Nepal", "NP", "977"], ["Netherlands", "NL", "31"], ["New Zealand", "NZ", "64"],
        ["Nicaragua", "NI", "505"], ["Niger", "NE", "227"], ["Nigeria", "NG", "234"],
        ["North Korea", "KP", "850"], ["North Macedonia", "MK", "389"], ["Norway", "NO", "47"],
        ["Oman", "OM", "968"], ["Pakistan", "PK", "92"], ["Palau", "PW", "680"],
        ["Palestine", "PS", "970"], ["Panama", "PA", "507"], ["Papua New Guinea", "PG", "675"],
        ["Paraguay", "PY", "595"], ["Peru", "PE", "51"], ["Philippines", "PH", "63"],
        ["Poland", "PL", "48"], ["Portugal", "PT", "351"], ["Qatar", "QA", "974"],
        ["Romania", "RO", "40"], ["Russia", "RU", "7"], ["Rwanda", "RW", "250"],
        ["Saint Kitts and Nevis", "KN", "1869"], ["Saint Lucia", "LC", "1758"],
        ["Saint Vincent and the Grenadines", "VC", "1784"], ["Samoa", "WS", "685"],
        ["San Marino", "SM", "378"], ["Sao Tome and Principe", "ST", "239"],
        ["Saudi Arabia", "SA", "966"], ["Senegal", "SN", "221"], ["Serbia", "RS", "381"],
        ["Seychelles", "SC", "248"], ["Sierra Leone", "SL", "232"], ["Singapore", "SG", "65"],
        ["Slovakia", "SK", "421"], ["Slovenia", "SI", "386"], ["Solomon Islands", "SB", "677"],
        ["Somalia", "SO", "252"], ["South Africa", "ZA", "27"], ["South Korea", "KR", "82"],
        ["South Sudan", "SS", "211"], ["Spain", "ES", "34"], ["Sri Lanka", "LK", "94"],
        ["Sudan", "SD", "249"], ["Suriname", "SR", "597"], ["Sweden", "SE", "46"],
        ["Switzerland", "CH", "41"], ["Syria", "SY", "963"], ["Taiwan", "TW", "886"],
        ["Tajikistan", "TJ", "992"], ["Tanzania", "TZ", "255"], ["Thailand", "TH", "66"],
        ["Timor-Leste", "TL", "670"], ["Togo", "TG", "228"], ["Tonga", "TO", "676"],
        ["Trinidad and Tobago", "TT", "1868"], ["Tunisia", "TN", "216"], ["Turkey", "TR", "90"],
        ["Turkmenistan", "TM", "993"], ["Tuvalu", "TV", "688"], ["Uganda", "UG", "256"],
        ["Ukraine", "UA", "380"], ["United Arab Emirates", "AE", "971"],
        ["United Kingdom", "GB", "44"], ["United States", "US", "1"], ["Uruguay", "UY", "598"],
        ["Uzbekistan", "UZ", "998"], ["Vanuatu", "VU", "678"], ["Vatican City", "VA", "379"],
        ["Venezuela", "VE", "58"], ["Vietnam", "VN", "84"], ["Yemen", "YE", "967"],
        ["Zambia", "ZM", "260"], ["Zimbabwe", "ZW", "263"]
    ].map(([name, iso2, dial]) => ({ name, iso2, dial }));

    const flagEmoji = (iso2) => iso2
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

    const countryField = document.querySelector("[data-country-field]");
    const countrySelect = document.querySelector("[data-country-select]");
    const countrySearch = document.querySelector("[data-country-search]");
    const countryListbox = document.querySelector("[data-country-listbox]");
    const phonePrefix = document.querySelector("[data-phone-prefix]");

    if (countryField && countrySelect && countrySearch && countryListbox) {
        COUNTRIES.forEach((country) => {
            const option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });

        let activeIndex = -1;
        let visible = COUNTRIES;

        const closeList = () => {
            countryListbox.hidden = true;
            countrySearch.setAttribute("aria-expanded", "false");
            activeIndex = -1;
        };

        const selectCountry = (country) => {
            countrySelect.value = country.name;
            countrySelect.dispatchEvent(new Event("change", { bubbles: true }));
            countrySearch.value = country.name;
            if (phonePrefix) {
                phonePrefix.textContent = `+${country.dial}`;
            }
            closeList();
        };

        const renderList = () => {
            countryListbox.innerHTML = "";

            if (!visible.length) {
                const empty = document.createElement("li");
                empty.className = "contact-country-empty";
                empty.textContent = "No matching country";
                countryListbox.appendChild(empty);
                return;
            }

            visible.forEach((country, index) => {
                const item = document.createElement("li");
                item.className = "contact-country-option";
                item.id = `contact-country-option-${index}`;
                item.setAttribute("role", "option");
                item.dataset.value = country.name;
                item.innerHTML = `<span class="contact-country-flag">${flagEmoji(country.iso2)}</span><span class="contact-country-name">${country.name}</span><span class="contact-country-dial">+${country.dial}</span>`;
                item.addEventListener("mousedown", (event) => {
                    event.preventDefault();
                    selectCountry(country);
                });
                countryListbox.appendChild(item);
            });
        };

        const setActive = (index) => {
            const options = Array.from(countryListbox.querySelectorAll(".contact-country-option"));
            options.forEach((option) => option.classList.remove("is-active"));

            if (!options.length) {
                countrySearch.removeAttribute("aria-activedescendant");
                return;
            }

            activeIndex = (index + options.length) % options.length;
            const active = options[activeIndex];
            active.classList.add("is-active");
            countrySearch.setAttribute("aria-activedescendant", active.id);
            active.scrollIntoView({ block: "nearest" });
        };

        const openList = () => {
            countryListbox.hidden = false;
            countrySearch.setAttribute("aria-expanded", "true");
        };

        const filterList = () => {
            const query = countrySearch.value.trim().toLowerCase();
            visible = query
                ? COUNTRIES.filter((country) => country.name.toLowerCase().includes(query))
                : COUNTRIES;
            renderList();
            openList();
        };

        countrySearch.addEventListener("focus", filterList);
        countrySearch.addEventListener("input", filterList);

        countrySearch.addEventListener("keydown", (event) => {
            if (countryListbox.hidden && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
                filterList();
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive(activeIndex + 1);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive(activeIndex - 1);
            } else if (event.key === "Enter") {
                if (activeIndex >= 0 && visible[activeIndex]) {
                    event.preventDefault();
                    selectCountry(visible[activeIndex]);
                }
            } else if (event.key === "Escape") {
                closeList();
            }
        });

        document.addEventListener("click", (event) => {
            if (!countryField.contains(event.target)) {
                closeList();

                const selectedOption = COUNTRIES.find((country) => country.name === countrySelect.value);
                countrySearch.value = selectedOption ? selectedOption.name : "";
            }
        });
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
