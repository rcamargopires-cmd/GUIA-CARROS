// Suggestions for Brazil. The form always accepts a model not yet listed.
const VEHICLE_CATALOG={
  'Audi':['A1','A3','A4','A5','A6','Q3','Q5','Q7','Q8','e-tron'],
  'BMW':['Série 1','Série 2','Série 3','Série 4','Série 5','X1','X2','X3','X4','X5','X6','i3','iX'],
  'BYD':['Dolphin Mini','Dolphin','Dolphin Plus','Yuan Pro','Yuan Plus','Song Pro','Song Plus','Seal','King','Tan','Han'],
  'CAOA Chery':['Tiggo 2','Tiggo 3X','Tiggo 5X','Tiggo 7','Tiggo 7 Pro','Tiggo 8','Tiggo 8 Pro','Arrizo 5','Arrizo 6'],
  'Chevrolet':['Agile','Astra','Blazer','Bolt EV','Celta','Classic','Cobalt','Cruze','Equinox','Joy','Montana','Onix','Onix Plus','Prisma','S10','Spin','Tracker','Trailblazer','Vectra','Zafira'],
  'Citroën':['Aircross','Basalt','Berlingo','C3','C3 Aircross','C4','C4 Cactus','C4 Lounge','C5 Aircross','Jumpy','Xsara Picasso'],
  'Dodge':['Challenger','Charger','Durango','Journey','Ram 2500'],
  'Fiat':['500','Argo','Bravo','Cronos','Doblo','Ducato','Fastback','Fiorino','Freemont','Grand Siena','Idea','Linea','Mobi','Palio','Pulse','Punto','Siena','Strada','Toro','Uno'],
  'Ford':['Bronco Sport','EcoSport','Edge','Escort','Fiesta','Focus','Fusion','Ka','Ka Sedan','Maverick','Mustang','Ranger','Territory'],
  'GWM':['Haval H6','Haval H6 GT','Ora 03','Tank 300','Poer'],
  'Honda':['Accord','City','City Hatchback','Civic','CR-V','Fit','HR-V','WR-V','ZR-V'],
  'Hyundai':['Azera','Creta','HB20','HB20S','i30','Ioniq 5','Kona','Santa Fe','Tucson','Veracruz'],
  'JAC':['E-JS1','E-JS4','E-JS7','J2','J3','J5','J6','T40','T50','T60','T80'],
  'Jaguar':['E-Pace','F-Pace','F-Type','I-Pace','XE','XF'],
  'Jeep':['Cherokee','Commander','Compass','Grand Cherokee','Renegade','Wrangler'],
  'Kia':['Carnival','Cerato','Niro','Picanto','Sorento','Soul','Sportage','Stonic'],
  'Land Rover':['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Evoque','Range Rover Sport','Range Rover Velar'],
  'Lexus':['ES','NX','RX','UX'],
  'Mercedes-Benz':['Classe A','Classe B','Classe C','Classe E','Classe G','CLA','GLA','GLB','GLC','GLE','Sprinter'],
  'Mitsubishi':['ASX','Eclipse Cross','L200','Outlander','Pajero','Pajero Sport'],
  'Nissan':['Frontier','Kicks','Leaf','Livina','March','Sentra','Tiida','Versa','X-Trail'],
  'Peugeot':['2008','206','207','208','3008','307','308','408','5008','Expert','Partner'],
  'Porsche':['911','Cayenne','Macan','Panamera','Taycan'],
  'RAM':['1500','2500','3500','Rampage'],
  'Renault':['Captur','Clio','Duster','Fluence','Kardian','Kwid','Logan','Master','Oroch','Sandero','Stepway'],
  'Subaru':['Forester','Impreza','Legacy','Outback','XV'],
  'Suzuki':['Grand Vitara','Jimny','Jimny Sierra','S-Cross','Swift','Vitara'],
  'Toyota':['Corolla','Corolla Cross','Etios','Hilux','Prius','RAV4','SW4','Yaris','Yaris Cross'],
  'Volkswagen':['Amarok','Bora','CrossFox','Fox','Gol','Golf','Jetta','Nivus','Passat','Polo','Saveiro','SpaceFox','T-Cross','Taos','Tiguan','Up!','Virtus','Voyage'],
  'Volvo':['C40','EX30','EX40','S60','V40','XC40','XC60','XC90']
};
// Community API for FIPE reference data. The official FIPE site does not offer a public API.
const FIPE_API='https://fipe.parallelum.com.br/api/v2/cars';
const fipeCache=new Map();
let fipeUI={brands:[],models:[],years:[],nonce:0};

async function fipeGet(path){
  if(!fipeCache.has(path)){
    const request=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
      try{
        const response=await fetch(FIPE_API+path,{headers:{Accept:'application/json'},signal:controller.signal});
        if(response.status===429)throw new Error('Muitas consultas agora. Aguarde um pouco e tente novamente.');
        if(!response.ok)throw new Error('A consulta está indisponível. Tente novamente mais tarde.');
        return await response.json();
      }finally{clearTimeout(timer)}
    })();
    fipeCache.set(path,request);
    request.catch(()=>fipeCache.delete(path));
  }
  return fipeCache.get(path);
}
function fipeNorm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function fipeField(id){return document.getElementById('f-'+id)}
function fipeSet(id,value){const el=fipeField(id);if(el)el.value=value??''}
function fipeStatus(message,type='neutral'){const el=document.getElementById('fipe-status');if(el){el.textContent=message;el.dataset.type=type}}
function fipeOptions(id,values){const el=document.getElementById(id);if(el)el.innerHTML=values.map(v=>`<option value="${esc(v)}"></option>`).join('')}
function fipeSelectOptions(items,selected=''){
  return `<option value="">Selecione a versão exata</option>${items.map(x=>`<option value="${esc(x.name)}" ${x.name===selected?'selected':''}>${esc(x.name)}</option>`).join('')}<option value="__manual__" ${selected&&items.every(x=>x.name!==selected)?'selected':''}>Minha versão não aparece</option>`;
}
function fipeBrand(raw){
  const key=fipeNorm(canonicalBrand(raw));
  if(key==='volkswagen')return fipeUI.brands.find(x=>x.name.startsWith('VW -'));
  if(key==='caoa chery')return fipeUI.brands.find(x=>fipeNorm(x.name).includes('chery'));
  return fipeUI.brands.find(x=>fipeNorm(x.name)===key);
}
function modelFits(full,base){
  const a=fipeNorm(full),b=fipeNorm(base);
  return a===b||a.startsWith(b+' ')||a.includes(' '+b+' ');
}
function fipeVersions(brand,base){
  const local=VEHICLE_CATALOG[canonicalBrand(brand)]||[];
  const longer=local.filter(x=>x!==base&&fipeNorm(x).startsWith(fipeNorm(base)+' '));
  return fipeUI.models.filter(x=>modelFits(x.name,base)&&!longer.some(other=>modelFits(x.name,other)));
}
function resetFipeFields(level){
  if(level==='brand'){fipeSet('model','');fipeSet('fipeModelCode','')}
  if(level==='brand'||level==='model'){fipeSet('version','');fipeSet('versionOther','');fipeSet('fipeModelCode','')}
  if(level!=='year')fipeSet('year','');
  fipeSet('fipeYearCode','');
  fipeSet('fipe','');fipeSet('fipeCode','');fipeSet('fipeReferenceMonth','');fipeSet('fipeCheckedAt','');fipeSet('fipeSource','');
  if(level==='brand')fipeSet('fipeBrandCode','');
}
async function loadFipeModels(brandCode,nonce){
  fipeStatus('Buscando modelos e versões da marca…');
  const models=await fipeGet(`/brands/${encodeURIComponent(brandCode)}/models`);
  if(nonce!==fipeUI.nonce||!fipeField('brand'))return false;
  fipeUI.models=models;
  const brand=canonicalBrand(fipeField('brand').value),local=VEHICLE_CATALOG[brand]||[];
  const list=local.length?local:models.map(x=>x.name);
  fipeOptions('model-suggestions',[...new Set(list)]);
  fipeStatus('Escolha o modelo. A lista de versões será carregada em seguida.');
  return true;
}
function showFipeVersions(){
  const el=fipeField('version'),base=fipeField('model')?.value||'';
  if(!el)return;
  const choices=base?fipeVersions(fipeField('brand').value,base):[];
  const saved=el.dataset.saved||'';
  el.innerHTML=fipeSelectOptions(choices,saved);
  if(saved&&choices.some(x=>x.name===saved)){el.value=saved;fipeSet('fipeModelCode',choices.find(x=>x.name===saved).code)}
  else if(saved){el.value='__manual__';fipeField('versionOther').value=saved}
  document.getElementById('manual-version').hidden=el.value!=='__manual__';
  fipeStatus(choices.length?`${choices.length} versões encontradas. Escolha a que aparece no documento do carro.`:'Nenhuma versão correspondente. Confira o modelo ou informe a versão manualmente.',choices.length?'neutral':'warning');
}
async function loadFipeYears(modelCode,nonce){
  fipeStatus('Buscando anos e combustíveis disponíveis…');
  const years=await fipeGet(`/brands/${encodeURIComponent(fipeField('fipeBrandCode').value)}/models/${encodeURIComponent(modelCode)}/years`);
  if(nonce!==fipeUI.nonce||!fipeField('year'))return false;
  fipeUI.years=years;
  fipeOptions('year-suggestions',years.map(x=>x.name));
  fipeStatus('Escolha o ano/modelo e combustível para consultar o valor.');
  return true;
}
async function lookupFipeValue(yearCode,nonce){
  fipeStatus('Consultando o preço de referência…');
  const brandCode=fipeField('fipeBrandCode').value,modelCode=fipeField('fipeModelCode').value;
  const data=await fipeGet(`/brands/${encodeURIComponent(brandCode)}/models/${encodeURIComponent(modelCode)}/years/${encodeURIComponent(yearCode)}`);
  if(nonce!==fipeUI.nonce||!fipeField('fipe'))return;
  const price=Number(String(data.price||'').replace(/[^\d,.]/g,'').replace(/\./g,'').replace(',','.'));
  if(!Number.isFinite(price)||price<=0)throw new Error('Não foi possível interpretar o valor retornado.');
  fipeSet('fipe',price.toFixed(2));
  fipeSet('fipeCode',data.codeFipe||'');
  fipeSet('fipeReferenceMonth',data.referenceMonth||'');
  fipeSet('fipeCheckedAt',new Date().toISOString());
  fipeSet('fipeSource','parallelum');
  fipeStatus(`${brl(price)} · ${data.referenceMonth||'referência atual'} · código FIPE ${data.codeFipe||'não informado'}. Confirme no site oficial.`, 'success');
}
async function initFipeForm(saved){
  const nonce=++fipeUI.nonce;
  fipeUI.models=[];fipeUI.years=[];
  fipeStatus('Carregando catálogo e valor FIPE…');
  try{
    fipeUI.brands=await fipeGet('/brands');
    if(nonce!==fipeUI.nonce||!fipeField('brand'))return;
    fipeOptions('brand-suggestions',[...new Set([...Object.keys(VEHICLE_CATALOG),...fipeUI.brands.map(x=>x.name)])]);
    const brand=fipeBrand(saved.brand);
    if(!brand){fipeStatus('Selecione uma marca da lista para buscar versões e preço FIPE.');return}
    fipeSet('fipeBrandCode',brand.code);
    if(!await loadFipeModels(brand.code,nonce))return;
    if(!saved.model)return;
    fipeField('version').dataset.saved=saved.version||'';
    showFipeVersions();
    const version=fipeUI.models.find(x=>x.code===saved.fipeModelCode)||fipeUI.models.find(x=>x.name===saved.version);
    if(!version)return;
    fipeSet('fipeModelCode',version.code);
    if(!await loadFipeYears(version.code,nonce))return;
    const year=fipeUI.years.find(x=>x.code===saved.fipeYearCode)||fipeUI.years.find(x=>x.name===saved.year);
    if(year){fipeSet('year',year.name);fipeSet('fipeYearCode',year.code);await lookupFipeValue(year.code,nonce)}
  }catch(e){if(nonce===fipeUI.nonce)fipeStatus(e.name==='AbortError'?'A consulta demorou demais. Tente novamente.':e.message,'warning')}
}
async function fipeChanged(target){
  const id=target.id;
  if(!['f-brand','f-model','f-version','f-year'].includes(id))return false;
  const nonce=++fipeUI.nonce;
  try{
    if(id==='f-brand'){
      resetFipeFields('brand');fipeUI.models=[];fipeUI.years=[];
      fipeField('version').dataset.saved='';
      fipeField('version').innerHTML=fipeSelectOptions([]);
      document.getElementById('manual-version').hidden=true;
      const brand=fipeBrand(target.value);
      if(!brand){fipeStatus('Escolha uma marca da lista para habilitar as versões FIPE.','warning');return true}
      fipeSet('fipeBrandCode',brand.code);
      await loadFipeModels(brand.code,nonce);
    }else if(id==='f-model'){
      resetFipeFields('model');fipeUI.years=[];
      fipeField('version').dataset.saved='';
      showFipeVersions();
    }else if(id==='f-version'){
      resetFipeFields('version');fipeUI.years=[];
      const manual=target.value==='__manual__';
      document.getElementById('manual-version').hidden=!manual;
      if(manual){fipeStatus('Versão manual: informe o valor FIPE após conferir no site oficial.','warning');return true}
      const version=fipeUI.models.find(x=>x.name===target.value);
      if(!version){fipeStatus('Selecione uma versão para continuar.');return true}
      fipeSet('fipeModelCode',version.code);
      await loadFipeYears(version.code,nonce);
    }else if(id==='f-year'){
      resetFipeFields('year');
      const year=fipeUI.years.find(x=>x.name===target.value);
      if(!year){fipeStatus('Escolha ano/modelo e combustível exatamente como aparecem na lista.','warning');return true}
      fipeSet('fipeYearCode',year.code);
      await lookupFipeValue(year.code,nonce);
    }
  }catch(e){if(nonce===fipeUI.nonce)fipeStatus(e.name==='AbortError'?'A consulta demorou demais. Tente novamente.':e.message,'warning')}
  return true;
}
const KEY='seminovo-sem-surpresa-v1';
const STEPS=[
 {id:'preco',name:'Preço',question:'Vale o que estão pedindo?',icon:'01',tip:'FIPE é referência, não sentença. Compare a mesma versão, região, estado e custos que virão.',items:[
  ['fipe','Consultei a FIPE da versão correta','Anote o valor e a data da consulta.'],['comparaveis','Comparei anúncios semelhantes','Verifique ano, versão, quilometragem e região.'],['preco','Entendi a diferença entre preço pedido e estado real','Peça justificativa para descontos ou preços muito baixos.'],['uso','O carro atende ao meu uso e cabe no orçamento','Considere espaço, consumo, seguro e vaga.']]},
 {id:'procedencia',name:'Procedência',question:'Que história estou comprando?',icon:'02',tip:'Leilão, sinistro e recuperação precisam de contexto. Entenda o fato e seus efeitos no seguro, financiamento e revenda.',items:[
  ['historico','Consultei o histórico do veículo','Investigue proprietários, registros e restrições.'],['km','A quilometragem combina com o desgaste','Compare volante, pedais, bancos, pneus e revisões.'],['manutencao','Pedi comprovantes de manutenção','Notas e registros dão mais segurança.'],['leilao','Esclareci leilão, sinistro ou roubo/furto','Confira motivo, gravidade, reparo, baixa e impacto.'],['recall','Verifiquei recall pendente','Confirme pelo canal oficial da montadora.']]},
 {id:'produto',name:'Produto',question:'Como este carro está hoje?',icon:'03',tip:'A visita rápida revela sinais. Um laudo cautelar e uma avaliação mecânica respondem perguntas diferentes.',items:[
  ['exterior','Olhei pintura, vãos, portas e alinhamento','Observe de longe e sob luz natural.'],['pneus','Chequei pneus e rodas','Veja sulco, idade, bolhas e desgaste irregular.'],['interior','Conferi interior e equipamentos','Teste painel, vidros, ar e luzes.'],['motor','Observei compartimento do motor a frio','Procure vazamentos, rachaduras e adaptações sem tocar.'],['testdrive','Fiz test-drive com atenção','Sinta direção, freios, câmbio, ruídos e temperatura.'],['cautelar','Li o laudo cautelar completo','Aprovação não garante bom estado mecânico.'],['mecanico','Um mecânico de confiança avaliou o carro','Peça diagnóstico e orçamento de reparos.']]},
 {id:'papelada',name:'Papelada',question:'Posso transferir com segurança?',icon:'04',tip:'Antes de pagar, confirme quem vende, o que consta nos documentos e se há pendências que impedem a transferência.',items:[
  ['titular','Confirmei proprietário e poderes para vender','Confira documento com foto, titularidade e procuração, se houver.'],['identidade','Conferi placa, chassi e identificação','As informações precisam corresponder ao carro e aos documentos.'],['debitos','Consultei multas, IPVA e licenciamento','Defina por escrito quem quitará cada pendência.'],['gravame','Verifiquei gravame e restrições','Alienação e bloqueios exigem solução clara.'],['contrato','Li o contrato e os termos de transferência','Preço, prazos, responsabilidades e dados completos.']]},
 {id:'pagamento',name:'Pagamento',question:'Quanto isso realmente vai me custar?',icon:'05',tip:'Compare o total, preserve sua reserva e só transfira dinheiro após conferir dados e condições.',items:[
  ['total','Calculei preço, taxas, seguro e reparos','O anúncio é só o começo.'],['financiamento','Entendi entrada, parcelas, prazo e CET','Compare propostas pelo custo total, não apenas pela parcela.'],['reserva','Mantenho uma reserva após comprar','Imprevistos também fazem parte da vida com o carro.'],['recebedor','Confirmei quem receberá o pagamento','Desconfie de PIX para terceiros sem explicação e contrato.'],['comprovantes','Guardarei contrato e comprovantes','Verifique tudo antes de fazer o PIX.']]}
];
const CRITERIA=[['procedencia','Procedência',20,'Histórico, origem e coerência'],['mecanica','Mecânica e conservação',20,'Estado atual e manutenção'],['documentacao','Documentação',15,'Situação legal e débitos'],['mercado','Preço e mercado',15,'Valor justo e liquidez'],['futuro','Custo futuro',15,'Seguro, peças e revisões'],['adequacao','Adequação à sua vida',15,'Uso, necessidades e orçamento']];
const FLAGS=[['seguranca','Segurança comprometida: estrutura, airbag ou freios'],['documental','Impedimento documental ou restrição sem solução clara'],['fraude','Indícios de fraude, adulteração ou história falsa'],['pagamento','Pagamento inseguro ou para terceiro sem clareza'],['incompativel','Custo incompatível com a realidade financeira']];
const ICONS={inicio:'⌂',novo:'＋',vistoria:'◉',custos:'▦',nota:'✦',comparar:'⇄',resumo:'▤',fotos:'▧'};
let state=load(), route={page:'inicio',step:0}, modal=null;
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&Array.isArray(x.cars))return x}catch(e){}return {cars:[],current:null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast('Não foi possível salvar. Libere espaço no navegador.')}}
function car(){return state.cars.find(x=>x.id===state.current)}
function fresh(){return {id:crypto.randomUUID?.()||String(Date.now()),name:'',brand:'',model:'',version:'',year:'',km:'',plate:'',seller:'',location:'',date:new Date().toISOString().slice(0,10),price:'',fipe:'',notes:'',checks:{},ratings:{},flags:{},costs:{},created:Date.now()}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const n=x=>Number(x)||0, brl=x=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n(x));
const title=c=>c?.name||[c?.brand,c?.model].filter(Boolean).join(' ')||'Carro sem nome';
const sub=c=>[c?.version,c?.year,c?.km?`${Number(c.km).toLocaleString('pt-BR')} km`:null].filter(Boolean).join(' · ')||'Preencha os dados do veículo';
function progress(c){let done=0,total=0;STEPS.forEach(s=>s.items.forEach(([id])=>{total++;if(c.checks?.[id])done++}));return {done,total,pct:Math.round(done/total*100)}}
function score(c){let touched=0,points=0;CRITERIA.forEach(([id,,w])=>{let v=c.ratings?.[id];if(v!==undefined&&v!==''&&v!==null){touched++;points+=n(v)*w/10}});return {touched,points:Math.round(points)}}
function flagCount(c){return FLAGS.filter(([id])=>c.flags?.[id]).length}
function money(c){const a=c.costs||{},initial=['tires','service','repairs','transfer','insurance','taxes','other'].reduce((s,k)=>s+n(a[k]),0),recurring=['fuel','monthlyInsurance','monthlyTax','monthlyMaintenance','parking'].reduce((s,k)=>s+n(a[k]),0),trade=n(a.trade),finance=a.mode==='finance';const financed=finance?n(a.entry)+n(a.installment)*n(a.months)+n(a.financeFees):n(c.price);return {initial,recurring,trade,finance,total:Math.max(0,financed-trade)+initial,financeCost:financed-n(c.price)}}
function status(c){if(flagCount(c))return {label:'Alerta crítico',cls:'red'};let s=score(c);if(s.touched===6){if(s.points>=85)return {label:'Excelente candidato',cls:'green'};if(s.points>=70)return {label:'Pontos a conferir',cls:'yellow'};if(s.points>=50)return {label:'Investigue mais',cls:'yellow'};return {label:'Risco elevado',cls:'red'}}return {label:'Em avaliação',cls:''}}
function nav(){const entries=[['inicio','Início'],['novo','Cadastrar carro'],['vistoria','Conferir o carro'],['fotos','Analisar fotos'],['custos','Quanto vou gastar'],['nota','Pontos de atenção'],['comparar','Comparar opções'],['resumo','Minha decisão']];document.querySelector('#nav').innerHTML=entries.map(([p,t])=>`<button class="nav-btn ${route.page===p?'active':''}" data-page="${p}"><span class="nav-ico">${ICONS[p]}</span>${t}</button>`).join('')}
function go(p,step){route.page=p;if(step!==undefined)route.step=step;document.querySelector('.sidebar').classList.remove('open');render();window.scrollTo({top:0,behavior:'smooth'})}
function toast(msg){let el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3200)}
function header(eye,h,p,actions=''){return `<div class="page-header"><div><div class="eyebrow">${eye}</div><h1>${h}</h1><p>${p}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</div>`}
const action=(label,page,kind='outline')=>`<button class="btn ${kind}" data-page="${page}" ${page==='novo'?'data-new="true"':''}>${label}</button>`;
function render(){nav();let c=car();document.querySelector('#topContext').textContent=c?`${title(c).toUpperCase()} · COMPRA INTELIGENTE`:'COMPRA INTELIGENTE · PASSO A PASSO';if(!c&&!['inicio','novo','comparar'].includes(route.page))route.page='inicio';const html={inicio:home,novo:details,vistoria:inspection,custos:costs,nota:rating,comparar:compare,resumo:report,fotos:photos}[route.page]();document.querySelector('#app').innerHTML=html;if(route.page==='resumo')document.title=`Relatório · ${title(c)} | Seminovo sem Surpresa`;else document.title='Seminovo sem Surpresa — Guia de compra';if(modal)drawModal();if(route.page==='novo')initFipeForm(c||{});if(route.page==='fotos'){hydratePhotos();checkPhotoAI()}}
function home(){const cars=state.cars,done=cars.filter(c=>progress(c).pct===100).length;return `${header('UM PASSO DE CADA VEZ','Vamos escolher com mais segurança.','Você não precisa entender de carro. Eu ajudo você a saber o que perguntar e conferir, no seu ritmo.',action('＋ Avaliar um carro','novo','primary'))}
<section class="hero"><div><div class="eyebrow">SEMINOVO SEM SURPRESA</div><h2>Comprar com calma.<br><em>Decidir com confiança.</em></h2><p>Recebeu um anúncio ou encontrou um carro? Vamos organizar as verificações antes de você decidir. Sem pressão e em linguagem simples.</p>${action(cars.length?'Continuar avaliação →':'Começar minha avaliação →',cars.length?'vistoria':'novo','primary')}</div><div class="hero-visual"><div class="hero-ring">5<small>P</small></div></div></section>
<section class="journey-intro"><div class="eyebrow">ONDE VOCÊ ESTÁ AGORA?</div><h2>Escolha uma opção. Eu mostro o próximo passo.</h2><div class="journey-grid">
<button class="journey-step" data-page="novo"><span>01</span><b>Ainda estou procurando</b><small>Quero começar a avaliar um anúncio.</small><i>Começar →</i></button>
<button class="journey-step" data-page="vistoria"><span>02</span><b>Encontrei um carro</b><small>Quero saber o que conferir na visita.</small><i>Ver o que conferir →</i></button>
<button class="journey-step" data-page="nota"><span>03</span><b>Estou negociando</b><small>Quero revisar os alertas antes de decidir.</small><i>Revisar cuidados →</i></button>
</div></section>
<section class="trust-note"><div class="trust-icon">!</div><div><b>Vai pagar um sinal ou fazer um PIX?</b><p>Faça uma pausa. Confira o carro e os documentos, confirme quem é o proprietário e só pague depois de entender exatamente para quem vai o dinheiro. Pressa e pedido de transferência para terceiro merecem atenção.</p><button data-page="nota">Ver pontos de atenção antes de fechar →</button></div></section>
<div class="stats"><div class="stat"><div class="stat-icon">▤</div><div><strong>${cars.length}</strong><small>Carros em análise</small></div></div><div class="stat"><div class="stat-icon">✓</div><div><strong>${done}</strong><small>Vistorias completas</small></div></div><div class="stat"><div class="stat-icon">✦</div><div><strong>5P</strong><small>Método de decisão</small></div></div></div>
<div class="section-title"><div><h2>Minha jornada</h2><p>Você pode voltar quando quiser. Seus registros ficam salvos neste navegador.</p></div>${cars.length?action('＋ Novo carro','novo'):''}</div>
${cars.length?`<div class="vehicle-grid">${cars.map(c=>{let s=status(c),p=progress(c);return `<article class="card vehicle-card"><div class="vehicle-top"><div class="vehicle-glyph">🚘</div><span class="pill ${s.cls}">${s.label}</span></div><h3>${esc(title(c))}</h3><p>${esc(sub(c))}</p><div class="value">${c.price?brl(c.price):'Preço não informado'}<small>Preço anunciado</small></div><div class="progress-track"><i style="width:${p.pct}%"></i></div><div class="vehicle-foot"><span>${p.done} de ${p.total} itens conferidos</span><button data-select="${esc(c.id)}">Abrir avaliação →</button></div></article>`}).join('')}</div>`:`<div class="empty"><div class="big">🚘</div><strong>Quando encontrar um carro, começamos por ele</strong><p>Você pode cadastrar mais de uma opção e comparar com calma. Não precisa preencher tudo de uma vez.</p>${action('Cadastrar um carro','novo','primary')}</div>`}
<div class="section-title"><div><h2>As cinco perguntas certas</h2><p>O método 5P organiza as decisões mais importantes.</p></div></div><div class="section-title"><div><h2>Depois da compra, seguimos juntos</h2><p>Esta jornada também pode ajudar na próxima etapa.</p></div></div><div class="after-grid"><div><b>Antes de fechar</b><small>Documentos, visita, fotos e custos.</small></div><div><b>Depois de comprar</b><small>Organize manutenção, seguro e documentos para acompanhar o carro.</small></div><div><b>Na próxima troca</b><small>Guarde seu histórico e compare as opções com mais tranquilidade.</small></div></div><p class="plain-disclaimer">O app organiza sua decisão, mas não substitui consulta oficial dos documentos nem avaliação presencial de um mecânico. Você decide no seu tempo.</p><div class="method-grid">${STEPS.map(s=>`<div class="method"><span>P</span><b>${s.name}</b><small>${s.question}</small></div>`).join('')}</div>`}
function input(key,label,type='text',hint='',value='',extra=''){return `<div class="field ${extra}"><label for="f-${key}">${label}</label><input id="f-${key}" name="${key}" type="${type}" ${type==='number'?'min="0" step="any"':''} placeholder="${hint}" value="${esc(value)}"></div>`}
function canonicalBrand(raw){const key=String(raw||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const aliases={'vw':'Volkswagen','volks':'Volkswagen','gm':'Chevrolet','chevy':'Chevrolet','mercedes':'Mercedes-Benz','chery':'CAOA Chery','caoa':'CAOA Chery','land rover':'Land Rover'};return aliases[key]||Object.keys(VEHICLE_CATALOG).find(x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()===key)||String(raw||'').trim()}
function catalogField(kind,label,value,options){return `<div class="field"><label for="f-${kind}">${label}</label><input id="f-${kind}" name="${kind}" type="text" list="${kind}-suggestions" autocomplete="off" placeholder="Selecione ou digite" value="${esc(value)}"><datalist id="${kind}-suggestions">${options.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist></div>`}
function updateModelSuggestions(){const brand=canonicalBrand(document.querySelector('#f-brand')?.value),list=document.querySelector('#model-suggestions');if(list)list.innerHTML=(VEHICLE_CATALOG[brand]||[]).map(x=>`<option value="${esc(x)}"></option>`).join('')}
function details(){
  const c=car(),d=c||fresh();
  const fipeMessage=d.fipeSource==='parallelum'&&d.fipeReferenceMonth
    ?`${brl(d.fipe)} · ${d.fipeReferenceMonth} · código FIPE ${d.fipeCode||'não informado'}. Confirme no site oficial.`
    :'Selecione marca, modelo, versão e ano para consultar o valor automaticamente.';
  return `${header(c?'FICHA DO VEÍCULO':'NOVO VEÍCULO',c?'Dados do carro':'Comece pelo carro que você encontrou.',c?'Atualize as informações conforme confirmar cada detalhe.':'Selecione o veículo para preencher versões e valor de referência.',c?action('← Voltar à vistoria','vistoria'):'')}
<div class="layout"><form class="card form-card" id="detailsForm">
  <div class="section-title" style="margin:0 0 18px"><h2>Identificação</h2><span class="pill">ETAPA 01</span></div>
  <div class="form-grid">
    ${input('name','Apelido da avaliação','text','Ex.: Corolla do centro',d.name)}
    ${catalogField('brand','Marca',d.brand,Object.keys(VEHICLE_CATALOG))}
    ${catalogField('model','Modelo',d.model,VEHICLE_CATALOG[canonicalBrand(d.brand)]||[])}
    <div class="field"><label for="f-version">Versão exata</label><select id="f-version" name="version" data-saved="${esc(d.version)}"><option value="">Selecione marca e modelo</option><option value="__manual__">Minha versão não aparece</option></select></div>
    <div class="field wide" id="manual-version" hidden><label for="f-versionOther">Versão não listada</label><input id="f-versionOther" name="versionOther" type="text" placeholder="Descreva a versão conforme o documento"></div>
    <div class="field"><label for="f-year">Ano/modelo e combustível</label><input id="f-year" name="year" type="text" list="year-suggestions" autocomplete="off" placeholder="Selecione o ano e combustível" value="${esc(d.year)}"><datalist id="year-suggestions"></datalist></div>
    ${input('manufactureYear','Ano de fabricação (opcional)','number','Ex.: 2022',d.manufactureYear||'')}
    ${input('km','Quilometragem','number','Ex.: 42000',d.km)}
    ${input('plate','Placa (opcional)','text','Ex.: ABC1D23',d.plate)}
    ${input('seller','Vendedor ou loja','text','Nome de contato',d.seller)}
    ${input('price','Preço pedido (R$)','number','Ex.: 89900',d.price)}
    <div class="field"><label for="f-fipe">Valor FIPE (R$)</label><input id="f-fipe" name="fipe" type="number" min="0" step="0.01" placeholder="Preenchido ao selecionar o ano" value="${esc(d.fipe)}"></div>
    <div class="field wide"><div id="fipe-status" class="fipe-status" role="status" aria-live="polite">${esc(fipeMessage)}</div><button class="link-button" type="button" id="refreshFipe">Atualizar consulta FIPE ↻</button><small class="fipe-disclaimer">Consulta por API comunitária, sem vínculo oficial com a FIPE. O preço é uma referência média, não uma avaliação deste exemplar. <a href="https://veiculos.fipe.org.br/" target="_blank" rel="noopener noreferrer">Confira no portal oficial ↗</a></small></div>
    ${input('location','Local da visita','text','Bairro ou loja',d.location)}
    ${input('date','Data da visita','date','',d.date)}
    <div class="field wide"><label for="f-notes">Notas iniciais</label><textarea id="f-notes" name="notes" placeholder="Link do anúncio, dúvidas e primeira impressão...">${esc(d.notes)}</textarea></div>
  </div>
  ${['fipeBrandCode','fipeModelCode','fipeYearCode','fipeCode','fipeReferenceMonth','fipeCheckedAt','fipeSource'].map(k=>`<input type="hidden" id="f-${k}" name="${k}" value="${esc(d[k]||'')}">`).join('')}
  <div class="form-actions">${c?`<button class="btn danger" type="button" data-delete="${esc(c.id)}">Excluir carro</button>`:''}<button class="btn primary" type="submit">Salvar e continuar →</button></div>
</form><div><div class="card aside-card"><div class="eyebrow">ANTES DE VISITAR</div><h3>Peça mais que fotos bonitas</h3><ul><li>Versão, quilometragem e histórico de manutenção.</li><li>Número de proprietários e eventuais passagens por leilão ou sinistro.</li><li>Chave reserva, manual e laudo disponível.</li></ul><p>Preço muito abaixo da média pede uma explicação verificável.</p></div><p class="privacy">🔒 Informações salvas localmente. Para manter uma cópia, imprima o relatório ao final.</p></div></div>`
}
function inspection(){let c=car(),s=STEPS[route.step]||STEPS[0],p=progress(c);return `${header('VISTORIA GUIADA','Os 5 Ps na prática.','Marque “Conferido”, “Atenção” ou deixe pendente. Um item em atenção sempre merece apuração.',action('Ver relatório','resumo'))}
<div class="step-tabs" role="tablist" aria-label="Etapas do método 5P">${STEPS.map((x,i)=>`<button class="step-tab ${i===route.step?'active':''}" data-step="${i}" role="tab" aria-selected="${i===route.step}"><span>0${i+1} / 05</span>${x.name}</button>`).join('')}</div><div class="layout"><div class="card step-body"><div class="step-intro"><div class="step-badge">P</div><div><div class="eyebrow">${s.name.toUpperCase()}</div><h2>${s.question}</h2><p>${s.tip}</p></div></div><div class="check-list">${s.items.map(([id,label,detail])=>{let val=c.checks?.[id]||'';return `<div class="check-row"><div><strong>${label}</strong><small>${detail}</small></div><div class="segmented" role="group" aria-label="${label}"><button class="${val==='ok'?'on ok':''}" data-check="${id}" data-value="ok" aria-pressed="${val==='ok'}">✓ Conferido</button><button class="${val==='issue'?'on issue':''}" data-check="${id}" data-value="issue" aria-pressed="${val==='issue'}">! Atenção</button><button class="${!val?'on na':''}" data-check="${id}" data-value="" aria-pressed="${!val}">Pendente</button></div></div>`}).join('')}</div><div class="step-bottom"><span class="hint">Progresso geral: ${p.done} de ${p.total} itens</span><button class="btn primary" data-page="${route.step===4?'custos':'vistoria'}" ${route.step<4?`data-next-step="${route.step+1}"`:''}>${route.step===4?'Calcular custo real →':'Próximo P →'}</button></div></div><aside><div class="card aside-card"><div class="eyebrow">REGISTRO DA VISITA</div><h3>${esc(title(c))}</h3><p>${esc(sub(c))}</p><div class="progress-track"><i style="width:${p.pct}%"></i></div><p>${p.pct}% dos itens registrados.</p><button class="link-button" data-page="novo">Editar dados do carro →</button></div><div class="warning">“Aprovado” no laudo cautelar não substitui avaliação do motor, câmbio, suspensão e custos futuros.</div></aside></div>`}
function costs(){let c=car(),a=c.costs||{},m=money(c),diff=c.fipe?n(c.price)-n(c.fipe):null;return `${header('PLANEJAMENTO','O custo real da compra.','Preencha estimativas e valores da proposta. O total se atualiza enquanto você digita.',action('Ver nota de compra','nota'))}<div class="layout"><div class="card form-card"><div class="section-title" style="margin:0 0 17px"><div><h2>Preço e forma de pagamento</h2><p>Compare sempre o total, inclusive quando houver financiamento.</p></div></div><div class="form-grid">${input('price','Preço pedido (R$)','number','',c.price)}${input('fipe','FIPE de referência (R$)','number','',c.fipe)}<div class="field wide"><label for="mode">Forma de pagamento</label><select id="mode" data-cost="mode"><option value="cash" ${a.mode!=='finance'?'selected':''}>À vista</option><option value="finance" ${a.mode==='finance'?'selected':''}>Financiamento</option></select></div></div><div id="financeFields" ${a.mode!=='finance'?'hidden':''}><div class="money-grid" style="margin-top:15px">${costInput('entry','Entrada','',a)}${costInput('installment','Parcela mensal','',a)}${costInput('months','Número de parcelas','',a)}${costInput('financeFees','Taxas pagas fora das parcelas','',a)}</div><p class="inline-note">Confira o CET e todos os produtos embutidos no contrato. O cálculo aqui usa a proposta que você digitou, sem inventar uma taxa.</p></div><div class="section-title"><h2>Custos imediatos</h2></div><div class="money-grid">${[['tires','Pneus'],['service','Revisão'],['repairs','Reparos'],['transfer','Transferência'],['insurance','Seguro inicial'],['taxes','Taxas e débitos'],['other','Outros'],['trade','Seu carro na troca']].map(([k,l])=>costInput(k,l,'R$',a)).join('')}</div><div class="section-title"><h2>Custo mensal estimado</h2></div><div class="money-grid">${[['fuel','Combustível'],['monthlyInsurance','Seguro mensal'],['monthlyTax','IPVA/licenciamento ÷ 12'],['monthlyMaintenance','Manutenção/reserva'],['parking','Estacionamento/outros']].map(([k,l])=>costInput(k,l,'R$',a)).join('')}</div></div><aside><div class="calc-result"><small>DESEMBOLSO TOTAL ESTIMADO</small><strong id="totalValue">${brl(m.total)}</strong><p>Inclui compra ou proposta financeira, custos imediatos e desconta o veículo na troca. Não inclui meses futuros de uso.</p></div><div class="card aside-card"><h3>Leitura do preço</h3><p id="fipeDiff">${diff===null?'Informe a FIPE para ver a diferença.':`${brl(Math.abs(diff))} ${diff>=0?'acima':'abaixo'} da FIPE informada. Compare contexto e estado.`}</p><h3>Custo mensal</h3><p><b id="monthlyValue">${brl(m.recurring+(m.finance?n(a.installment):0))}</b> / mês estimado, ${m.finance?'incluindo parcela.':'sem parcela.'}</p><p>Preserve uma reserva para imprevistos.</p></div></aside></div>`}
function costInput(key,label,placeholder='',a={}){return `<div class="field"><label for="cost-${key}">${label}</label><input id="cost-${key}" type="number" min="0" step="any" data-cost="${key}" placeholder="${placeholder||'0'}" value="${esc(a[key]??'')}"></div>`}
function rating(){let c=car(),s=score(c),flags=flagCount(c),p=s.touched/6*100;let badge=flags?'Alerta crítico':s.touched<6?'Preencha as 6 notas':status(c).label;return `${header('NOTA DA COMPRA','Avalie com critério.','Dê uma nota de 0 a 10 em cada aspecto. Os pesos seguem a ficha do guia.',action('Ver relatório','resumo'))}<div class="layout"><div class="card form-card"><div class="score-summary"><div class="score-orb" style="--degree:${p}%"><div><strong id="scoreNum">${s.touched===6?s.points:'—'}</strong><small>de 100</small></div></div><div><div class="eyebrow">AVALIAÇÃO PONDERADA</div><h2 id="scoreLabel">${badge}</h2><p id="scoreDetail">${s.touched===6?'A nota ajuda a comparar. Sinais críticos continuam tendo prioridade.':`${s.touched} de 6 critérios avaliados. A nota só é exibida quando todos forem preenchidos.`}</p></div></div><div class="rating-list">${CRITERIA.map(([id,label,weight,desc])=>{let v=c.ratings?.[id];return `<div class="rating-row"><div><b>${label}</b><small>${desc} · peso ${weight}</small></div><input type="range" min="0" max="10" step="1" value="${v===''||v===undefined?5:v}" data-rating="${id}" aria-label="Nota para ${label}"><output id="out-${id}">${v===''||v===undefined?'—':v}/10</output></div>`}).join('')}</div><div class="warning">A nota é uma ferramenta de comparação, não uma certificação. Não use uma pontuação alta para ignorar um alerta sério.</div></div><aside><div class="card aside-card"><div class="eyebrow">CRITÉRIOS DE ELIMINAÇÃO</div><h3>Um vermelho muda a decisão.</h3><p>Marque qualquer sinal identificado. Investigue antes de continuar; se não houver solução convincente, considere sair da negociação.</p><div class="flag-list">${FLAGS.map(([id,label])=>`<label class="flag"><input type="checkbox" data-flag="${id}" ${c.flags?.[id]?'checked':''}><span>${label}</span></label>`).join('')}</div></div><div class="warning red" id="flagWarning" ${!flags?'hidden':''}>${flags} alerta${flags===1?'':'s'} crítico${flags===1?'':'s'} marcado${flags===1?'':'s'}. A pontuação não neutraliza esses riscos.</div></aside></div>`}
function compare(){let cars=state.cars;return `${header('DECISÃO COMPARADA','Coloque os carros lado a lado.','O melhor anúncio nem sempre é a melhor compra.',action('＋ Adicionar outro','novo','primary'))}${cars.length<2?`<div class="empty"><div class="big">⇄</div><strong>Cadastre pelo menos dois carros</strong><p>Depois de avaliar mais de uma opção, compare nota, custo total e alertas no mesmo lugar.</p>${action('Cadastrar outro carro','novo','primary')}</div>`:`<div class="card" style="overflow:auto"><table class="comparison"><thead><tr><th>CARRO</th><th>PREÇO</th><th>CUSTO ESTIMADO</th><th>NOTA</th><th>ALERTAS</th><th>PROGRESSO</th><th></th></tr></thead><tbody>${cars.map(c=>{let s=score(c),m=money(c),f=flagCount(c);return `<tr><td><b>${esc(title(c))}</b><br><small>${esc(sub(c))}</small></td><td>${brl(c.price)}</td><td>${brl(m.total)}</td><td>${s.touched===6?`${s.points}/100`:'Pendente'}</td><td><span class="pill ${f?'red':'green'}">${f?`${f} crítico${f>1?'s':''}`:'Nenhum marcado'}</span></td><td>${progress(c).pct}%</td><td><button class="link-button" data-select="${esc(c.id)}">Abrir →</button></td></tr>`}).join('')}</tbody></table></div><div class="warning">Os custos e notas refletem os dados que você informou. Compare a qualidade das evidências, não somente o número final.</div>`}`}
function report(){let c=car(),s=score(c),f=flagCount(c),m=money(c),issues=STEPS.flatMap(x=>x.items.filter(([id])=>c.checks?.[id]==='issue').map(([,label])=>label)),pending=STEPS.flatMap(x=>x.items.filter(([id])=>!c.checks?.[id]).map(([,label])=>label)),flags=FLAGS.filter(([id])=>c.flags?.[id]).map(([,label])=>label),st=status(c);return `${header('RELATÓRIO DE COMPRA','Sua decisão, por escrito.','Uma síntese para rever antes de assinar ou pagar.',`<button class="btn outline" id="printReport">↧ Imprimir / PDF</button>`)}<div class="card report"><div class="eyebrow">SEMINOVO SEM SURPRESA · MÉTODO 5P</div><h2>${esc(title(c))}</h2><div class="report-lead">${esc(sub(c))} ${c.plate?'· Placa '+esc(c.plate):''} ${c.date?'· Visita '+esc(c.date):''}</div><div class="result-grid"><div class="result-box"><small>Preço pedido</small><b>${brl(c.price)}</b></div><div class="result-box"><small>Custo total estimado</small><b>${brl(m.total)}</b></div><div class="result-box"><small>Nota ponderada</small><b>${s.touched===6?s.points+'/100':'Pendente'}</b></div></div><div class="report-alert ${f?'red':''}"><b>${f?'PARE E INVESTIGUE: '+f+' alerta'+(f>1?'s':'')+' crítico'+(f>1?'s':''):esc(st.label)}</b><br>${f?'Nenhuma pontuação compensa um problema grave. Entenda e resolva cada item antes de avançar.':s.touched<6?'Complete as notas antes de interpretar a avaliação.':s.points>=85?'Excelente candidato, sujeito à confirmação das evidências.':s.points>=70?'Boa compra com pontos a conferir.':s.points>=50?'Investigue os pontos relevantes antes de decidir.':'Risco elevado: reavalie a compra.'}</div><div class="section-title"><h2>Pontos para resolver</h2></div>${issues.length||flags.length||pending.length?`<div class="report-list">${flags.map(x=>`<div style="border-color:#edc7c3;background:#fff6f4"><b>● Alerta crítico</b>${esc(x)}</div>`).join('')}${issues.map(x=>`<div><b>! Atenção na vistoria</b>${esc(x)}</div>`).join('')}${pending.map(x=>`<div><b>○ Ainda não verificado</b>${esc(x)}</div>`).join('')}</div>`:'<p class="inline-note">Todos os itens da vistoria foram registrados sem pendências.</p>'}${c.photoAnalysis?`<div class="section-title"><h2>Observações das fotos</h2></div><div class="report-alert">${esc(c.photoAnalysis.resumo)}</div><div class="report-list">${(c.photoAnalysis.observacoes||[]).map(o=>`<div><b>Foto ${esc(o.foto)} · ${esc(o.area)} · ${esc(o.atencao)}</b>${esc(o.achado)}<br>Conferir: ${esc(o.conferir)}</div>`).join('')}</div>`:''}<div class="section-title"><h2>Registro da visita</h2></div><div class="report-list"><div><b>Vendedor ou loja</b>${esc(c.seller)||'Não informado'}</div><div><b>Local</b>${esc(c.location)||'Não informado'}</div><div><b>FIPE ${c.fipeSource==='parallelum'?'consultada':'informada'}</b>${c.fipe?brl(c.fipe):'Não informada'}${c.fipeReferenceMonth?` · ${esc(c.fipeReferenceMonth)}`:''}${c.fipeCode?` · cód. ${esc(c.fipeCode)}`:''}</div><div><b>Custos mensais estimados</b>${brl(m.recurring+(m.finance?n(c.costs?.installment):0))}</div></div>${c.notes?`<div class="report-alert"><b>Suas anotações</b><br>${esc(c.notes).replace(/\n/g,'<br>')}</div>`:''}<div class="report-actions"><button class="btn primary" id="printReportBottom">Imprimir ou salvar em PDF</button><button class="btn outline" id="shareReport">Compartilhar resumo</button><button class="btn outline" data-page="vistoria">Voltar à vistoria</button></div><p class="privacy">Este relatório não é laudo cautelar, consulta oficial nem diagnóstico mecânico. Confirme documentos, restrições, dados e condições com fontes competentes antes da compra.</p></div>`}
function drawModal(){let c=car();document.querySelector('#modalRoot')?.remove();let el=document.createElement('div');el.id='modalRoot';el.className='modal-backdrop';el.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><h2 id="modalTitle">Excluir ${esc(title(c))}?</h2><p>Isso apaga os dados desta avaliação neste navegador. A ação não pode ser desfeita.</p><div class="modal-actions"><button class="btn outline" id="cancelDelete">Cancelar</button><button class="btn danger" id="confirmDelete">Excluir avaliação</button></div></div>`;document.body.append(el)}
function updateCostView(){let c=car(),m=money(c),d=c.fipe?n(c.price)-n(c.fipe):null;document.querySelector('#totalValue').textContent=brl(m.total);document.querySelector('#monthlyValue').textContent=brl(m.recurring+(m.finance?n(c.costs.installment):0));document.querySelector('#fipeDiff').textContent=d===null?'Informe a FIPE para ver a diferença.':`${brl(Math.abs(d))} ${d>=0?'acima':'abaixo'} da FIPE informada. Compare contexto e estado.`}
function updateScoreView(){let c=car(),s=score(c),f=flagCount(c),orb=document.querySelector('.score-orb');orb.style.setProperty('--degree',`${s.touched/6*100}%`);document.querySelector('#scoreNum').textContent=s.touched===6?s.points:'—';document.querySelector('#scoreLabel').textContent=f?'Alerta crítico':s.touched===6?status(c).label:'Preencha as 6 notas';document.querySelector('#scoreDetail').textContent=s.touched===6?'A nota ajuda a comparar. Sinais críticos continuam tendo prioridade.':`${s.touched} de 6 critérios avaliados. A nota só é exibida quando todos forem preenchidos.`;let warn=document.querySelector('#flagWarning');warn.hidden=!f;warn.textContent=`${f} alerta${f===1?'':'s'} crítico${f===1?'':'s'} marcado${f===1?'':'s'}. A pontuação não neutraliza esses riscos.`}
document.addEventListener('click',e=>{let target=e.target.closest('[data-page],[data-step],[data-check],[data-select],[data-delete],#mobileMenu,#cancelDelete,#confirmDelete,#printReport,#printReportBottom,#shareReport,#refreshFipe');if(!target)return;if(target.id==='refreshFipe'){fipeChanged(document.querySelector('#f-year'));return}if(target.id==='mobileMenu'){document.querySelector('.sidebar').classList.toggle('open');return}if(target.dataset.select){state.current=target.dataset.select;save();go('vistoria');return}if(target.dataset.delete){modal='delete';drawModal();return}if(target.id==='cancelDelete'){modal=null;document.querySelector('#modalRoot')?.remove();return}if(target.id==='confirmDelete'){const deletedCarId=state.current;state.cars=state.cars.filter(x=>x.id!==state.current);state.current=state.cars[0]?.id||null;save();modal=null;document.querySelector('#modalRoot')?.remove();go('inicio');photoRecords(deletedCarId).then(list=>list.forEach(p=>photoDelete(p.id))).catch(()=>{});toast('Avaliação excluída.');return}if(target.id==='printReport'||target.id==='printReportBottom'){window.print();return}if(target.id==='shareReport'){let c=car(),s=score(c),m=money(c),f=flagCount(c),msg=`Seminovo sem Surpresa — ${title(c)}\nPreço pedido: ${brl(c.price)}\nCusto total estimado: ${brl(m.total)}\nNota: ${s.touched===6?s.points+'/100':'pendente'}\nAlertas críticos: ${f}\nConfira os documentos, o laudo e a mecânica antes de pagar.`;if(navigator.share)navigator.share({title:'Resumo da avaliação',text:msg}).catch(()=>{});else navigator.clipboard?.writeText(msg).then(()=>toast('Resumo copiado.')).catch(()=>toast('Não foi possível copiar.'));return}if(target.dataset.step!==undefined){go('vistoria',n(target.dataset.step));return}if(target.dataset.check!==undefined){let c=car(),id=target.dataset.check,val=target.dataset.value;if(val)c.checks[id]=val;else delete c.checks[id];save();render();return}if(target.dataset.page){if(target.dataset.new)state.current=null;go(target.dataset.page,target.dataset.nextStep!==undefined?n(target.dataset.nextStep):undefined)}});
document.addEventListener('submit',e=>{if(e.target.id!=='detailsForm')return;e.preventDefault();let data=Object.fromEntries(new FormData(e.target).entries()),c=car();data.brand=canonicalBrand(data.brand);if(data.version==='__manual__'){data.version=data.versionOther||'';data.fipeSource=data.fipe?'manual':'';data.fipeCode='';data.fipeReferenceMonth='';data.fipeCheckedAt='';data.fipeModelCode='';data.fipeYearCode=''}delete data.versionOther;if(!c){c=fresh();state.cars.unshift(c);state.current=c.id}Object.assign(c,data);save();go('vistoria');toast('Dados salvos neste dispositivo.');});
document.addEventListener('input',e=>{if(e.target.id==='f-brand')updateModelSuggestions();if(route.page==='novo'&&['f-brand','f-model','f-year'].includes(e.target.id)){fipeSet('fipe','');fipeSet('fipeCode','');fipeSet('fipeReferenceMonth','');fipeSet('fipeCheckedAt','');fipeSet('fipeSource','');fipeStatus('Selecione o veículo para atualizar o valor FIPE.')}if(route.page==='novo'&&e.target.id==='f-fipe'){fipeSet('fipeCode','');fipeSet('fipeReferenceMonth','');fipeSet('fipeCheckedAt','');fipeSet('fipeSource',e.target.value?'manual':'');fipeStatus('Valor ajustado manualmente. Confira no portal oficial.','warning')}let c=car();if(!c||route.page==='novo')return;if(e.target.dataset.rating){c.ratings[e.target.dataset.rating]=e.target.value;save();document.querySelector('#out-'+e.target.dataset.rating).textContent=e.target.value+'/10';updateScoreView()}if(e.target.dataset.cost){let key=e.target.dataset.cost;c.costs[key]=e.target.value;save();updateCostView()}if(e.target.id==='f-price'||e.target.id==='f-fipe'){c[e.target.name]=e.target.value;if(e.target.id==='f-fipe'){c.fipeSource=e.target.value?'manual':'';c.fipeReferenceMonth='';c.fipeCheckedAt='';c.fipeCode=''}save();if(route.page==='custos')updateCostView()}});
document.addEventListener('change',e=>{if(route.page==='novo'&&['f-brand','f-model','f-version','f-year'].includes(e.target.id)){fipeChanged(e.target);return}let c=car();if(!c)return;if(e.target.dataset.flag){c.flags[e.target.dataset.flag]=e.target.checked;save();updateScoreView()}if(e.target.dataset.cost==='mode'){c.costs.mode=e.target.value;save();document.querySelector('#financeFields').hidden=e.target.value!=='finance';updateCostView()}});
const PHOTO_AREAS=['Frente','Traseira','Lateral','Rodas e pneus','Interior','Motor','Detalhe'];
let photoBusy=false,photoAiAvailable=false;
function photoDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open('seminovo-fotos-v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('photos',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function photoRecords(carId){const db=await photoDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos');const req=tx.objectStore('photos').getAll();req.onsuccess=()=>{resolve(req.result.filter(p=>p.carId===carId));db.close()};req.onerror=()=>{reject(req.error);db.close()}})}
async function photoPut(p){const db=await photoDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put(p);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function photoDelete(id){const db=await photoDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').delete(id);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
function photoShrink(file){return new Promise((resolve,reject)=>{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)return reject(new Error('Use JPG, PNG ou WebP com até 12 MB.'));const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);let scale=Math.min(1,1200/Math.max(img.width,img.height)),canvas=document.createElement('canvas'),data='';for(let pass=0;pass<4;pass++){canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);for(let quality=.78;quality>=.39;quality-=.1){data=canvas.toDataURL('image/jpeg',quality);if(data.length<=600_000)return resolve(data)}scale*=.78}reject(new Error('Foto grande demais. Tente recortar antes de enviar.'))};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível abrir a foto.'))};img.src=url})}
function photos(){let c=car();return `${header('FOTOS DO CARRO','Olhe os detalhes com ajuda da IA.','Envie até seis fotos nítidas. Registre ângulos e detalhes que merecem verificação presencial.',action('Ver relatório','resumo'))}<div class="layout"><section class="card form-card"><div class="section-title" style="margin-top:0"><div><h2>Fotos desta avaliação</h2><p>Frente, traseira, laterais, pneus, interior, motor ou um detalhe.</p></div><span class="pill" id="photoCount">0/6</span></div><div class="photo-upload"><label class="field" for="photoArea"><span>Área fotografada</span><select id="photoArea">${PHOTO_AREAS.map(x=>`<option>${x}</option>`).join('')}</select></label><label class="btn outline photo-picker" for="photoInput">＋ Adicionar fotos</label><input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" multiple><span class="inline-note">JPG, PNG ou WebP; até 12 MB por original. O app reduz o tamanho e remove metadados da cópia.</span></div><div id="photoGallery" class="photo-grid" aria-live="polite"><p class="inline-note">Carregando fotos...</p></div><div class="photo-actions"><button class="btn primary" id="analyzePhotos" type="button" disabled>✦ Analisar fotos com IA</button><small id="photoAiStatus">Verificando disponibilidade da IA...</small><small>Ao analisar, as imagens selecionadas são enviadas à OpenAI. Fotos e resultado permanecem salvos neste navegador; o servidor não mantém cópia.</small></div><div id="analysisResult">${analysisHtml(c.photoAnalysis)}</div></section><aside><div class="card aside-card"><div class="eyebrow">COMO FOTOGRAFAR</div><h3>Mostre contexto e detalhe</h3><ul><li>Use luz natural e enquadre o carro inteiro antes do close.</li><li>Fotografe vãos entre peças, pintura, pneus e painel.</li><li>No motor, fotografe a frio e não toque em componentes.</li></ul></div><div class="warning">A IA pode deixar passar defeitos e confundir reflexos, sujeira ou sombras com dano. Use os achados como perguntas para o vendedor, laudo cautelar e mecânico.</div></aside></div>`}
function analysisHtml(a){if(!a)return '<div class="empty photo-empty"><strong>Pronto para examinar</strong><p>Adicione fotos e toque em “Analisar fotos com IA”.</p></div>';return `<div class="section-title"><div><h2>Observações da IA</h2><p>Gerado em ${esc(a.date||'')} · confira pessoalmente.</p></div></div><div class="report-alert">${esc(a.resumo||'')}</div><div class="photo-findings">${(a.observacoes||[]).map(o=>`<article class="photo-finding"><span class="pill ${o.atencao==='alto'?'red':o.atencao==='medio'?'yellow':''}">${esc(o.atencao||'inconclusivo')}</span><b>Foto ${esc(o.foto)} · ${esc(o.area)}</b><p>${esc(o.achado)}</p><small><strong>Confira:</strong> ${esc(o.conferir)}</small></article>`).join('')}</div><p class="privacy">${esc(a.limitacoes||'A análise visual não substitui inspeção técnica.')}</p>`}
async function checkPhotoAI(){try{const response=await fetch('/api/analyze-photos',{cache:'no-store'}),data=await response.json();photoAiAvailable=Boolean(data.available)}catch{photoAiAvailable=false}if(route.page==='fotos'){let label=document.querySelector('#photoAiStatus');if(label)label.textContent=photoAiAvailable?'Análise disponível. As fotos serão enviadas somente quando você tocar no botão.':'Análise por IA em ativação. Você já pode guardar as fotos e continuar a vistoria.';hydratePhotos()}}
async function hydratePhotos(){let c=car(),id=c?.id;if(!id)return;try{let list=await photoRecords(id);if(route.page!=='fotos'||car()?.id!==id)return;document.querySelector('#photoCount').textContent=`${list.length}/6`;document.querySelector('#photoGallery').innerHTML=list.length?list.map(p=>`<figure class="photo-tile"><img src="${p.data}" alt="${esc(p.area)}" loading="lazy"><figcaption><span>${esc(p.area)}</span><button type="button" data-photo-delete="${esc(p.id)}" aria-label="Remover foto de ${esc(p.area)}">Remover</button></figcaption></figure>`).join(''):'<p class="inline-note">Nenhuma foto adicionada ainda.</p>';document.querySelector('#analyzePhotos').disabled=photoBusy||!list.length||!photoAiAvailable}catch{document.querySelector('#photoGallery').textContent='Não foi possível acessar as fotos neste navegador.'}}
document.addEventListener('change',async e=>{if(e.target.id!=='photoInput')return;let c=car(),input=e.target;if(!c)return;try{const list=await photoRecords(c.id),files=[...input.files];if(list.length+files.length>6)throw new Error('Use no máximo seis fotos por carro.');const area=document.querySelector('#photoArea').value;for(const file of files){let data=await photoShrink(file);await photoPut({id:crypto.randomUUID(),carId:c.id,area,data})}c.photoAnalysis=null;save();await hydratePhotos();document.querySelector('#analysisResult').innerHTML=analysisHtml(null);toast(`${files.length} foto${files.length===1?'':'s'} adicionada${files.length===1?'':'s'}.`)}catch(error){toast(error.message||'Não foi possível salvar as fotos.')}input.value=''});
document.addEventListener('click',async e=>{let deleteBtn=e.target.closest('[data-photo-delete]');if(deleteBtn){let c=car();try{await photoDelete(deleteBtn.dataset.photoDelete);c.photoAnalysis=null;save();hydratePhotos();document.querySelector('#analysisResult').innerHTML=analysisHtml(null)}catch{toast('Não foi possível remover a foto.')}return}if(e.target.id!=='analyzePhotos'||photoBusy)return;let c=car(),button=e.target;try{const list=await photoRecords(c.id);if(!list.length)return;photoBusy=true;button.disabled=true;button.textContent='Analisando imagens...';const response=await fetch('/api/analyze-photos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({vehicle:[c.brand,c.model,c.version,c.year].filter(Boolean).join(' '),photos:list.map(p=>({area:p.area,data:p.data}))})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Falha na análise.');c.photoAnalysis={...data.analysis,date:new Date().toLocaleString('pt-BR')};save();document.querySelector('#analysisResult').innerHTML=analysisHtml(c.photoAnalysis);toast('Análise concluída.')}catch(error){toast(error.message||'Não foi possível analisar.')}finally{photoBusy=false;button.textContent='✦ Analisar fotos com IA';hydratePhotos()}});

render();
