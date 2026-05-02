# Painel Pietra - entrada de dados reais

## Fonte de dados

O app agora funciona em dois modos:

- **Demo local**: usa `localStorage`, sem configuração externa.
- **Supabase conectado**: usa Postgres/Supabase via REST API e mantém `localStorage` apenas como cache.

Para ativar dados reais:

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local`.
4. Preencha:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

5. Reinicie o app com `npm run dev`.

Se o banco estiver vazio, o app faz uma carga inicial com os dados atuais de demonstração.

## Inputs operacionais

### Obras

Cadastro mestre da obra acompanhada no painel.

Campos principais:

- nome
- endereço
- início
- prazo previsto
- cliente
- responsável
- avanço planejado
- desvio de prazo em dias

### Disciplinas

Agrupam produção, pendências e itens de controle.

Campos principais:

- obra
- nome
- responsável
- meta
- produtividade
- próximo passo

### Itens de Controle da Obra

São a base de orçamento, tendência e avanço físico.

Campos principais:

- obra
- disciplina
- código
- nome
- orçamento previsto
- tendência de custo
- status
- data prevista
- responsável
- avanço físico

### Diário de Campo

Entrada diária operacional. Alimenta avanço, produtividade e bloqueios.

Campos principais:

- data
- disciplina
- item de controle
- atividade
- meta do dia
- realizado do dia
- equipe
- HH
- restrição
- status do dia
- avanço atualizado do item
- plano seguinte
- observações

### Pendências

Centraliza restrições, RFI, mudanças, riscos, issues e decisões.

Campos principais:

- tipo
- disciplina
- descrição
- responsável
- prazo
- impacto
- status
- prioridade

## Próximo avanço recomendado

A próxima etapa natural é importar planilhas Excel/CSV para carga inicial de:

- disciplinas
- itens de controle
- orçamento previsto
- datas planejadas

Depois disso, o diário e as pendências viram o input de rotina da obra.
