# BTech Jr. — Apresentações em slides

Apresentações em HTML + CSS + JS no mesmo template visual.

| Arquivo | Conteúdo |
|---------|----------|
| `index.html` | Desafio Trainee — Engajamento & Integração |
| `chave-facil.html` | Desafio Trainee — Gestão de Chaves (IFBA) |

## Como rodar

Não há dependências nem build. Basta abrir o site em um navegador.

### Opção 1 — Abrir o arquivo direto

Abra `index.html` ou `chave-facil.html` com duplo clique ou arraste o arquivo para o Chrome / Edge / Firefox.

### Opção 2 — Servidor local (recomendado)

Alguns navegadores restringem recursos locais; um servidor evita isso.

Na pasta do projeto:

```bash
npx --yes serve .
```

Depois acesse o endereço que o comando mostrar (em geral `http://localhost:3000`).

Alternativa com Python:

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`.

## Navegação

- **Teclado:** setas esquerda / direita (única forma de avançar/voltar slide)  
- **Touch:** deslize horizontal no slide (fora do carrossel do mock do Instagram)  
- **Pontos:** clique nos dots à direita (desktop) ou na barra inferior (mobile)

## Estrutura

| Arquivo      | Função                          |
|-------------|----------------------------------|
| `index.html`| Slides e conteúdo               |
| `styles.css`| Estilos e layout responsivo     |
| `main.js`   | Slider principal e carrossel Instagram |
| `images/`   | Imagens do mock e da marca    |
