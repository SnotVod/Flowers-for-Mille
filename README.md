# Daily Bloom Message Site

This is a small romantic website that automatically changes every day from **July 5 through July 10, 2026**.

You only need to send **one link**. The site checks the visitor's own device date and shows the correct daily flower, animation, animals, and message.

## What it does

- July 5: Bloom 1
- July 6: Bloom 2
- July 7: Bloom 3
- July 8: Bloom 4
- July 9: Bloom 5
- July 10: Bloom 6 / final bloom
- Before July 5: shows a locked garden message
- After July 10: shows a finished garden message
- If the page is left open when the date changes, it checks every minute and refreshes to the new day
- Works on phones, tablets, and laptops

## How the automatic day change works

The website uses JavaScript's `new Date()` to read the date from the device it is opened on. That means it changes at midnight according to that device's local date/time.

Important note: because it uses the device clock, someone could preview future days by changing their device date. For this kind of sweet private gift, that is usually fine. If you need stronger locking, you would need a backend/server clock.

## How to preview every day

Open `index.html` normally to see the real current day.

To preview specific days, add these to the end of the URL:

```text
?day=1
?day=2
?day=3
?day=4
?day=5
?day=6
```

Examples:

```text
index.html?day=1
index.html?day=6
```

After hosting:

```text
https://your-site-name.netlify.app/?day=1
https://your-site-name.netlify.app/?day=6
```

## How to personalize it

Open `config.js` and edit:

- `recipientName`
- `senderName`
- each day's `messageTitle`
- each day's `message`
- each day's `finalLine`
- animals, flowers, and colors if you want

The current version is already personalized for:

- Recipient: Beautiful Norwegian
- Sender: Gingie
- Theme: cute and romantic
- Animals: includes her golden retriever / dog theme
- Flowers: peony-inspired, fuchsia, hydrangea, tulip, meadow, and final garden moods
- Final day: says the daily garden is finally over and that you will see each other soon in Belgium

## How to share it as one link

The easiest way:

1. Unzip the folder.
2. Go to Netlify Drop.
3. Drag the whole folder into the page.
4. Netlify gives you a link.
5. Send that one link.

Do not send the `?day=1` preview link to her unless you want her to preview a specific day. Send the normal link without `?day=` so it updates automatically.
