// ---------------------------
// DESIGN DATA
// ---------------------------
export const designs = [
    {
        slug: "DemiProP2W",
        name: "DemiProP2W",
        images: ["assets/images/demi-p2w1.png", "assets/images/demi-p2w2.png"],
        desc: "The overall best, P2W design by Uranium himself. It has a compact layout and uses both RBC and teleporters. This is the best design at the moment.",
        tiktok: "...",
        comingSoon: false
    },
    {
        slug: "DemiP2W",
        name: "DemiP2W",
        images: ["assets/images/demi-p2w1.png", "assets/images/demi-p2w2.png"],
        desc: "A P2W design by Uranium that doesn't use teleporters.",
        comingSoon: false
    },
    {
        slug: "DemiPro",
        name: "DemiPro",
        images: ["assets/images/demi-pro1.png", "assets/images/demi-pro2.png"],
        desc: "A famous, F2P-friendly design by Uranium himself. It has a compact layout and is update-proof.",
        comingSoon: false
    },
    {
        slug: "Demi",
        name: "Demi",
        images: ["assets/images/demi1.png", "assets/images/demi2.png"],
        desc: "The best budget design that's compact and update-proof. Designed by Uranium.",
        comingSoon: false
    },
    {
        slug: "CompactProP2W",
        name: "CompactProP2W",
        images: ["assets/images/compact-pro-p2w.png"],
        desc: "Uranium's most compact and efficient P2W design. It uses RBC and teleporters but is not update-proof. Shoutout to fraternal.",
        comingSoon: false
    },
    {
        slug: "CompactP2W",
        name: "CompactP2W",
        images: ["assets/images/CompactP2W.png"],
        desc: "Uranium's most compact P2W (and first ever) design. It uses RBC and is very efficient, but not update-proof. Shoutout to fraternal.",
        tiktok: "...",
        comingSoon: false
    }
];


// ---------------------------
// INITIALIZE GALLERY (called by router.js)
// ---------------------------
export function initGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    grid.innerHTML = "";

    designs.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "gallery-card";

        if (item.comingSoon) {
            card.innerHTML = `
                <div class="coming-soon-card">
                    <h3>${item.name}</h3>
                    <div class="coming-soon-badge">COMING SOON</div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <img src="${item.images[0]}" alt="${item.name}">
                <h3>${item.name}</h3>
            `;
        }

        card.addEventListener("click", () => openLightbox(index));
        grid.appendChild(card);
    });

    setupLightbox();
}


// ---------------------------
// SETUP LIGHTBOX ELEMENTS
// ---------------------------
let lightbox, mainImg, secondImg, title, desc, tiktokContainer, tiktokFrame, closeBtn, imageRow, rightCol;

function setupLightbox() {
    lightbox = document.getElementById("lightbox");
    mainImg = document.getElementById("lightbox-main-img");
    secondImg = document.getElementById("lightbox-second-img");
    title = document.getElementById("lightbox-title");
    desc = document.getElementById("lightbox-desc");
    tiktokContainer = document.getElementById("lightbox-tiktok-container");
    tiktokFrame = document.getElementById("lightbox-tiktok");
    closeBtn = document.getElementById("lightbox-close");
    imageRow = document.querySelector(".image-row");
    rightCol = document.querySelector(".lightbox-right");

    closeBtn.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        tiktokFrame.src = "";
    });

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            tiktokFrame.src = "";
        }
    });
}


// ---------------------------
// RESET LIGHTBOX
// ---------------------------
function resetLightbox() {
    document.querySelectorAll(".coming-soon-big").forEach(el => el.remove());

    imageRow.classList.remove("hidden");
    tiktokContainer.classList.remove("hidden");

    tiktokFrame.src = "";
    title.textContent = "";
    desc.textContent = "";

    lightbox.classList.remove("soon-mode");
}


// ---------------------------
// OPEN LIGHTBOX BY INDEX
// ---------------------------
function openLightbox(index) {
    const item = designs[index];
    resetLightbox();

    if (item.comingSoon) {
        lightbox.classList.add("soon-mode");

        imageRow.classList.add("hidden");
        tiktokContainer.classList.add("hidden");

        title.textContent = item.name;
        desc.textContent = item.desc;

        const soon = document.createElement("div");
        soon.className = "coming-soon-big";
        soon.textContent = "COMING SOON";

        rightCol.insertBefore(soon, closeBtn);

        lightbox.classList.remove("hidden");
        return;
    }

    // Main image
    mainImg.src = item.images[0];

    // Second image (hide if only one)
    if (item.images.length > 1) {
        secondImg.src = item.images[1];
        secondImg.classList.remove("hidden");
    } else {
        secondImg.classList.add("hidden");
    }

    title.textContent = item.name;
    desc.textContent = item.desc;

    // TikTok embed
    if (item.tiktok) {
        tiktokContainer.classList.remove("hidden");
        tiktokFrame.src = item.tiktok;
    } else {
        tiktokContainer.classList.add("hidden");
    }

    lightbox.classList.remove("hidden");
}


// ---------------------------
// OPEN LIGHTBOX BY SLUG (used by router.js)
// ---------------------------
export function openDesignBySlug(slug) {
    const index = designs.findIndex(d => d.slug === slug);
    if (index !== -1) {
        openLightbox(index);
    }
}
