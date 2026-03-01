const container = document.getElementById("page-container");
const FADE = 200;

// Load a page into the container
async function loadPage(url) {
    container.style.opacity = 0;

    const response = await fetch(url);
    const html = await response.text();

    setTimeout(async () => {
        container.innerHTML = html;

        // --- Load gallery script BEFORE firing pageLoaded ---
        if (url.includes("gallery")) {
            const module = await import("./gallery.js");

            // expose functions globally
            window.initGallery = module.initGallery;
            window.openDesignBySlug = module.openDesignBySlug;

            // initialize gallery immediately
            module.initGallery();

            // auto-open recommended design from form
            if (window.selectedDesignSlug) {
                module.openDesignBySlug(window.selectedDesignSlug);
                window.selectedDesignSlug = null;
            }
        }

        // --- Fire pageLoaded event AFTER gallery.js is imported ---
        document.dispatchEvent(new CustomEvent("pageLoaded", { detail: url }));

        container.style.opacity = 1;

        // --- Run form wizard if form page is loaded ---
        if (url.includes("form") && window.initFormWizard) {
            window.initFormWizard();
        }

    }, FADE);
}

// Initial load
loadPage("Pages/home.html");

// Intercept navigation
document.addEventListener("click", e => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    const url = link.getAttribute("href");

    // Copyright page = allow normal navigation
    if (url.includes("copyright")) {
        return;
    }

    e.preventDefault();
    loadPage(url);
});

// Highlight active nav button
document.querySelectorAll('.top-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;

        loadPage(page);

        document.querySelectorAll('.top-nav button')
            .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');
    });
});
