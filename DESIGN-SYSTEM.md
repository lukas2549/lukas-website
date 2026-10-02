Design system — Elite Fitness

Overview
- Color tokens: defined in `assets/css/style.css` :root
- Typography: Montserrat (headings), Inter (body), Oswald (numbers)
- Spacing scale: --space-sm/md/lg in `style.css`

Usage
- Use `.card-glass` for glass surfaces, `.card-neu` for neumorphic panels.
- Program cards: `.program-card`
- Buttons: `.btn-gold`, `.btn-outline-light`, combine with `.btn-pill` for rounded CTAs.
- Use `.magnetic` on buttons that will receive a magnetic pointer JS effect.

Utilities
- `.container-narrow` centers content at a comfortable reading width.
- `#scrollProgress` is a top progress bar controlled by JS.

Accessibility
- Focus states are applied globally for keyboard users with generous contrast.

Files
- `assets/css/style.css` — tokens, utilities, and global styles
- `assets/css/components.css` — component styles for cards, timeline, badges

Next steps
- Add Storybook or visual docs for components (optional)
- Wire magnetic cursor and button microinteractions in `assets/js/animations.js`
