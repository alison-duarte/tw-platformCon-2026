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
      pt: 'Quais são os quatro blocos fundamentais de uma engineering platform na arquitetura Thoughtworks?',
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
    correctIndex: 0,
    difficulty: 'advanced',
    category: { pt: 'Definição de DI platform', en: 'DI platform definition' },
    question: {
      pt: 'Segundo a Thoughtworks, como se define uma DI platform (plataforma digital de entrega)?',
      en: 'According to Thoughtworks, how is a DI platform (digital delivery platform) defined?',
    },
    options: [
      { pt: 'Uma fundação de APIs, ferramentas, serviços e conhecimento self-service, organizada como um produto interno atraente, que permite entregas mais rápidas com menos coordenação', en: 'A foundation of self-service APIs, tools, services and knowledge, arranged as a compelling internal product that lets autonomous teams deliver faster with less coordination' },
      { pt: 'Um catálogo de fornecedores aprovados, com contratos negociados pela área de compras', en: 'A catalog of approved vendors, with contracts negotiated by procurement' },
      { pt: 'Um time central que aprova chamados manuais de infraestrutura antes de qualquer entrega', en: 'A central team that approves manual infrastructure tickets before any delivery' },
      { pt: 'Um painel de métricas que mostra o desempenho de cada time, sem oferecer serviços', en: 'A metrics dashboard that shows the performance of every team, without offering any services' },
    ],
    explanation: {
      pt: 'O deck define a plataforma digital como "uma fundação de APIs, ferramentas, serviços, conhecimento e suporte self-service, organizada como um produto interno atraente", em citação de Evan Bottcher. O objetivo é que times autônomos entreguem recursos com mais ritmo e menos coordenação.',
      en: 'The deck defines a digital platform as "a foundation of self-service APIs, tools, services, knowledge and support which are arranged as a compelling internal product", quoting Evan Bottcher. Autonomous teams use it to deliver at a higher pace with less coordination.',
    },
  },
  {
    id: 7,
    correctIndex: 3,
    difficulty: 'advanced',
    category: { pt: 'Produtividade dos desenvolvedores', en: 'Developer productivity' },
    question: {
      pt: 'No levantamento de desenvolvedores citado pela Thoughtworks, qual atividade é a que mais drena o tempo dos times de produto (categoria "drena muito tempo")?',
      en: 'In the developer survey cited by Thoughtworks, which activity drains the most time from product teams (the "drains a lot of time" category)?',
    },
    options: [
      { pt: 'Reuniões em que eu fico quase calado', en: 'Meetings where I mostly remain silent' },
      { pt: 'Lutar com ferramentas ruins', en: 'Struggling with bad tools' },
      { pt: 'Gerenciar tickets, status e processos', en: 'Managing tickets, status and process' },
      { pt: 'Esperar que outras pessoas façam alguma coisa', en: 'Waiting for other people to do stuff' },
    ],
    explanation: {
      pt: 'No levantamento de 2017 da GitPrime, com 1.000 desenvolvedores nos EUA e no Reino Unido, 41,1% disseram que esperar por outras pessoas drena muito do tempo deles. Esse percentual supera o de reuniões (39,9%) e o de ferramentas ruins (35,1%). O deck liga essas esperas a processos baseados em chamados, que o autoatendimento elimina.',
      en: 'In a 2017 GitPrime survey of 1,000 developers in the US and UK, cited by Thoughtworks, 41.1% said waiting for other people drains a lot of their time. That is higher than meetings (39.9%) and bad tools (35.1%). The deck links these waits to ticket-based processes that self-service removes.',
    },
  },
]);
