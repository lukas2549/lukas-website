(() => {
	document.documentElement.classList.add('js');

	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const cardSelector = '.bento-card, .program-tile, .article-card, .story-card';
	const countPattern = /^(\d+)([k+]*\+?)$/;
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
			if (reducedMotion.matches) return;
			if (!hoveredCard) return;
			const rect = hoveredCard.getBoundingClientRect();
			hoveredCard.style.setProperty('--mx', `${pointerX - rect.left}px`);
			hoveredCard.style.setProperty('--my', `${pointerY - rect.top}px`);
		});
	}, { passive: true });

	if (!reducedMotion.matches && 'IntersectionObserver' in window) {
		const countObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;

				countObserver.unobserve(entry.target);
				const originalText = entry.target.textContent.trim();
				const match = originalText.match(countPattern);
				if (!match) return;

				const target = Number(match[1]);
				const suffix = match[2];
				const startedAt = performance.now();
				const updateCount = now => {
					if (reducedMotion.matches) {
						entry.target.textContent = originalText;
						return;
					}

					const progress = Math.min((now - startedAt) / 1200, 1);
					const easedProgress = 1 - Math.pow(1 - progress, 3);
					entry.target.textContent = progress === 1
						? originalText
						: `${Math.round(target * easedProgress)}${suffix}`;

					if (progress < 1) requestAnimationFrame(updateCount);
				};

				requestAnimationFrame(updateCount);
			});
		}, { threshold: 0.35 });

		document.querySelectorAll('.hero-stat-strip strong').forEach(number => {
			if (countPattern.test(number.textContent.trim())) countObserver.observe(number);
		});
	}

	if (finePointer.matches && !reducedMotion.matches) {
		document.querySelectorAll('.hero-portrait').forEach(portrait => {
			let tiltFrame = 0;
			let tiltX = 0;
			let tiltY = 0;

			const updateTilt = () => {
				tiltFrame = 0;
				if (reducedMotion.matches) {
					tiltX = 0;
					tiltY = 0;
				}
				portrait.style.setProperty('--portrait-tilt-x', `${tiltX}deg`);
				portrait.style.setProperty('--portrait-tilt-y', `${tiltY}deg`);
			};

			portrait.addEventListener('pointermove', event => {
				if (reducedMotion.matches || !finePointer.matches) return;
				const rect = portrait.getBoundingClientRect();
				const x = (event.clientX - rect.left) / rect.width - 0.5;
				const y = (event.clientY - rect.top) / rect.height - 0.5;
				tiltX = Math.max(-4, Math.min(4, -y * 8));
				tiltY = Math.max(-4, Math.min(4, x * 8));
				if (!tiltFrame) tiltFrame = requestAnimationFrame(updateTilt);
			}, { passive: true });

			portrait.addEventListener('pointerleave', () => {
				tiltX = 0;
				tiltY = 0;
				if (!tiltFrame) tiltFrame = requestAnimationFrame(updateTilt);
			}, { passive: true });
		});
	}

	const faqItems = document.querySelectorAll('.faq-item');
	const syncFaqExpanded = item => {
		const button = item.querySelector('.faq-question');
		if (button) button.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
	};

	faqItems.forEach(syncFaqExpanded);
	if ('MutationObserver' in window) {
		const faqObserver = new MutationObserver(records => {
			records.forEach(record => syncFaqExpanded(record.target));
		});
		faqItems.forEach(item => faqObserver.observe(item, {
			attributes: true,
			attributeFilter: ['class']
		}));
	}
})();