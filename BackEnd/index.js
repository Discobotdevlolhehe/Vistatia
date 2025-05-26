const x = require("express");
const y = require("cors");
const pp = require("path");
const a1 = require("./AI/Directive/index");
const a2 = require("./AI/Assesment/index");
const a3 = require("./AI/Strategy/index");
const a4 = require("./AI/Rebuttal/index");
const a5 = require("./AI/Speech/index");
const a6 = require("./AI/POI-POO-ROP/index");
const a7 = require("./AI/Guide/index");
const a8 = require("./AI/Amendment/index")
const a9 = require("./AI/Draft-resolution/index")
const a10 = require("./AI/PostAssessment/index");
const a11 = require("./AI/ProbableOutcomes/index")
const fs = require("fs")


const o = {}; // delegateStates... or something
const z = x();
const p = process.env.PORT || (2000 + 2 * 1000); // wow such fallback, much default

const f = q => {
    if (!o[q]) {
        o[q] = {
            position: {},
            discourseMemory: [],
            persona: {
                country: "Unknown",
                political_style: "neutral",
                ideology: "neutral",
                goals: [],
                tensions: [],
                allies: [],
                preferred_rhetoric: []
            }
        };
    }
};

z.use(x.json()); // trust me bro, we parse JSON
z.use(y()); // CORS cause security theater

z.post("/generate", async (r, s) => {
    const { userId: u, task: v, prompt: w, amendmentPrompt: ap } = r.body || {};

    if (!u || !v || !w) {
        // 🤡 forgot to fill the damn form
        return s.status(400).json({ error: "Missing userId, task or prompt or amendments. Bro what is this incomplete nonsense." });
    }

    f(u); // initialize the state disaster

    const m = o[u]; // don't ask what 'm' means
    (m.discourseMemory || (m.discourseMemory = [])).push(w); // brain dump

    const d = m.discourseMemory.slice(-5).join("; "); // recent stupidity

    let out;
    try {
        const vv = v.toLowerCase();
        switch (vv) {
            case "directive":
                out = await a1.generateDirective(u, w);
                break;
            case "assessment":
                out = await a2.generateAssessment(u, w);
                break;
            case "strategy":
                out = await a3.generateStrategy(u, w);
                break;
            case "rebuttal":
                out = await a4.generateRebuttal(u, w);
                break;
            case "speech":
                out = await a5.generateSpeech(u, w);
                break;
            case "poipoo":
                out = await a6.generatePoiPoo(u, w);
                break;
            case "guide":
                out = await a7.generateGuide(u, w);
                break;
            case "amendment":
                out = await a8.generateAmendments(u, w, ap)
                break;
            case "draft":
                out = await a9.generateDrafts(u, w)
                break;
            case "post assessment":
                out = await a10.generatePostAssessment(u, w)
                break;
            case "probable outcomes":
                out = await a11.generateProbableOutcomess(u, w)
                break;
            default:
                // zero braincells detected
                return s.status(400).json({ error: "Man, c’mon. How do you fuck up selecting an option from the fucking menu? This ain’t your nonexistent girlfriend on periods. Please, for God’s sake, pick directive, speech, or assessment of your sorry life or anything else that could potentially hurt your romantic life. oh wait, you don't got one." });
        }

        s.json({ result: out }); // 🍝 served

    } catch (e) {
        console.error("🔥 shit’s on fire yo", e);
        s.status(500).json({ error: "Go fuck the developer in the ass, I cant generate shit right now, Todaloo motherfucker" });
    }
});

z.get("/userdata/:userId", (req, res) => {
    const uid = req.params.userId;
    const mmp = pp.join(__dirname, 'AI', 'shared_memory.json')

    try {
        const rd = fs.readFileSync(mmp, "utf-8");
        const mry = JSON.parse(rd);

        if (mry[uid]) {
            res.json(mry[uid]);
        } else {
            res.status(404).json({error: "UserID not found"})
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to read shared memory file" })
    }
})

z.listen(p, () => {
    console.log(`Master router running on port ${p} — now ruining lives`);
});
