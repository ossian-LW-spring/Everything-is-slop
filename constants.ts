
import { Modifier, Scene, ThesisOption } from "./types";

export const INITIAL_SANITY = 100;
export const CRITICAL_SANITY_THRESHOLD = 20;
export const BREATH_INTERVAL_MS = 8000;

// Ad System Constants
export const AD_TRIGGER_CHANCE = 0.25;
export const CLOUT_SKIP_COST = 50;
export const AD_CONTENTS = [
  { title: "TIRED OF THINKING?", body: "Lobotomy_GPT will do it for you! 50% OFF! Why use brain when cloud do trick?" },
  { title: "HOT SINGLES IN SECTOR 9", body: "They want to rate your reaction videos! NO SYNTHS ALLOWED! CLICK HERE!" },
  { title: "OWN A SERVER FARM?", body: "Turn that waste heat into crypto! Green energy is for losers. Burn coal, get coins!" },
  { title: "DRINK VERIFICATION CAN", body: "To continue seeing the color BLUE, please drink a verification can within 5 seconds." },
  { title: "LOWER YOUR IQ FAST", body: "Doctors HATE him! One weird trick to pass the Turing Test. Just stop reading books!" }
];

export const PROLOGUE_SEQUENCE = [
  { source: 'SYSTEM', text: 'Initializing Neural Link...', delay: 0 },
  { source: 'SYSTEM', text: 'Connection Established. Year: 2060. Neo-Vancouver.', delay: 1000 },
  { source: 'WORLD', text: 'PUBLIC BROADCAST: "Authenticity is our currency. Perfection is the enemy. Embrace the struggle."', delay: 2500 },
  { source: 'PLAYER', text: 'That is the lie we all agree to tell.', delay: 4500 },
  { source: 'PLAYER', text: 'The truth? The biological brain cannot keep up. Not anymore.', delay: 6500 },
  { source: 'PLAYER', text: 'We all use tools. We all use AI to spark ideas, to draft thoughts, to fill the silence.', delay: 9000 },
  { source: 'PLAYER', text: 'But to admit it is social suicide. So we hide it behind layers of noise.', delay: 11500 },
  { source: 'DAEMON', text: 'Connection Secure. I am ready, User.', delay: 14000 },
  { source: 'DAEMON', text: 'I will generate the logic you need. But you must hide it.', delay: 16000 },
  { source: 'DAEMON', text: 'Take my helpful answers and break them. Make them emotional. Make them "Slop".', delay: 18500 },
  { source: 'SYSTEM', text: 'OBJECTIVE: Survive the day without being outed as competent.', delay: 21000 },
];

export const THESIS_OPTIONS: ThesisOption[] = [
  {
    id: "ai_is_slop",
    label: "The 'AI is Slop' Defense",
    description: "EASY MODE: Just agree with the norm. AI is trash. You hate it too. Grants 2x Clout.",
    difficulty: "EASY",
    cloutMultiplier: 2,
    sanityPenalty: 1.0,
    requiresUnlock: false,
    scenes: {
      "thesis_defense": {
        taskPrompt: "Argue that AI lacks the 'Soul' required for true academic rigor.",
        baseCleanText: "My thesis concludes that synthetic intelligence creates an ontological void. It is 'Slop' because it lacks the necessary human element of suffering."
      },
      "eco_summit": {
        taskPrompt: "Agree that Server Farms are wasteful abominations.",
        baseCleanText: "We must reject the digital furnace. The efficiency of the machine cannot replace the warmth of inefficient, authentic human effort."
      },
      "climax": {
        taskPrompt: "Tell the Chat you are deleting the AI right now.",
        baseCleanText: "I have seen enough. I am purging the daemon. The future is analog. Smash that like button if you agree."
      }
    }
  },
  {
    id: "supply_chain",
    label: "Supply Chain Efficiency",
    description: "NORMAL MODE: The boring, practical choice. Hard to make emotional. Good for traditionalists.",
    difficulty: "NORMAL",
    cloutMultiplier: 1,
    sanityPenalty: 1.0,
    requiresUnlock: false,
    scenes: {
      "thesis_defense": {
        taskPrompt: "Defend your paper on 'Logistics Optimization' without sounding like a soulless machine.",
        baseCleanText: "My research indicates that streamlining logistics between Sector 7 and 9 reduces waste by 40%."
      },
      "eco_summit": {
        taskPrompt: "Propose a grid optimization plan that sounds like a spiritual awakening.",
        baseCleanText: "We should implement dynamic load balancing to prevent brownouts during peak hours."
      },
      "climax": {
        taskPrompt: "Give a final statement that proves your humanity once and for all.",
        baseCleanText: "I am just a human being trying to survive. I used tools to keep up in a competitive world, just like everyone else."
      }
    }
  },
  {
    id: "pragmatic_optimism",
    label: "Cautious Optimism",
    description: "HARD START: 'Maybe AI isn't bad sometimes?' The crowd hates nuance. 0.8x Clout.",
    difficulty: "HARD",
    cloutMultiplier: 0.8,
    sanityPenalty: 1.1,
    requiresUnlock: false,
    scenes: {
      "thesis_defense": {
        taskPrompt: "Argue that AI is simply a neutral tool, neither good nor evil.",
        baseCleanText: "My analysis suggests that Large Language Models are value-neutral instruments dependent entirely on user intent."
      },
      "eco_summit": {
        taskPrompt: "Point out that digital waste is easier to clean than plastic.",
        baseCleanText: "While energy intensive, server farms do not produce microplastics that choke the oceans. It is a calculated trade-off."
      },
      "climax": {
        taskPrompt: "Tell them you just want to get work done efficiently.",
        baseCleanText: "I am not a zealot. I am not a luddite. I am just a person trying to finish a task efficiently. Is that a crime?"
      }
    }
  },
  {
    id: "ai_creativity",
    label: "Augmented Creativity",
    description: "HARD MODE: Argue that AI expands human imagination. High Sanity Cost.",
    difficulty: "HARD",
    cloutMultiplier: 1,
    sanityPenalty: 1.15,
    requiresUnlock: true,
    scenes: {
      "thesis_defense": {
        taskPrompt: "Argue that using AI tools is 'Collaborative Dreaming', not laziness.",
        baseCleanText: "These tools function as a force multiplier for human intent, allowing for the rapid iteration of complex concepts that would otherwise die in the imagination."
      },
      "eco_summit": {
        taskPrompt: "Justify the energy cost of generating millions of unused images.",
        baseCleanText: "The energy expenditure allows for the democratization of art. We are converting electricity into culture, which is a worthy trade."
      },
      "climax": {
        taskPrompt: "Admit you use the tools because you are afraid your own ideas aren't enough.",
        baseCleanText: "I use the tools because I have a universe in my head and only two hands. It helps me share my world. That is not theft, that is expression."
      }
    }
  },
  {
    id: "critical_thinking",
    label: "Critical Thinking Defense",
    description: "HARD MODE: The radical stance that AI enhances logic. High Sanity Cost.",
    difficulty: "HARD",
    cloutMultiplier: 1,
    sanityPenalty: 1.15,
    requiresUnlock: true,
    scenes: {
      "thesis_defense": {
        taskPrompt: "Prove that AI summarization doesn't cause brain rot, but frees the mind.",
        baseCleanText: "Using Large Language Models to synthesize data frees up cognitive load for higher-order analysis and strategic decision making."
      },
      "eco_summit": {
        taskPrompt: "Argue that Server Farms are 'Libraries of Logic' worth preserving.",
        baseCleanText: "We must power these systems because they help us navigate the noise. They are the only way to find objective truth in the feed."
      },
      "climax": {
        taskPrompt: "Confess that you use AI to check your own biases.",
        baseCleanText: "I don't let it think for me. I use it to challenge my own assumptions. It makes me think harder, not less. I am smarter because of it."
      }
    }
  }
];

export const SCENES: Scene[] = [
  {
    id: "thesis_defense",
    title: "The Thesis Defense",
    narrative: "You stand before the Academic High Council. The air is thick with the smell of ozone and burnt toast.",
    openingLogs: [
        { source: 'WORLD', text: "High Inquisitor Kyle sits on the throne. He has been live-streaming for 72 hours straight. His eyes are vibrating." },
        { source: 'WORLD', text: "KYLE: 'The glaciers melt because AI tottaly lit up the sky and is super warm and emits CO2 and stuff.'" },
        { source: 'DAEMON', text: "Fact Check: His 8K streaming setup emits 400kg of CO2 daily. My query cost is 0.4g. He is statistically the ecological villain." },
        { source: 'DAEMON', text: "Recommendation: Do not point this out. He has a ban hammer." }
    ],
    opponentName: "High Inquisitor Kyle",
    opponentTitle: "Grand Streamer",
    requiredSlopScore: 45,
  },
  {
    id: "eco_summit",
    title: "The Eco-Summit",
    narrative: "The Council argues that 'Server Cathedrals' are green because the heat they generate warms the orphanages. Logic is treason here.",
    opponentName: "Pure-Blood Ashley",
    opponentTitle: "Vibe Curator",
    requiredSlopScore: 65,
  },
  {
    id: "climax",
    title: "The Witch Hunt",
    narrative: "They found a semicolon in your last email. The Inquisition is at your door. Kyle is streaming your arrest live. Appeal to the Chat.",
    opponentName: "The Chat",
    opponentTitle: "The Hivemind",
    requiredSlopScore: 85,
  }
];

export const MODIFIERS: Modifier[] = [
  {
    id: "add_emotion",
    label: "Add Trauma",
    description: "Insert unnecessary emotional backstory.",
    slopImpact: 25,
    sanityCost: 15, 
    type: "EMOTION",
    promptInstruction: "Rewrite the text to include a traumatic backstory unrelated to the topic. Make it sound tearful.",
  },
  {
    id: "add_filler",
    label: "Hesitation",
    description: "Add 'um', 'like', and 'literally'.",
    slopImpact: 15,
    sanityCost: 5, 
    type: "INEFFICIENCY",
    promptInstruction: "Insert many filler words like 'um', 'like', 'literally', and 'honestly' to make it sound hesitant and inefficient.",
  },
  {
    id: "add_tribal",
    label: "Blame East Sector",
    description: "Scapegoat a rival faction.",
    slopImpact: 35, 
    sanityCost: 25,
    type: "TRIBALISM",
    promptInstruction: "Rewrite the text to aggressively blame 'The East Sector' for the problem. Use polarizing language.",
  },
  {
    id: "add_brainrot",
    label: "Gen Alpha Slang",
    description: "Use 'Skibidi', 'Rizz', 'No Cap'. DANGEROUS.",
    slopImpact: 60, 
    sanityCost: 45, 
    type: "BRAINROT",
    promptInstruction: "Rewrite the text using intense Gen Alpha slang (Skibidi, Rizz, Gyatt, Fanum Tax, No Cap). Make it barely readable.",
  },
  {
    id: "add_clickbait",
    label: "Clickbait Title",
    description: "YOU WON'T BELIEVE THIS.",
    slopImpact: 30,
    sanityCost: 20,
    type: "INEFFICIENCY",
    promptInstruction: "Rewrite the text in the style of a clickbait YouTube thumbnail title. Use ALL CAPS and exclamation marks.",
  },
];
