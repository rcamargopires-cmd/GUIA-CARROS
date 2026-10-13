# Seminovo sem Surpresa

App de apoio à compra de veículos seminovos. Consulte marca, modelo, versão e preço de referência FIPE; registre vistoria 5P, custos e fotos; compare carros e gere relatório.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Publicação na Vercel

Importe este repositório como projeto Next.js. O build usa `npm run build`. A consulta FIPE usa a API comunitária Parallelum e deve ser conferida no portal oficial da FIPE.

Para habilitar **Fotos e IA**, crie uma chave na plataforma de API da OpenAI e configure `OPENAI_API_KEY` como variável de ambiente **sensitive** nos ambientes Production e Preview da Vercel. Reimplante o projeto. Não coloque a chave no GitHub, no navegador ou em arquivos `.env` publicados.

O app reduz as fotos e guarda as cópias no IndexedDB do navegador. O resultado fica no localStorage do mesmo navegador. Ao pedir análise, até seis fotos são enviadas ao endpoint do app, que chama a API da OpenAI com `store: false`. A IA descreve apenas sinais visíveis e não substitui laudo cautelar ou avaliação mecânica.

Se o site for aberto ao público com a análise por IA ativa, configure proteção contra uso excessivo no endpoint `/api/analyze-photos` antes de divulgar o link amplamente.
