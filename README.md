<p align="center"><img src="assets/logo.svg" width="72" alt="XOXO"></p>

# I played on Apple’s Playground so You don’t have to

*I spent the whole of September inside Apple’s new Image Playground. Here is what came out.*

Kyle Choi · September 2026

Live page: **https://kylechoi101.github.io/xoxo-blog/** (hover any picture there for the iPhone model and the exact prompt; click to copy it).

> Every seed image on this page is AI-generated with Gemini. No photograph of a real person appears here or on the live page.

---

## Sep 1 · The first day

First, I generated avatars. An avatar is a mini version of you, so it has to carry all of your facial features. I drew seven facial types and checked whether Playground honored each one.

<p><img src="assets/img/0049.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0050.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0051.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0052.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0053.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0054.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"> <img src="assets/img/0055.jpg" width="110" alt="iPhone 15 Pro Max · iOS 27 beta"></p>

73 drawings in this round. The rest are in the dropdown on the live page.

## Sep 1 – 5 · Moods

Next, I wanted to see whether the avatars could be altered by mood keywords. At first I just said “make it look angry”, but Apple clearly had a different vision from mine. I also needed them to be kawaii. So I reversed the process: I had Gemini draw a reference image for each mood, had Claude describe that picture, and used the description as the keyword for the mood tile.

<table><tr><td align="center"><img src="assets/img/0104.jpg" width="300" alt="Reference art (Gemini), not drawn by Playground"><br><sub>Angry, as Gemini imagined it</sub></td><td align="center"><img src="assets/img/0105.jpg" width="300" alt="MacBook Pro 16″ (M4, Mac16,7) · macOS 27.0"><br><sub>Playground’s take on the same brief</sub></td></tr></table>

500 drawings in this round. The rest are in the dropdown on the live page.

## Sep 5 · First phone rounds

Then I checked whether the prompts survived on a real iPhone running an iOS close to release. As you can see, anything involving hands gave me problems. I also realized that Playground keeps the shape of the original picture, square or rectangular. My app goes square to rectangle.

<table><tr><td align="center"><img src="assets/img/0154.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 beta 8"><br><sub>The avatar, iOS 27 beta 8</sub></td><td align="center"><img src="assets/img/0155.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 beta 8"><br><sub>Celebrating. Hands are the hard part</sub></td></tr></table>

122 drawings in this round. The rest are in the dropdown on the live page.

## Sep 7 · A/B prompts

I tweaked the phrasing a bit more to see which wording survives a reliable regeneration cycle.

<table><tr><td align="center"><img src="assets/img/0184.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 beta 8"><br><sub>Prompt sent as text</sub></td><td align="center"><img src="assets/img/0185.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 beta 8"><br><sub>Same prompt, hidden behind a title</sub></td></tr></table>

30 drawings in this round. The rest are in the dropdown on the live page.

## Sep 8 – 12 · Realistic photos

I wanted to see whether the prompts held up on more realistic photos, not just portraits.

<table><tr><td align="center"><img src="assets/img/0234.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>From a real-looking photo</sub></td><td align="center"><img src="assets/img/0235.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>The same person, love you</sub></td></tr></table>

151 drawings in this round. The rest are in the dropdown on the live page.

## Sep 9 – 10 · Scoring against the reference

The results were getting better by then, so I built a scoring system to track the likeness and the kawaii-ness of each result.

<table><tr><td align="center"><img src="assets/img/0284.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>Body clause last: a head</sub></td><td align="center"><img src="assets/img/0285.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>Body clause first: the whole body, 3 of 3</sub></td></tr></table>

57 drawings in this round. The rest are in the dropdown on the live page.

## Sep 13 – 15 · Avatar labs

The real iOS 27 turned out a bit different from the betas. In the background it rewrites the prompt for its own on-device or Private Cloud Compute model. I had to find out which prompts survive the rewrite.

<table><tr><td align="center"><img src="assets/img/0334.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>The shipped prompt</sub></td><td align="center"><img src="assets/img/0335.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>Same words, after “The same person as in the picture”</sub></td></tr></table>

60 drawings in this round. The rest are in the dropdown on the live page.

## Sep 13 – 14 · All 54 through the app

Every mood redrawn from the avatar, on the phone, in one night.

<table><tr><td align="center"><img src="assets/img/0384.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27 RC"><br><sub>Nostalgic, shipping prompt</sub></td><td align="center"><img src="assets/img/0385.jpg" width="300" alt="MacBook Pro 16″ (M4, Mac16,7) · macOS 27.0"><br><sub>Nostalgic, copying the reference</sub></td></tr></table>

168 drawings in this round. The rest are in the dropdown on the live page.

## Sep 16 · Two phones, two iOS

iOS 26 has a Playground problem. If a user has not updated to iOS 27 yet, Playground draws glossy, unsettling 3D. iOS 27 draws flat kawaii characters. It was a hard bargain.

<table><tr><td align="center"><img src="assets/img/0402.jpg" width="300" alt="iPhone 17 · iOS 26.6"><br><sub>iPhone 17, iOS 26.6</sub></td><td align="center"><img src="assets/img/0403.jpg" width="300" alt="iPhone 16 · iOS 27.0"><br><sub>iPhone 16, iOS 27. Same photo, same prompt</sub></td></tr></table>

18 drawings in this round. The rest are in the dropdown on the live page.

## Sep 18 – 19 · Variance

A one-to-one comparison between an iPhone 15 Pro Max and an iPhone 18 Pro Max.

<table><tr><td align="center"><img src="assets/img/0452.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27.0"><br><sub>iPhone 15 Pro Max</sub></td><td align="center"><img src="assets/img/0453.jpg" width="300" alt="iPhone 18 Pro Max · iOS 27.0"><br><sub>iPhone 18 Pro Max, anime eyes</sub></td></tr></table>

61 drawings in this round. The rest are in the dropdown on the live page.

## Sep 20 · Apple’s new features

I tested the personalization and variety options. Minor drawbacks, no real improvement.

<table><tr><td align="center"><img src="assets/img/0468.jpg" width="300" alt="iPhone 18 Pro Max · iOS 27.0"><br><sub>With “large sparkling”</sub></td><td align="center"><img src="assets/img/0469.jpg" width="300" alt="iPhone 18 Pro Max · iOS 27.0"><br><sub>Without it. Two words did what the knobs could not</sub></td></tr></table>

16 drawings in this round. The rest are in the dropdown on the live page.

## Sep 20 · Reading the photo

I let Apple’s on-device model read the photo and write the feature keywords itself. This is still in research.

<table><tr><td align="center"><img src="assets/img/0472.jpg" width="300" alt="iPhone 15 Pro Max · iOS 27.0"><br><sub>The model said brown hair</sub></td><td align="center"><img src="assets/img/0473.jpg" width="300" alt="iPhone 18 Pro Max · iOS 27.0"><br><sub>The model said black hair. Same photo</sub></td></tr></table>

4 drawings in this round. The rest are in the dropdown on the live page.

## The numbers behind the pictures

Every score is a Vision feature-print distance or a blind 1-to-5 rubric, straight from the lab files. Hover any mark.

The four figures are drawn from the lab files on the live page: differentiation against drift for the three backgrounds, distance from control per prompt arm with each lab’s run-to-run floor, which prompt clauses survive the sheet’s rewrite per phone, and blind likeness and cuteness per avatar prompt.

---

Scores are Vision feature-print distances; smaller is more alike. Every drawing, round by round, is in the XOXO Drawing Archive.

Built from the XOXO lab record. Prompts on the hover cards are quoted as sent, so they keep their original spelling.
