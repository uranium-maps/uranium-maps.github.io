const container = document.getElementById("page-container");
const FADE = 200;

// Load a page into the container
async function loadPage(url) {
    container.style.opacity = 0;

    const response = await fetch(url);
    const html = await response.text();

    setTimeout(async () => {
        container.innerHTML = html;
        container.style.opacity = 1;

        // Run gallery script if gallery page is loaded
        if (url.includes("gallery")) {
            const module = await import("./gallery.js");
            module.initGallery();
        }
    }, FADE);
}


// Initial load
loadPage("pages/home.html");

// Intercept navigation
document.addEventListener("click", e => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    const url = link.getAttribute("href");

    // Copyright page no no reload do
    if (url.includes("copyright")) {
        return; // allow normal navigation
    }

    e.preventDefault();
    loadPage(url);
});
