import {
  Calculator,
  Wallet,
  HeartPulse,
  Receipt,
  GraduationCap,
  Eye,
  type LucideIcon,
} from "lucide-react";

export type SystemDetail = {
  slug: string;
  icon: LucideIcon;
  name: string;
  title: string;
  description: string;
  tagline: string;
  features: { title: string; description: string }[];
  modules: string[];
  benefits: string[];
};

export const systems: SystemDetail[] = [
  {
    slug: "scpi",
    icon: Calculator,
    name: "SCPI",
    title: "Contabilidade Pública",
    description:
      "Gestão contábil completa em conformidade com TCE e SICONFI.",
    tagline:
      "Sistema completo de Contabilidade Pública, Orçamento e Tesouraria, totalmente aderente às normas do TCE/SP, STN e SICONFI.",
    features: [
      {
        title: "Conformidade Total",
        description:
          "Geração automática de arquivos para AUDESP, SICONFI, MSC e demais obrigações legais.",
      },
      {
        title: "Orçamento Integrado",
        description:
          "PPA, LDO e LOA integrados ao empenho, liquidação e pagamento em tempo real.",
      },
      {
        title: "Tesouraria Online",
        description:
          "Conciliação bancária, fluxo de caixa e ordens bancárias eletrônicas.",
      },
    ],
    modules: [
      "Contabilidade",
      "Orçamento (PPA/LDO/LOA)",
      "Tesouraria",
      "Empenho e Liquidação",
      "Prestação de Contas (AUDESP)",
      "SICONFI / MSC",
    ],
    benefits: [
      "Redução de erros e retrabalho na prestação de contas",
      "Atendimento direto às exigências do Tribunal de Contas",
      "Relatórios gerenciais e LRF automáticos",
    ],
  },
  {
    slug: "sip",
    icon: Wallet,
    name: "SIP",
    title: "Folha de Pagamento",
    description:
      "Gestão de pessoal, RH e folha com integrações eSocial.",
    tagline:
      "Sistema Integrado de Pessoal para gestão completa de RH, folha de pagamento e obrigações trabalhistas do servidor público.",
    features: [
      {
        title: "eSocial Completo",
        description:
          "Geração e envio de todos os eventos do eSocial para entes públicos.",
      },
      {
        title: "Folha Automatizada",
        description:
          "Cálculos de proventos, descontos, férias, 13º e rescisões com total segurança.",
      },
      {
        title: "Portal do Servidor",
        description:
          "Holerite online, declarações e solicitações pelo próprio servidor.",
      },
    ],
    modules: [
      "Folha de Pagamento",
      "Recursos Humanos",
      "Ponto Eletrônico",
      "eSocial",
      "Portal do Servidor",
      "Concursos e Processos Seletivos",
    ],
    benefits: [
      "Conformidade com legislação trabalhista e previdenciária",
      "Redução do tempo de fechamento da folha",
      "Transparência e autoatendimento do servidor",
    ],
  },
  {
    slug: "sis",
    icon: HeartPulse,
    name: "SIS",
    title: "Saúde / e-SUS",
    description:
      "Gestão de unidades de saúde integrada ao DATASUS e e-SUS APS.",
    tagline:
      "Sistema de Informação em Saúde integrado ao e-SUS APS e DATASUS, para gestão completa da rede municipal de saúde.",
    features: [
      {
        title: "Integração e-SUS APS",
        description:
          "Envio automático de produção para o Ministério da Saúde sem retrabalho.",
      },
      {
        title: "Prontuário Eletrônico",
        description:
          "Histórico clínico do paciente acessível em todas as unidades de saúde.",
      },
      {
        title: "Gestão de Medicamentos",
        description:
          "Controle de estoque, dispensação e validade em todas as farmácias municipais.",
      },
    ],
    modules: [
      "Prontuário Eletrônico",
      "Agendamento e Regulação",
      "Farmácia Municipal",
      "Vigilância Sanitária",
      "Transporte de Pacientes (TFD)",
      "Integração e-SUS APS / DATASUS",
    ],
    benefits: [
      "Aumento do repasse federal por produção registrada",
      "Atendimento mais ágil ao cidadão",
      "Indicadores de saúde em tempo real",
    ],
  },
  {
    slug: "arrecadacao",
    icon: Receipt,
    name: "Arrecadação",
    title: "Tributos Municipais",
    description:
      "IPTU, ISS, dívida ativa e atendimento ao contribuinte.",
    tagline:
      "Sistema completo de Arrecadação Municipal: IPTU, ISS, ITBI, taxas, dívida ativa e atendimento ao contribuinte em um só lugar.",
    features: [
      {
        title: "ISS Eletrônico",
        description:
          "Emissão de NFS-e, escrituração eletrônica e fiscalização integrada.",
      },
      {
        title: "Cadastro Imobiliário",
        description:
          "Gestão completa do cadastro mobiliário e imobiliário do município.",
      },
      {
        title: "Dívida Ativa",
        description:
          "Inscrição automática, parcelamentos e protesto extrajudicial integrado.",
      },
    ],
    modules: [
      "IPTU",
      "ISS / NFS-e",
      "ITBI",
      "Taxas e Contribuições",
      "Dívida Ativa",
      "Portal do Contribuinte",
    ],
    benefits: [
      "Aumento da arrecadação municipal",
      "Redução da inadimplência",
      "Atendimento online ao contribuinte 24/7",
    ],
  },
  {
    slug: "educacao",
    icon: GraduationCap,
    name: "Educação",
    title: "Gestão Escolar",
    description:
      "Matrículas, frequência, notas e merenda escolar centralizados.",
    tagline:
      "Sistema de Gestão Escolar para a Secretaria Municipal de Educação: do cadastro do aluno ao Censo Escolar.",
    features: [
      {
        title: "Censo Escolar",
        description:
          "Geração de arquivos para o Censo Escolar do INEP de forma automática.",
      },
      {
        title: "Diário de Classe Digital",
        description:
          "Frequência e notas lançadas diretamente pelo professor, em tempo real.",
      },
      {
        title: "Transporte e Merenda",
        description:
          "Gestão das rotas de transporte escolar e cardápio da merenda municipal.",
      },
    ],
    modules: [
      "Matrícula Online",
      "Diário de Classe",
      "Boletim Eletrônico",
      "Merenda Escolar",
      "Transporte Escolar",
      "Censo Escolar (INEP)",
    ],
    benefits: [
      "Mais tempo para o professor focar no ensino",
      "Comunicação direta com os pais",
      "Indicadores educacionais para gestão estratégica",
    ],
  },
  {
    slug: "transparencia",
    icon: Eye,
    name: "Transparência",
    title: "Portal da Transparência",
    description:
      "Publicação automática de receitas, despesas e contratos.",
    tagline:
      "Portal da Transparência em conformidade com a LAI e Lei de Responsabilidade Fiscal, com publicação automática dos dados.",
    features: [
      {
        title: "100% Automático",
        description:
          "Integração direta com os sistemas de contabilidade, folha e licitações.",
      },
      {
        title: "Acessibilidade",
        description:
          "Interface adaptada às normas de acessibilidade do governo digital.",
      },
      {
        title: "e-SIC Integrado",
        description:
          "Sistema Eletrônico de Informação ao Cidadão para pedidos de acesso à informação.",
      },
    ],
    modules: [
      "Receitas e Despesas",
      "Licitações e Contratos",
      "Folha de Pagamento",
      "Diárias e Viagens",
      "Convênios e Repasses",
      "e-SIC",
    ],
    benefits: [
      "Atendimento à LAI e LRF sem esforço operacional",
      "Maior confiança da população na gestão",
      "Redução de pedidos manuais de informação",
    ],
  },
];

export const getSystemBySlug = (slug: string) =>
  systems.find((s) => s.slug === slug);