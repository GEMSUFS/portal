/* ==========================================================================
   CONTEÚDO DO PORTAL GEMS
   ==========================================================================

   Este é o ÚNICO arquivo que precisa ser editado para publicar notícias,
   mudar a agenda ou trocar os contatos. O resto do site se monta sozinho.

   COMO PUBLICAR UMA NOTÍCIA
   1. Copie um bloco { ... } da lista "noticias" abaixo e cole no topo dela.
   2. Troque o "id" (sem espaço nem acento: vira o endereço da página).
   3. Edite título, linha fina, categoria, data e texto.
   4. Salve e envie para o GitHub. Em 1 ou 2 minutos está no ar.

   DICAS DE ESCRITA — cada item de "texto" é um parágrafo. Além disso:
     "## Intertítulo"            vira um subtítulo dentro da notícia
     "> Frase de destaque"       vira uma citação em destaque
     "- Item"                    vira um item de lista (itens seguidos juntam)
     "![Legenda](imagens/x.jpg)" insere uma foto no meio do texto
     **negrito**   *itálico*   [texto do link](https://endereco)

   CUIDADO COM A PONTUAÇÃO — o arquivo é JavaScript:
     • todo texto fica entre aspas "assim";
     • se o texto tiver aspas, use as curvas “assim”;
     • os itens são separados por vírgula.
   Se algo quebrar, o próprio site avisa no lugar das notícias (no site
   publicado, com o número da linha). É só abrir este arquivo e corrigir.
   ========================================================================== */

window.GEMS = {

  /* ---------------------------------------------------------------------
     DADOS DO GRUPO
     --------------------------------------------------------------------- */
  site: {
    sigla: "GEMS",
    nome: "Grupo de Estudos em Melhoramento Vegetal do Semiárido",
    instituicao: "Universidade Federal de Sergipe · Campus do Sertão",
    instituicaoSigla: "UFS",
    slogan: "Portal de notícias",
    chamada: "Ciência, campo e inovação para a agricultura do Semiárido",   // título do bloco "O grupo"
    sobre: [
      "O GEMS — Grupo de Estudos em Melhoramento Vegetal do Semiárido — reúne estudantes de graduação, mestrado e doutorado da Universidade Federal de Sergipe, no Campus do Sertão, em torno do melhoramento genético de plantas, com foco na cultura do milho.",
      "O grupo atua em iniciação científica, iniciação tecnológica e ações de extensão, conduz programas de seleção recorrente, mantém um banco ativo de germoplasma e desenvolve as próprias ferramentas digitais, como o SEEDS. O grupo foi idealizado e é orientado pelo Prof. Dr. Gustavo Hugo Ferreira de Oliveira, com coorientação do Prof. Dr. José Jairo Florentino Cordeiro Junior."
    ]
  },

  contato: {
    email: "gems@academico.ufs.br",
    instagram: "https://www.instagram.com/gems_ufsser/",
    youtube: "",     // ex.: "https://www.youtube.com/@canal"   (vazio = não aparece)
    github: "",      // ex.: "https://github.com/gemsufs"       (vazio = não aparece)
    endereco: "Fazenda Experimental da UFS – Campus do Sertão, Pov. Mesinhas"
  },

  /* ---------------------------------------------------------------------
     VÍNCULO INSTITUCIONAL — logos na faixa acima do rodapé, em todas as páginas
       monocromatico: true -> logo de uma cor só (branco); o site pinta de
                              escuro no tema claro e deixa branco no escuro
     --------------------------------------------------------------------- */
  instituicoes: [
    { nome: "Universidade Federal de Sergipe", logo: "assets/img/ufs.png", link: "https://www.ufs.br/", monocromatico: true },
    { nome: "Departamento de Engenharia Agronômica do Sertão (DEAS)", logo: "assets/img/deas.png", link: "https://www.instagram.com/deas_ufsser/" }
  ],

  /* ---------------------------------------------------------------------
     SEÇÕES (categorias das notícias)
     Uma seção só aparece no menu quando tem pelo menos uma notícia.
     "cor" é a cor do rótulo e da capa gerada automaticamente.
     --------------------------------------------------------------------- */
  categorias: [
    { id: "pesquisa",    nome: "Pesquisa",    cor: "#2F7542", descricao: "Ensaios, análises e resultados das pesquisas do grupo." },
    { id: "campo",       nome: "Campo",       cor: "#5A7A1E", descricao: "Semeadura, polinização, avaliações e colheita na área experimental." },
    { id: "germoplasma", nome: "Germoplasma", cor: "#9A6412", descricao: "Banco ativo de germoplasma, lotes de sementes e conservação." },
    { id: "tecnologia",  nome: "Tecnologia",  cor: "#235C94", descricao: "O SEEDS, automação e as ferramentas digitais do grupo." },
    { id: "eventos",     nome: "Eventos",     cor: "#B4472A", descricao: "Congressos, dias de campo, visitas e apresentações." },
    { id: "grupo",       nome: "Grupo",       cor: "#6B4C8A", descricao: "Organização, pessoas e a rotina do GEMS." }
  ],

  /* ---------------------------------------------------------------------
     NOTÍCIAS — a ordem aqui não importa: o site ordena pela data.
       destaque: true   -> pode ir para a manchete da página inicial
       imagem           -> foto de capa (opcional). Coloque o arquivo na
                           pasta "imagens" e escreva "imagens/nome.jpg".
                           Sem foto, o site desenha uma capa com a cor da seção.
       enquadramento    -> "topo", "centro" (padrão) ou "baixo": que parte da
                           foto aparece nos cartões. Em cartazes, use "topo".
       video            -> link do YouTube (opcional), aparece no topo da notícia
     --------------------------------------------------------------------- */
  noticias: [

    {
      id: "dia-de-campo-2026",
      titulo: "Dia de Campo GEMS abre a Fazenda Experimental em 18 de setembro",
      linhaFina: "Manhã de troca de conhecimento no Campus do Sertão, com os experimentos do grupo abertos à visitação, das 8h30 às 11h30.",
      categoria: "eventos",
      data: "2026-09-12",
      autor: "Departamento de Mídia",
      destaque: true,
      imagem: "imagens/dia-de-campo-2026.jpg",
      enquadramento: "topo",
      legenda: "Cartaz de divulgação do Dia de Campo GEMS 2026.",
      tags: ["Dia de Campo", "extensão", "milho"],
      texto: [
        "O GEMS convida agricultores, estudantes e pesquisadores para o **Dia de Campo GEMS**, na sexta-feira, 18 de setembro de 2026, na Fazenda Experimental da UFS – Campus do Sertão, no povoado Mesinhas. O encontro começa às 8h30 e vai até as 11h30.",
        "“É hora de sair da teoria, colocar o conhecimento em prática e vivenciar a pesquisa diretamente no campo”, diz o convite publicado pelo grupo. O professor Gustavo Oliveira, orientador do GEMS, também gravou um convite em vídeo.",
        "## O que você vai encontrar",
        "- **Pesquisa e experimentação**, com os experimentos conduzidos pelo grupo abertos à visitação;",
        "- **Conhecimento no campo**, com a equipe explicando cada etapa do trabalho;",
        "- **Tecnologia e inovação** aplicadas ao melhoramento vegetal.",
        "> Um encontro para ver a pesquisa acontecendo na prática e trocar experiências sobre os caminhos da agricultura no Semiárido.",
        "O Dia de Campo tem apoio do Edital 4/2021 CAPES/FAPITEC e reúne o Campus do Sertão, o Departamento de Engenharia Agronômica do Sertão (DEAS), o PPGAGRI-UFS e o grupo Insecta.",
        "[Veja o convite no Instagram do GEMS](https://www.instagram.com/gems_ufsser/p/DdHRcmWp6A4/)."
      ]
    },

    {
      id: "mencao-honrosa-conagro",
      titulo: "Estudo sobre uso de nitrogênio em milho recebe menção honrosa em 1º lugar no IV CONAGRO",
      linhaFina: "Trabalho de Jacilene Francisca Souza Santos avalia progênies de meios-irmãos e combina parâmetros genéticos e análise multivariada para selecionar genótipos adaptados ao semiárido.",
      categoria: "pesquisa",
      data: "2026-09-08",
      autor: "Departamento de Mídia",
      destaque: true,
      imagem: "imagens/conagro-jacilene.jpg",
      enquadramento: "topo",
      legenda: "Card de divulgação da premiação, publicado pelo Campus do Sertão da UFS.",
      tags: ["premiação", "nitrogênio", "milho"],
      texto: [
        "A pesquisadora **Jacilene Francisca Souza Santos**, discente do PPGAGRI/UFS e integrante do GEMS, conquistou a **menção honrosa em 1º lugar**, na modalidade vídeo-pôster, no IV Congresso Nacional de Agronomia On-line (IV CONAGRO), realizado entre 18 e 20 de junho de 2026.",
        "O trabalho premiado, “Eficiência do Uso de Nitrogênio em Progênies de Meios-Irmãos de Milho: Parâmetros Genéticos e Análise Multivariada para Seleção de Genótipos Adaptados ao Semiárido”, avalia a eficiência do uso de nitrogênio em milho e busca genótipos que se saiam bem nas condições da região.",
        "## Por que o nitrogênio",
        "O nitrogênio é o nutriente que o milho mais exige e um dos insumos mais caros da lavoura. Encontrar materiais que produzam bem com menos nitrogênio disponível é, ao mesmo tempo, uma questão econômica para o agricultor e uma questão ambiental.",
        "## Quem assina",
        "Além da autora, assinam o trabalho Barbara Nascimento Santos, Carla Nayara da Silva Lima, Nartênia Susane Costa Aragão, Carlos Emanuel Brito dos Santos, João Pedro da Silva Alves, Camila Lima Santos e Tamara Rebecca Albuquerque de Oliveira, com os professores José Jairo Florentino Cordeiro Junior e Gustavo Hugo Ferreira de Oliveira, orientador.",
        "A conquista foi celebrada também pela Direção Geral do Campus do Sertão, que destacou a sequência de resultados do grupo em eventos científicos de todo o país."
      ]
    },

    {
      id: "premio-melhor-resumo-barbara",
      titulo: "Altura de planta medida por drone rende 1º lugar em prêmio de melhor resumo científico",
      linhaFina: "Trabalho de Barbara Nascimento Santos usa imagens aéreas para apoiar a seleção de genótipos mais produtivos e virou reportagem na TV Sergipe.",
      categoria: "pesquisa",
      data: "2026-09-02",
      autor: "Departamento de Mídia",
      destaque: true,
      imagem: "imagens/premio-barbara.jpg",
      legenda: "A pesquisa do grupo em reportagem do programa Estação Agrícola, da TV Sergipe.",
      tags: ["premiação", "fenotipagem", "drone"],
      texto: [
        "**Barbara Nascimento Santos**, integrante do Programa de Pós-Graduação em Agricultura e Biodiversidade (PPGAGRI) e do GEMS, conquistou o **1º lugar no prêmio de Melhor Resumo Científico** com um trabalho desenvolvido no grupo.",
        "O estudo mostra que estimativas de altura de planta obtidas por drone melhoram a seleção indireta para produtividade de grãos em milho sob disponibilidade contrastante de nitrogênio. Em outras palavras: uma medida rápida e barata, feita do alto, ajuda a decidir quais materiais avançam no programa de melhoramento.",
        "## Da parcela para o telejornal",
        "A repercussão passou do meio acadêmico: o trabalho virou [matéria da UFS](https://share.google/cFHtH4KU3c9exKr9b) e [reportagem na TV Sergipe](https://globoplay.globo.com/v/14914170).",
        "O resumo está publicado nos anais do XVII Simpósio Internacional de Genética e Melhoramento (SIGM 2026) e pode ser [acessado na íntegra](https://proceedings.science/sigm/sigm-2026/papers/uav-derived-plant-height-estimates-enhance-indirect-selection-for-grain-yield-in?lang=pt-br).",
        "> É um reconhecimento que valoriza não só a conquista da Bárbara, mas também todo o trabalho e dedicação dos envolvidos na pesquisa."
      ]
    },

    {
      id: "seeds-3o-lugar-seagro",
      titulo: "SEEDS, o aplicativo do grupo, conquista o 3º lugar no IV SEAGRO",
      linhaFina: "Trabalho de José Felipe Dantas Lima apresenta o sistema que reúne materiais, cruzamentos, progênies e experimentos em um só ambiente.",
      categoria: "tecnologia",
      data: "2026-08-29",
      autor: "Departamento de Mídia",
      destaque: false,
      imagem: "imagens/seagro-seeds.jpg",
      enquadramento: "topo",
      legenda: "Card de divulgação da premiação publicado pelo GEMS.",
      tags: ["SEEDS", "premiação", "inovação"],
      texto: [
        "O GEMS foi destaque no **IV SEAGRO – Seminário da Agroprodução e VI Semana de Agronomia**, realizado pelo Instituto Federal de Alagoas (IFAL) – Campus Piranhas, com o tema “Pesquisa, Inovação e Mercado: Novos Caminhos para o Agro no Semiárido”.",
        "**José Felipe Dantas Lima**, discente de Engenharia Agronômica, conquistou o **3º lugar na categoria Melhor Resumo Científico** com o trabalho “SEEDS: aplicativo para gestão, rastreabilidade e inovação em programas de melhoramento vegetal no semiárido”.",
        "Desenvolvido pelo próprio grupo, o SEEDS integra em um único ambiente o registro de materiais, cruzamentos, progênies e informações de experimentos, deixando a gestão do programa de melhoramento mais organizada, eficiente e rastreável.",
        "O trabalho teve orientação do Prof. Dr. Gustavo Oliveira, orientador do grupo e professor adjunto do Departamento de Engenharia Agronômica do Sertão (DEAS).",
        "[Conheça o SEEDS por dentro](noticia.html?id=seeds-3-5)."
      ]
    },

    {
      id: "gems-no-iv-seagro",
      titulo: "GEMS leva 15 resumos científicos ao IV SEAGRO",
      linhaFina: "Trabalhos passam por seleção de genótipos, diversidade genética, índices de seleção, produtividade, fenotipagem e ferramentas tecnológicas.",
      categoria: "eventos",
      data: "2026-08-29",
      autor: "Departamento de Mídia",
      destaque: false,
      imagem: "imagens/seagro-15-resumos.jpg",
      legenda: "Integrantes do GEMS no IV SEAGRO – Seminário da Agroprodução e VI Semana de Agronomia.",
      tags: ["SEAGRO", "publicações"],
      texto: [
        "O GEMS marcou presença no IV SEAGRO – Seminário da Agroprodução e VI Semana de Agronomia com a submissão de **15 resumos científicos**.",
        "Os trabalhos abrangem diferentes abordagens dentro da genética e do melhoramento vegetal: seleção de genótipos, diversidade genética, índices de seleção, características morfoagronômicas, produtividade, fenotipagem e o desenvolvimento de ferramentas tecnológicas aplicadas ao melhoramento.",
        "> Mais do que números, são 15 trabalhos que representam conhecimento, dedicação e ciência.",
        "A participação reforça o compromisso do grupo com a formação de pesquisadores e com o desenvolvimento de soluções para a agricultura do Semiárido."
      ]
    },

    {
      id: "primeira-tese-doutorado",
      titulo: "Gabriel Martins defende a primeira tese de doutorado do GEMS",
      linhaFina: "Pesquisa aplica enviromics e modelagem preditiva ao melhoramento de milho no Semiárido brasileiro.",
      categoria: "grupo",
      data: "2026-08-27",
      autor: "Departamento de Mídia",
      destaque: false,
      imagem: "imagens/tese-gabriel-martins.jpg",
      enquadramento: "topo",
      legenda: "Banca da defesa de tese de Gabriel Martins, em 4 de julho de 2026.",
      tags: ["doutorado", "enviromics", "milho"],
      texto: [
        "Em 4 de julho de 2026, **Gabriel Martins** defendeu a tese “Enviromics e modelagem preditiva aplicadas ao melhoramento de milho (Zea mays L.) no Semiárido brasileiro”, sob orientação do Prof. Dr. Gustavo Oliveira.",
        "É a primeira tese de doutorado defendida por um integrante do GEMS — um marco na trajetória de um grupo que nasceu formando estudantes de graduação e hoje também atua no mestrado e no doutorado.",
        "## O que é enviromics",
        "A enviromics descreve o ambiente com a mesma sistematicidade com que a genômica descreve o genótipo: clima, solo e manejo viram variáveis que entram nos modelos. Combinada à modelagem preditiva, ajuda a antecipar como cada material se comporta em cada ambiente — pergunta decisiva em uma região tão variável quanto o Semiárido.",
        "> Que este seja apenas mais um dos muitos capítulos de uma trajetória de sucesso na ciência."
      ]
    },

    {
      id: "nova-identidade-visual",
      titulo: "A hélice e o grão: o que diz a identidade visual do GEMS",
      linhaFina: "Espiral inspirada na dupla hélice do DNA, grão de milho estilizado e as cores da agricultura brasileira.",
      categoria: "grupo",
      data: "2025-09-22",
      autor: "Departamento de Mídia",
      destaque: false,
      imagem: "imagens/identidade-visual.jpg",
      legenda: "A marca do GEMS, apresentada em setembro de 2025.",
      tags: ["identidade visual", "grupo"],
      texto: [
        "A identidade visual do GEMS une ciência, inovação e agricultura. O elemento central em espiral, inspirado na **dupla hélice do DNA**, simboliza o avanço da genética no melhoramento de plantas.",
        "Na base da espiral, o **grão de milho estilizado** destaca o principal foco de atuação do grupo: a cultura do milho. O desenho combina a espiga com formas que lembram folhas, reforçando a conexão entre produtividade e sustentabilidade.",
        "As cores **verde e amarela** foram escolhidas por representarem a agricultura brasileira, e o degradê entre elas transmite inovação para a agricultura no semiárido, guiada pela ciência e pela tecnologia.",
        "A nova marca chegou junto com uma mudança de escala: o grupo, especializado no treinamento de estudantes de graduação, ampliou sua atuação para o mestrado e o doutorado, reafirmando o compromisso com a pesquisa, o ensino e a extensão aplicados ao campo."
      ]
    },

    {
      id: "seeds-3-5",
      titulo: "SEEDS: o programa de melhoramento do GEMS inteiro em um só sistema",
      linhaFina: "Desenvolvida dentro do grupo, a plataforma reúne programas, ciclos de seleção, cruzamentos, progênies, ensaios e pedigree — e roda em qualquer computador do laboratório.",
      categoria: "tecnologia",
      data: "2026-08-20",
      autor: "Departamento de Tecnologia",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["SEEDS", "software", "rastreabilidade"],
      texto: [
        "Todo programa de melhoramento produz uma quantidade enorme de informação: de onde veio cada material, quem foi cruzado com quem, qual progênie foi selecionada em qual ciclo, em que parcela ela estava no campo. No GEMS, essas informações moram em um só lugar: o **SEEDS**, sistema desenvolvido pelo próprio grupo.",
        "Com ele é possível cadastrar programas, ciclos de seleção, entradas genéticas, cruzamentos, progênies e experimentos de campo, além de gerar etiquetas, croquis, cadernos de campo e a genealogia completa dos materiais.",
        "## Rastreabilidade de ponta a ponta",
        "O ponto central é o pedigree. Em um programa de seleção recorrente, as progênies selecionadas em um ciclo se tornam os genitores do ciclo seguinte. O SEEDS acompanha essa cadeia geração após geração, de modo que qualquer material pode ser rastreado até as populações de origem.",
        "> Qualquer material pode ser rastreado, geração após geração, até as populações de origem.",
        "## Feito para o laboratório",
        "O sistema tem instalador próprio, que dispensa instalar o R ou ter acesso de administrador, funciona em português e em inglês, pede login individual e atualiza as telas sozinho quando outra pessoa grava um dado na rede.",
        "O trabalho que apresenta o SEEDS [ficou em 3º lugar no IV SEAGRO](noticia.html?id=seeds-3o-lugar-seagro)."
      ]
    },

    {
      id: "banco-de-germoplasma-digital",
      titulo: "Banco de germoplasma ganha controle digital dos lotes de sementes",
      linhaFina: "Aba do SEEDS registra o saldo de cada lote guardado na câmara fria e mostra em quais programas cada material está sendo usado.",
      categoria: "germoplasma",
      data: "2026-08-11",
      autor: "Departamento de Germoplasma",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["BAG", "sementes", "SEEDS"],
      texto: [
        "As sementes guardadas na câmara fria são o patrimônio mais valioso de um programa de melhoramento: é delas que saem os cruzamentos das próximas safras. Para cuidar desse acervo, o SEEDS ganhou a aba **BAG**, sigla de Banco Ativo de Germoplasma.",
        "Cada lote de sementes passa a ter registro próprio, com o saldo disponível. Assim, o Departamento de Germoplasma sabe o que está guardado antes de planejar semeaduras e cruzamentos, e o painel inicial do sistema avisa quando um lote chega a um nível crítico.",
        "## De onde vem, para onde vai",
        "A aba também mostra em quais programas cada material está sendo usado. Essa informação não é digitada por ninguém: o sistema a deduz dos cruzamentos em que o material entrou como genitor, das progênies que ele originou e dos ensaios em que foi avaliado. Por isso, ela nunca fica desatualizada.",
        "## Próximo passo: a balança",
        "A etapa seguinte é ligar a balança do laboratório direto ao sistema, para que o peso de cada lote seja lido sem digitação. A integração já foi construída e está em fase de testes."
      ]
    },

    {
      id: "etiquetas-qr-code",
      titulo: "Etiquetas com QR code agilizam a identificação de parcelas e cruzamentos",
      linhaFina: "O SEEDS gera as etiquetas em PDF, prontas para imprimir, com o código de cada parcela ou cruzamento também gravado em QR code.",
      categoria: "campo",
      data: "2026-07-30",
      autor: "Departamento de Campo",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["etiquetas", "QR code", "SEEDS"],
      texto: [
        "Identificar corretamente cada parcela e cada saco de sementes é o que separa um dado confiável de um dado perdido. Para isso, o SEEDS gera as etiquetas do grupo em PDF, prontas para imprimir.",
        "Nas etiquetas de parcela, o código do ensaio e o da parcela vêm escritos e também gravados em um **QR code**, que pode ser lido pelo celular no campo.",
        "## Um saco, uma etiqueta",
        "Nas etiquetas de cruzamento, cada saco recebe a sua, numerada — 1 de 3, 2 de 3, e assim por diante —, para que nenhum se perca entre o campo e a câmara fria.",
        "A lista pode vir de uma planilha: ler o arquivo não cadastra nada no sistema, apenas prepara a impressão."
      ]
    },

    {
      id: "janela-de-polinizacao",
      titulo: "Janela de polinização: por que o campo não espera",
      linhaFina: "Atividades que dependem do florescimento têm prazo biológico — e o grupo se organiza para estar pronto quando a planta estiver.",
      categoria: "campo",
      data: "2026-07-22",
      autor: "Departamento de Campo",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["polinização", "milho", "campo"],
      texto: [
        "No melhoramento de milho, algumas tarefas não podem ser marcadas com semanas de antecedência. A polinização controlada precisa acontecer quando pendão e espiga estão prontos — e quem decide o dia é a planta, não a agenda.",
        "Para lidar com isso, o regulamento do GEMS prevê a **janela de prontidão**: o coordenador de campo anuncia um período e, dentro dele, a convocação pode ocorrer com 24 a 48 horas de antecedência. Todos já contam com isso.",
        "## Eventos críticos",
        "A polinização faz parte dos chamados eventos críticos, ao lado da semeadura, da colheita e da montagem de experimentos. Nesses dias, a presença de todos os membros é esperada, qualquer que seja o departamento. Nos eventos que podem ser agendados, as faltas precisam ser avisadas com pelo menos sete dias de antecedência.",
        "## Na prática",
        "Na polinização controlada, a espiga é protegida antes de os estilos-estigmas aparecerem, e o pólen coletado de um pendão escolhido é levado até ela no momento certo. É assim que se garante quem é o pai de cada semente — informação que depois vai para o pedigree no SEEDS."
      ]
    },

    {
      id: "selecao-recorrente-explicada",
      titulo: "Entenda: como a seleção recorrente melhora uma população de milho a cada ciclo",
      linhaFina: "Avaliar, selecionar e recombinar: o método que acumula, geração após geração, os alelos favoráveis de uma população.",
      categoria: "pesquisa",
      data: "2026-07-15",
      autor: "Redação GEMS",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["seleção recorrente", "milho", "melhoramento"],
      texto: [
        "A seleção recorrente é um dos métodos mais usados para melhorar populações de plantas alógamas, como o milho. A ideia é simples de enunciar: a cada ciclo, avaliam-se progênies da população, selecionam-se as melhores, e essas progênies são recombinadas entre si para formar a população do ciclo seguinte.",
        "Como a recombinação reúne alelos favoráveis que estavam espalhados em indivíduos diferentes, a frequência desses alelos aumenta de um ciclo para o outro — e, com ela, a média da população para os caracteres selecionados, sem esgotar a variabilidade genética de uma vez.",
        "## Um ciclo, passo a passo",
        "- **Obtenção das progênies** a partir da população do ciclo atual;",
        "- **Avaliação em ensaios de campo**, com repetições, para separar o efeito genético do efeito do ambiente;",
        "- **Seleção** das melhores progênies com base nos dados;",
        "- **Recombinação** das progênies selecionadas, que dá origem ao ciclo seguinte.",
        "## Onde entra o SEEDS",
        "Como as progênies selecionadas em um ciclo se tornam os genitores do próximo, o pedigree de cada material cresce a cada geração. O SEEDS registra essa cadeia, dos genitores originais às progênies mais recentes, e mantém a ordem dos ciclos de cada programa."
      ]
    },

    {
      id: "ensaio-interprovi-2025",
      titulo: "Ensaio Interprovi 2025: dados de nove genótipos de milho entram em análise",
      linhaFina: "Experimento em blocos casualizados, com 27 parcelas, avaliou caracteres de planta, de espiga e a produção de grãos.",
      categoria: "pesquisa",
      data: "2026-08-18",
      autor: "Redação GEMS",
      destaque: false,
      imagem: "",
      legenda: "",
      tags: ["milho", "ensaio", "análise de trilha"],
      texto: [
        "Os dados do ensaio Interprovi 2025 estão na fase de análise. O experimento avaliou **nove genótipos de milho** em delineamento de blocos casualizados, com três repetições: 27 parcelas no total.",
        "Foram medidos caracteres de planta, como a altura da planta, a altura de inserção da espiga e as datas de florescimento, e caracteres ligados à produção, como diâmetro e comprimento da espiga, número de grãos por fileira e peso de grãos por parcela.",
        "## Antes da estatística, a conferência",
        "Antes de qualquer análise, a planilha passa por uma conferência cuidadosa. É nessa etapa que aparecem problemas comuns em dados de campo — valores digitados na coluna errada, colunas duplicadas, separadores de milhar confundidos com vírgula decimal — que, se passassem adiante, distorceriam os resultados.",
        "## Correlações e análise de trilha",
        "Com os dados conferidos, a equipe estima as correlações entre os caracteres e faz a **análise de trilha**, que desdobra essas correlações em efeitos diretos e indiretos sobre a produção de grãos.",
        "> A pergunta é quais características ajudam a encontrar, de forma indireta, os genótipos mais produtivos.",
        "Caracteres fáceis de medir e fortemente associados à produção podem apoiar a seleção nos próximos ciclos do programa."
      ]
    }

  ],

  /* ---------------------------------------------------------------------
     LEITURAS ESSENCIAIS — lista da lateral. Use os "id" das notícias.
     --------------------------------------------------------------------- */
  essenciais: [
    "nova-identidade-visual",
    "primeira-tese-doutorado",
    "selecao-recorrente-explicada",
    "janela-de-polinizacao",
    "seeds-3-5"
  ],

  /* ---------------------------------------------------------------------
     AGENDA — itens com data já passada somem sozinhos.
     Sem data definida? Deixe data: "" e escreva em "quando" (ex.: "A confirmar").
     --------------------------------------------------------------------- */
  agenda: [
    { data: "2026-09-18", quando: "", titulo: "Dia de Campo GEMS", local: "Fazenda Experimental da UFS – Campus do Sertão, Pov. Mesinhas · 8h30 às 11h30" }
  ],

  /* ---------------------------------------------------------------------
     O GEMS EM NÚMEROS — faixa verde da página inicial
     --------------------------------------------------------------------- */
  numeros: [
    { valor: "15", rotulo: "resumos científicos no IV SEAGRO" },
    { valor: "3",  rotulo: "premiações em eventos científicos em 2026" },
    { valor: "1ª", rotulo: "tese de doutorado defendida no grupo" },
    { valor: "{membros}", rotulo: "integrantes, da graduação ao doutorado" }   // {membros} = conta sozinho
  ],

  /* ---------------------------------------------------------------------
     DEPARTAMENTOS — icone: "semente", "broto", "codigo" ou "camera"
     "categoria" (opcional) liga o cartão às notícias daquela seção;
     "cor" (opcional) serve para departamento sem seção própria.
     --------------------------------------------------------------------- */
  departamentos: [
    { nome: "Germoplasma", icone: "semente", categoria: "germoplasma",
      texto: "Cuida do banco ativo de germoplasma: inventário da câmara fria, contagem de sementes, testes de germinação e organização dos lotes." },
    { nome: "Campo", icone: "broto", categoria: "campo",
      texto: "Conduz a área experimental: semeadura, polinizações, avaliações ao longo do ciclo e colheita." },
    { nome: "Tecnologia", icone: "codigo", categoria: "tecnologia",
      texto: "Desenvolve o SEEDS e as ferramentas digitais do grupo, de scripts de automação a fichas digitais de coleta." },
    { nome: "Mídia", icone: "camera", categoria: "", cor: "#B4472A",
      texto: "Registra e comunica o trabalho do grupo em fotos, vídeos e nos canais do GEMS." }
  ],

  /* ---------------------------------------------------------------------
     EQUIPE — página "Membros"
       grupo    -> id de um dos "grupos" abaixo
       foto     -> retrato padronizado em "imagens/membros" (vazio = monograma)
       lattes   -> endereço do currículo Lattes (vazio = não aparece)
       orcid    -> só o número, ex.: "0000-0002-3839-6261"
       credenciais -> só para quem está num grupo com destaque: true (linhas de formação)
       coordena -> nome de um dos "departamentos": a pessoa ganha destaque como
                   coordenação dele (aqui e no cartão do departamento na página inicial)
       email    -> aparece no cartão, com link (o site é público: só com autorização)
     Nunca coloque aqui CPF ou matrícula.
     --------------------------------------------------------------------- */
  equipe: {
    titulo: "Quem faz o GEMS",
    intro: "Docentes, pós-graduandos e estudantes de graduação que conduzem, do campo à análise de dados, o melhoramento de milho para o Semiárido na UFS – Campus do Sertão.",
    grupos: [
      { id: "orientacao",    nome: "Orientação",    descricao: "Orientação e coorientação científica do grupo.", destaque: true },
      { id: "pos-graduacao", nome: "Pós-graduação", descricao: "Mestrado e doutorado no Programa de Pós-Graduação em Agricultura e Biodiversidade (PPGAGRI/UFS)." },
      { id: "graduacao",     nome: "Graduação",     descricao: "Estudantes da UFS – Campus do Sertão em iniciação científica, tecnológica e extensão." },
      { id: "colaboracao",   nome: "Colaboração",   descricao: "Membros externos que atuam nos projetos do grupo." }
    ],
    membros: [

      { id: "gustavo-oliveira", grupo: "orientacao",
        nome: "Gustavo Hugo Ferreira de Oliveira",
        cargo: "Orientador e idealizador do GEMS",
        foto: "imagens/membros/gustavo-oliveira.webp",
        credenciais: ["Doutorado em Produção Vegetal — UNESP", "Mestrado — UFRPE", "Professor adjunto — DEAS/UFS, desde 2018"],
        bio: "Idealizou o GEMS e orienta o grupo. Professor adjunto do Departamento de Engenharia Agronômica do Sertão (DEAS/UFS), conduz o programa de melhoramento de milho do grupo, com trabalhos em seleção de genótipos adaptados ao Semiárido, fenotipagem por imagens e envirotyping.",
        lattes: "https://lattes.cnpq.br/7634952167645542", orcid: "0000-0002-3839-6261",
        email: "gustavooliveira@academico.ufs.br" },

      { id: "jairo-cordeiro", grupo: "orientacao",
        nome: "José Jairo Florentino Cordeiro Junior",
        cargo: "Coorientador do GEMS",
        foto: "imagens/membros/jairo-cordeiro.webp",
        credenciais: ["Doutorado em Engenharia Agrícola — UFRPE", "Mestrado em Produção Agrícola — UFRPE", "Professor adjunto — UFS, Campus do Sertão, desde 2018"],
        bio: "Coorienta o grupo ao lado do professor Gustavo Oliveira. Engenheiro agrônomo formado pela Universidade Federal Rural de Pernambuco, onde também fez mestrado e doutorado, é professor adjunto do Núcleo de Graduação de Agronomia da UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/1366860947364876", orcid: "0000-0002-1138-8309",
        email: "jairofcordeiro@academico.ufs.br" },

      { id: "barbara-nascimento", grupo: "pos-graduacao",
        nome: "Barbara Nascimento Santos",
        cargo: "Doutoranda · PPGAGRI/UFS",
        foto: "imagens/membros/barbara-nascimento.webp",
        bio: "Engenheira agrônoma pela UFS – Campus do Sertão. Desenvolve um protocolo de fenotipagem de alto rendimento com imagens aéreas de drone para identificar precocemente genótipos de milho no Semiárido.",
        lattes: "https://lattes.cnpq.br/3897884816442099", orcid: "0000-0002-1689-7399",
        email: "barbaranascimento2804@gmail.com" },

      { id: "carla-nayara", grupo: "pos-graduacao",
        nome: "Carla Nayara da Silva Lima",
        cargo: "Pós-graduação · PPGAGRI/UFS",
        foto: "imagens/membros/carla-nayara.webp",
        bio: "Graduação pelo Departamento de Ciências Florestais da UFS e mestrado em Agricultura e Biodiversidade. Integra as equipes dos estudos do grupo sobre uso de nitrogênio e fenotipagem de milho por drone.",
        lattes: "https://lattes.cnpq.br/7567058592041542", orcid: "0009-0003-0677-4998",
        email: "carla.nayara.716@gmail.com" },

      { id: "jacilene-santos", grupo: "pos-graduacao",
        nome: "Jacilene Francisca Souza Santos",
        cargo: "Doutoranda · PPGAGRI/UFS",
        foto: "imagens/membros/jacilene-santos.webp",
        bio: "Engenheira agrônoma e mestre em Agricultura e Biodiversidade, pesquisa recursos genéticos para o melhoramento do milho frente a estresses bióticos e abióticos. Menção honrosa em 1º lugar no IV CONAGRO (2026).",
        lattes: "https://lattes.cnpq.br/3994415488550168", orcid: "0000-0001-5109-3663",
        email: "jacisanttos17@gmail.com" },

      { id: "nartenia-aragao", grupo: "pos-graduacao",
        nome: "Nartênia Susane Costa Aragão",
        cargo: "Mestranda · PPGAGRI/UFS",
        foto: "imagens/membros/nartenia-aragao.webp",
        bio: "Técnica agropecuária pelo IFS e engenheira agrônoma pela UFS – Campus do Sertão. Seleciona genótipos de milho adaptados ao Semiárido com FAI-BLUP, MGIDI e GYT biplot. Premiada no PIBIC 2021/22 e 2022/23.",
        lattes: "https://lattes.cnpq.br/8012425150523512", orcid: "0000-0003-3409-3236",
        email: "nartenia.aragao@gmail.com" },

      { id: "arthur-valenca", grupo: "graduacao",
        nome: "Arthur Rocha Valença",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/arthur-valenca.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "", orcid: "0009-0001-2381-626X",
        email: "" },

      { id: "camila-lima", grupo: "graduacao",
        nome: "Camila Lima Santos",
        cargo: "Zootecnia",
        foto: "imagens/membros/camila-lima.webp",
        bio: "Estudante de graduação em Zootecnia na UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/4999441804660008", orcid: "0009-0005-1771-0601",
        email: "camila091@academico.ufs.br" },

      { id: "carlos-emanuel", grupo: "graduacao",
        nome: "Carlos Emanuel Brito dos Santos",
        cargo: "Graduação · UFS",
        foto: "imagens/membros/carlos-emanuel.webp",
        bio: "Estudante de graduação na UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/5041383353796564", orcid: "0009-0000-3327-2756",
        email: "manuevil20@gmail.com" },

      { id: "evany-melo", grupo: "graduacao",
        nome: "Evany dos Santos Melo",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/evany-melo.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "", orcid: "0009-0000-9404-823X",
        email: "evanymelo@academico.ufs.br" },

      { id: "itamara-almeida", grupo: "graduacao", coordena: "Germoplasma",
        nome: "Itamara de Almeida Santos",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/itamara-almeida.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "", orcid: "0009-0003-8315-0927",
        email: "itamaradealmeida@academico.ufs.br" },

      { id: "joao-pedro-alves", grupo: "graduacao", coordena: "Campo",
        nome: "João Pedro da Silva Alves",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/joao-pedro-alves.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/7199299150504519", orcid: "0009-0008-9662-2002",
        email: "agro.jpalves@gmail.com" },

      { id: "jose-felipe-dantas", grupo: "graduacao", coordena: "Tecnologia",
        nome: "José Felipe Dantas Lima",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/jose-felipe-dantas.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/8422282845805796", orcid: "0009-0000-9629-5103",
        email: "felipedantascontato@gmail.com" },

      { id: "raiane-paixao", grupo: "graduacao", coordena: "Mídia",
        nome: "Raiane Prissila Andrade da Paixão",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/raiane-paixao.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "https://lattes.cnpq.br/7543957456190153", orcid: "0009-0001-5302-5952",
        email: "raianeprissila@gmail.com" },

      { id: "silvio-souza", grupo: "graduacao",
        nome: "Silvio Roberto de Souza Junior",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/silvio-souza.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "", orcid: "0009-0000-2442-0163",
        email: "silviojunior@academico.ufs.br" },

      { id: "vinicius-aragao", grupo: "graduacao",
        nome: "Vinicius Emanuel Silva Aragão",
        cargo: "Engenharia Agronômica",
        foto: "imagens/membros/vinicius-aragao.webp",
        bio: "Estudante de graduação em Engenharia Agronômica na UFS – Campus do Sertão.",
        lattes: "", orcid: "0009-0009-7585-1698",
        email: "viniciusemanuel557@gmail.com" },

      { id: "mikaely-rosendo", grupo: "colaboracao",
        nome: "Mikaely Rosendo dos Santos",
        cargo: "Membro externo",
        foto: "imagens/membros/mikaely-rosendo.webp",
        bio: "Integra a equipe do estudo sobre altura de planta estimada por drone para seleção de milho sob diferentes níveis de nitrogênio, publicado nos anais do SIGM 2026.",
        lattes: "https://lattes.cnpq.br/5195830206356678", orcid: "0000-0003-0454-8498",
        email: "mikaellyrosendodossantos285@gmail.com" }

    ]
  },

  /* ---------------------------------------------------------------------
     EXPERIMENTOS — página "Experimentos" e chamada na página inicial
       sigla    -> nome curto em destaque
       resumo   -> uma frase, usada no cartão da página inicial
       foco     -> etiquetas curtas com o que o experimento avalia
       parceria -> instituição parceira (opcional)
       arte     -> desenho do experimento: "ambientes", "cruzamento",
                   "topcross" ou "bacterias"
       cor      -> cor de destaque do experimento
     --------------------------------------------------------------------- */
  experimentos: {
    titulo: "Experimentos",
    intro: "As linhas de experimentação do GEMS com a cultura do milho, conduzidas no Campus do Sertão para gerar materiais mais produtivos, estáveis e adaptados ao Semiárido.",
    lista: [
      {
        id: "vcu", sigla: "VCU", nome: "Valor de Cultivo e Uso",
        cor: "#2F7542", arte: "ambientes",
        resumo: "Desempenho agronômico e adaptação de genótipos de milho em ambientes representativos do semiárido.",
        foco: ["Produtividade", "Estabilidade", "Adaptação"],
        parceria: "",
        texto: [
          "O experimento de VCU (Valor de Cultivo e Uso) tem como objetivo avaliar o desempenho agronômico e a adaptação de diferentes genótipos de milho em ambientes representativos do semiárido. São analisadas características relacionadas à produtividade, à estabilidade e à adaptação dos materiais, permitindo identificar aqueles com maior potencial de cultivo na região.",
          "A avaliação em diferentes ambientes ajuda a compreender o comportamento dos genótipos e a subsidiar as etapas de seleção e desenvolvimento de materiais de milho mais produtivos, estáveis e adaptados às condições do semiárido."
        ]
      },
      {
        id: "inter", sigla: "INTER", nome: "Híbridos intervarietais",
        cor: "#235C94", arte: "cruzamento",
        resumo: "Cruzamentos entre populações divergentes e a população F2 como matéria-prima para seleção e novos híbridos.",
        foco: ["Heterose", "População F2", "Seleção recorrente"],
        parceria: "",
        texto: [
          "Híbridos intervarietais são obtidos pelo cruzamento controlado entre duas populações de polinização aberta geneticamente divergentes, explorando a heterose entre elas.",
          "A geração F1 desse cruzamento, ao ser autofecundada, origina a população base F2. É nesse momento que ocorrem a segregação e a recombinação dos alelos parentais, gerando a variabilidade genética que servirá de matéria-prima para a seleção recorrente, a obtenção de linhagens ou a formação de novos híbridos.",
          "Estudos mostram que híbridos derivados de populações F2 podem igualar em produtividade os derivados de F1, com custo de semente bem mais baixo que o dos híbridos comerciais."
        ]
      },
      {
        id: "topcross", sigla: "TOPCROSS", nome: "Híbridos top cross de tripla aptidão",
        cor: "#9A6412", arte: "topcross",
        resumo: "Híbridos top cross de milho para grãos, forragem e milho verde: uma cultivar, três usos.",
        foco: ["Grãos", "Forragem", "Milho verde"],
        parceria: "",
        texto: [
          "O experimento trata do desenvolvimento de híbridos top cross de milho com tripla aptidão, destinados à produção de grãos, de forragem e de milho verde.",
          "O top cross é uma técnica de melhoramento genético de plantas que consiste no cruzamento entre uma linhagem e um híbrido ou variedade usado como testador. Ela permite obter híbridos top cross e avaliar a capacidade de combinação das linhagens envolvidas.",
          "Diante da necessidade dos produtores da região de disporem de cultivares versáteis, capazes de atender a diferentes finalidades conforme a demanda do mercado ou da propriedade, o projeto busca desenvolver híbridos top cross que possam ser destinados tanto à colheita de grãos quanto à produção de forragem e à comercialização como milho verde.",
          "Espera-se, com isso, oferecer aos produtores da região uma cultivar multipropósito, que facilite a tomada de decisão no manejo da lavoura e amplie as possibilidades de uso da cultura do milho."
        ]
      },
      {
        id: "bac", sigla: "BAC", nome: "Bactérias na fixação biológica de nitrogênio",
        cor: "#6B4C8A", arte: "bacterias",
        resumo: "Bactérias Gram-positivas e Gram-negativas para reduzir o uso de adubo nitrogenado no milho.",
        foco: ["Fixação biológica de N", "Menos fertilizante", "Sustentabilidade"],
        parceria: "BIOWORD",
        texto: [
          "Desenvolvido em parceria com a BIOWORD, o experimento trabalha com bactérias Gram-positivas e Gram-negativas para avaliar seu potencial na fixação biológica de nitrogênio (FBN) na cultura do milho.",
          "O estudo busca identificar o potencial dessas bactérias na redução do uso de fertilizantes nitrogenados, contribuindo para um manejo mais eficiente e sustentável da cultura."
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------------
     DESTAQUE DO SEEDS — bloco da página inicial
     --------------------------------------------------------------------- */
  seeds: {
    titulo: "O programa de melhoramento inteiro em um só lugar",
    texto: "Sistema integrado de gestão de melhoramento vegetal, experimentos e rastreabilidade de materiais, desenvolvido pelo Departamento de Tecnologia do GEMS e premiado no IV SEAGRO 2026.",
    recursos: [
      "Programas e ciclos de seleção",
      "Cruzamentos e progênies",
      "Ensaios, croquis e cadernos de campo",
      "Etiquetas com QR code",
      "Pedigree e rastreabilidade",
      "Banco de germoplasma"
    ],
    noticia: "seeds-3-5"   // "Leia a reportagem" abre esta notícia
  }
};
