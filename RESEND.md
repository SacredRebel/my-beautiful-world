# RESEND — the whole email setup, in one place

This is the source of truth. If anything about email capture is ever in question,
the answer is here. Do not re-derive it from memory, and do not change any ID
below without re-running `list-segments` / `list-topics` against the live account
first.

Last verified against the live Resend account: **26 Jul 2026, 5:10 pm LA time.**

---

## 1. What this has to do

Three places collect an email address. Each one has to land in the right list,
and the two brands must never bleed into each other.

| # | Capture point | Who they are | Brand |
|---|---|---|---|
| 1 | Book landing page, free sample form | someone who wants the sample PDF | book |
| 2 | Book purchase, via the Whop webhook | someone who has paid | book |
| 3 | Post-purchase hand-raise, print / series waitlist | a buyer asking for more | book |
| 4 | Edenverse main site signup form | Edenverse audience | Edenverse |

Points 1-3 are this repo. Point 4 is the separate Edenverse site repo.

---

## 2. The map

| Capture point | Endpoint | Segment | Topic |
|---|---|---|---|
| Free sample | `api/subscribe.js` | Book — free sample | My Beautiful World, opt_in |
| Purchase | `api/whop-webhook.js` | Book — buyers | My Beautiful World, opt_in |
| Print / series waitlist | `api/waitlist.js` | Book — buyers | My Beautiful World, opt_in |
| Edenverse site | Edenverse repo, `app/api/subscribe/route.ts` | General | Edenverse Codex, opt_in |

The print and series waitlists share one segment on purpose. Which of the two a
person raised a hand for is recorded on the contact's `interests` property, so
one segment carries both without losing the detail. The free plan allows three
segments and all three are spoken for.

---

## 3. Segments vs topics — why both

This is the part that gets forgotten, so it is written down plainly.

A **segment** decides who a broadcast is *addressed to*. It is a manual
container. The free plan caps us at three, and all three are used.

A **topic** decides who is *allowed to receive* it. Topics are consent, they
drive the unsubscribe link, and they are **not** capped by the plan.

Both topics are set to **opt_out by default**. That is deliberate and it is the
thing that actually keeps the brands apart: a contact who has never been opted
into a topic silently receives nothing on that topic. So even if a segment were
ever misconfigured and a book reader ended up in the Edenverse segment, they
still could not be sent an Edenverse broadcast, because they were never opted
into the Edenverse Codex topic. The separation holds in both directions and it
survives a mistake in the segment layer.

Relying on segments alone would not do this. Relying on topics alone would work
for sending but would leave us with no way to address a list.

---

## 4. How a signup is written

One call, not two. `POST /contacts` with the topic inline:

```js
POST https://api.resend.com/contacts
{
  "email": "someone@example.com",
  "unsubscribed": false,
  "topics": [{ "id": "<topic id>", "subscription": "opt_in" }]
}
```

This behaves as an **idempotent upsert**. A repeat submission of the same address
sets the topic named in the array and leaves any other topic that contact
already holds alone — which matters for a person who signs up for both the book
and Edenverse, because they keep both. Verified empirically on the Edenverse side
across three live signups.

Then the contact is filed into its segment:

```js
POST https://api.resend.com/segments/<segment id>/contacts
{ "email": "someone@example.com" }
```

That endpoint wants `email`. Passing `contact_id` returns 422 "Missing `email`
field". `contact_id` is kept in the code only as a fallback in case that changes.

### The fallback path

`PATCH /contacts/{email}/topics` also sets a topic. Its body is a **bare array**,
not an object — wrapping it as `{ "topics": [...] }` is rejected, and
`PATCH /contacts/{email}` does not accept a topics field at all.

It is used **only** when the inline topic on create did not take, so a contact is
never left sitting on the opt_out default and silently unable to receive
anything.

**Not verified:** whether a single-element array on this endpoint merges into the
contact's existing topics or replaces the whole list. That is exactly why it is
the fallback and not the normal path. Do not promote it back to the main path
without testing that first.

### Failure behaviour

Contact filing is **best effort and must never block the email**. Every Resend
call in `api/_resend.js` is wrapped and only `console.warn`s on failure. A useful
consequence: after a live test, **zero warning-level Vercel logs is positive
proof every Resend call returned 2xx**, because a failure would have warned.

---

## 5. Live IDs

Re-verified 26 Jul 2026. Never type one of these from memory.

**Segments**

| Name | ID |
|---|---|
| Book — free sample | `6e57156d-c8b0-49b2-b7a1-2206fc9e5731` |
| Book — buyers | `ccacd682-48e3-4fff-8fa9-7df585e235a2` |
| General (Edenverse main list) | `16abb5e2-6dc1-46f1-aa49-3252b10ab565` |

`General` is the audience Resend auto-created with the account on 20 Jul. It is
now the Edenverse main-site list. It is a real, separate segment — which is why
**no plan upgrade is needed** to keep the lists apart. All three lists are
already separated at both the segment layer and the topic layer.

**Topics**

| Name | ID | Default |
|---|---|---|
| My Beautiful World | `3ee7c02a-1c3b-4fc5-8113-9ea5081719b8` | opt_out |
| Edenverse Codex | `8e9eda88-b108-4310-90e4-cd28a927286d` | opt_out |

**Domains**

| Domain | Status | ID |
|---|---|---|
| `edenverse.earth` | verified — send from this | `4960ca07-3426-42c3-88ff-beaf470dc202` |
| `edenverse.co` | **NOT verified — sending from it 502s** | — |

**Contact properties**

`source` (fallback `unknown`) and `interests` (fallback `none`). Resend returns
properties wrapped as `{ interests: { value: "series", type: "string" } }`, not
as bare values. Reading the wrapper with `String()` yields `[object Object]`,
which then gets written back as a tag. `propValue()` in `_resend.js` unwraps it
and `JUNK` repairs contacts already carrying the residue.

**Plan limits (free)**

1,000 marketing contacts/mo, 3,000 transactional/mo, 100 emails/day. The
1,000-contact allowance is a single shared pool across both brands — the
separation is logical, not a separate quota.

---

## 6. Files

In this repo:

- `api/_resend.js` — the shared helper. `sendEmail`, `addContact`, `setTopic`
  (fallback only), `propValue`, `tagInterest`, and the `BOOK_TOPIC` constant.
- `api/subscribe.js` — free sample.
- `api/waitlist.js` — print / series hand-raise.
- `api/whop-webhook.js` — purchase.

In the Edenverse site repo:

- `lib/resend-audience.ts`, `app/api/subscribe/route.ts`, `app/api/contact/route.ts`.

---

## 7. Known open items

**Contacts have disappeared from Resend on their own.** Three addresses are
confirmed gone with no removal call ever made by any code or agent:
`edenverse88+wltest@gmail.com`, `paulmuresan77+sitetest1@gmail.com`, and four
signups reported as HTTP 200 into General that are not in the segment. It is not
indiscriminate — the three book test contacts from the same period all survived
intact, and all three segments are unchanged. **Cause unknown. This is a Resend
platform question, not a code question**, and it is the one thing that genuinely
bears on "no emails get lost." It needs a Resend support ticket, not another
code change.

**The PATCH merge-vs-replace question**, per section 4. Currently defused by not
using that path, not by having answered it.

---

## 8. Rules

- Never assert an ID, a segment name, or a topic state from memory. Re-read it.
- Never promote the PATCH fallback to the main path without testing merge vs
  replace first.
- Never send from `edenverse.co`.
- Deleting a contact or segment is irreversible and requires explicit
  confirmation naming the item.
- Book captures opt into My Beautiful World. Edenverse captures opt into
  Edenverse Codex. Nothing opts into both automatically.
