---
name: negativity
description: Review a Harbourly page specification, design, mockup or feature for content that points at something missing or empty (no reviews yet, 0 sessions, empty sections, missing features) and doesn't help the user, then flag each case with a positive rewrite or a removal. Use when the user asks to review a page spec, design or feature with this rule, runs /negativity, or mentions the "negativity rule" or "main rule".
---

# Negativity review

## The rule

Remove or reframe anything that points at something **missing or empty** and doesn't help the user. It doesn't have to be openly negative: anything that makes a person, listing or the product look less impressive by showing what isn't there counts. Pages lead with what is there.

Why: showing an absence draws attention to it. "No reviews yet" on a marketplace profile highlights a lack of social proof and weakens the viewer's confidence. Other trust signals (rank, languages, next free time) should carry the content instead.

The examples in this file illustrate the rule; they are not a complete list. Apply the test below to every piece of content, including new features, details and designs that match no example.

## The test

Run this on each piece of content: copy, labels, counts, sections, states, empty states, badges, placeholders.

1. **Does it point at something missing or empty?** No reviews, no sessions, a count of 0, an empty section, a feature or option that isn't there.
   - Covers **absence only**. Low but real numbers (e.g. "4.2 (1)", "2 sessions") pass and are not flagged.
   - If no: it passes. Move on.
2. **Does the user need it to act, decide, recover, understand their money, or stay within policy or the law?**
   - **No:** flag it. Suggest a **positive rewrite first**. Suggest **removing it** only when no rewrite works (e.g. leave out a rating that has no reviews; leave out a section that has nothing in it).
   - **Yes:** keep the information. If the wording dwells on the gap, you may suggest a calmer version that leads with the next step, but the information stays.
3. **If something is removed, can a positive signal take its place?** Say what already carries the content (e.g. rank, languages, next free time on a coach card), or suggest one.
4. **Not sure?** Don't decide. Put it in the "Unsure" list with a short reason.

## Copy versus state names

A spec mixes two kinds of text. Tell them apart before flagging anything.

- **User-facing copy:** words the user will actually see, usually in quotes (e.g. "No reviews yet", "Nothing needs you right now"). Flag these as copy, with a **Rewrite:** or **Remove.** suggestion.
- **State names and descriptions:** labels that tell the designer which situation to draw (e.g. "nothing free this week", "empty", "showcase empty", "no results"). They are not shown to users. Never flag them as copy and never suggest renaming them.
- When a spec only names a state and doesn't say what the page shows in it, review what the page *would* show in that situation. Give the finding as **Guidance:** for that state, i.e. what the state should lead with (e.g. "Show the coach's next free time and a jump to that week"). The state name stays as it is.
- Not sure whether a line is copy or a label? Put it in "Unsure".

## Fix the cause, not the symptom

Prefer removing what causes an absence over hiding its count or message case by case. Hiding something only when it's empty makes elements behave differently from one view to the next (e.g. a result count that shows for every result except 0). When the cause is removed, the element can always show and stays consistent.

- Example (decided 27 Nov 2026, Browse coaches): instead of a no-results message and a hidden "0 coaches" count, only games that have live coaches get a filter pill. Every filter returns coaches, so the no-results state goes away and the count always shows.
- When suggesting a fix, check first whether the empty case can be prevented. Suggest a rewrite or removal only when it can't.

## Scope

- **Public pages** (what other people see: coach cards, profiles, browse results) and the **user's own private pages** (dashboard, My sessions, settings). Private pages may be dropped from scope later; follow the latest instruction from the user.
- Any page, design or feature: existing, being specified, or new.

## Usually flagged (examples, not a complete list)

- Missing social proof: "No reviews yet", empty ratings, review or session counts of 0, "0 sessions completed".
- Empty sections on profiles or listings: "This coach hasn't added a showcase", "No voice intro". Leave the section out instead.
- Filters, categories or options that can return nothing. Don't offer them at all (e.g. only games with live coaches get a filter pill), so there's no empty result to show. See "Fix the cause, not the symptom".
- Empty or no-results states that can't be prevented and lead with what's missing. Keep the state, but lead with what's there and the next step, not "No coaches…".
- Counts that read 0 in summaries, such as "0 coaches". Prevent the 0 first; hide a count only when a 0 can't be prevented.
- Empty states on private pages: "No sessions coming up" can become "Book your next session" with the action.
- Product-level gaps stated when they aren't needed: "only 5 games supported", "limited availability".

## Always kept (examples of the principle, not a complete list)

Keep anything the user needs to act, decide, recover, understand their money, or stay within policy or the law:

- Errors and failures: "We couldn't load coaches", "Payment didn't go through". Users need them to recover. Wording may be made calmer and fix-focused.
- Money, policy and legal facts: cancellation rules, refund amounts, platform fee, payment holds, converted prices ("≈").
- Blocking conditions: under 18, country not supported, phone not verified.
- Things the user must know about their own account: a dispute filed against them, a hold about to expire, a deadline.
- The **New Coach label**. It's a policy decision; this rule doesn't touch it.

## How to run a review

1. Read the whole spec, design or feature, including every state (loading, empty, error, logged out, filtered, etc.) and every role view.
2. Sort each line into user-facing copy or a state name (see "Copy versus state names"), then apply the test to the copy and to what each state would show.
3. Don't edit the spec or design until the user approves the findings, unless they asked for the changes to be applied.
4. Report using the format below.

## Output format

Start with one line: how many copy items were flagged, how many states got guidance, and how many are unsure.

**Flagged**

Report copy and states in two tables.

**Flagged copy** (words users see)

| # | Where | Current copy | Why it's flagged | Suggestion |
| --- | --- | --- | --- | --- |
| 1 | Coach card, Proof | "No reviews yet" | Shows missing social proof; the viewer doesn't need it to choose | Remove. Show no rating; rank, languages and next free time carry the card |

The Suggestion column starts with **Rewrite:** (and the new wording) or **Remove.** (and what carries the content instead).

**State guidance** (states whose content isn't written yet)

| # | Where | State (name kept) | Why it needs guidance | Guidance |
| --- | --- | --- | --- | --- |
| 1 | Pick a slot | Nothing free this week | The page could lead with the missing times | Guidance: show the coach's next free time and a jump to that week |

**Unsure**

| # | Where | Current content | Why it's unclear |
| --- | --- | --- | --- |

**Kept on purpose** (optional, short): items that touch an absence but stay because users need them, with a few words on why. Include only when the reason isn't obvious.

If nothing is flagged, say so in one line.

## Learning from decisions

When the user decides an "Unsure" item, or overrules a finding, offer to add it to this file as a new example under "Usually flagged" or "Always kept", so later reviews follow the same call.
