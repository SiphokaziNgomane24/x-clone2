document.querySelector("#draftForm").addEventListener("submit", event => {
event.preventDefault();
addPost(draft.value);
});
function addPost(text) {
        if (!text.trim()) return;
            posts.unshift({ id: Date.now(), author: "You", handle: "@you",
                text: text.trim(), likes: 0 });
                followed.add("You");
                    draft.value = "";
                    document.querySelector("#counter").textContent = "0 / 280";
                            document.querySelector("#postButton").disabled = true;
    renderFeed();
    closeModal();
}
        feed.addEventListener("click", event => {
            const button = event.target.closest("[data-id]");
                    if (!button) return;
                            const id = Number(button.dataset.id);
                                liked.has(id) ? liked.delete(id) : liked.add(id);
        renderFeed();
});
        document.querySelectorAll("[data-feed]").forEach(button => {
                button.addEventListener("click", () => {
                    followingOnly = button.dataset.feed === "following";
                    document.querySelectorAll("[data-feed]").forEach(tab =>
                    tab.classList.toggle("selected", tab === button));
    renderFeed();
});
});
        function showView(view) { const explore = view === "explore";
            document.querySelector("#homeView").hidden = explore;
                document.querySelector("#exploreView").hidden = !explore;
                    document.querySelector("#pageTitle").textContent = explore
        ? "Explore" : "Home";
}
                document.querySelectorAll("[data-view]").forEach(button =>
            button.addEventListener("click", () => showView(button.dataset.view)));
            const backdrop = document.querySelector("#backdrop");
                const modalDraft = document.querySelector("#modalDraft");

                function openModal() { backdrop.hidden = false; modalDraft.focus(); }
                function closeModal() {backdrop.hidden = true;
                modalDraft.value = "";
            document.querySelector("#modalCounter").textContent = "0 / 280";
            document.querySelector("#modalPost").disabled = true;
}

        document.querySelector("#openModal").addEventListener("click", openModal);
        document.querySelector("#mobileCompose").addEventListener("click", openModal);
        document.querySelector("#closeModal").addEventListener("click", closeModal);
        backdrop.addEventListener("click", event => {

            if (event.target === backdrop) closeModal();
});
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeModal();
});
        modalDraft.addEventListener("input", () => {
        document.querySelector("#modalCounter").textContent =
            `${modalDraft.value.length} / 280`;
            document.querySelector("#modalPost").disabled = !modalDraft.value.trim();
});
        document.querySelector("#modalPost").addEventListener("click", () =>
            addPost(modalDraft.value));
            const theme = document.querySelector("#themeToggle");

            if (localStorage.getItem("chirp-dark") === "1")
                document.body.classList.add("dark");
                    theme.addEventListener("click", () => {
                        document.body.classList.toggle("dark");
                const dark = document.body.classList.contains("dark");
                        localStorage.setItem("chirp-dark", dark ? "1" : "0");
                theme.textContent = dark ? "Light mode" : "Dark mode";
});