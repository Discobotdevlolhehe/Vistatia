const ax = require("axios");
const fz = require("fs");
const pp = require("path");
const { use } = require("react");

const KEY = "placeholder"; // API sadness key
const BLOB = pp.join(__dirname, "..", "shared_memory.json"); // mental vomit storage

//memory shyt
function loadIdiotsMemory(user) {
    const mem = yeetMemory();
    const ud = mem[user] || {};
    let comp = "";

    for (const type in ud) {
        if(!Array.isArray(ud[type])) continue;
        compiled += `\n\n### ${type.toUpperCase()} TASKS ###\n`;
        userData[type].forEach((entry, i) => {
            compiled += `\n[${i + 1}] Prompt: ${entry.prompt}`;
            if (entry.task) compiled += `\nResponse: ${entry.task}`;
        });
    }
}

// psychic memory recall
function suckMemory() {
  return fz.existsSync(BLOB) ? JSON.parse(fz.readFileSync(BLOB)) : {};
}

// psychic memory overwrite
function yeetMemory(brain) {
  fz.writeFileSync(BLOB, JSON.stringify(brain, null, 2));
}

const SYSTEM_THOUGHTS = fz.readFileSync(pp.join(__dirname, "system_prompt.txt"), "utf-8");

async function generateProbableOutcomess(user, prompt) {
  let mind = suckMemory();

  const mt = loadIdiotsMemory(user);

  const fpt = `Here is the delegate's overall activity log:\n\n${mt}\n\n` +
        `Based on this, analyze the strengths, weaknesses, bloc alignment, and likely impact of proposals. Estimate 2-3 possible voting outcomes with justification.`;

  // sanity check or what's left of it
  if (!mind[user]) {
    mind[user] = { outcomes: [] };
  } else if (!Array.isArray(mind[user].outcomes)) {
    mind[user].outcomes = [];
  }

  const chatBlob = [
    { role: "system", content: SYSTEM_THOUGHTS },
    { role: "user", content: fpt }
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

  mind[user].outcomes.push({ prompt: prompt, outcomes: txt });
  yeetMemory(mind);

  return txt;
}

// vomit it out into commonJS void
module.exports = {
  generateProbableOutcomess: generateProbableOutcomess
};
