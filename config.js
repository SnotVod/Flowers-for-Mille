/*
  DAILY BLOOM CONFIG
  Edit this file to personalize the site.

  IMPORTANT:
  - The app automatically chooses the bloom by the visitor's device date.
  - One link is enough. You do NOT need to send a new site every day.
  - If the page stays open past midnight, it will refresh itself and show the new day.
  - You can preview each day before sending it with:
      index.html?day=1
      index.html?day=2
      ...
      index.html?day=6
  - You can also preview by date:
      index.html?date=2026-07-05

  The schedule below is July 5 through July 10, 2026.
*/
window.BLOOM_CONFIG = {
  recipientName: "Mille",
  senderName: "Gingie",

  // The visitor's own device date is used. Keep these dates in YYYY-MM-DD format.
  startDate: "2026-07-05",
  endDate: "2026-07-10",

  lockedTitle: "A little garden is growing for you",
  lockedMessage: "The first flower opens on July 5. Come back then and click the big flower in the middle.",
  finishedTitle: "The garden is fully bloomed",
  finishedMessage: "The last bloom opened on July 10. I hope every flower made you smile — and that seeing each other in Belgium feels even closer now.",

  dailyBlooms: [
    {
      date: "2026-07-05",
      dayLabel: "Bloom 1 of 6 · July 5 · Peony morning",
      mood: "sunrise",
      bloomStyle: "peonyUnfurl",
      tapHint: "Click the peony bud",
      messageTitle: "Day 1: A little peony for you 🌸",
      message: `
Mille,

This is the first little bloom in your garden. I wanted to make you something that changes every day, so you have a small reason to smile while I can't talk a lot to you.

I miss you a lot, and I hope this little flower makes you think of me too.
      `.trim(),
      finalLine: "This is the first flower, And I hope this works haha. Jeg elsker deg.",
      flowerType: "peony",
      animals: ["dog", "butterfly", "rabbit", "bird", "squirrel"],
      smallFlowers: ["peony", "tulip", "hydrangea", "bouquet"]
    },
    {
      date: "2026-07-06",
      dayLabel: "Bloom 2 of 6 · July 6 · Rose blush",
      mood: "peach",
      bloomStyle: "roseSpiral",
      tapHint: "Click the rosebud",
      messageTitle: "Day 2: Cute little chaos 🐾",
      message: `
Mille,

Today’s garden has extra paws in it, because obviously Bobby needs to be here as well. I hope he is in the garden, if not, he might be in the next :).

I really really like talking to you so I'm sad we can't do it right now. I hope you are having nice and calm days without too much stress.
      `.trim(),
      finalLine: "A tiny bloom, a tiny paw print, and a big thought of you.",
      flowerType: "rose",
      animals: ["dog", "rabbit", "hedgehog", "squirrel", "butterfly"],
      smallFlowers: ["rose", "peony", "tulip", "meadow"]
    },
    {
      date: "2026-07-07",
      dayLabel: "Bloom 3 of 6 · July 7 · Hydrangea glow",
      mood: "lavender",
      bloomStyle: "hydrangeaFirefly",
      tapHint: "Click the hydrangea glow",
      messageTitle: "Day 3: Little moments",
      message: `
Mille,

Some days thinking of you makes the day feel brighter, and some days it makes me feel a little warmer. I hope this little bloom can do the same for you.

We have this flower in our garden as well. I can't wait to see you in Belgium and show you them while we sit outside and chill.
      `.trim(),
      finalLine: "You are on my mind more than you probably realize.",
      flowerType: "hydrangea",
      animals: ["dog", "butterfly", "bee", "bird", "rabbit", "hedgehog"],
      smallFlowers: ["hydrangea", "peony", "bouquet", "tulip"]
    },
    {
      date: "2026-07-08",
      dayLabel: "Bloom 4 of 6 · July 8 · Tulip moonlight",
      mood: "moonlight",
      bloomStyle: "tulipMoonrise",
      tapHint: "Click the moonlit tulip",
      messageTitle: "Day 4: A calm little place 🌙",
      message: `
Mille,

I hope you are having a good day and are enjoying the flowers. I wanted to make this one a little calmer, because I know you have been working a lot lately.

Just a reminder that I love you and that I think about you a lot. I hope this  tulip can make you feel a warmer, and a little closer to me.
      `.trim(),
      finalLine: "Until then, here is nice and cozy flower in the night. I wish I could cuddle up next to you while we fall asleep",
      flowerType: "tulip",
      animals: ["dog", "dove", "owl", "butterfly", "rabbit", "hedgehog"],
      smallFlowers: ["tulip", "hydrangea", "peony"]
    },
    {
      date: "2026-07-09",
      dayLabel: "Bloom 5 of 6 · July 9 · Golden meadow",
      mood: "meadow",
      bloomStyle: "sunflowerBeeDance",
      tapHint: "Click the sunny meadow bloom",
      messageTitle: "Day 5: Almost there 🐝",
      message: `
Mille,

This one is a warm little meadow, because we are getting closer.

Even while walking and having fun, I am counting down the days until I can really talk to you again. I hope you have been enjoying the flowers thus far.
      `.trim(),
      finalLine: "Tomorrow is a special one, I hope you are looking forward to it as much as I am. I love you.",
      flowerType: "meadow",
      animals: ["dog", "bee", "butterfly", "bird", "rabbit", "squirrel"],
      smallFlowers: ["meadow", "tulip", "peony", "bouquet"]
    },
    {
      date: "2026-07-10",
      dayLabel: "Bloom 6 of 6 · July 10 · Belgium soon",
      mood: "forest",
      bloomStyle: "memoryBouquet",
      tapHint: "Click the final bloom",
      messageTitle: "Day 6: The final bloom 💐",
      message: `
Mille,

I hope you like this bouquet. I'm sad I can't give you a real one, but I hope this also fills your heart. 

But the best part is not the last flower. The best part is that we will see each other soon, and Belgium is starting to feel close enough to touch.

I hope this made you smile, and I hope it made you look forward to seeing me even a little more.
      `.trim(),
      finalLine: "The garden is complete. Now I just want to see you soon. Jeg elsker deg.",
      flowerType: "bouquet",
      animals: ["dog", "butterfly", "rabbit", "bee", "bird", "fox", "squirrel", "hedgehog"],
      smallFlowers: ["bouquet", "peony", "rose", "meadow", "tulip", "hydrangea"]
    }
  ]
};
