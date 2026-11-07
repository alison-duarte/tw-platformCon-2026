/**
 * Static quiz content. Basic questions first; advanced questions (deck-based) last.
 * Correct answers spread over A to D, with no letter more than twice (see tests).
 * Each option carries both languages, so PT and EN can never drift out of order.
 */
export const QUESTIONS = Object.freeze([
  {
    id: 1,
    correctIndex: 2,
    difficulty: 'basic',
    category: { pt: 'Evolução do DevOps', en: 'DevOps evolution' },
    question: {
      pt: "Como resolver a sobrecarga do desenvolvedor no modelo 'você cria, você opera' (DevOps tradicional)?",
      en: "How should organizations solve developer burnout in the traditional 'you build it, you run it' model?",
    },
    options: [
      { pt: 'Aumentar as reuniões diárias e exigir plantões noturnos', en: 'Schedule more daily syncs and enforce night-shift on-calls' },
      { pt: 'Contratar mais pessoas só para abrir e aprovar chamados manuais', en: 'Hire more personnel solely to process manual approval tickets' },
      { pt: 'Construir uma plataforma de engenharia como produto interno com caminhos pavimentados (paved paths)', en: 'Build an engineering platform as an internal product with paved paths' },
      { pt: 'Abolir a nuvem e voltar a comprar servidores físicos', en: 'Abandon the cloud and return to on-premise physical servers' },
    ],
    explanation: {
      pt: "A Thoughtworks destaca que a engenharia de plataforma abstrai a complexidade operacional da nuvem. O objetivo é fornecer 'paved roads' e autoatendimento, reduzindo a fadiga cognitiva dos times de produto.",
      en: 'Thoughtworks emphasizes that platform engineering abstracts operational cloud complexity through paved roads and self-service, eliminating cognitive overload.',
    },
  },
  {
    id: 2,
    correctIndex: 0,
    difficulty: 'basic',
    category: { pt: 'Platform as a product', en: 'Platform as a product' },
    question: {
      pt: "Qual é a regra de ouro do 'Platform as a Product' na visão da Thoughtworks?",
      en: "What is the golden rule of 'Platform as a Product' in Thoughtworks' view?",
    },
    options: [
      { pt: 'Tratar desenvolvedores como clientes, criando ferramentas que eles realmente escolham usar', en: 'Treat developers as customers, building tools they genuinely choose to use' },
      { pt: 'Obrigar a adoção por decreto da diretoria com auditorias surpresa', en: 'Mandate adoption through executive orders and surprise audits' },
      { pt: 'Esconder a documentação para forçar os squads a agendarem reuniões', en: 'Hide technical documentation to force teams into alignment meetings' },
      { pt: 'Criar a infraestrutura mais complexa possível para justificar o time', en: "Design overly complex infrastructure to justify the team's existence" },
    ],
    explanation: {
      pt: 'A Thoughtworks defende que a adoção de plataformas internas deve ser voluntária e orientada a valor. O time de plataforma opera como um time de produto: com Product Manager, foco em DevEx e SLOs sólidos.',
      en: 'Thoughtworks believes internal platform adoption should be voluntary and value-driven. Platform teams operate with product managers, clear DevEx metrics and solid SLOs.',
    },
  },
  {
    id: 3,
    correctIndex: 3,
    difficulty: 'basic',
    category: { pt: 'Blocos da plataforma', en: 'Platform architecture' },
    question: {
      pt: 'Quais são os quatro blocos fundamentais da arquitetura de uma Plataforma segundo aThoughtworks?',
      en: "Which four building blocks form an engineering platform in Thoughtworks' blueprint?",
    },
    options: [
      { pt: 'Docker, Kubernetes, Terraform e Helm', en: 'Docker, Kubernetes, Terraform and Helm' },
      { pt: 'Frontend, backend, banco de dados e API gateway', en: 'Frontend, backend, database and API gateway' },
      { pt: 'Jira, Slack, planilhas e e-mails de homologação', en: 'Jira, Slack, spreadsheets and sign-off emails' },
      { pt: 'Delivery Infra Hub, Service Hub, Knowledge Hub e Portal DevEx', en: 'Delivery Infra Hub, Service Hub, Knowledge Hub and DevEx Portal' },
    ],
    explanation: {
      pt: 'A Thoughtworks estrutura a plataforma em quatro pilares: Delivery Infra Hub (infra elástica e CI/CD), Service Hub (descoberta de APIs e eventos), Knowledge Hub (padrões e ADRs) e Portal DevEx (interface unificada de autoatendimento).',
      en: 'Thoughtworks organizes platforms into four pillars: Delivery Infra Hub (CI/CD and infra), Service Hub (APIs and events), Knowledge Hub (guidelines and ADRs) and DevEx Portal (unified interface).',
    },
  },
  {
    id: 4,
    correctIndex: 1,
    difficulty: 'basic',
    category: { pt: 'Impacto no mundo real', en: 'Real-world impact' },
    question: {
      pt: 'Com a plataforma NEO (Thoughtworks) e em clientes como TELUS, qual foi o ganho no tempo de provisionamento?',
      en: 'In the NEO platform (Thoughtworks) and TELUS, what was the impact on infrastructure provisioning?',
    },
    options: [
      { pt: 'Apenas 5% de melhoria marginal', en: 'Only a 5% marginal improvement' },
      { pt: 'Queda de 90%: de semanas de espera para minutos via autoatendimento', en: '90% reduction: from weeks of waiting down to minutes via self-service' },
      { pt: 'Nenhuma mudança, apenas os formulários mudaram de cor', en: 'Zero change, just recolored request tickets' },
      { pt: 'O tempo aumentou para exigir mais comitês de aprovação', en: 'Provisioning time increased due to extra approval gates' },
    ],
    explanation: {
      pt: 'Ao substituir chamados manuais por templates de serviço e infraestrutura como código (Project Catalyst), o tempo para ir da ideia à primeira linha de código em produção caiu mais de 90%.',
      en: 'By replacing manual ticketing with pre-baked service templates and infrastructure as code, time from idea to first line of production code dropped by 90%.',
    },
  },
  {
    id: 5,
    correctIndex: 2,
    difficulty: 'basic',
    category: { pt: 'Portais DevEx e AI', en: 'DevEx portals and AI' },
    question: {
      pt: 'Qual framework open source (CNCF) a Thoughtworks adota como base para portais de autoatendimento?',
      en: 'Which CNCF open-source framework does Thoughtworks champion for building developer portals?',
    },
    options: [
      { pt: 'WordPress Developer Edition', en: 'WordPress Developer Edition' },
      { pt: 'Microsoft SharePoint Intranet', en: 'Microsoft SharePoint Intranet' },
      { pt: 'Backstage.io (criado pelo Spotify e incubado pela CNCF)', en: 'Backstage.io (created by Spotify and incubated by CNCF)' },
      { pt: 'Redmine Wiki Corporativo', en: 'Redmine Corporate Wiki' },
    ],
    explanation: {
      pt: 'O Backstage.io é o framework de referência adotado pela Thoughtworks por sua arquitetura modular de plugins e catálogo centralizado de microsserviços, servindo de base sólida inclusive para esteiras de IA.',
      en: "Backstage.io is Thoughtworks' reference framework for developer portals, offering a plugin architecture and unified software catalog that also acts as a foundation for AI workflows.",
    },
  },
  {
    id: 6,
    correctIndex: 1,
    difficulty: 'advanced',
    category: { pt: 'Arquitetura & Divisão de Papéis', en: 'Architecture & role split' },
    question: {
      pt: 'Mesmo com uma plataforma de entrega madura abstraindo a infraestrutura, o que continua sendo de responsabilidade direta do time de produto?',
      en: 'Even with a mature delivery platform abstracting the infrastructure, what remains the product team\'s direct responsibility?',
    },
    options: [
      { pt: 'Provisionamento de infraestrutura elástica e node scaling', en: 'Elastic infrastructure provisioning and node scaling' },
      { pt: 'Tolerância a falhas na aplicação, migração de dados e tracing distribuído', en: 'Application fault tolerance, database migration and distributed tracing' },
      { pt: 'Orquestração de runners e pipelines de entrega', en: 'Runner orchestration and delivery pipelines' },
      { pt: 'Backup e recuperação de metadados do cluster', en: 'Cluster metadata backup and restore' },
    ],
    explanation: {
      pt: 'A plataforma elimina o trabalho operacional pesado (como orquestração de containers e resiliência de cluster), mas não substitui boas práticas de engenharia de software. Resiliência da aplicação, migrações e rastreamento distribuído continuam sob domínio do time de desenvolvimento.',
      en: 'The platform abstracts heavy operational scaffolding (like container orchestration and cluster failover), but it doesn\'t replace solid engineering practices. Application resilience, migrations and distributed tracing remain with the product team.',
    },
  },
  {
    id: 7,
    correctIndex: 3,
    difficulty: 'advanced',
    category: { pt: 'DevSecOps & Automação de Políticas', en: 'DevSecOps & policy automation' },
    question: {
      pt: 'Como a Thoughtworks estrutura a governança em uma plataforma para evitar gargalos e processos lentos de aprovação manual?',
      en: 'How does Thoughtworks approach governance in a platform to avoid approval bottlenecks and manual ticketing?',
    },
    options: [
      { pt: 'Criando comitês formais de arquitetura para revisar pull requests antes do deploy', en: 'Setting up formal architecture review boards to manually approve pull requests' },
      { pt: 'Eliminando regras de conformidade e permitindo autonomia total sem padrões', en: 'Removing compliance rules and allowing total autonomy without standards' },
      { pt: 'Concentrando validações em auditorias pós-produção e relatórios mensais', en: 'Relying exclusively on post-production audits and monthly spreadsheets' },
      { pt: 'Aplicando políticas como código, admission controllers e fitness functions automatizadas no pipeline', en: 'Applying policy-as-code, admission controllers and automated fitness functions in the pipeline' },
    ],
    explanation: {
      pt: 'Para a Thoughtworks, governança eficaz não é burocracia por tickets. Aplicamos a conformidade diretamente no "ponto de mudança": políticas automatizadas, admission controllers e architectural fitness functions validam qualidade e segurança antes do deploy, fornecendo feedback imediato ao desenvolvedor.',
      en: 'For Thoughtworks, effective governance isn\'t ticketing bureaucracy. We enforce compliance at the "point of change": automated policies, admission controllers and architectural fitness functions validate quality and security before deploy, giving developers instant feedback.',
    },
  },
]);
