# Controle de Estoque — La Formatta Pizzaria

Duas páginas estáticas que conectam direto no Supabase (mesmo banco do [dashboard de BI](https://github.com/nikokrz1/la-bella-donna-bi)), hospedadas via GitHub Pages.

## Páginas

- **[index.html](index.html)** — preenchimento diário de estoque (uso: funcionário responsável pelo estoque)
  - Um card por insumo: **Estoque Fechado**, **Estoque em Uso/Cozinha**, **Compras do dia**
  - Salva automaticamente ao sair do campo
  - Trava o envio se a variação passar de 30% do último registro sem compra lançada (evita erro de digitar em UN em vez de KG, ou vice-versa)

- **[precos.html](precos.html)** — cadastro de preços dos insumos (uso: sócios)
  - Preço de compra, quantidade por embalagem e fornecedor editáveis
  - Custo unitário calculado automaticamente

## Como funciona por baixo

Ambas as páginas usam a **chave pública (anon key)** do Supabase — segura para expor, porque o acesso é limitado por Row Level Security no banco (só permite ler/gravar exatamente o que essas páginas precisam).

Tabelas usadas: `insumos` e `estoque_diario` (schema em [schema_estoque.sql](https://github.com/nikokrz1/la-bella-donna-bi/blob/main/db/schema_estoque.sql) no repositório do BI).

## Relatórios

O consumo diário (em quantidade e em R$) é calculado e visualizado no **Metabase** — não nesta página, para manter essa informação visível só para os sócios.
