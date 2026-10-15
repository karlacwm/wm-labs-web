/**
 * WM LABS - Aquarium Launchpad Product Registry
 * 
 * To add a new product to the aquarium, simply add a new object to this array.
 * The aquarium engine automatically spawns a dedicated fish for each product!
 */

const PRODUCTS_DATA = [
  {
    id: 'aqua-os',
    name: 'AquaOS Core',
    tagline: 'High-Throughput Micro-Kernel for Edge Cloud Computing',
    species: 'clownfish',
    category: 'Infrastructure',
    status: 'In Development',
    statusType: 'dev', // 'dev' | 'beta' | 'alpha' | 'live'
    releaseEta: 'Q3 2027',
    leadDev: 'WM Labs Systems Team',
    accentColor: '#FF6B35',
    url: '#product-aqua-os',
    description: 'A revolutionary asynchronous runtime designed for high-density edge deployments. Built with zero-copy memory pipelines and self-healing worker pools.',
    highlights: [
      'Sub-millisecond cold start times across distributed clusters',
      'Built-in deterministic memory safety and telemetry',
      'Unified hardware acceleration for ARM64 and RISC-V'
    ],
    metrics: {
      stars: '1.4k',
      speed: '4.8x faster',
      stability: '99.99%'
    }
  },
  {
    id: 'deep-query',
    name: 'DeepQuery Engine',
    tagline: 'Real-Time Neural Vector Database for Complex Semantics',
    species: 'angelfish',
    category: 'AI & Data',
    status: 'Private Beta',
    statusType: 'beta',
    releaseEta: 'Q1 2027',
    leadDev: 'WM Labs Cognitive Unit',
    accentColor: '#38EF7D',
    url: '#product-deep-query',
    description: 'Blazing fast vector search engine operating at billion-scale embeddings. Features adaptive quantization and streaming multi-modal indexing.',
    highlights: [
      'Billion-scale ANN vector indexing with under 3ms recall latency',
      'Hybrid semantic + lexical scoring pipeline',
      'Zero-downtime hot index partitioning'
    ],
    metrics: {
      recall: '99.4%',
      latency: '< 3ms',
      scale: '10B+'
    }
  },
  {
    id: 'hyper-stream',
    name: 'HyperStream Net',
    tagline: 'Low-Latency Global P2P Mesh Communication Mesh',
    species: 'neontetra',
    category: 'Networking',
    status: 'Alpha Sandbox',
    statusType: 'alpha',
    releaseEta: 'Q4 2026',
    leadDev: 'WM Labs Telemetry Team',
    accentColor: '#00F2FE',
    url: '#product-hyper-stream',
    description: 'Decentralized high-bandwidth peer fabric that eliminates traditional gateway bottlenecks through intelligent multipath dynamic routing.',
    highlights: [
      'Automatic NAT traversal with zero-configuration mesh formation',
      'End-to-end post-quantum cryptographic primitives',
      'Adaptive packet FEC (Forward Error Correction)'
    ],
    metrics: {
      throughput: '120 Gbps',
      jitter: '< 0.2ms',
      peers: '500k+'
    }
  },
  {
    id: 'vault-pulse',
    name: 'VaultPulse Shield',
    tagline: 'Autonomous Threat Neutralization and Policy Guardrail',
    species: 'pufferfish',
    category: 'Cybersecurity',
    status: 'In Development',
    statusType: 'dev',
    releaseEta: 'Q2 2027',
    leadDev: 'WM Labs Security Group',
    accentColor: '#FFE066',
    url: '#product-vault-pulse',
    description: 'Dynamic sandbox isolation for modern microservice architectures. Proactively detects protocol anomalies and enforces cryptographic compliance.',
    highlights: [
      'eBPF kernel-level runtime behavioral auditing',
      'Real-time automated breach micro-segmentation',
      'Compliance automation for SOC2 and ISO27001'
    ],
    metrics: {
      blocks: '99.98%',
      overhead: '< 0.5%',
      audits: 'Instant'
    }
  },
  {
    id: 'aura-cloud',
    name: 'Aura Compute',
    tagline: 'Sustainable Green-Compute Workload Dispatcher',
    species: 'koi',
    category: 'Cloud Services',
    status: 'Public Preview',
    statusType: 'live',
    releaseEta: 'Available Now',
    leadDev: 'WM Labs Cloud Ops',
    accentColor: '#FF416C',
    url: '#product-aura-cloud',
    description: 'Workload scheduling system that routes compute batches to data centers running on 100% renewable energy grids in real-time.',
    highlights: [
      'Live carbon-intensity tracking across 40+ global regions',
      'Automatic cost optimization without SLA degradation',
      'Native Kubernetes controller integration'
    ],
    metrics: {
      carbonSaved: '-68%',
      savings: '42%',
      nodes: '12,000+'
    }
  },
  {
    id: 'biomimic-ui',
    name: 'PixelForge UI',
    tagline: 'Micro-Graphic Component Library for Modern Web Apps',
    species: 'guppy',
    category: 'Design Tools',
    status: 'Beta Testing',
    statusType: 'beta',
    releaseEta: 'Q1 2027',
    leadDev: 'WM Labs Creative Tech',
    accentColor: '#9D4EDD',
    url: '#product-pixelforge',
    description: 'An ultra-compact vector & pixel hybrid rendering engine for web interfaces. Delivers stunning retro-futuristic visuals with zero runtime bloat.',
    highlights: [
      'Sub-15kb bundle footprint with zero external dependencies',
      'Hardware-accelerated pixel canvas shaders',
      'Rich accessibility and keyboard navigation layer'
    ],
    metrics: {
      bundle: '14.2 KB',
      fps: '60 FPS',
      themes: '24'
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA };
}
