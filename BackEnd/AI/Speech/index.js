const ax = require("axios");
const fz = require("fs");
const pp = require("path");

const KEY = "placeholder"; // API sadness key
const BLOB = pp.join(__dirname, "..", "shared_memory.json"); // mental vomit storage

// psychic memory recall
function suckMemory() {
  return fz.existsSync(BLOB) ? JSON.parse(fz.readFileSync(BLOB)) : {};
}

// psychic memory overwrite
function yeetMemory(brain) {
  fz.writeFileSync(BLOB, JSON.stringify(brain, null, 2));
}

const SYSTEM_THOUGHTS = fz.readFileSync(pp.join(__dirname, "system_prompt.txt"), "utf-8");

async function generateSpeech(user, prompt) {
  let mind = suckMemory();

  // sanity check or what's left of it
  if (!mind[user]) {
    mind[user] = { speeches: [] };
  } else if (!Array.isArray(mind[user].speeches)) {
    mind[user].speeches = [];
  }

  const chatBlob = [
    { role: "system", content: SYSTEM_THOUGHTS },
    { role: "user", content: prompt }
  ];

  let res;
  try {
    res = await ax.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: chatBlob,
        temperature: 1,
        max_tokens: 12800
      },
      {
        headers: {
          Authorization: "Bearer " + KEY,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (e) {
    console.error("oh no axios go boom", e);
    throw e;
  }

  const txt = (
    res &&
    res.data &&
    res.data.choices &&
    res.data.choices[0] &&
    res.data.choices[0].message &&
    res.data.choices[0].message.content
  ) || "[blank stare]";

  mind[user].speeches.push({ prompt: prompt, speech: txt });
  yeetMemory(mind);

  return txt;
}

// vomit it out into commonJS void
module.exports = {
  generateSpeech: generateSpeech
};
