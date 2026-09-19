'use client';

import { useEffect, useMemo, useState } from 'react';

const currentMakers = [
  { name: '輸入車（集計）', value: 28_987, color: '#d8ff43' },
  { name: 'トヨタ', value: 19_545, color: '#8b7cff' },
  { name: '日産', value: 14_087, color: '#40d7c1' },
  { name: 'ホンダ', value: 3_912, color: '#ff9f68' },
  { name: 'SUBARU', value: 2_910, color: '#5ea8ff' },
];

const rankingsByPeriod = {
  '2022': { label: '2022年', total: 31_592, makers: [{ name: '日産', value: 16_017, color: '#d8ff43' }, { name: '輸入車（集計）', value: 14_348, color: '#8b7cff' }, { name: 'トヨタ', value: 618, color: '#40d7c1' }, { name: 'ホンダ', value: 371, color: '#ff9f68' }, { name: 'SUBARU', value: 180, color: '#5ea8ff' }] },
  '2023': { label: '2023年', total: 43_991, makers: [{ name: '輸入車（集計）', value: 22_848, color: '#d8ff43' }, { name: '日産', value: 17_660, color: '#8b7cff' }, { name: 'トヨタ', value: 2_546, color: '#40d7c1' }, { name: 'SUBARU', value: 632, color: '#ff9f68' }, { name: 'ホンダ', value: 286, color: '#5ea8ff' }] },
  '2024': { label: '2024年', total: 34_057, makers: [{ name: '輸入車（集計）', value: 24_057, color: '#d8ff43' }, { name: '日産', value: 7_823, color: '#8b7cff' }, { name: 'トヨタ', value: 1_789, color: '#40d7c1' }, { name: 'SUBARU', value: 229, color: '#ff9f68' }, { name: 'ホンダ', value: 147, color: '#5ea8ff' }] },
  '2025': { label: '2025年', total: 39_885, makers: [{ name: '輸入車（集計）', value: 30_458, color: '#d8ff43' }, { name: '日産', value: 4_875, color: '#8b7cff' }, { name: 'トヨタ', value: 4_203, color: '#40d7c1' }, { name: 'SUBARU', value: 330, color: '#ff9f68' }, { name: 'ホンダ', value: 10, color: '#5ea8ff' }] },
  '2026': { label: '2026年 1〜8月', total: 69_441, makers: currentMakers },
} as const;

const annualTotals = [
  { year: '2022', value: 31_592 },
  { year: '2023', value: 43_991 },
  { year: '2024', value: 34_057 },
  { year: '2025', value: 39_885 },
  { year: '2026', value: 69_441, partial: true },
];

const monthly2026 = [5_419, 6_245, 11_245, 6_937, 8_957, 12_225, 10_062, 8_351];
const currentTotal = 69_441;
const nf = new Intl.NumberFormat('ja-JP');

export default function Home() {
  const [metric, setMetric] = useState<'units' | 'share'>('units');
  const [selectedYear, setSelectedYear] = useState<keyof typeof rankingsByPeriod>('2026');
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const ranking = rankingsByPeriod[selectedYear];
  const rankingShares = useMemo(() => {
    const listed = ranking.makers.map((maker) => ({ ...maker, share: maker.value / ranking.total * 100 }));
    const otherValue = ranking.total - ranking.makers.reduce((sum, maker) => sum + maker.value, 0);
    return otherValue > 0 ? [...listed, { name: 'その他', value: otherValue, share: otherValue / ranking.total * 100, color: '#393a35' }] : listed;
  }, [ranking]);
  const donut = useMemo(() => {
    let point = 0;
    const parts = rankingShares.map((maker) => {
      const next = point + maker.share;
      const part = `${maker.color} ${point}% ${next}%`;
      point = next;
      return part;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }, [rankingShares]);

  useEffect(() => {
    setReady(true);
    const sections = document.querySelectorAll<HTMLElement>('.story-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
    }, { threshold: 0.55 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const maxMonthly = Math.max(...monthly2026);

  return <main className={`site-shell ${ready ? 'is-ready' : ''}`}>
    <div className="grain" />
    <nav className="topbar"><a className="brand" href="#top"><i /> EV ATLAS</a><p>JAPAN BEV REGISTRATIONS / JADA</p><button className="menu-button" aria-label="メニューを開く"><span /><span /></button></nav>
    <section className="hero story-section in-view" id="top">
      <div className="eyebrow"><span /> MARKET PULSE <b>2026 JAN — AUG</b></div><h1>日本のBEV市場は<br /><em>いま、動いている。</em></h1>
      <p className="hero-copy">JADAの燃料別メーカー別登録台数を基に、国内の登録乗用車BEVを可視化。2026年1〜8月の登録台数は{nf.format(currentTotal)}台です。</p>
      <div className="hero-stats"><div><strong>{nf.format(currentTotal)}</strong><span>2026 YTD BEV REGISTRATIONS</span></div><div><strong>+205%</strong><span>VS. 2025 JAN — AUG</span></div><div><strong>5</strong><span>TOP CATEGORIES</span></div></div>
      <div className="orb orb-one" /><div className="orb orb-two" /><div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
    </section>
    <section className="content-grid" aria-label="日本のBEVメーカー別登録台数">
      <article className="rank-card panel story-section"><div className="panel-heading"><div><span className="section-number">01</span><h2>メーカー別<br />BEV登録台数</h2></div><label className="year-select"><span>対象年</span><select value={selectedYear} onChange={(event) => { setSelectedYear(event.target.value as keyof typeof rankingsByPeriod); setActive(0); }} aria-label="対象年を選択">{Object.entries(rankingsByPeriod).map(([year, item]) => <option key={year} value={year}>{item.label}</option>)}</select></label></div>
        <div className="metric-toggle" role="group" aria-label="表示指標"><button className={metric === 'units' ? 'selected' : ''} onClick={() => setMetric('units')}>台数</button><button className={metric === 'share' ? 'selected' : ''} onClick={() => setMetric('share')}>構成比</button></div>
        <div className="bars">{rankingShares.map((maker, index) => { const measure = metric === 'units' ? maker.value : maker.share; const max = metric === 'units' ? rankingShares[0].value : rankingShares[0].share; return <button className={`bar-row ${active === index ? 'active' : ''}`} key={maker.name} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className="rank">{String(index + 1).padStart(2, '0')}</span><span className="maker">{maker.name}</span><span className="bar-track"><i style={{ width: `${measure / max * 100}%`, background: maker.color }} /></span><strong>{metric === 'units' ? `${nf.format(maker.value)}台` : `${maker.share.toFixed(1)}%`}</strong></button>; })}</div>
        <p className="source">SOURCE: JADA 燃料別メーカー別登録台数（乗用車）／軽自動車を除く</p>
      </article>
      <article className="share-card panel story-section"><div className="panel-heading"><div><span className="section-number">02</span><h2>市場の<br />構成比</h2></div><span className="year-tag">{ranking.label}</span></div><div className="donut-wrap"><div className="donut" style={{ background: donut }}><div><strong>100</strong><span>%</span><small>JADA BEV TOTAL</small></div></div><div className="legend">{rankingShares.map((maker) => <div key={maker.name}><i style={{ background: maker.color }} /><span>{maker.name}</span><b>{maker.share.toFixed(1)}%</b></div>)}</div></div><div className="insight"><span>READING THE DATA</span><p>{rankingShares[0].name}が<br /><b>{rankingShares[0].share.toFixed(1)}%</b>で最多。</p></div></article>
      <article className="growth-card panel story-section"><div className="panel-heading"><div><span className="section-number">03</span><h2>年次の推移</h2></div><span className="growth-pill">2026年は1〜8月</span></div><div className="area-chart"><svg viewBox="0 0 720 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d8ff43" stopOpacity=".38"/><stop offset="1" stopColor="#d8ff43" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 146 L180 99 L360 125 L540 108 L720 20 L720 220 L0 220Z"/><path className="line" d="M0 146 L180 99 L360 125 L540 108 L720 20"/></svg><div className="chart-points">{annualTotals.map((item, i) => <div className="point" key={item.year} style={{ left: `${i / (annualTotals.length - 1) * 100}%`, top: `${84 - item.value / 70_000 * 76}%` }}><i/><b>{(item.value / 1000).toFixed(1)}k{item.partial ? '*' : ''}</b><span>{item.year}</span></div>)}</div></div><div className="growth-footer"><div><strong>+26.2%</strong><span>2022→2025</span></div><div><strong>69,441台*</strong><span>2026年1〜8月の登録台数</span></div><p>* 2026年は年途中の累計値です。</p></div></article>
      <article className="momentum-card panel story-section"><span className="section-number">04</span><h2>2026年<br />月次の動き</h2><div className="momentum-number"><span>PEAK MONTH</span><strong>12,225</strong><em>2026年6月のBEV登録台数</em></div><div className="spark-bars">{monthly2026.map((value, i) => <i key={i} aria-label={`${i + 1}月 ${nf.format(value)}台`} style={{ height: `${value / maxMonthly * 100}%` }} />)}</div><div className="month-labels">{monthly2026.map((_, i) => <span key={i}>{i + 1}月</span>)}</div><p>年間データと途中経過を区別し、2026年は1〜8月累計として表示しています。</p></article>
    </section>
    <footer><span>EV ATLAS / JAPAN BEV DATA STORY</span><span>JADA FUEL-TYPE REGISTRATIONS · UPDATED SEP 2026</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}
