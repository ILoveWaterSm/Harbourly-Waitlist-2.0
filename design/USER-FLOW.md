# Harbourly webapp MVP user flow

The reference script for design and build. Every page we design should map to a node here; anything not here needs agreeing first. Built from the MVP feature list plus `design/DECISIONS.md`.

Diagrams:

1. Map of the whole product
2. Sign up and log in
3. Browse, profile and booking
4. Before the session: reminders, rescheduling, cancelling
5. The session
6. After the session: confirm, review
7. Disputes and no-show reports
8. Coach journey: application to live
9. Live coach: managing the profile
10. Account
11. Booking status lifecycle
12. Coach status lifecycle
13. Navigation and dual-role routing

---

## 1. Map of the whole product

```mermaid
flowchart TD
  Visitor(["Visitor, logged out"]) --> Browse["Browse coaches"]
  Browse --> Profile["Coach profile"]
  Visitor --> Auth["Sign up or log in"]
  Profile -->|"Book, needs login"| Auth
  Auth --> GDash["Gamer dashboard"]

  GDash --> Browse
  GDash --> GSessions["My sessions"]
  GSessions --> Detail["Session detail"]
  Profile --> Booking["Pick a slot and check out"]
  Booking --> Detail
  Detail --> Session["Live session"]
  Session --> After["Confirm, report a problem, review"]
  After --> Detail
  Detail --> Dispute["Dispute"]

  GDash --> Become["Become a coach"]
  Become --> Apply["Coach application"]
  Apply --> Setup["Payout, phone, profile setup"]
  Setup --> CDash["Coach dashboard"]
  CDash --> CSessions["Coach sessions"]
  CSessions --> Detail
  CDash --> Manage["Coach profile settings"]

  GDash --> Account["Account settings"]
  CDash --> Account
```

---

## 2. Sign up and log in

```mermaid
flowchart TD
  Start(["Sign up"]) --> Method{"Method"}
  Method -->|"Email and password"| Email["Enter email and password"]
  Email --> Verify["Verify your email"]
  Verify --> Details
  Method -->|"Google"| Details["Finish setting up your account"]

  Details --> Fields["First name, last name, username, date of birth, phone with OTP, country, gamer or coach, accept terms"]
  Fields --> Age{"18 or older?"}
  Age -->|"No"| Under18(["You need to be 18 or older to use Harbourly"])
  Age -->|"Yes"| Country{"Country supported?"}
  Country -->|"No"| NotAvail(["Harbourly isn't available in your country yet"])
  Country -->|"Yes"| Role{"Chose coach?"}
  Role -->|"No"| GDash(["Gamer dashboard"])
  Role -->|"Yes"| CoachCountry{"Coach country supported?"}
  CoachCountry -->|"No"| NoCoach["Coaching isn't available in your country yet. You can still book as a gamer"]
  NoCoach --> GDash
  CoachCountry -->|"Yes"| AppIntro(["Coach application, step 1"])

  Login(["Log in"]) --> LMethod{"Method"}
  LMethod -->|"Email and password"| Creds["Email and password"]
  LMethod -->|"Google"| Google["Google"]
  Creds -->|"Forgot password"| Forgot["Forgot password"]
  Forgot --> ResetEmail["Reset email sent"]
  ResetEmail --> Reset["Set a new password"]
  Reset --> Login
  Creds --> Checks
  Google --> Checks{"Setup finished?"}
  Checks -->|"No"| Details
  Checks -->|"Yes"| Terms{"Latest terms accepted?"}
  Terms -->|"No"| AcceptTerms["Accept the updated terms"]
  AcceptTerms --> Return
  Terms -->|"Yes"| Return{"Came from a booking?"}
  Return -->|"Yes"| BackToSlot(["Back to the same booking step"])
  Return -->|"No"| GDash
```

The gamer or coach choice is a routing hint only. Every account can book as a gamer.

---

## 3. Browse, profile and booking

```mermaid
flowchart TD
  Browse["Browse coaches: filter by game and price, sort by price, rating, most reviewed. Prices in your currency"] --> Card["Coach card"]
  Browse -->|"Load more"| Browse
  Card --> Profile["Coach profile: bio, country, languages and time zone, per-game rank and credentials, per-game price, showcase images if added, availability preview, voice intro, reviews"]
  Profile --> Own{"Is this your own coach profile?"}
  Own -->|"Yes"| NoBook(["No Book button. This is your profile"])
  Own -->|"No"| Game["Choose a game"]
  Game --> Slot["Pick a one-hour slot, in your local time"]
  Own -->|"No, Choose a time on a game section: game already chosen"| Slot
  Slot --> LoggedIn{"Logged in?"}
  LoggedIn -->|"No"| Auth["Log in or sign up"]
  Auth --> Slot
  LoggedIn -->|"Yes"| Phone{"Phone verified?"}
  Phone -->|"No"| VerifyPhone["Verify your phone"]
  VerifyPhone --> Hold
  Phone -->|"Yes"| Hold["Slot held for 30 minutes. Booking is pending payment"]
  Hold --> Summary["Checkout summary: price, platform fee, total in the coach's currency, cancellation rule, how the escrow hold works"]
  Summary --> Hosted["Stripe or Xendit hosted payment page"]
  Summary -->|"Choose another time: hold released"| Slot
  Hosted --> Back["Back on Harbourly: confirming your payment"]
  Back --> Result{"Payment provider result"}
  Result -->|"Paid"| Confirmed(["Booking confirmed. Emails to both"])
  Confirmed -->|"Book another time with this coach: same game chosen"| Slot
  Result -->|"Not paid, hold still active"| Failed["Payment didn't go through"]
  Failed --> Summary
  Result -->|"Hold expired"| Expired["This time is no longer held. Email to gamer"]
  Expired --> Slot
```

---

## 4. Before the session: reminders, rescheduling, cancelling

```mermaid
flowchart TD
  Confirmed(["Booking confirmed"]) --> Window{"More than 24 hours to go?"}

  Window -->|"Yes"| Options["Session detail offers: Request a new time, Cancel booking"]
  Window -->|"No"| Locked["Time locked: no new times. Cancel booking still offered"]

  Options --> Req["Requester offers up to 3 slots from the coach's availability. Slots held"]
  Req --> Other{"Other person responds"}
  Other -->|"Picks a slot"| Moved(["Booking moved. Emails to both"])
  Other -->|"Declines"| WhoAsked{"Who asked?"}
  WhoAsked -->|"Gamer"| Stands(["Original time stands"])
  WhoAsked -->|"Coach"| GamerChoice{"Gamer chooses"}
  GamerChoice -->|"Keep original time"| Stands
  GamerChoice -->|"Cancel"| FullRefund(["Cancelled. Full refund including platform fee"])
  Other -->|"No reply in 48h, or 12h before start"| Stands

  Options --> CancelWho{"Who cancels, and when?"}
  Locked --> CancelWho
  CancelWho -->|"Gamer, 1 hour or more before the start"| FullRefund
  CancelWho -->|"Gamer, inside the last hour"| Split(["Cancelled. Coach's price split 50/50, platform fee kept"])
  CancelWho -->|"Coach, any time"| CoachCancel(["Cancelled. Full refund to gamer. Recorded against coach"])

  Confirmed --> Remind["Reminder emails 24h and 1h before"]
  Remind --> Join(["Join session opens 10 minutes before start"])
  Locked --> Join
```

Only one open request per booking, and at most one accepted reschedule per booking. A coach cancelling inside 24 hours counts like a coach no-show (DECISIONS.md, "Coach reliability").

---

## 5. The session

```mermaid
flowchart TD
  Join(["Join session, from 10 minutes before"]) --> Waiting{"Other person here?"}
  Waiting -->|"No"| Room["Waiting for the other person"]
  Room --> Waiting
  Room -->|"15 minutes after start, other person absent"| NoShow(["Report a no-show: see diagram 7"])
  Waiting -->|"Yes"| Live["Live: call, chat saved, screen share on computers only"]
  Live --> Banners["Banners at 10, 5 and 1 minutes before the end"]
  Live -->|"Disconnected"| Rejoin["Rejoin until the scheduled end"]
  Rejoin --> Live
  Live --> EndHow{"How it ends"}
  EndHow -->|"Scheduled end time"| Ended
  EndHow -->|"Person A: End session, then Confirm"| Ask["Person B sees: A wants to end the session"]
  Ask -->|"Keep going"| Live
  Ask -->|"End now"| Ended(["Session ended. Pending confirmation"])
```

---

## 6. After the session: confirm, review

```mermaid
flowchart TD
  Ended(["Pending confirmation, 72 hours"]) --> Emails["Email to gamer: please confirm. Reminder with 24 hours left"]
  Ended --> GamerAct{"What happens"}
  GamerAct -->|"Gamer confirms"| Done
  GamerAct -->|"No action for 72 hours"| Done(["Completed. Payment released to coach. Emails"])
  GamerAct -->|"Gamer reports a problem"| Dispute(["Dispute. Auto-release paused"])
  GamerAct -->|"Coach reports a problem"| Dispute
  Done --> Review["Leave a review: 5 stars, optional text. One per booking"]
  Review --> Shown(["Shown on the coach profile. Average updated"])
  Done --> Later(["Payment problem within 30 days: dispute"])
```

---

## 7. Disputes and no-show reports

```mermaid
flowchart TD
  Start(["Report a problem on session detail"]) --> When{"When?"}
  When -->|"Before confirmation"| WindowReasons["Reasons for your role: conduct, ended early, didn't coach, didn't match listing, technical, other"]
  When -->|"Within 30 days after completion"| PayReasons["Payment reasons only: wrong amount, charged twice, refund missing, payout missing or wrong, other"]
  WindowReasons --> Form
  PayReasons --> Form["Description and optional evidence"]
  Form --> Open["Status: Open. Auto-release paused if still in the window"]
  Open --> Notify["Email to both. The other person can add one response with evidence"]
  Notify --> Review["Status: Under review. Team reviews in Supabase"]
  Review --> Outcome{"Outcome"}
  Outcome -->|"Refund"| Refunded(["Resolved: refunded to gamer"])
  Outcome -->|"Release"| Paid(["Resolved: paid to coach"])
  Refunded --> Email(["Outcome emailed to both"])
  Paid --> Email

  NoShow(["Report a no-show: from 15 minutes after the start, while the other person hasn't joined"]) --> NSOpen["No-show reported. Payment stays held. Email to both"]
  NSOpen --> NSAnswer{"Reported person, within 24 hours"}
  NSAnswer -->|"Confirms, or doesn't answer"| NSWho{"Who didn't show?"}
  NSWho -->|"Coach"| NSRefund(["Refunded to gamer in full, platform fee included"])
  NSWho -->|"Gamer"| NSSplit(["Coach's price split 50/50, platform fee kept"])
  NSAnswer -->|"Contests"| Review
```

Disputes always end in a full refund or a full release. A contested no-show report is decided by the team from the call's join records, by the same two no-show rules. Resolution happens in the Stripe or Xendit dashboard.

---

## 8. Coach journey: application to live

```mermaid
flowchart TD
  Become(["Become a coach"]) --> Row["Coach record created. Coach dashboard appears in the sidebar"]
  Row --> Step1["Step 1: what coaching on Harbourly involves, and what you'll need"]
  Step1 --> Step2["Step 2: games and rank per game, proof images up to 5, marketplace profile link optional, what made you start coaching"]
  Step2 -->|"Leave and come back"| Draft["Draft saved. Dashboard: continue your application"]
  Draft --> Step2
  Step2 --> Submitted["Submitted. Dashboard: under review"]
  Submitted --> Decision{"Team decision"}

  Decision -->|"Rejected"| Rejected["Rejected: reason shown, flagged section highlighted, inputs kept"]
  Rejected --> Attempts{"Which rejection?"}
  Attempts -->|"First or second"| Fix["Change the flagged section, resubmit now"]
  Attempts -->|"Third"| Wait["Wait 14 days, then resubmit"]
  Fix --> Submitted
  Wait --> Submitted
  Decision -->|"Not eligible"| Closed(["Not eligible. No reapply"])

  Decision -->|"Approved"| Gates["Dashboard: what's left before you go live"]
  Gates --> Payout["Payout setup with Stripe or Xendit, including identity check"]
  Payout -->|"Couldn't verify"| PayoutFail["Your payout account couldn't be verified. Try again or contact support"]
  PayoutFail --> Payout
  Gates --> PhoneGate["Phone verified"]
  Gates --> Setup["Profile setup: bio, avatar, banner, languages, availability, price and credentials per game, showcase (optional)"]
  Setup -->|"Leave and come back"| Setup
  Payout --> AllDone{"All four done?"}
  PhoneGate --> AllDone
  Setup --> AllDone
  AllDone -->|"Yes"| Live(["Live and bookable as a New Coach. Email"])

  Live --> NewCoach{"New Coach period"}
  NewCoach -->|"5 completed sessions, no upheld dispute"| Dropped(["Label stops showing. Email"])
  NewCoach -->|"Upheld dispute, coach no-show, or coach cancels inside 24 hours"| Reset["Progress back to 0. Email with the reason"]
  Reset --> NewCoach
```

The four conditions to go live: application approved, payout setup complete, phone verified, profile complete. There is no Verified badge; a portfolio never shortens the New Coach period. Scamming, predatory or grooming conduct is a permanent ban at any stage.

---

## 9. Live coach: managing the profile

```mermaid
flowchart TD
  CDash(["Coach dashboard"]) --> Settings["Coach profile settings"]
  Settings --> Bio["Edit bio, avatar, banner, languages. Photos checked automatically on upload"]
  Settings --> Avail["Edit weekly availability, in your own time zone"]
  Settings --> Rates["Edit price per game, not below the floor (about S$10)"]
  Settings --> Rank["Update rank: new screenshot, old rank shown until approved"]
  Settings --> AddGame["Add a game: proof, listing under review until approved"]
  Settings --> Voice["Record a voice intro: pending, then approved or declined"]
  Settings --> Showcase["Showcase: up to 5 images, optional captions. Checked automatically on upload; shown at once if it passes, refused with a reason if not"]
  Settings --> Portfolio["Submit portfolio: reviewed by hand, shown on your profile if it passes"]
  Settings --> Preview["Preview my public profile"]
  CDash --> PayoutSet["Payout settings: status and link to Stripe or Xendit"]
  CDash --> CSessions["Coach sessions list"]
  CSessions --> Detail["Session detail, coach view"]
  CDash --> Disputes["Open disputes involving you"]
  Disputes --> Detail
```

---

## 10. Account

```mermaid
flowchart TD
  Account(["Account settings"]) --> Profile["Name, username, avatar. Photo checked automatically on upload"]
  Account --> EmailChange["Change email: verify the new one, notice to the old one"]
  Account --> Password["Change password"]
  Account --> PhoneChange["Change phone: OTP"]
  Account --> Locale["Country, time zone, currency"]
  Account --> Delete{"Delete account"}
  Delete -->|"Upcoming sessions or open disputes"| Blocked(["Not yet: finish or resolve them first"])
  Delete -->|"Nothing open"| Confirm["Confirm with a clear warning"]
  Confirm --> Gone(["Deletion requested"])

  System(["System pages"]) --> NotFound["404"]
  System --> Error["Something went wrong"]
  System --> SessionExp["Session expired: sign in again"]
  System --> Protected["Sign in to continue, on protected pages"]
```

A coach's country can't be changed here once payout setup is done.

---

## 11. Booking status lifecycle

```mermaid
stateDiagram-v2
  [*] --> pending_payment: slot picked
  pending_payment --> confirmed: payment provider confirms
  pending_payment --> expired: 30 minutes, not paid

  confirmed --> confirmed: reschedule accepted
  confirmed --> cancelled: gamer cancels (full refund, or 50/50 inside the last hour), or coach any time
  confirmed --> in_session: both have joined
  confirmed --> no_show_reported: 15 minutes after start, other person absent

  no_show_reported --> refunded: coach no-show, confirmed or unanswered in 24h
  no_show_reported --> missed: gamer no-show, confirmed or unanswered in 24h (50/50)
  no_show_reported --> disputed: contested

  in_session --> pending_confirmation: session ends
  pending_confirmation --> completed: gamer confirms, or 72 hours pass
  pending_confirmation --> disputed: either party reports a problem

  disputed --> refunded: resolved for gamer
  disputed --> completed: resolved for coach
  disputed --> missed: contested gamer no-show upheld

  cancelled --> [*]
  missed --> [*]
  expired --> [*]
  refunded --> [*]
  completed --> [*]
```

A reschedule request is shown as a second line on a confirmed booking, not a separate status. `missed` is a gamer no-show settled 50/50; a late cancellation stays `cancelled`, with its refund amount on the record. A payment dispute after completion is tracked on the dispute record, not as a new booking status.

---

## 12. Coach status lifecycle

```mermaid
stateDiagram-v2
  [*] --> draft: Become a coach
  draft --> submitted: submit application
  submitted --> rejected: team rejects
  rejected --> submitted: resubmit after changes
  submitted --> not_eligible: team marks not eligible
  submitted --> approved: team approves
  approved --> live: payout, phone and profile all complete

  state live {
    [*] --> new_coach
    new_coach --> new_coach: upheld dispute, coach no-show or late cancel resets progress
    new_coach --> established: 5 completed sessions, no upheld dispute (label stops showing)
  }

  live --> suspended: team decision after warnings
  suspended --> live: team lifts it
  live --> banned: scamming, predatory or grooming conduct

  not_eligible --> [*]
  banned --> [*]
```

---

## 13. Navigation and dual-role routing

```mermaid
flowchart LR
  Top["Top bar, always: logo, name and sign out, or log in and sign up"]
  Top -->|"Logo, logged in"| GDash
  Top -->|"Logo, logged out"| Home["Marketing home"]

  subgraph Gamer["Gamer block in the sidebar"]
    GDash["Dashboard /dashboard"]
    GBrowse["Browse coaches /coaches"]
    GSess["My sessions /sessions"]
    GBecome["Become a coach, until a coach record exists"]
  end

  subgraph Coach["Coach block, once a coach record exists"]
    CDash["Coach dashboard /coach/dashboard"]
    CSess["Coach sessions /coach/sessions"]
  end

  GDash <-->|"Switcher"| CDash
```

Gamer and coach data never mix. Each dashboard and each sessions list is its own route with its own data.
