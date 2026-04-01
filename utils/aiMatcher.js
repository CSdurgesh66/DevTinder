
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.Gemini_Api_Key);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });


async function scoreCheck(mySkills, theirSkills) {

    if (!mySkills?.length || !theirSkills?.length) {
        return {
            score: 50,
            reason: "Not enough skill data to score"
        }
    }

    const prompt = `
You are a developer matchmaking engine.
 
Your job: given two developers' skill lists, return a compatibility score
from 0 to 100 and one short sentence (max 12 words) explaining why.
 
Rules for scoring:
- 80-100 → very strong match (shared stack, or highly complementary skills)
- 60-79  → good match (some overlap or related technologies)
- 40-59  → weak match (different domains, little overlap)
- 0-39   → poor match (completely unrelated stacks)
 
Consider semantic relationships — e.g. React and Next.js are related,
Python and Machine Learning are related, Node.js and Express are related.
Also value complementary skills (frontend + backend = potential collaborators).
 
Developer A skills: ${mySkills.join(", ")}
Developer B skills: ${theirSkills.join(", ")}
 
Reply ONLY with valid JSON in this exact shape, nothing else:
{"score": <number>, "reason": "<string>"}
`.trim();

    try {

        const result = await model.generateContent(prompt);

        const raw = result.response.text().trim()

        const parsed = JSON.parse(raw);

        parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));

        return parsed;


    } catch (err) {
        console.log(err.message);
        return {
            score: 50,
            reason: "Failed to compute score"
        }

    }

}


async function scoreFeedBatch(mySkills, feedUsers) {

    const scored = await Promise.all(
        feedUsers.map(async (user) => {
            const {score , reason} = await scoreCheck(mySkills, user.skills || []);
            const plain = user.toObject ? user.toObject() : {...user};
            plain.matchScore = score;
            plain.matchReason = reason;
            return plain;
        })
    )

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored;

}

module.exports = {
    scoreCheck,
    scoreFeedBatch
}