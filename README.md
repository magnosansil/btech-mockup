# BTech Jr. — Mockup da campanha (Grupo 3)

Apresentação em slides (HTML + CSS + JS) da mini campanha de divulgação da BTech Jr.

## Como rodar

Não há dependências nem build. Basta abrir o site em um navegador.

### Opção 1 — Abrir o arquivo direto

Abra `index.html` com duplo clique ou arraste o arquivo para o Chrome / Edge / Firefox.

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

- **Teclado:** setas esquerda / direita  
- **Mouse:** roda do mouse (scroll vertical)  
- **Touch:** deslize horizontal no slide (fora do carrossel do mock do Instagram)  
- **Pontos:** clique nos dots à direita (desktop) ou na barra inferior (mobile)

## Estrutura

| Arquivo      | Função                          |
|-------------|----------------------------------|
| `index.html`| Slides e conteúdo               |
| `styles.css`| Estilos e layout responsivo     |
| `main.js`   | Slider principal e carrossel Instagram |
| `images/`   | Imagens do mock e da marca    |
