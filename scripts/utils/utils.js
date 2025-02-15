export async function loadHeaderAndFooter() {
    try {
        const headerResponse = await fetch('../../html-components/header.html');
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();

        const footerResponse = await fetch('../../html-components/footer.html');
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();

    } catch (error) {
        console.error('Error loading header or footer:', error);
    }
}