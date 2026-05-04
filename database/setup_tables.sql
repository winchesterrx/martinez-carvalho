-- =============================================
-- MARTINEZ & CARVALHO - TABELAS DO SITE
-- Todas com sufixo _site para nao misturar
-- Compativel com MySQL 5.5+
-- =============================================

CREATE TABLE IF NOT EXISTS usuarios_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  papel VARCHAR(20) DEFAULT 'admin',
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP NULL,
  UNIQUE KEY uq_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sistemas_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL,
  icone VARCHAR(50) NOT NULL DEFAULT 'Calculator',
  nome VARCHAR(100) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  tagline TEXT,
  features TEXT,
  modulos TEXT,
  beneficios TEXT,
  ordem INT DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL,
  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS videos_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  url_video VARCHAR(500) NOT NULL,
  duracao VARCHAR(10),
  topico VARCHAR(100),
  thumbnail_url VARCHAR(500),
  ordem INT DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ferramentas_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  url_download VARCHAR(500) NOT NULL,
  icone VARCHAR(50) DEFAULT 'Download',
  cor VARCHAR(80) DEFAULT 'from-primary to-primary-deep',
  ordem INT DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sobre_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200),
  subtitulo VARCHAR(300),
  texto_principal TEXT,
  texto_secundario TEXT,
  imagem_1 VARCHAR(500),
  imagem_2 VARCHAR(500),
  imagem_3 VARCHAR(500),
  imagem_4 VARCHAR(500),
  stat_1_icone VARCHAR(50) DEFAULT 'Award',
  stat_1_valor VARCHAR(20) DEFAULT '+12',
  stat_1_label VARCHAR(100) DEFAULT 'Anos de mercado',
  stat_2_icone VARCHAR(50) DEFAULT 'Users',
  stat_2_valor VARCHAR(20) DEFAULT '+50',
  stat_2_label VARCHAR(100) DEFAULT 'Orgaos atendidos',
  stat_3_icone VARCHAR(50) DEFAULT 'Building2',
  stat_3_valor VARCHAR(20) DEFAULT '100%',
  stat_3_label VARCHAR(100) DEFAULT 'Foco em gestao publica',
  atualizado_em TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contato_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefone VARCHAR(30),
  email VARCHAR(150),
  endereco_rua VARCHAR(200),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_cep VARCHAR(15),
  cnpj VARCHAR(25),
  facebook_url VARCHAR(300),
  instagram_url VARCHAR(300),
  linkedin_url VARCHAR(300),
  whatsapp VARCHAR(30),
  mapa_url VARCHAR(500),
  atualizado_em TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS configuracoes_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL,
  valor TEXT,
  descricao VARCHAR(300),
  atualizado_em TIMESTAMP NULL,
  UNIQUE KEY uq_chave (chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS hero_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto VARCHAR(300) NOT NULL,
  ordem INT DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS parceria_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200),
  subtitulo VARCHAR(300),
  descricao TEXT,
  badge_texto VARCHAR(100),
  logo_url VARCHAR(500),
  atualizado_em TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Base de Conhecimento da IA (Cleusa)
CREATE TABLE IF NOT EXISTS conhecimento_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sistema VARCHAR(50),
  categoria VARCHAR(50) DEFAULT 'geral',
  titulo VARCHAR(200) NOT NULL,
  conteudo TEXT NOT NULL,
  tags VARCHAR(300),
  ordem INT DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- DADOS INICIAIS
-- =============================================

INSERT INTO usuarios_site (nome, usuario, senha_hash, email, papel) VALUES
('Administrador', 'admin', 'admin123', 'martinez@martinez.inf.br', 'admin');

INSERT INTO hero_site (texto, ordem, ativo) VALUES
('Especialistas em Gestao Publica Municipal.', 1, 1),
('Suporte Tecnico de Excelencia para Sistemas Fiorilli.', 2, 1),
('Tecnologia e Compromisso em Votuporanga e Regiao.', 3, 1);

INSERT INTO sistemas_site (slug, icone, nome, titulo, descricao, tagline, features, modulos, beneficios, ordem) VALUES
('scpi', 'Calculator', 'SCPI', 'Contabilidade Publica', 'Gestao contabil completa em conformidade com TCE e SICONFI.', 'Sistema completo de Contabilidade Publica, Orcamento e Tesouraria, totalmente aderente as normas do TCE/SP, STN e SICONFI.', '[{\"title\":\"Conformidade Total\",\"description\":\"Geracao automatica de arquivos para AUDESP, SICONFI, MSC e demais obrigacoes legais.\"},{\"title\":\"Orcamento Integrado\",\"description\":\"PPA, LDO e LOA integrados ao empenho, liquidacao e pagamento em tempo real.\"},{\"title\":\"Tesouraria Online\",\"description\":\"Conciliacao bancaria, fluxo de caixa e ordens bancarias eletronicas.\"}]', '[\"Contabilidade\",\"Orcamento (PPA/LDO/LOA)\",\"Tesouraria\",\"Empenho e Liquidacao\",\"Prestacao de Contas (AUDESP)\",\"SICONFI / MSC\"]', '[\"Reducao de erros e retrabalho na prestacao de contas\",\"Atendimento direto as exigencias do Tribunal de Contas\",\"Relatorios gerenciais e LRF automaticos\"]', 1),
('sip', 'Wallet', 'SIP', 'Folha de Pagamento', 'Gestao de pessoal, RH e folha com integracoes eSocial.', 'Sistema Integrado de Pessoal para gestao completa de RH, folha de pagamento e obrigacoes trabalhistas do servidor publico.', '[{\"title\":\"eSocial Completo\",\"description\":\"Geracao e envio de todos os eventos do eSocial para entes publicos.\"},{\"title\":\"Folha Automatizada\",\"description\":\"Calculos de proventos, descontos, ferias, 13o e rescisoes com total seguranca.\"},{\"title\":\"Portal do Servidor\",\"description\":\"Holerite online, declaracoes e solicitacoes pelo proprio servidor.\"}]', '[\"Folha de Pagamento\",\"Recursos Humanos\",\"Ponto Eletronico\",\"eSocial\",\"Portal do Servidor\",\"Concursos e Processos Seletivos\"]', '[\"Conformidade com legislacao trabalhista e previdenciaria\",\"Reducao do tempo de fechamento da folha\",\"Transparencia e autoatendimento do servidor\"]', 2),
('sis', 'HeartPulse', 'SIS', 'Saude / e-SUS', 'Gestao de unidades de saude integrada ao DATASUS e e-SUS APS.', 'Sistema de Informacao em Saude integrado ao e-SUS APS e DATASUS, para gestao completa da rede municipal de saude.', '[{\"title\":\"Integracao e-SUS APS\",\"description\":\"Envio automatico de producao para o Ministerio da Saude sem retrabalho.\"},{\"title\":\"Prontuario Eletronico\",\"description\":\"Historico clinico do paciente acessivel em todas as unidades de saude.\"},{\"title\":\"Gestao de Medicamentos\",\"description\":\"Controle de estoque, dispensacao e validade em todas as farmacias municipais.\"}]', '[\"Prontuario Eletronico\",\"Agendamento e Regulacao\",\"Farmacia Municipal\",\"Vigilancia Sanitaria\",\"Transporte de Pacientes (TFD)\",\"Integracao e-SUS APS / DATASUS\"]', '[\"Aumento do repasse federal por producao registrada\",\"Atendimento mais agil ao cidadao\",\"Indicadores de saude em tempo real\"]', 3),
('arrecadacao', 'Receipt', 'Arrecadacao', 'Tributos Municipais', 'IPTU, ISS, divida ativa e atendimento ao contribuinte.', 'Sistema completo de Arrecadacao Municipal: IPTU, ISS, ITBI, taxas, divida ativa e atendimento ao contribuinte em um so lugar.', '[{\"title\":\"ISS Eletronico\",\"description\":\"Emissao de NFS-e, escrituracao eletronica e fiscalizacao integrada.\"},{\"title\":\"Cadastro Imobiliario\",\"description\":\"Gestao completa do cadastro mobiliario e imobiliario do municipio.\"},{\"title\":\"Divida Ativa\",\"description\":\"Inscricao automatica, parcelamentos e protesto extrajudicial integrado.\"}]', '[\"IPTU\",\"ISS / NFS-e\",\"ITBI\",\"Taxas e Contribuicoes\",\"Divida Ativa\",\"Portal do Contribuinte\"]', '[\"Aumento da arrecadacao municipal\",\"Reducao da inadimplencia\",\"Atendimento online ao contribuinte 24/7\"]', 4),
('educacao', 'GraduationCap', 'Educacao', 'Gestao Escolar', 'Matriculas, frequencia, notas e merenda escolar centralizados.', 'Sistema de Gestao Escolar para a Secretaria Municipal de Educacao: do cadastro do aluno ao Censo Escolar.', '[{\"title\":\"Censo Escolar\",\"description\":\"Geracao de arquivos para o Censo Escolar do INEP de forma automatica.\"},{\"title\":\"Diario de Classe Digital\",\"description\":\"Frequencia e notas lancadas diretamente pelo professor, em tempo real.\"},{\"title\":\"Transporte e Merenda\",\"description\":\"Gestao das rotas de transporte escolar e cardapio da merenda municipal.\"}]', '[\"Matricula Online\",\"Diario de Classe\",\"Boletim Eletronico\",\"Merenda Escolar\",\"Transporte Escolar\",\"Censo Escolar (INEP)\"]', '[\"Mais tempo para o professor focar no ensino\",\"Comunicacao direta com os pais\",\"Indicadores educacionais para gestao estrategica\"]', 5),
('transparencia', 'Eye', 'Transparencia', 'Portal da Transparencia', 'Publicacao automatica de receitas, despesas e contratos.', 'Portal da Transparencia em conformidade com a LAI e Lei de Responsabilidade Fiscal, com publicacao automatica dos dados.', '[{\"title\":\"100% Automatico\",\"description\":\"Integracao direta com os sistemas de contabilidade, folha e licitacoes.\"},{\"title\":\"Acessibilidade\",\"description\":\"Interface adaptada as normas de acessibilidade do governo digital.\"},{\"title\":\"e-SIC Integrado\",\"description\":\"Sistema Eletronico de Informacao ao Cidadao para pedidos de acesso a informacao.\"}]', '[\"Receitas e Despesas\",\"Licitacoes e Contratos\",\"Folha de Pagamento\",\"Diarias e Viagens\",\"Convenios e Repasses\",\"e-SIC\"]', '[\"Atendimento a LAI e LRF sem esforco operacional\",\"Maior confianca da populacao na gestao\",\"Reducao de pedidos manuais de informacao\"]', 6);

INSERT INTO ferramentas_site (nome, descricao, url_download, icone, cor, ordem) VALUES
('AnyDesk', 'Acesso remoto rapido e seguro para suporte imediato.', 'https://anydesk.com/pt/downloads/windows', 'MonitorSmartphone', 'from-red-500 to-red-600', 1),
('TeamViewer', 'Conexao remota completa com o nosso time tecnico.', 'https://www.teamviewer.com/pt-br/baixar/windows/', 'MonitorSmartphone', 'from-blue-500 to-blue-600', 2),
('Requisitos do Sistema', 'PDF com requisitos minimos para os sistemas Fiorilli.', '#', 'FileCheck2', 'from-emerald-500 to-emerald-600', 3),
('Manual do Usuario', 'Documentacao completa para uso diario das solucoes.', '#', 'FileText', 'from-primary to-primary-deep', 4);

INSERT INTO videos_site (titulo, descricao, url_video, duracao, topico, ordem) VALUES
('Introducao ao SCPI', 'Primeiros passos no sistema de contabilidade publica.', '', '12:35', 'Contabilidade', 1),
('Folha mensal no SIP', 'Processamento completo da folha mensal e encargos.', '', '18:20', 'Folha de Pagamento', 2),
('Atendimento e-SUS no SIS', 'Registro de atendimentos e envio ao DATASUS.', '', '15:10', 'Saude', 3),
('Lancamento de IPTU', 'Geracao e lancamento dos carnes de IPTU anuais.', '', '09:48', 'Arrecadacao', 4),
('Matricula escolar online', 'Cadastro de alunos e gestao de matriculas pela web.', '', '11:22', 'Educacao', 5),
('Publicacao Transparencia', 'Publicacao automatica de dados no portal da transparencia.', '', '07:55', 'Transparencia', 6);

INSERT INTO sobre_site (titulo, subtitulo, texto_principal, texto_secundario, stat_1_icone, stat_1_valor, stat_1_label, stat_2_icone, stat_2_valor, stat_2_label, stat_3_icone, stat_3_valor, stat_3_label) VALUES
('Tecnologia a servico da', 'gestao publica', 'Fundada em 2012 em Votuporanga/SP, a Martinez & Carvalho Software nasceu com o proposito de modernizar a gestao publica municipal atraves da implantacao e suporte especializado dos sistemas Fiorilli Software.', 'Combinamos profundo conhecimento tecnico, atendimento proximo e compromisso com prazos para entregar solucoes que realmente transformam a rotina das prefeituras e orgaos publicos da nossa regiao.', 'Award', '+12', 'Anos de mercado', 'Users', '+50', 'Orgaos atendidos', 'Building2', '100%', 'Foco em gestao publica');

INSERT INTO contato_site (telefone, email, endereco_rua, endereco_bairro, endereco_cidade, endereco_cep, cnpj, whatsapp, mapa_url) VALUES
('(17) 3411-1444', 'martinez@martinez.inf.br', 'Rua Carmem Rodrigues Basi, 1500', 'Parque Cidade Jardim', 'Votuporanga/SP', '15503-538', '14.908.157/0001-24', '', 'https://www.google.com/maps?q=Rua+Carmem+Rodrigues+Basi+1500+Votuporanga&output=embed');

INSERT INTO parceria_site (titulo, subtitulo, descricao, badge_texto) VALUES
('Canal de Suporte e', 'Implantacao Homologado', 'Atuamos como canal oficial homologado da Fiorilli Software, garantindo implantacao tecnica e suporte certificado para a gestao publica.', 'Parceiro Oficial Fiorilli Software');
