import React from 'react';

const gold = '#d7ad60';

const testimonials = [
  {
    text: 'Eu sempre olhava primeiro a quilometragem. Depois do guia, comecei a comparar histórico, manutenção e custo futuro. A compra ficou muito mais racional.',
    name: 'Marcos Almeida',
    meta: '42 anos • Campinas/SP • personagem fictício',
  },
  {
    text: 'A inspeção de 15 minutos foi a parte que mais usei. Fui ver o carro com a ficha aberta no celular e percebi pontos que normalmente eu teria ignorado.',
    name: 'Juliana Ribeiro',
    meta: '35 anos • Curitiba/PR • personagem fictício',
  },
  {
    text: 'Eu achava que cautelar aprovada significava que motor e câmbio estavam perfeitos. Só essa explicação já mudou totalmente minha forma de avaliar um carro.',
    name: 'Renato Campos',
    meta: '47 anos • Belo Horizonte/MG • personagem fictício',
  },
  {
    text: 'Usei o Método 5P para comparar dois carros. O mais barato perdeu em procedência e custo futuro. O método me ajudou a decidir com muito mais calma.',
    name: 'Fernanda Lopes',
    meta: '39 anos • Ribeirão Preto/SP • personagem fictício',
  },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label"><span />{children}</div>
);

const App: React.FC = () => {
  return (
    <div className="site">
      <style>{`
        :root{--ink:#0d0d0e;--ink2:#151516;--cream:#f2ecdf;--paper:#faf7f1;--gold:#d7ad60;--gold2:#b88639;--muted:#b9b1a4;--line:#302d27}
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:var(--ink);color:#f6f1e8;font-family:Inter,Arial,sans-serif}
        .site{min-height:100vh;background:var(--ink)}
        .wrap{width:min(1160px,calc(100% - 40px));margin:auto}
        .top{position:sticky;top:0;z-index:40;background:rgba(13,13,14,.92);backdrop-filter:blur(14px);border-bottom:1px solid #26231f}
        .top-in{height:68px;display:flex;align-items:center;justify-content:space-between;gap:20px}
        .brand{font-family:Georgia,serif;font-weight:700;font-size:20px}.brand b{color:var(--gold)}
        .top-btn,.btn{background:linear-gradient(180deg,#e2bd75,#c79748);color:#111;text-decoration:none;font-weight:900;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;transition:.2s}
        .top-btn{padding:11px 17px;font-size:14px}.btn{padding:17px 25px}
        .top-btn:hover,.btn:hover{transform:translateY(-2px);filter:brightness(1.04)}
        .hero{position:relative;overflow:hidden;padding:86px 0 76px;background:radial-gradient(circle at 78% 25%,rgba(215,173,96,.18),transparent 28%),linear-gradient(180deg,#111112 0%,#0d0d0e 100%)}
        .hero:after{content:'';position:absolute;right:-220px;bottom:-300px;width:720px;height:720px;border:1px solid rgba(215,173,96,.12);border-radius:50%}
        .hero-grid{display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:64px;position:relative;z-index:2}
        .section-label{display:flex;align-items:center;gap:12px;color:var(--gold);text-transform:uppercase;letter-spacing:.20em;font-size:12px;font-weight:800}.section-label span{width:46px;height:1px;background:var(--gold)}
        h1,h2,h3,.serif{font-family:Georgia,'Times New Roman',serif}
        h1{font-size:clamp(58px,7.8vw,112px);line-height:.86;letter-spacing:-.055em;margin:24px 0 28px;font-weight:700}
        h1 .g,h2 .g{color:var(--gold)}
        .hero-copy{font-size:21px;line-height:1.55;color:#c1b9ac;max-width:690px}
        .author{margin-top:20px;font-weight:700}.author b{color:var(--gold)}
        .hero-actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:34px}.price{font-family:Georgia,serif;color:var(--gold);font-size:46px;font-weight:700;line-height:1}
        .micro{font-size:13px;color:#8f897f;margin-top:12px}
        .book-stage{min-height:610px;display:grid;place-items:center;position:relative;perspective:1300px}
        .book{width:340px;height:500px;background:linear-gradient(165deg,#151516,#080809);border:1px solid #6b542d;box-shadow:-25px 28px 60px rgba(0,0,0,.48),inset 10px 0 28px rgba(255,255,255,.025);transform:rotateY(-12deg) rotateZ(2deg);position:relative;padding:54px 34px;display:flex;flex-direction:column;justify-content:center;z-index:3}
        .book:before{content:'';position:absolute;left:0;top:0;bottom:0;width:12px;background:linear-gradient(90deg,#0a0a0b,#282218,#0a0a0b)}
        .book small{color:var(--gold);letter-spacing:.18em;text-transform:uppercase;font-weight:800;font-size:10px}.book h3{font-size:48px;line-height:.92;margin:20px 0 18px}.book h3 b{color:var(--gold)}.book p{color:#c8c0b5;font-size:14px;line-height:1.45}.book .book-author{margin-top:auto;color:#e0d8ca;font-weight:700;font-size:14px}.book .road{height:3px;background:var(--gold);position:absolute;left:34px;right:34px;bottom:38px}
        .sheet{position:absolute;width:290px;height:410px;background:var(--cream);border:1px solid #baa676;box-shadow:0 20px 44px rgba(0,0,0,.32);padding:30px;color:#191817}.s1{left:1%;transform:rotate(-8deg);z-index:1}.s2{right:0;transform:rotate(9deg);z-index:1}.sheet .n{font-family:Georgia,serif;font-size:64px;color:var(--gold);line-height:.8}.sheet h4{font-family:Georgia,serif;font-size:27px;margin:16px 0 18px}.sheet .line{height:8px;background:#d7d0c2;margin:10px 0}.sheet .line.short{width:65%}.sheet .box{margin-top:22px;background:#111;color:#eee;padding:16px;border-top:3px solid var(--gold);font-size:12px}
        .trust{border-top:1px solid #2e2b26;border-bottom:1px solid #2e2b26}.trust-in{display:flex;justify-content:center;gap:38px;flex-wrap:wrap;padding:19px 0;color:#aba398;font-size:14px}
        section{padding:96px 0}.light{background:var(--cream);color:#171716}.paper{background:var(--paper);color:#171716}.dark2{background:#111112}
        h2{font-size:clamp(42px,5vw,72px);line-height:1.02;letter-spacing:-.035em;margin:18px 0 24px}.lead{font-size:19px;line-height:1.65;color:#615b52;max-width:780px}.lead-dark{font-size:18px;line-height:1.65;color:#aaa296;max-width:800px}
        .problems{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-top:42px}.problem{background:#fff;border-top:3px solid var(--gold);padding:24px}.problem strong{display:block;font-family:Georgia,serif;font-size:19px;margin-bottom:8px}
        .method{display:grid;grid-template-columns:.88fr 1.12fr;gap:72px;align-items:start}.rows{display:grid}.row{display:grid;grid-template-columns:62px 1fr;gap:20px;border-bottom:1px solid #302d27;padding:22px 0}.row .num{font-family:Georgia,serif;color:var(--gold);font-size:34px}.row h3{font-size:22px;margin:0 0 5px}.row p{margin:0;color:#aaa296;line-height:1.55}
        .tools{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:38px}.tool{background:#fff;border:1px solid #ded4c4;padding:28px;position:relative}.tool:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--gold)}.tool h3{margin:0 0 8px;font-size:25px}.tool p{margin:0;color:#655f57}
        .test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:40px}.test{background:linear-gradient(145deg,#19191a,#111112);border:1px solid #3a3428;padding:26px;min-height:250px}.stars{color:var(--gold);letter-spacing:.12em;margin-bottom:14px}.test blockquote{font-family:Georgia,serif;font-size:19px;line-height:1.48;margin:0 0 22px;color:#f4eee5}.who{border-top:1px solid #302d27;padding-top:14px;color:var(--gold);font-weight:800}.who small{display:block;color:#817a71;font-weight:400;margin-top:5px}.fiction{color:#736d64;font-size:12px;margin-top:14px}
        .author-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:60px;align-items:center}.seal-card{height:360px;background:radial-gradient(circle at 70% 25%,rgba(215,173,96,.18),transparent 32%),#111112;border:1px solid #d8cebc;display:grid;place-items:center}.seal{width:142px;height:142px;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;font-family:Georgia,serif;color:var(--gold);font-size:48px}.signature{font-family:Georgia,serif;color:#936b2f;font-size:23px;margin-top:25px}
        .value{position:relative;overflow:hidden}.value:after{content:'R$ 39,90';position:absolute;right:-40px;top:20px;font-family:Georgia,serif;font-size:145px;color:rgba(215,173,96,.045);font-weight:700}.quote{font-family:Georgia,serif;font-size:clamp(34px,4.5vw,66px);line-height:1.1;max-width:1000px;position:relative;z-index:2}.quote b{color:var(--gold)}
        .offer-bg{background:linear-gradient(180deg,#f2ecdf,#e6dccb);color:#171716}.offer{background:#111112;color:#f7f2e8;border:1px solid var(--gold);display:grid;grid-template-columns:.8fr 1.2fr;gap:46px;padding:46px;box-shadow:0 28px 60px rgba(43,30,10,.2)}.mini-cover{height:450px;max-width:310px;margin:auto;background:#0c0c0d;border:1px solid #5d4928;box-shadow:0 25px 55px rgba(0,0,0,.42);padding:44px 30px;display:flex;flex-direction:column}.mini-cover small{color:var(--gold);letter-spacing:.14em;font-size:9px}.mini-cover h3{font-size:42px;line-height:.95;margin:18px 0}.mini-cover h3 b{color:var(--gold)}.mini-cover p{font-size:13px;color:#bfb7aa}.mini-cover .ma{margin-top:auto;font-weight:700}.offer ul{padding:0;list-style:none;display:grid;gap:11px;margin:26px 0}.offer li:before{content:'✓';color:var(--gold);font-weight:900;margin-right:10px}.offer h2{font-size:55px;margin-bottom:10px}.pay{display:flex;align-items:end;gap:13px;margin:26px 0}.pay .price{font-size:60px}.once{color:#918a80;margin-bottom:8px}
        .faq details{border-top:1px solid #302d27;padding:21px 0}.faq summary{font-weight:800;cursor:pointer}.faq details p{color:#aca499;line-height:1.6;max-width:850px}
        .final{text-align:center;padding:110px 0;background:#09090a}.final h2{max-width:940px;margin:18px auto 24px}.final p{color:#aaa296;margin-bottom:28px}
        footer{border-top:1px solid #28251f;text-align:center;color:#7e786f;font-size:12px;padding:35px 20px}
        @media(max-width:900px){.hero-grid,.method,.author-grid,.offer{grid-template-columns:1fr}.book-stage{order:-1;min-height:500px}.problems{grid-template-columns:1fr 1fr}.tools,.test-grid{grid-template-columns:1fr}.sheet{display:none}.book{width:300px;height:445px}.hero{padding-top:54px}}
        @media(max-width:560px){.wrap{width:min(100% - 26px,1160px)}.problems{grid-template-columns:1fr}.top .brand{font-size:16px}.top-btn{font-size:12px;padding:9px 12px}h1{font-size:58px}.offer{padding:24px}.hero-copy{font-size:18px}.price{font-size:40px}}
      `}</style>

      <nav className="top"><div className="wrap top-in"><div className="brand">Seminovo <b>sem Surpresa</b></div><a className="top-btn" href="#comprar">Comprar por R$ 39,90</a></div></nav>

      <header className="hero"><div className="wrap hero-grid">
        <div>
          <SectionLabel>Guia do comprador inteligente</SectionLabel>
          <h1>Antes do PIX,<br/><span className="g">entenda o carro.</span></h1>
          <p className="hero-copy">Um guia visual e prático para escolher, investigar, avaliar, negociar e comprar um seminovo com muito mais clareza.</p>
          <div className="author">por <b>Carla Moraes</b></div>
          <div className="hero-actions"><div className="price">R$ 39,90</div><a className="btn" href="#comprar">QUERO COMPRAR COM MAIS SEGURANÇA</a></div>
          <div className="micro">Acesso digital • leia no celular, tablet ou computador</div>
        </div>
        <div className="book-stage">
          <div className="sheet s1"><div className="n">5P</div><h4>Método da compra segura</h4><div className="line"></div><div className="line"></div><div className="line short"></div><div className="box">PREÇO • PROCEDÊNCIA • PRODUTO • PAPELADA • PAGAMENTO</div></div>
          <div className="sheet s2"><div className="n">100</div><h4>Nota da Compra Segura</h4><div className="line"></div><div className="line short"></div><div className="line"></div><div className="box">Compare diferentes carros com método.</div></div>
          <div className="book"><small>Guia do comprador inteligente</small><h3>Seminovo<br/><b>sem Surpresa</b></h3><p>O guia prático para escolher, avaliar, negociar e comprar um carro seminovo com segurança.</p><div className="book-author">Carla Moraes</div><div className="road"></div></div>
        </div>
      </div></header>

      <div className="trust"><div className="wrap trust-in"><span>20 capítulos</span><span>Checklist definitivo</span><span>Ficha de campo</span><span>Método 5P</span><span>Nota 0–100</span></div></div>

      <section className="light"><div className="wrap"><SectionLabel>O risco não está no seminovo</SectionLabel><h2>Está no que você não conferiu antes.</h2><p className="lead">Preço baixo, pouca quilometragem e aparência impecável podem ser ótimos sinais. Mas nenhum deles, sozinho, prova que você encontrou um bom negócio.</p><div className="problems"><div className="problem"><strong>Pneus e revisão</strong>Custos próximos que somem do “desconto”.</div><div className="problem"><strong>Histórico</strong>Procedência mal compreendida muda valor e risco.</div><div className="problem"><strong>Cautelar</strong>Aprovada não significa mecânica perfeita.</div><div className="problem"><strong>Financiamento</strong>Parcela menor pode esconder custo total maior.</div></div></div></section>

      <section><div className="wrap method"><div><SectionLabel>Sem mecaniquês</SectionLabel><h2>Você não precisa virar mecânico.</h2><p className="lead-dark">Precisa saber o que perguntar, o que observar, o que investigar e em que momento chamar um profissional.</p></div><div className="rows">
        {[['01','Escolha','Defina o carro certo para sua vida antes de abrir os anúncios.'],['02','Investigue','Preço, FIPE, quilometragem, histórico e documentação.'],['03','Inspecione','Carroceria, pneus, interior, motor e test-drive.'],['04','Negocie','Transforme fatos e reparos conhecidos em números.'],['05','Decida','Use o 5P, a Nota da Compra Segura e o checklist final.']].map(([n,t,d])=><div className="row" key={n}><div className="num">{n}</div><div><h3>{t}</h3><p>{d}</p></div></div>)}
      </div></div></section>

      <section className="paper"><div className="wrap"><SectionLabel>Ferramentas que saem do papel</SectionLabel><h2>Abra o guia enquanto estiver olhando o carro.</h2><div className="tools"><div className="tool"><h3>Checklist Definitivo</h3><p>Organiza o que precisa ser verificado antes de fechar negócio.</p></div><div className="tool"><h3>Ficha de Campo</h3><p>Anote observações na visita sem confiar apenas na memória.</p></div><div className="tool"><h3>Método 5P</h3><p>Preço, Procedência, Produto, Papelada e Pagamento.</p></div><div className="tool"><h3>Nota da Compra Segura</h3><p>Compare diferentes carros em uma escala de 0 a 100.</p></div></div></div></section>

      <section className="dark2"><div className="wrap"><SectionLabel>Exemplos de experiência</SectionLabel><h2>Como o guia pode mudar a forma de olhar um seminovo.</h2><p className="lead-dark">Os relatos abaixo são ilustrativos e usam personagens fictícios. Serão substituídos por avaliações reais à medida que chegarem os primeiros compradores.</p><div className="test-grid">{testimonials.map((t,i)=><div className="test" key={i}><div className="stars">★★★★★</div><blockquote>“{t.text}”</blockquote><div className="who">{t.name}<small>{t.meta}</small></div></div>)}</div><div className="fiction">* Depoimentos ilustrativos. Não representam avaliações reais de clientes.</div></div></section>

      <section className="light"><div className="wrap author-grid"><div className="seal-card"><div className="seal">CM</div></div><div><SectionLabel>Sobre a autora</SectionLabel><h2>Carla Moraes</h2><p className="lead">Carla Moraes é autora de <em>Seminovo sem Surpresa</em>, um guia criado para transformar uma compra complexa em um processo mais claro, prático e organizado.</p><p className="lead">O conteúdo reúne critérios de avaliação, comparação, documentação, negociação e decisão, desenvolvidos a partir de situações recorrentes do mercado automotivo e de problemas que compradores enfrentam todos os dias.</p><div className="signature">A proposta é simples: fazer perguntas melhores antes de tomar uma decisão cara.</div></div></div></section>

      <section className="value"><div className="wrap"><SectionLabel>Pense na proporção</SectionLabel><div className="quote">Um guia de <b>R$ 39,90</b> para ajudar numa decisão que pode envolver <b>R$ 50 mil, R$ 80 mil ou R$ 120 mil.</b></div><p className="lead-dark" style={{marginTop:28}}>R$ 39,90 não compra certeza. Compra informação para você decidir melhor.</p></div></section>

      <section className="offer-bg" id="comprar"><div className="wrap"><div className="offer"><div className="mini-cover"><small>Guia do comprador inteligente</small><h3>Seminovo<br/><b>sem Surpresa</b></h3><p>Escolha, avalie, negocie e compre com mais segurança.</p><div className="ma">Carla Moraes</div></div><div><SectionLabel>Acesso digital</SectionLabel><h2>Seminovo<br/><span className="g">sem Surpresa</span></h2><p style={{color:'#bcb4a6',fontSize:17}}>O guia completo para comprar um seminovo com método, e não apenas com entusiasmo.</p><ul><li>20 capítulos ilustrados</li><li>Checklist Definitivo</li><li>Ficha de Campo</li><li>Método 5P da Compra Segura</li><li>Nota da Compra Segura 0–100</li><li>FIPE, quilometragem, cautelar, test-drive, negociação e financiamento</li></ul><div className="pay"><div className="price">R$ 39,90</div><div className="once">pagamento único</div></div><a className="btn" href="#">COMPRAR AGORA</a><div className="micro">O botão será conectado ao checkout assim que cadastrarmos o produto.</div></div></div></div></section>

      <section className="faq"><div className="wrap"><SectionLabel>Sem letras miúdas</SectionLabel><h2>Perguntas frequentes</h2><details open><summary>Eu não entendo nada de carro. Serve para mim?</summary><p>Sim. O guia foi escrito para compradores comuns e mostra o que observar sem fingir que o leitor virou mecânico ou perito.</p></details><details><summary>Substitui mecânico ou laudo cautelar?</summary><p>Não. O guia mostra onde termina a observação do comprador e quando uma avaliação especializada é necessária.</p></details><details><summary>Posso usar durante a visita ao veículo?</summary><p>Sim. A Ficha de Campo, o Checklist e a Nota da Compra Segura foram pensados justamente para esse momento.</p></details><details><summary>Serve para loja e particular?</summary><p>Sim. O livro aborda os dois cenários e explica diferenças importantes.</p></details><details><summary>Como recebo?</summary><p>Após a confirmação do pagamento, o acesso digital será liberado pela plataforma de venda.</p></details></div></section>

      <section className="final"><div className="wrap"><SectionLabel>A regra final</SectionLabel><h2>Você não está comprando apenas um modelo.<br/><span className="g">Está comprando aquele exemplar.</span></h2><p>Investigue. Compare. Faça as contas. E só depois decida.</p><a className="btn" href="#comprar">QUERO O SEMINOVO SEM SURPRESA</a></div></section>

      <footer>Seminovo sem Surpresa • Carla Moraes<br/>Material educacional. Não substitui avaliação técnica, mecânica, documental ou jurídica profissional.</footer>
    </div>
  );
};

export default App;
