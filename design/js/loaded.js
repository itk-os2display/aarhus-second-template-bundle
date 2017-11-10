// A little tweak to make animations wait for content until they run

document.body.classList.add('js-loading');
window.addEventListener("load", showPage);
function showPage() {
    document.body.classList.remove('js-loading');
    console.log("loaded");
}