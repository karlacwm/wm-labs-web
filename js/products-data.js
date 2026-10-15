/**
 * WM LABS - Aquarium Launchpad Product Registry
 * 
 * Each active product in this array spawns an interactive fish in the digital aquarium.
 */

const PRODUCTS_DATA = [
  // 1. GoalCoach (Live Product)
  {
    id: 'goalcoach',
    name: 'GoalCoach',
    tagline: 'Adaptive AI Language Coach for Goal-Oriented Learners',
    category: 'AI & Education',
    status: 'Live MVP',
    releaseEta: 'Available Now',
    leadDev: 'WM Labs AI Education Group',
    accentColor: '#FF6B35',
    url: 'https://goalcoach.ai.studio',
    githubUrl: 'https://github.com/karlacwm/GoalCoach-web',
    description: 'State-driven adaptive language learning for goal-oriented learners and professionals. Built on a closed state-driven loop with dual AI agents and LLM tool calls: a Planning Agent constructs dynamic, personalized learning paths while a Teaching Agent determines real-time pedagogy, adaptive exercises, and situational practice.',
    highlights: [
      'Dual-Agent Architecture: Planning Agent designs learning paths; Teaching Agent decides what and how to teach',
      'Closed State-Driven Loop: Synchronized curriculum state evolves dynamically with student mastery',
      'LLM Tool Calling: Autonomous evaluation, exercise retrieval, and adaptive task generation',
      'Goal-Oriented Roleplay & Real-time Conversation: Authentic situational immersion and feedback'
    ],
    metrics: {
      status: 'Live Web App',
      language: 'Chinese (Mandarin)',
      engine: 'Agentic System'
    }
  },

  // 2. PastPort (In Development Prototype)
  {
    id: 'pastport',
    name: 'PastPort',
    tagline: 'Photographic Heritage Mystery & Narrative Simulation Platform',
    category: 'Interactive Narrative',
    status: 'In Development',
    releaseEta: 'Proposal Prototype',
    leadDev: 'WM Labs Heritage Tech',
    accentColor: '#38EF7D',
    url: 'https://github.com/Psyche0920/PastPort',
    githubUrl: 'https://github.com/Psyche0920/PastPort',
    description: 'An online photographic narrative platform that transforms authentic cultural heritage archives and real site photography into consequential historical deduction games. Players step into archival roles, examining photographic evidence, interrogating ledgers, and resolving heritage mysteries.',
    highlights: [
      'Photographic observation and evidence-based historical deduction',
      'Consequential branching choices with narrative relationship outcomes',
      'Reusable modular production framework for cultural heritage sites',
      'Pilot case set in the historical 1430s Muradiye complex in Bursa'
    ],
    metrics: {
      pilot: 'Muradiye Complex',
      format: '2D Photographic Game',
      foundation: 'Archival Heritage'
    }
  },

  // 3. Coming Soon (Product 3)
  {
    id: 'coming-soon-1',
    name: 'Coming Soon',
    tagline: '',
    category: '',
    status: 'Coming Soon',
    releaseEta: 'TBA',
    leadDev: 'WM Labs',
    accentColor: '#00F2FE',
    url: '#',
    description: '',
    highlights: [
      'In active research & development',
      'Stay tuned for upcoming announcement'
    ],
    metrics: {
      status: 'Developing',
      phase: 'R&D',
      access: 'Upcoming'
    }
  },

  // 4. Coming Soon (Product 4)
  {
    id: 'coming-soon-2',
    name: 'Coming Soon',
    tagline: '',
    category: '',
    status: 'Coming Soon',
    releaseEta: 'TBA',
    leadDev: 'WM Labs',
    accentColor: '#FFE066',
    url: '#',
    description: '',
    highlights: [
      'In active prototyping',
      'Stay tuned for upcoming announcement'
    ],
    metrics: {
      status: 'Developing',
      phase: 'Prototype',
      access: 'Upcoming'
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA };
}
