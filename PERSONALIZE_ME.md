# Personalization Checklist

The site is already set up with your answers:

1. Recipient name: **Mille**
2. Sender name: **Gingie**
3. Messages: placeholder romantic messages are included, but you can edit them later in `config.js`
4. Animals: dog / golden retriever theme is included, plus cute animals
5. Flowers: peony, fuchsia, hydrangea, tulip, meadow, and mixed final garden themes
6. Vibe: cute and romantic, with slightly different daily styles
7. Countdown feeling: she should look forward to seeing you in Belgium
8. Final day: says it is finally over and that you will see each other soon

## Where to edit the six messages

Open `config.js` and search for:

```text
messageTitle:
message:
finalLine:
```

There are six daily bloom entries:

- `2026-07-05`
- `2026-07-06`
- `2026-07-07`
- `2026-07-08`
- `2026-07-09`
- `2026-07-10`

Edit only the text between the backticks after `message:` if you want to replace the message body.

Example:

```js
message: `
Write your personal message here.
`.trim(),
```

## Preview links

Use these to test before sending:

```text
?day=1
?day=2
?day=3
?day=4
?day=5
?day=6
```

When sending it to her, send the normal link without `?day=`.
