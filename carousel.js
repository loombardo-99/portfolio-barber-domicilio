document.addEventListener('DOMContentLoaded', () => {
    const cortesContainer = document.querySelector('.cortes-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (cortesContainer && prevBtn && nextBtn) {
        // Calcula a largura de um card, incluindo a margem direita
        const firstCard = cortesContainer.querySelector('.card');
        const cardWidth = firstCard.offsetWidth;
        const cardMarginRight = parseFloat(window.getComputedStyle(firstCard).marginRight);
        const scrollAmount = cardWidth + cardMarginRight;

        prevBtn.addEventListener('click', () => {
            cortesContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            cortesContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
});
