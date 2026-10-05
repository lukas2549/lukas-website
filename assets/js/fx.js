(() => {
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const cardSelector = '.bento-card, .program-tile, .article-card, .story-card';
	let frame = 0;
	let hoveredCard = null;
	let pointerX = 0;
	let pointerY = 0;

	document.addEventListener('pointermove', event => {
		if (!finePointer.matches || reducedMotion.matches) return;

		const card = event.target.closest?.(cardSelector);
		if (!card) return;

		hoveredCard = card;
		pointerX = event.clientX;
		pointerY = event.clientY;
		if (frame) return;

		frame = requestAnimationFrame(() => {
			frame = 0;
			if (!hoveredCard) return;
			const rect = hoveredCard.getBoundingClientRect();
			hoveredCard.style.setProperty('--mx', `${pointerX - rect.left}px`);
			hoveredCard.style.setProperty('--my', `${pointerY - rect.top}px`);
		});
	}, { passive: true });
})();