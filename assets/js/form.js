function initFormWizard() {
    const stepContainer = document.getElementById("form-step");
    if (!stepContainer) return;

    const backBtn = document.getElementById("form-back");
    const nextBtn = document.getElementById("form-next");

    let step = 0;

    const answers = {
        petTeleporters: null,
        priority: null,
        rainbowCollector: null,
        email: ""
    };

    function renderStep() {
        backBtn.classList.toggle("hidden", step === 0);
        nextBtn.textContent = step === 3 ? "Finish" : "Next";

        switch (step) {
            case 0:
                stepContainer.innerHTML = `
                    <p>Do you have pet teleporters?</p>
                    <div class="form-options">
                        <button class="opt" data-value="yes">Yes</button>
                        <button class="opt" data-value="no">No</button>
                    </div>
                `;
                break;

            case 1:
                stepContainer.innerHTML = `
                    <p>Do you care more about your base being update-proof or compact?</p>
                    <div class="form-options">
                        <button class="opt" data-value="update-proof">Update-proof</button>
                        <button class="opt" data-value="compact">Compact</button>
                    </div>
                `;
                break;

            case 2:
                stepContainer.innerHTML = `
                    <p>Do you have a rainbow collector?</p>
                    <div class="form-options">
                        <button class="opt" data-value="yes">Yes</button>
                        <button class="opt" data-value="no">No</button>
                    </div>
                `;
                break;

            case 3:
                stepContainer.innerHTML = `
                    <p>
                        Enter your email for update notifications (optional)
                        <span class="info-icon">i
                            <span class="info-box">
                                If you enter your email, you'll receive a message whenever your chosen design gets updated.
                            </span>
                        </span>
                    </p>
                    <input type="email" id="email-input" placeholder="your@email.com">
                `;
                break;

            case 4:
                const slug = getRecommendedSlug();
                stepContainer.innerHTML = `
                    <h2>Your recommended design:</h2>
                    <p style="font-size:1.4rem; margin-top:10px;">${slug}</p>
                `;
                backBtn.classList.add("hidden");
                nextBtn.classList.add("hidden");
                break;
        }

        attachOptionHandlers();
    }

    function attachOptionHandlers() {
        document.querySelectorAll(".opt").forEach(btn => {
            btn.addEventListener("click", () => {
                const value = btn.dataset.value;

                if (step === 0) answers.petTeleporters = value;
                if (step === 1) answers.priority = value;
                if (step === 2) answers.rainbowCollector = value;

                step++;
                renderStep();
            });
        });
    }

    nextBtn.addEventListener("click", () => {
        if (step === 3) {
            answers.email = document.getElementById("email-input").value.trim();
            finishForm();
            return;
        }

        step++;
        renderStep();
    });

    backBtn.addEventListener("click", () => {
        if (step > 0) step--;
        renderStep();
    });

    function getRecommendedSlug() {
        const upgradeProof = answers.priority === "update-proof";
        const portals = answers.petTeleporters === "yes";
        const rainbowCollector = answers.rainbowCollector === "yes";

        const key =
            (upgradeProof ? "UP" : "NOTUP") + "_" +
            (rainbowCollector ? "RBC" : "NORBC") + "_" +
            (portals ? "PORTALS" : "NOPORTALS");

        const designRecommendations = {
            "UP_RBC_PORTALS": "DemiProP2W",
            "UP_RBC_NOPORTALS": "DemiP2W",
            "UP_NORBC_PORTALS": "DemiPro",
            "UP_NORBC_NOPORTALS": "Demi",

            "NOTUP_RBC_PORTALS": "CompactProP2W",
            "NOTUP_RBC_NOPORTALS": "CompactP2W",
            "NOTUP_NORBC_PORTALS": "DemiPro",
            "NOTUP_NORBC_NOPORTALS": "Demi"
        };

        return designRecommendations[key];
    }

    function finishForm() {
    const slug = getRecommendedSlug();
    const email = answers.email.trim();

    // Store globally for gallery auto-open
    window.selectedDesignSlug = slug;

    // Send to Google Sheets if email is provided
    if (email) {
        fetch("https://script.google.com/macros/s/AKfycbxrUHgoh1Rp5Tfo6PxsbboWX-fQRHiPUzFfNhG_iix1jNF9q7823clzD-V0jPBiM5AM/exec", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                design: slug
            })
        });
    }

    loadPage("Pages/gallery.html");
}

    renderStep();
}

window.initFormWizard = initFormWizard;
