A glowing green pill that carries the page's one main action.

Use `hb-btn` for the primary action, `hb-btn-xl` once per page for the hero, and `hb-btn-sm` in the nav. Label it with the outcome ("Join the waitlist"). Text is `green-ink` on `green`; the glow comes from `shadow-cta` plus a blurred `::before` halo, so the parent must not clip overflow. Secondary actions are the underlined `hb-link` or the round `hb-ghost` icon button, never a second green pill beside the first. Consumers provide the click handler and, for the halo, a stacking context.
