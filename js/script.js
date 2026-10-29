const categoryGrid = document.querySelector("#category-grid");
const previousButton = document.querySelector(".carousel-control--previous");
const nextButton = document.querySelector(".carousel-control--next");

if (categoryGrid && previousButton && nextButton) {
  const originalCards = Array.from(categoryGrid.children);
  const cloneCards = (cards) =>
    cards.map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.classList.add("category-card--clone");
      return clone;
    });

  categoryGrid.prepend(...cloneCards(originalCards));
  categoryGrid.append(...cloneCards(originalCards));

  const firstOriginalCard = categoryGrid.children[originalCards.length];
  const getCarouselMetrics = () => {
    const firstCard = categoryGrid.children[0];
    const secondCard = categoryGrid.children[1];
    const cardStep =
      secondCard.getBoundingClientRect().left -
      firstCard.getBoundingClientRect().left;
    const originalStart =
      firstOriginalCard.getBoundingClientRect().left -
      categoryGrid.getBoundingClientRect().left +
      categoryGrid.scrollLeft;

    return {
      cardStep,
      loopDistance: cardStep * originalCards.length,
      originalStart,
    };
  };

  categoryGrid.scrollLeft = getCarouselMetrics().originalStart;

  let normalizeTimer;

  const normalizeLoopPosition = () => {
    const { cardStep, loopDistance, originalStart } = getCarouselMetrics();

    if (categoryGrid.scrollLeft < originalStart - cardStep / 2) {
      categoryGrid.scrollLeft += loopDistance;
    } else if (
      categoryGrid.scrollLeft >=
      originalStart + loopDistance - cardStep / 2
    ) {
      categoryGrid.scrollLeft -= loopDistance;
    }
  };

  categoryGrid.addEventListener("scroll", () => {
    window.clearTimeout(normalizeTimer);
    normalizeTimer = window.setTimeout(normalizeLoopPosition, 120);
  });

  const scrollCategories = (direction) => {
    const { cardStep } = getCarouselMetrics();
    categoryGrid.scrollBy({
      left: direction * cardStep,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  previousButton.addEventListener("click", () => scrollCategories(-1));
  nextButton.addEventListener("click", () => scrollCategories(1));
}