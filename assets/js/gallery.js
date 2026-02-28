// Gallery items
const designs = [
    {
        name: "Design One",
        images: [
            "assets/gallery/P2W1.png",
            "assets/gallery/P2W2.png"
        ],
        desc: "A description of the first design.",
        tiktok: "https://www.tiktok.com/embed/7609505292103044374"
    },
];

// Render gallery grid
const grid = document.getElementById("gallery-grid");

designs.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
        <img src="${item.images[0]}" alt="${item.name}">
        <h3>${item.name}</h3>
    `;
    card.addEventListener("click", () => openLightbox(index));
    grid.appendChild(card);
});

// Lightbox elements
const lightbox = document.getElementById("lightbox");
const mainImg = document.getElementById("lightbox-main-img");
const extraImages = document.getElementById("lightbox-extra-images");
const title = document.getElementById("lightbox-title");
const desc = document.getElementById("lightbox-desc");
const tiktokContainer = document.getElementById("lightbox-tiktok-container");
const tiktokFrame = document.getElementById("lightbox-tiktok");
const closeBtn = document.getElementById("lightbox-close");

function openLightbox(index) {
    const item = designs[index];

    // Main image
    mainImg.src = item.images[0];

    // Extra images
    extraImages.innerHTML = "";
    if (item.images.length > 1) {
        item.images.slice(1).forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "extra-img";
            extraImages.appendChild(img);
        });
    }

    // Text
    title.textContent = item.name;
    desc.textContent = item.desc;

    // TikTok
    if (item.tiktok) {
        tiktokContainer.classList.remove("hidden");
        tiktokFrame.src = item.tiktok;
    } else {
        tiktokContainer.classList.add("hidden");
        tiktokFrame.src = "";
    }

    lightbox.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden");
    tiktokFrame.src = ""; // stop playback
});

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
        lightbox.classList.add("hidden");
        tiktokFrame.src = "";
    }
});
