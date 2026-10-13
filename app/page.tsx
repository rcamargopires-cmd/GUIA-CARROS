export default function Home() {
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#inicio" aria-label="Seminovo sem Surpresa, início"><span className="brand-mark">S<span>✦</span></span><span>SEMINOVO<br/><b>SEM SURPRESA</b></span></a>
      <div className="side-label">SUA JORNADA</div>
      <nav id="nav" aria-label="Navegação principal" />
      <div className="side-bottom"><span className="gold-dot"/> Método 5P <small>Baseado no guia de Carla Moraes</small></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><button className="mobile-brand" id="mobileMenu" aria-label="Abrir menu">☰ <span>SEM SURPRESA</span></button><div className="top-context" id="topContext">COMPRA INTELIGENTE · PASSO A PASSO</div><div className="top-actions"><span className="autosave">● Salvo neste dispositivo</span><button className="avatar" aria-label="Meu painel">5P</button></div></header>
      <main id="app" tabIndex={-1}/>
      <footer>Seminovo sem Surpresa <span>·</span> Uma ferramenta de apoio à decisão, por Carla Moraes. Verificações oficiais e avaliação profissional continuam necessárias.</footer>
    </div>
    <div id="toast" className="toast" role="status" aria-live="polite"/>
  </div>;
}
