const tables = [
  ['手戻りを防ぐデザインの進め方を考えてみた', 'maruhama (@misatom143)'],
  ['デザイナーがプロジェクトにうまく関わるためには', 'akikoy (@akikoy__)'],
  ['0から作らないデザイントークン', 'kuon (@kuon609)'],
  ['実践！ユーザーインタビューがデザイン改善に繋がるまで', 'takeru (@mountainboooy)'],
  ['質疑応答・パネルディスカッション', 'maruhama (@misatom143), akikoy (@akikoy__), kuon (@kuon609), takeru (@mountainboooy)']
]
export const Overlay = () => {
  const params = new URLSearchParams(location.search);
  const n = params.get('n');
  if (!n) return null
  const info = tables[Number(n)]
  return <><div style={{ minHeight: '7vh'}}>{info[0]}</div><div>{info[1]}</div></>
}
