# For Anwesha 🩷

A one-page interactive birthday website: passcode gate → heart tree & flowers →
cake building + slicing → sliding photo puzzle → balloon pop with notes →
favourite photo → "the question" → final photo gallery.

Everything runs in the browser — no server, no build step. You can open
`index.html` directly, or host it for free on GitHub Pages (steps below).

---

## 1. Replace the placeholder photos

Right now every photo is a pink placeholder image so the site works out of
the box. Replace these files **with the same names** inside `assets/images/`:

| File | Used for |
|---|---|
| `photo1.jpg` → `photo5.jpg` | The 5 balloons (each pops to reveal one) — also reused in the final gallery |
| `puzzle.jpg` | The sliding picture puzzle |
| `favorite.jpg` | The centered "favourite picture" scene |
| `celebration.gif` | Shown if she answers "Yes" (a placeholder confetti heart gif is included — swap it for any gif you like, or delete it and the site will just skip it gracefully) |

Any normal photo works — square-ish or portrait photos look best. Keep file
sizes reasonable (under ~1–2MB each) so the site loads quickly on her phone.

## 2. Add your background music

Drop an MP3 file named exactly `background-music.mp3` into
`assets/music/`, replacing the placeholder chime that's there now.
Keep it reasonably short (2–4 min) — it loops automatically.

**Note on autoplay:** phones and browsers block audio with sound from
playing automatically until the user has interacted with the page. Since
she has to type the passcode and tap "Unlock" first, that tap counts as
interaction, so the music will start right after she unlocks. A small
🔊 button in the top-right corner also lets her mute/unmute any time.

## 3. Customize the words (optional)

Open `js/script.js` and edit the `CONFIG` object at the very top:
- `passcode` — currently `"ILOVEYOU"`
- `balloonNotes` — the 5 short notes behind each balloon
- `finalParagraph` — the paragraph under the favourite photo

Everything else (scene titles, the question text, the "yes/no" responses)
is in `index.html` and `js/script.js` if you want to tweak wording further.

## 4. Knowing her answer (Yes / No)

Since this is just a static website (no backend server behind it), you can't
technically get a text message or push notification straight from it. But
you can get an **email** the instant she taps Yes or No, using a free
service called **Formspree** — it just collects the answer and emails it to
you. No coding needed:

1. Go to **formspree.io** and sign up (free — just an email + password).
2. Click **"+ New Form"**, give it any name (e.g. "Birthday site"), and
   create it. It'll show you a link that looks like:
   `https://formspree.io/f/abcd1234`
3. Copy that link.
4. Open `js/script.js` in this folder, find this line near the top:
   ```js
   notifyURL: "",
   ```
   and paste your link between the quotes:
   ```js
   notifyURL: "https://formspree.io/f/abcd1234",
   ```
5. Save the file. That's the whole setup. The moment she taps Yes or No,
   an email lands in your inbox telling you which one she picked.

If you leave `notifyURL: ""` as it is, the site still works perfectly —
you just won't get notified, you'd have to ask her yourself.

**If you'd rather use Discord instead of email:** create a webhook in any
Discord server you're in (**Server Settings → Integrations → Webhooks → New
Webhook → Copy Webhook URL**) and paste that URL into the exact same
`notifyURL: ""` spot instead. The code works with either link, unchanged —
you don't need to pick in advance, just paste whichever link you end up with.

## 5. Hosting it for free on GitHub Pages

1. Create a new **public** GitHub repository (e.g. `for-anwesha`).
2. Upload everything in this folder — `index.html`, `css/`, `js/`, `assets/`,
   keeping the folder structure exactly as-is.
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`, then **Save**.
5. GitHub gives you a live link like `https://yourusername.github.io/for-anwesha/`
   after a minute or two. That's the link you send her.

**A privacy note:** GitHub Pages repos are public by default unless you have
GitHub Pro/Team (private repos can still use Pages there). If you don't want
anyone stumbling onto the repo and seeing her photos, either:
- keep the repository itself unlisted and only share the live link (people
  would need to guess the exact URL), or
- use a Pro/Team plan for a private repo + Pages, or
- host it on Netlify or Vercel instead (both have simple free tiers and
  support private/unlisted deployments more easily) — just drag-and-drop
  this folder onto Netlify's dashboard.

## 6. Testing before you send it

Open `index.html` in your browser and click through the whole flow once:
unlock → tap to grow the tree → drag the knife across the cake → solve the
puzzle → pop all 5 balloons → read the paragraph → answer the question. Try
it on your phone too, since that's most likely how she'll open it.

Happy birthday to her. 🩷
