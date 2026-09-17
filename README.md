# Portal de notícias do GEMS

Site do **GEMS — Grupo de Estudos em Melhoramento Vegetal do Semiárido (UFS)**,
no formato de portal de notícias. É um site estático (HTML, CSS e JavaScript,
sem nada para instalar), feito para ser publicado de graça no **GitHub Pages**.

- **Página inicial** com manchete, últimas notícias, leituras essenciais,
  agenda, números do grupo, departamentos, destaque do SEEDS e contato.
- **Página de cada notícia**, com botões para compartilhar no WhatsApp,
  Facebook, LinkedIn ou copiar o link.
- **Arquivo** com todas as notícias, filtro por seção e busca (a busca ignora
  acentos: “genetica” encontra “genética”).
- Tema claro e escuro, versão para celular e página 404 própria.
- Notícia sem foto ganha uma **capa desenhada automaticamente** com a cor e um
  motivo da seção (hélice de DNA, croqui de parcelas, grãos de milho, genealogia…).

---

## Publicar no GitHub Pages (primeira vez)

1. Entre no [GitHub](https://github.com) e crie um repositório **público**
   (botão **New**). Um nome curto funciona bem, por exemplo `gems`.
   > Se o repositório se chamar `NOME-DA-CONTA.github.io`, o site fica na
   > raiz: `https://NOME-DA-CONTA.github.io/`. Com outro nome, fica em
   > `https://NOME-DA-CONTA.github.io/gems/`.
2. No repositório recém-criado, clique em **uploading an existing file**
   (ou **Add file → Upload files**) e arraste **o conteúdo** desta pasta — os
   arquivos e as pastas que estão aqui dentro, não a pasta `gems-portal` em si.
   O `index.html` precisa ficar na raiz do repositório.
   Clique em **Commit changes**.
3. Vá em **Settings → Pages**. Em *Build and deployment*, escolha
   **Source: Deploy from a branch**, **Branch: main** e a pasta **/ (root)**.
   Clique em **Save**.
4. Em um ou dois minutos o endereço do site aparece no topo dessa mesma página.

Quem prefere a linha de comando, de dentro desta pasta:

```bash
git init -b main
git add .
git commit -m "Portal de notícias do GEMS"
git remote add origin https://github.com/NOME-DA-CONTA/gems.git
git push -u origin main
```

---

## Publicar uma notícia

Tudo o que muda no dia a dia fica em **um único arquivo: `conteudo.js`**.

1. Abra o `conteudo.js` — pelo próprio GitHub (clique no arquivo e depois no
   lápis ✏️) ou no computador.
2. Copie um bloco de notícia `{ ... },` e cole no começo da lista `noticias`.
3. Troque o `id` (sem espaço nem acento — ele vira o endereço da página),
   o título, a linha fina, a categoria, a data (`AAAA-MM-DD`) e o texto.
4. Salve (**Commit changes**). O site se atualiza em cerca de um minuto;
   quem já estava com o site aberto pode levar até 10 minutos para ver,
   por causa do cache do GitHub.

A ordem das notícias no arquivo não importa: o site ordena pela data.
Marque `destaque: true` na notícia que pode ir para a manchete.

Dentro do texto, cada item da lista é um parágrafo, e também valem:

| Escreva                        | Para ter                          |
| ------------------------------ | --------------------------------- |
| `"## Intertítulo"`             | um subtítulo dentro da notícia    |
| `"> Frase"`                    | uma citação em destaque           |
| `"- Item"`                     | um item de lista                  |
| `"![Legenda](imagens/foto.jpg)"` | uma foto no meio do texto       |
| `**negrito**` e `*itálico*`    | ênfase                            |
| `[texto](https://endereco)`    | um link                           |

**Errou uma vírgula?** O site não quebra em silêncio: no lugar das notícias
aparece uma caixa avisando que há um erro no `conteudo.js` — no site
publicado, com o número da linha.

### Fotos

Coloque as fotos na pasta `imagens/` e escreva o caminho no campo `imagem`
da notícia, por exemplo `imagem: "imagens/colheita-2026.jpg"`. Veja as
recomendações de tamanho em [`imagens/LEIA-ME.md`](imagens/LEIA-ME.md).
Se o nome estiver errado, o site usa a capa desenhada no lugar da foto.

### Vídeo

Coloque o link do YouTube no campo `video` da notícia
(`video: "https://youtu.be/..."`) e ele aparece no topo, no lugar da capa.

### O que mais dá para mudar no `conteudo.js`

- `site` e `contato` — nome, texto “quem somos”, e-mail, Instagram, YouTube,
  GitHub. Campo vazio (`""`) simplesmente não aparece no site.
- `categorias` — as seções do menu. Uma seção só aparece no menu quando tem
  pelo menos uma notícia.
- `essenciais` — a lista numerada da lateral (use os `id` das notícias).
- `agenda` — compromissos; os que já passaram somem sozinhos.
- `numeros`, `departamentos` e `seeds` — os blocos da página inicial.
  Em `numeros`, o valor `{membros}` é trocado sozinho pelo total da equipe.
- `equipe` — a página **Membros** (ver abaixo).
- `instituicoes` — os logos da faixa “Vínculo institucional”, acima do rodapé
  (UFS e DEAS). Logo de uma cor só leva `monocromatico: true`.

### Membros

A página `membros.html` é montada a partir de `equipe` no `conteudo.js`: cada
pessoa tem nome, grupo (orientação, pós-graduação, graduação, colaboração),
cargo, uma descrição curta, foto, e-mail e os links do Lattes e do ORCID
(campo vazio não aparece). O e-mail fica visível e clicável no cartão: só
publique o de quem autorizou. **Nunca coloque CPF ou matrícula ali — o site
é público.**

As fotos ficam em `imagens/membros/`, todas com **640 × 800 px, fundo
transparente (WebP)**, olhos na mesma altura e o rosto na mesma escala; é isso
que deixa a vitrine alinhada. Para incluir alguém novo, peça ao Claude para
recortar e padronizar a foto do mesmo jeito. Quem estiver sem foto (`foto: ""`)
aparece com uma silhueta e as iniciais, no mesmo tamanho dos demais.

---

## Ver no computador antes de publicar

Dê dois cliques no `index.html`: o site abre direto no navegador, sem
servidor. Aberto assim (no próprio computador), o site também mostra uma
caixa amarela de **avisos do `conteudo.js`** — data em formato errado, `id`
com acento, foto que não foi encontrada. Esses avisos nunca aparecem no site
publicado.

---

## Depois de publicar: prévia no WhatsApp

Para que o link compartilhado mostre a imagem do GEMS, o WhatsApp e as redes
exigem o endereço completo da imagem. Depois que o site estiver no ar, troque
nos arquivos `index.html`, `noticia.html`, `noticias.html` e `membros.html` o trecho

```html
<meta property="og:image" content="assets/img/og-gems.png">
```

pelo endereço completo, por exemplo

```html
<meta property="og:image" content="https://NOME-DA-CONTA.github.io/gems/assets/img/og-gems.png">
```

---

## Estrutura

```
gems-portal/
├── index.html        página inicial
├── noticia.html      página de cada notícia (noticia.html?id=...)
├── noticias.html     arquivo, seções e busca
├── membros.html      vitrine da equipe
├── 404.html          página de endereço inexistente
├── conteudo.js       ← notícias, equipe, agenda e contatos (o arquivo que se edita)
├── imagens/          ← fotos das notícias
│   └── membros/      ← retratos padronizados da equipe
├── assets/
│   ├── css/portal.css
│   ├── js/portal.js  monta as páginas a partir do conteudo.js
│   └── img/          logos, ícones e imagem de compartilhamento
└── .nojekyll         diz ao GitHub Pages para publicar os arquivos como estão
```

## Domínio próprio (opcional)

Para usar um endereço como `gems.ufs.br`, é preciso pedir ao setor de TI da
UFS um registro DNS apontando para o GitHub e depois informar o domínio em
**Settings → Pages → Custom domain**.
