import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Photo = { area: string; data: string };
const areas = new Set(["Frente", "Traseira", "Lateral", "Rodas e pneus", "Interior", "Motor", "Detalhe"]);
const schema = {
  type: "object", additionalProperties: false,
  properties: {
    resumo: {type:"string"},
    observacoes: {type:"array", items:{type:"object", additionalProperties:false, properties:{foto:{type:"integer"},area:{type:"string"},achado:{type:"string"},atencao:{type:"string",enum:["baixo","medio","alto","inconclusivo"]},conferir:{type:"string"}},required:["foto","area","achado","atencao","conferir"]}},
    limitacoes: {type:"string"}
  }, required:["resumo","observacoes","limitacoes"]
};

export async function GET() {
  return NextResponse.json({available:Boolean(process.env.OPENAI_API_KEY)},{headers:{"cache-control":"no-store"}});
}

export async function POST(request: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (typeof key !== "string" || !key) return NextResponse.json({error:"A análise por IA ainda não foi ativada neste app."},{status:503});
  if (Number(request.headers.get("content-length")||0)>4_200_000) return NextResponse.json({error:"Envie até 6 imagens menores."},{status:413});
  let body: {photos?: Photo[]; vehicle?: string};
  try { body = await request.json(); } catch {return NextResponse.json({error:"Envio inválido."},{status:400});}
  const photos = body.photos;
  if (!Array.isArray(photos) || photos.length<1 || photos.length>6 || photos.some(p=>!areas.has(p?.area)||typeof p?.data!=="string"||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.data)||p.data.length>650_000)) return NextResponse.json({error:"Envie de 1 a 6 fotos JPG, PNG ou WebP com até 450 KB cada."},{status:400});
  const vehicle = String(body.vehicle||"").slice(0,150);
  const content: Array<Record<string, unknown>> = [{type:"input_text",text:`Avalie SOMENTE o que é visível nas fotos de um seminovo (${vehicle}). Fotos numeradas e áreas informadas abaixo. Liste detalhes concretos por foto, inclusive quando a imagem não permite concluir. Aponte riscos potenciais como hipótese, jamais diagnóstico. Não conclua ausência de colisão, pintura original, condição estrutural ou mecânica por foto. Não identifique pessoas, placas ou dados pessoais. Responda em português simples. Até 8 observações úteis.`}];
  photos.forEach((p,i)=>{content.push({type:"input_text",text:`Foto ${i+1}, área declarada: ${p.area}.`},{type:"input_image",image_url:p.data,detail:"high"});});
  try {
    const controller = new AbortController(); const timer = setTimeout(()=>controller.abort(),45000);
    let response: Response;
    try { response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{authorization:`Bearer ${key}`,"content-type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",store:false,max_output_tokens:1200,input:[{role:"user",content}],text:{format:{type:"json_schema",name:"avaliacao_visual",strict:true,schema}}}),signal:controller.signal}); }
    finally {clearTimeout(timer);}
    if (!response.ok) return NextResponse.json({error:"A análise não ficou disponível agora. Tente novamente mais tarde."},{status:502});
    const result = await response.json() as {output?: Array<{content?: Array<{type:string;text?:string}>}>};
    const raw = result.output?.flatMap(o=>o.content||[]).find(x=>x.type==="output_text")?.text;
    if (!raw) throw new Error("empty analysis");
    const analysis = JSON.parse(raw);
    return NextResponse.json({analysis},{headers:{"cache-control":"no-store"}});
  } catch {return NextResponse.json({error:"Não foi possível concluir a análise. Tente novamente."},{status:502});}
}
