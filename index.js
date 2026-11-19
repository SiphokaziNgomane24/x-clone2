const posts = [];
const liked = new Set();
const followed = new Set(["You"]);
let followingOnly = false;

const draftForm = document.querySelector("#postForm") || document.querySelector("#draftForm");
const draft = document.querySelector("#postInput") || document.querySelector("#draft");
const feed = document.querySelector("#feed");
const counter = document.querySelector("#counter");
const postButton = document.querySelector("#postButton");

function renderFeed() {
    if (!feed) return;
    const visiblePosts = followingOnly
        ? posts.filter(post => followed.has(post.author))
        : posts;

    feed.replaceChildren();
    visiblePosts.forEach(post => {
        const article = document.createElement("article");
        article.className = "post";

        const meta = document.createElement("div");
        const author = document.createElement("strong");
        author.textContent = post.author;
        const handle = document.createElement("span");
        handle.textContent = ` ${post.handle}`;
        meta.append(author, handle);

        const body = document.createElement("p");
        body.textContent = post.text;

        const likeBtn = document.createElement("button");
        likeBtn.type = "button";
        likeBtn.dataset.id = String(post.id);
        const isLiked = liked.has(post.id);
        if (isLiked) likeBtn.classList.add("liked");
        likeBtn.textContent = `♥ ${post.likes + (isLiked ? 1 : 0)}`;

        article.append(meta, body, likeBtn);
        feed.appendChild(article);
    });
}

if (draft) {
    draft.addEventListener("input", () => {
        if (counter) counter.textContent = `${draft.value.length}/280`;
        if (postButton) postButton.disabled = !draft.value.trim();
    });
}

if (draftForm && draft) {
    draftForm.addEventListener("submit", event => {
        event.preventDefault();
        addPost(draft.value);
    });
}

function addPost(text) {
    if (!text.trim()) return;
    posts.unshift({
        id: Date.now(),
        author: "You",
        handle: "@you",
        text: text.trim(),
        likes: 0
    });
    followed.add("You");
    if (draft) draft.value = "";
    if (counter) counter.textContent = "0/280";
    if (postButton) postButton.disabled = true;
    renderFeed();
    closeModal();
}

if (feed) {
    feed.addEventListener("click", event => {
        const button = event.target.closest("[data-id]");
        if (!button) return;
        const id = Number(button.dataset.id);
        liked.has(id) ? liked.delete(id) : liked.add(id);
        renderFeed();
    });
}

document.querySelectorAll("[data-feed]").forEach(button => {
    button.addEventListener("click", () => {
        followingOnly = button.dataset.feed === "following";
        document.querySelectorAll("[data-feed]").forEach(tab =>
            tab.classList.toggle("selected", tab === button)
        );
        renderFeed();
    });
});

function showView(view) {
    if (view === "themeToggle") return;
    const explore = view === "explore";
    const homeView = document.querySelector("#homeView");
    const exploreView = document.querySelector("#exploreView");
    const pageTitle = document.querySelector("#pageTitle");
    if (homeView) homeView.hidden = explore;
    if (exploreView) exploreView.hidden = !explore;
    if (pageTitle) pageTitle.textContent = explore ? "Explore" : "Home";
}

document.querySelectorAll("[data-view]").forEach(button =>
    button.addEventListener("click", () => showView(button.dataset.view))
);

const backdrop = document.querySelector("#backdrop");
const modalDraft = document.querySelector("#modalDraft");

function openModal() {
    if (!backdrop || !modalDraft) return;
    backdrop.hidden = false;
    modalDraft.focus();
}

function closeModal() {
    if (!backdrop || !modalDraft) return;
    backdrop.hidden = true;
    modalDraft.value = "";
    const modalCounter = document.querySelector("#modalCounter");
    const modalPost = document.querySelector("#modalPost");
    if (modalCounter) modalCounter.textContent = "0 / 280";
    if (modalPost) modalPost.disabled = true;
}

const openModalBtn = document.querySelector("#openModal") || document.querySelector("#openModel");
if (openModalBtn) openModalBtn.addEventListener("click", openModal);

const mobileComposeBtn = document.querySelector("#mobileCompose");
if (mobileComposeBtn) mobileComposeBtn.addEventListener("click", openModal);

const closeModalBtn = document.querySelector("#closeModal");
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

if (backdrop) {
    backdrop.addEventListener("click", event => {
        if (event.target === backdrop) closeModal();
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
});

if (modalDraft) {
    modalDraft.addEventListener("input", () => {
        const modalCounter = document.querySelector("#modalCounter");
        const modalPost = document.querySelector("#modalPost");
        if (modalCounter) modalCounter.textContent = `${modalDraft.value.length} / 280`;
        if (modalPost) modalPost.disabled = !modalDraft.value.trim();
    });
}

const modalPostBtn = document.querySelector("#modalPost");
if (modalPostBtn && modalDraft) {
    modalPostBtn.addEventListener("click", () => addPost(modalDraft.value));
}

const theme = document.querySelector("#themeToggle") || document.querySelector('[data-view="themeToggle"]');

if (localStorage.getItem("chirp-dark") === "1") {
    document.body.classList.add("dark");
}

if (theme) {
    theme.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains("dark");
        localStorage.setItem("chirp-dark", dark ? "1" : "0");
        if (theme.id === "themeToggle") {
            theme.textContent = dark ? "Light mode" : "Dark mode";
        }
    });
}

showView("home");
renderFeed();