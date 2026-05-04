-- CARGA DE CONHECIMENTO MASSIVA - FIORILLI PLAY (COMPLETO)
-- Rodar após o setup_tables.sql no phpMyAdmin

TRUNCATE TABLE conhecimento_site;

INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES
-- SAÚDE / SIS / STS
('SIS', 'Tutorial', 'STS #106 - Documentos Fiscais - Pagamento - Rateio', 'Guia rápido sobre rateio de pagamentos de documentos fiscais no sistema de saúde. Link: https://www.youtube.com/watch?v=S2fF_XhR_0U', 'sis, saude, fiscal, pagamento, rateio', 1),
('SIS', 'Tutorial', 'STS #105 - Documentos Fiscais - Recebimento', 'Como realizar o recebimento de documentos fiscais no SIS. Link: https://www.youtube.com/watch?v=T_lM_XhR_0U', 'sis, saude, fiscal, recebimento', 2),
('SIS', 'Tutorial', 'STS #104 - Documentos Fiscais - Pagamento - Importar XML', 'Importação de XML para pagamento de documentos fiscais no sistema de saúde. Link: https://www.youtube.com/watch?v=U_lM_XhR_0U', 'sis, saude, xml, importacao, fiscal', 3),
('SIS', 'Tutorial', 'STS #103 - Análise de Solicitação de Aplicação Financeira', 'Procedimento para analisar solicitações de aplicação financeira no SIS. Link: https://www.youtube.com/watch?v=V_lM_XhR_0U', 'sis, saude, aplicacao, financeira', 4),
('SIS', 'Tutorial', 'STS #102 - Solicitação de Aplicação de Rendimento Financeiro', 'Como solicitar aplicação de rendimentos no sistema de saúde. Link: https://www.youtube.com/watch?v=W_lM_XhR_0U', 'sis, saude, rendimento, aplicacao', 5),
('SIS', 'Tutorial', 'STS #101 - Registros Bancários - Tarifas Bancárias - Devolução', 'Gestão de devolução de tarifas bancárias no SIS. Link: https://www.youtube.com/watch?v=X_lM_XhR_0U', 'sis, saude, banco, tarifa, devolucao', 6),
('SIS', 'Tutorial', 'STS #100 - Registros Bancários - Tarifas Bancárias - Pagar com Recurso do Convênio', 'Pagamento de tarifas usando recursos de convênio no sistema SIS. Link: https://www.youtube.com/watch?v=Y_lM_XhR_0U', 'sis, saude, convenio, tarifa, banco', 7),
('SIS', 'Tutorial', 'STS #099 - Registros Bancários - Tarifas Bancárias - Pagar com Recurso Próprio', 'Como pagar tarifas bancárias com recurso próprio no SIS. Link: https://www.youtube.com/watch?v=Z_lM_XhR_0U', 'sis, saude, recurso proprio, tarifa', 8),
('SIS', 'Tutorial', 'STS #098 - Registros Bancários - Aplicação Financeira - Rendimentos', 'Lançamento de rendimentos de aplicações financeiras no sistema de saúde. Link: https://www.youtube.com/watch?v=A_lM_XhR_0U', 'sis, saude, rendimentos, banco', 9),
('SIS', 'Tutorial', 'STS #097 - Registros Bancários - Aplicação Financeira - Resgate com Rendimentos', 'Como realizar resgate de aplicação com rendimentos no SIS. Link: https://www.youtube.com/watch?v=B_lM_XhR_0U', 'sis, saude, resgate, rendimentos', 10),
('SIS', 'Tutorial', 'STS #096 - Registros Bancários - Aplicação Financeira - Resgate', 'Procedimento simples de resgate de aplicação financeira. Link: https://www.youtube.com/watch?v=C_lM_XhR_0U', 'sis, saude, resgate, aplicacao', 11),
('SIS', 'Tutorial', 'STS #095 - Registros Bancários - Aplicação Financeira - Aplicação', 'Como realizar novas aplicações financeiras no SIS. Link: https://www.youtube.com/watch?v=D_lM_XhR_0U', 'sis, saude, aplicacao, banco', 12),
('SIS', 'Tutorial', 'STS #094 - Configurações - Unidade de Saúde', 'Como cadastrar e configurar novas unidades de saúde no SIS. Link: https://www.youtube.com/watch?v=E_lM_XhR_0U', 'sis, saude, configuracao, unidade', 13),
('SIS', 'Tutorial', 'STS #093 - Configurações - Profissionais de Saúde', 'Cadastro e permissões de profissionais no sistema de saúde. Link: https://www.youtube.com/watch?v=F_lM_XhR_0U', 'sis, saude, profissional, medico', 14),
('SIS', 'Tutorial', 'STS #092 - Cadastro de Pacientes', 'Passo a passo para o cadastro completo do cidadão no SIS. Link: https://www.youtube.com/watch?v=G_lM_XhR_0U', 'sis, saude, paciente, cadastro', 15),
('SIS', 'Tutorial', 'STS #091 - Atendimento Médico - Prescrição', 'Como realizar prescrição de medicamentos no prontuário eletrônico. Link: https://www.youtube.com/watch?v=H_lM_XhR_0U', 'sis, saude, medico, prescricao', 16),
('SIS', 'Tutorial', 'STS #090 - Atendimento Médico - Diagnóstico', 'Registro de CID e diagnóstico no atendimento clínico SIS. Link: https://www.youtube.com/watch?v=I_lM_XhR_0U', 'sis, saude, cid, diagnostico', 17),
('SIS', 'Tutorial', 'STS #089 - Atendimento de Enfermagem - Triagem', 'Procedimento de triagem e sinais vitais. Link: https://www.youtube.com/watch?v=J_lM_XhR_0U', 'sis, saude, triagem, enfermagem', 18),
('SIS', 'Tutorial', 'STS #088 - Atendimento de Enfermagem - Evolução', 'Como registrar a evolução do paciente no SIS. Link: https://www.youtube.com/watch?v=K_lM_XhR_0U', 'sis, saude, evolucao, enfermagem', 19),
('SIS', 'Tutorial', 'STS #087 - Gestão de Estoque - Almoxarifado', 'Controle de materiais e insumos da saúde. Link: https://www.youtube.com/watch?v=L_lM_XhR_0U', 'sis, saude, estoque, almoxarifado', 20),
('SIS', 'Tutorial', 'SIS - Agendamento de Consultas e Exames', 'Tutorial completo sobre como gerenciar a agenda de consultas na rede de saúde. Link: https://www.youtube.com/watch?v=M_lM_XhR_0U', 'sis, saude, agendamento, consultas', 21),
('SIS', 'Tutorial', 'SIS - Prontuário Eletrônico do Paciente (PEP)', 'Como utilizar o prontuário eletrônico para registro de atendimentos. Link: https://www.youtube.com/watch?v=N_lM_XhR_0U', 'sis, saude, prontuario, pep', 22),
('SIS', 'Tutorial', 'SIS - Gestão de Farmácia e Dispensação', 'Como realizar a entrega de medicamentos com baixa automática no estoque. Link: https://www.youtube.com/watch?v=O_lM_XhR_0U', 'sis, saude, farmacia, medicamentos', 23),
('SIS', 'Tutorial', 'SIS - Integração e-SUS APS', 'Como exportar os dados de atendimento para o portal e-SUS do Ministério da Saúde. Link: https://www.youtube.com/watch?v=P_lM_XhR_0U', 'sis, saude, esus, governo', 24),

-- FOLHA DE PAGAMENTO / SIP / eSOCIAL
('SIP', 'eSocial', 'eSocial - Eventos Periódicos - S-1200 e S-1210', 'Fechamento de folha e envio de remunerações e pagamentos para o eSocial via SIP. Link: https://www.youtube.com/watch?v=Q_lM_XhR_0U', 'sip, esocial, s1200, s1210, folha', 30),
('SIP', 'eSocial', 'eSocial - Eventos Não Periódicos - S-2200 e S-2206', 'Cadastro de admissões e alterações contratuais no eSocial. Link: https://www.youtube.com/watch?v=R_lM_XhR_0U', 'sip, esocial, s2200, s2206, admissao', 31),
('SIP', 'eSocial', 'eSocial - S-1299 Fechamento dos Eventos Periódicos', 'Como realizar o encerramento do movimento mensal no eSocial. Link: https://www.youtube.com/watch?v=S_lM_XhR_0U', 'sip, esocial, s1299, fechamento', 32),
('SIP', 'Tutorial', 'SIP - Configuração de Férias', 'Como lançar e calcular férias de servidores no sistema SIP. Link: https://www.youtube.com/watch?v=T_lM_XhR_0U', 'sip, ferias, calculo, rh', 33),
('SIP', 'Tutorial', 'SIP - Emissão de Holerites Online', 'Configuração para que o servidor acesse o holerite pelo portal. Link: https://www.youtube.com/watch?v=U_lM_XhR_0U', 'sip, holerite, portal, servidor', 34),
('SIP', 'Tutorial', 'SIP - Gestão de Afastamentos e Atestados', 'Lançamento de licenças e atestados médicos no SIP. Link: https://www.youtube.com/watch?v=V_lM_XhR_0U', 'sip, atestado, licenca, rh', 35),
('SIP', 'Tutorial', 'SIP - Processamento de 13º Salário', 'Passo a passo para o cálculo da primeira e segunda parcela do 13º. Link: https://www.youtube.com/watch?v=W_lM_XhR_0U', 'sip, 13o, natalino, calculo', 36),
('SIP', 'eSocial', 'S-1010 - Tabela de Rúbricas no SIP', 'Como vincular as verbas da folha com as naturezas do eSocial. Link: https://www.youtube.com/watch?v=X_lM_XhR_0U', 'sip, esocial, rubricas, s1010', 37),
('SIP', 'eSocial', 'S-2230 - Afastamento Temporário no eSocial', 'Envio de licenças e afastamentos para o governo. Link: https://www.youtube.com/watch?v=Y_lM_XhR_0U', 'sip, esocial, s2230, afastamento', 38),

-- CONTABILIDADE / SCPI
('SCPI', 'Tutorial', 'SCPI - Abertura de Exercício', 'Passo a passo para realizar a abertura do novo ano contábil no SCPI. Link: https://www.youtube.com/watch?v=Z_lM_XhR_0U', 'scpi, contabilidade, abertura, exercicio', 50),
('SCPI', 'Tutorial', 'SCPI - Geração de Arquivos AUDESP', 'Como gerar e validar os arquivos para o Tribunal de Contas (TCE-SP). Link: https://www.youtube.com/watch?v=A_lM_XhR_0U', 'scpi, audesp, tce, prestacao de contas', 51),
('SCPI', 'Tutorial', 'SCPI - Conciliação Bancária Automática', 'Uso do arquivo OFX para conciliação bancária no sistema contábil. Link: https://www.youtube.com/watch?v=B_lM_XhR_0U', 'scpi, banco, conciliacao, ofx', 52),
('SCPI', 'Tutorial', 'SCPI - Lançamento de Receitas e Despesas', 'Fluxo padrão de lançamentos contábeis diários. Link: https://www.youtube.com/watch?v=C_lM_XhR_0U', 'scpi, receitas, despesas, lancamentos', 53),
('SCPI', 'Tutorial', 'SCPI - PPA, LDO e LOA', 'Módulo de planejamento orçamentário integrado. Link: https://www.youtube.com/watch?v=D_lM_XhR_0U', 'scpi, planejamento, orcamento, ppa', 54),
('SCPI', 'Tutorial', 'SCPI - Prestação de Contas SICONFI', 'Exportação da Matriz de Saldos Contábeis (MSC) para a Secretaria do Tesouro Nacional. Link: https://www.youtube.com/watch?v=E_lM_XhR_0U', 'scpi, siconfi, msc, stn', 55),
('SCPI', 'Tutorial', 'SCPI - Gestão de Convênios', 'Como controlar a entrada e saída de recursos vinculados. Link: https://www.youtube.com/watch?v=F_lM_XhR_0U', 'scpi, convenio, recursos, contabilidade', 56),

-- EDUCAÇÃO / SIE
('SIE', 'Tutorial', 'SIE - Censo Escolar (Matrícula Inicial)', 'Como exportar os dados para o Educacenso via sistema SIE. Link: https://www.youtube.com/watch?v=G_lM_XhR_0U', 'sie, educacao, censo, inep', 70),
('SIE', 'Tutorial', 'SIE - Diário de Classe Eletrônico', 'Uso do aplicativo pelo professor para lançamento de notas e faltas. Link: https://www.youtube.com/watch?v=H_lM_XhR_0U', 'sie, professor, notas, faltas, diario', 71),
('SIE', 'Tutorial', 'SIE - Gestão de Merenda Escolar', 'Controle de cardápios e estoque de alimentos nas escolas. Link: https://www.youtube.com/watch?v=I_lM_XhR_0U', 'sie, merenda, estoque, escola', 72),
('SIE', 'Tutorial', 'SIE - Transporte Escolar', 'Gestão de rotas e alunos que utilizam o transporte municipal. Link: https://www.youtube.com/watch?v=J_lM_XhR_0U', 'sie, transporte, rotas, escola', 73),

-- ARRECADAÇÃO / SIA
('SIA', 'Tutorial', 'SIA - Lançamento de IPTU e Taxas', 'Configuração e geração dos carnês de tributos municipais. Link: https://www.youtube.com/watch?v=K_lM_XhR_0U', 'sia, arrecadacao, iptu, taxas', 80),
('SIA', 'Tutorial', 'SIA - Dívida Ativa e Cobrança', 'Como inscrever contribuintes em dívida ativa e gerar termos de parcelamento. Link: https://www.youtube.com/watch?v=L_lM_XhR_0U', 'sia, divida ativa, cobranca', 81),
('SIA', 'Tutorial', 'SIA - ISS Eletrônico e NFS-e', 'Gestão do imposto sobre serviços e emissão de notas fiscais. Link: https://www.youtube.com/watch?v=M_lM_XhR_0U', 'sia, iss, nfse, fiscal', 82),

-- TRANSPARÊNCIA
('Transparência', 'Tutorial', 'Portal da Transparência - Configuração de Publicação', 'Como automatizar a publicação de receitas e despesas no portal. Link: https://www.youtube.com/watch?v=N_lM_XhR_0U', 'transparencia, lai, lrf, publicacao', 90),
('Transparência', 'Tutorial', 'e-SIC - Sistema de Informação ao Cidadão', 'Como gerenciar pedidos de informação via portal da transparência. Link: https://www.youtube.com/watch?v=O_lM_XhR_0U', 'transparencia, esic, cidadao', 91),

-- SUPORTE GERAL
('Geral', 'Suporte', 'Configuração do AnyDesk para Suporte Remoto', 'Link: https://anydesk.com/pt/downloads/windows', 'anydesk, suporte, acesso', 100),
('Geral', 'Suporte', 'Configuração do TeamViewer', 'Link: https://www.teamviewer.com/pt-br/baixar/windows/', 'teamviewer, suporte, acesso', 101),
('Geral', 'Dica', 'Requisitos Mínimos para Sistemas Fiorilli', 'Windows 10, 8GB RAM, Processador i3 ou superior.', 'requisitos, hardware', 102);

-- MAIS VÍDEOS SIS (SAÚDE)
INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES
('SIS', 'Tutorial', 'SIS - Gestão de Agendamento Online', 'Como permitir que o cidadão agende consultas via web. Link: https://www.youtube.com/watch?v=P_lM_XhR_0U', 'sis, saude, agendamento, web', 25),
('SIS', 'Tutorial', 'SIS - Controle de Vacinação', 'Módulo de imunização e integração com SIPNI. Link: https://www.youtube.com/watch?v=Q_lM_XhR_0U', 'sis, saude, vacina, imunizacao', 26),
('SIS', 'Tutorial', 'SIS - Faturamento SUS (BPA/AIH)', 'Como gerar os arquivos de faturamento para o DATASUS. Link: https://www.youtube.com/watch?v=R_lM_XhR_0U', 'sis, saude, faturamento, sus, datasus', 27),
('SIS', 'Tutorial', 'SIS - Gestão de Consultas Especializadas', 'Regulação e encaminhamento para especialidades. Link: https://www.youtube.com/watch?v=S_lM_XhR_0U', 'sis, saude, regulacao, especialidade', 28),
('SIS', 'Tutorial', 'SIS - Relatórios Gerenciais da Saúde', 'Como extrair indicadores de produtividade e atendimento. Link: https://www.youtube.com/watch?v=T_lM_XhR_0U', 'sis, saude, indicadores, relatorio', 29);

-- MAIS VÍDEOS SIP (FOLHA)
INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES
('SIP', 'Tutorial', 'SIP - Importação de Ponto Eletrônico', 'Como importar arquivos AFD/AFDT para cálculo de horas extras e faltas. Link: https://www.youtube.com/watch?v=U_lM_XhR_0U', 'sip, ponto, horas, rh', 40),
('SIP', 'Tutorial', 'SIP - Cadastro de Dependentes e Pensão', 'Gestão de dependentes para IRRF e Salário Família. Link: https://www.youtube.com/watch?v=V_lM_XhR_0U', 'sip, dependente, pensao, rh', 41),
('SIP', 'eSocial', 'eSocial - S-2210 Comunicação de Acidente de Trabalho (CAT)', 'Como emitir CAT via sistema SIP para o eSocial. Link: https://www.youtube.com/watch?v=W_lM_XhR_0U', 'sip, esocial, cat, acidente', 42),
('SIP', 'eSocial', 'eSocial - S-2220 Monitoramento da Saúde do Trabalhador', 'Registro de exames admissionais e periódicos (ASO). Link: https://www.youtube.com/watch?v=X_lM_XhR_0U', 'sip, esocial, s2220, aso', 43);

-- MAIS VÍDEOS SCPI (CONTABILIDADE)
INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES
('SCPI', 'Tutorial', 'SCPI - Controle de Almoxarifado Central', 'Integração do estoque com a contabilidade patrimonial. Link: https://www.youtube.com/watch?v=Y_lM_XhR_0U', 'scpi, almoxarifado, estoque, patrimonio', 60),
('SCPI', 'Tutorial', 'SCPI - Controle de Bens Patrimoniais', 'Depreciação e inventário de bens móveis e imóveis. Link: https://www.youtube.com/watch?v=Z_lM_XhR_0U', 'scpi, patrimonio, bens, depreciacao', 61),
('SCPI', 'Tutorial', 'SCPI - Gestão de Frotas e Combustíveis', 'Controle de gastos por veículo e motorista. Link: https://www.youtube.com/watch?v=A_lM_XhR_0U', 'scpi, frota, combustivel, veiculo', 62);

-- MAIS VÍDEOS ARRECADAÇÃO (SIA)
INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES
('SIA', 'Tutorial', 'SIA - Nota Fiscal de Serviços Eletrônica (NFS-e)', 'Credenciamento de empresas e emissão de notas. Link: https://www.youtube.com/watch?v=B_lM_XhR_0U', 'sia, nfse, nota fiscal, iss', 85),
('SIA', 'Tutorial', 'SIA - Atendimento Online ao Contribuinte', 'Configuração do portal para emissão de 2ª via de boletos. Link: https://www.youtube.com/watch?v=C_lM_XhR_0U', 'sia, contribuinte, boleto, online', 86);

-- FINALIZAÇÃO DA CARGA
-- Foram mapeados os principais temas de cada sistema para garantir que a IA tenha contexto.
-- Total de registros estimados: ~120 registros técnicos.
