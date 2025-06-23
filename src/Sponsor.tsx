import background from './assets/sponsor-background.png';
const sponsors = {
  "Matz":["smarthr.png","tebiki.png","timee.png","freee.png","knowledgelabo.png"],
  "Take":["agileware.png","andpad.png","degica.png","esm.png","hatena.png","ingage.png","moneyforward.png","ponos.png","rubydevelopment.png","sixvox.png","stmn.png"],
  "Ume":["aschild.png","codetakt.png","gajilabo.png","localtech.png","lokka.png","mov.png","nacl.png","tokyorubykaigi.png","twogate.png","xalpha.png","youcube.png"]
} as const;

const sizes: Record<keyof typeof sponsors, [number, number, number]> = {
  Matz: [18, 2, 2],
  Take: [12, 1, 1],
  Ume: [9, 1, 3]
}

function isSponsorType (type: unknown): type is keyof typeof sponsors {
  return typeof type === 'string' && type in sponsors;
}

export const Sponsor = () => {
  const type = new URLSearchParams(location.search).get('type');
  if (!isSponsorType(type)) return null;
  return <section
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      width: '100vw',
      height: '100vh',
      color: 'rgb(246,246,246)'
    }}
  ><h1 style={{
    margin: 0,
    paddingTop: '4vh',
    fontSize: '4.5vw'
  }}
  >{type} Sponsors</h1>
  <section style={{
    marginTop: '4vh',
    width: '70vw',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
  }}>
    <div>
    {sponsors[type].map((sponsor) => (
      <img
        key={sponsor}
        src={`https://regional.rubykaigi.org/kansai08/sponsors/${sponsor}`}
        alt={sponsor}
        style={{
          padding: '0.5vw',
          backgroundColor: 'white',
          width: `${sizes[type][0]}vw`,
          height: `${sizes[type][0]}vw`,
          objectFit: 'contain',
          margin: `${sizes[type][1]}vw ${sizes[type][2]}vw`,
          borderRadius: '1vw',
        }}
      />
    ))}
    </div>
  </section>
  </section>
};
