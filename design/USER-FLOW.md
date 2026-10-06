# Harbourly webapp MVP user flow

The reference script for design and build. Every page we design should map to a node here; anything not here needs agreeing first. Built from the MVP feature list plus `design/DECISIONS.md`.

Diagrams:

1. Map of the whole product
2. Sign up and log in
3. Browse, profile and booking
4. Before the session: reminders, rescheduling, cancelling
5. The session
6. After the session: confirm, review
7. Disputes
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
  Card --> Profile["Coach profile: bio, per-game rank and credentials, per-game price, availability preview, voice intro, reviews"]
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
  Window -->|"No"| Locked["Time locked. No reschedule. Gamer can't cancel"]

  Options --> Req["Requester offers up to 3 slots from the coach's availability. Slots held"]
  Req --> Other{"Other person responds"}
  Other -->|"Picks a slot"| Moved(["Booking moved. Emails to both"])
  Other -->|"Declines"| WhoAsked{"Who asked?"}
  WhoAsked -->|"Gamer"| Stands(["Original time stands"])
  WhoAsked -->|"Coach"| GamerChoice{"Gamer chooses"}
  GamerChoice -->|"Keep original time"| Stands
  GamerChoice -->|"Cancel"| FullRefund(["Cancelled. Full refund including platform fee"])
  Other -->|"No reply in 48h, or 12h before start"| Stands

  Options --> CancelWho{"Who cancels?"}
  CancelWho -->|"Gamer, within 1 hour of booking"| FullRefund
  CancelWho -->|"Gamer, otherwise"| PartRefund(["Cancelled. Coach price refunded, platform fee kept"])
  CancelWho -->|"Coach"| CoachCancel(["Cancelled. Full refund to gamer. Recorded against coach"])
  Locked -->|"Coach can still cancel"| CoachCancel

  Confirmed --> Remind["Reminder emails 24h and 1h before"]
  Remind --> Join(["Join session opens 10 minutes before start"])
  Locked --> Join
```

Only one open request per booking, and at most one accepted reschedule per booking. A coach cancelling inside 24 hours counts as a serious incident.

---

## 5. The session

```mermaid
flowchart TD
  Join(["Join session, from 10 minutes before"]) --> Waiting{"Other person here?"}
  Waiting -->|"No"| Room["Waiting for the other person"]
  Room --> Waiting
  Room -->|"Gamer, 15 minutes after start, coach absent"| NoShow(["Report a no-show: opens a dispute"])
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

## 7. Disputes

```mermaid
flowchart TD
  Start(["Report a problem on session detail"]) --> When{"When?"}
  When -->|"Before confirmation"| WindowReasons["Reasons for your role: conduct, no-show, ended early, didn't coach, didn't match listing, technical, other"]
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
```

Always a full refund or a full release. Resolution happens in the Stripe or Xendit dashboard.

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
  Gates --> Setup["Profile setup: bio, avatar, banner, availability, price and credentials per game"]
  Setup -->|"Leave and come back"| Setup
  Payout --> AllDone{"All four done?"}
  PhoneGate --> AllDone
  Setup --> AllDone
  AllDone -->|"Yes"| Live(["Live and bookable as a New Coach. Email"])

  Live --> Path{"Path to Verified"}
  Path -->|"Submit portfolio, passes review"| Verified(["Verified"])
  Path -->|"5 sessions with no serious incidents"| Verified
```

The four conditions to go live: application approved, payout setup complete, phone verified, profile complete.

---

## 9. Live coach: managing the profile

```mermaid
flowchart TD
  CDash(["Coach dashboard"]) --> Settings["Coach profile settings"]
  Settings --> Bio["Edit bio, avatar, banner"]
  Settings --> Avail["Edit weekly availability, in your own time zone"]
  Settings --> Rates["Edit price per game"]
  Settings --> Rank["Update rank: new screenshot, old rank shown until approved"]
  Settings --> AddGame["Add a game: proof, listing under review until approved"]
  Settings --> Voice["Record a voice intro: pending, then approved or declined"]
  Settings --> Portfolio["Submit portfolio for Verified"]
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
  Account(["Account settings"]) --> Profile["Name, username, avatar"]
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
  confirmed --> cancelled: gamer 24h or more ahead, or coach any time
  confirmed --> in_session: someone joins
  confirmed --> disputed: coach no-show reported

  in_session --> pending_confirmation: session ends
  pending_confirmation --> completed: gamer confirms, or 72 hours pass
  pending_confirmation --> disputed: either party reports a problem

  disputed --> refunded: resolved for gamer
  disputed --> completed: resolved for coach

  cancelled --> [*]
  expired --> [*]
  refunded --> [*]
  completed --> [*]
```

A reschedule request is shown as a second line on a confirmed booking, not a separate status. A payment dispute after completion is tracked on the dispute record, not as a new booking status.

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
    new_coach --> verified: portfolio passes, or 5 clean sessions
  }

  not_eligible --> [*]
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
