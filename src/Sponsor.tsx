import background from './assets/sponsor-background.png';
const sponsors = {
  "Biwa":["toranoanalab.jpg"],
  "Gold":["aschild.png","ponos.png","gajilabo.png","ivry.png","leaner.png","rubydevelopment.jpg","agileware.png","ingage.png","netprotections.png","esm.png"],
  "Silver":["smarthr.png", "nacl.png"]
} as const;

const sizes: Record<keyof typeof sponsors, [number, number, number]> = {
  Biwa: [30, 25, 25],
  Gold: [12, 1, 1],
  Silver: [9, 1, 3]
}

const sponsorImageBaseUrl = 'https://regional.rubykaigi.org/kansai09/sponsors/';

const headingStyle = {
  margin: 0,
  paddingTop: '4vh',
  fontSize: '4.5vw'
} as const;

const logoListStyle = (heightVh: number) => ({
  marginTop: '4vh',
  width: '70vw',
  height: `${heightVh}vh`,
  display: 'flex',
  alignItems: 'center',
} as const);

const logoStyle = ([size, marginY, marginX]: [number, number, number]) => ({
  padding: '0.5vw',
  backgroundColor: 'white',
  width: `${size}vw`,
  height: `${size}vw`,
  objectFit: 'contain',
  margin: `${marginY}vw ${marginX}vw`,
  borderRadius: '1vw',
} as const);

function isSponsorType (type: unknown): type is keyof typeof sponsors {
  return typeof type === 'string' && type in sponsors;
}

export const Sponsor = () => {
  const type = new URLSearchParams(location.search).get('type');
  if (!isSponsorType(type)) return null;
  const isSilver = type === 'Silver';
  return <section
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      width: '100vw',
      height: '100vh',
      color: 'rgb(246,246,246)'
    }}
  ><h1 style={headingStyle}>{type} Sponsors</h1>
  <section style={logoListStyle(isSilver ? 30 : 80)}>
    <div>
    {sponsors[type].map((sponsor) => (
      <img
        key={sponsor}
        src={sponsorImageBaseUrl + sponsor}
        alt={sponsor}
        style={logoStyle(sizes[type])}
      />
    ))}
    </div>
  </section>
  {
    isSilver && <>
    <h1 style={headingStyle}>Tool Sponsor</h1>
    <section style={logoListStyle(30)}>
      <div>
        <img
          src={sponsorImageBaseUrl + 'esa.png'}
          alt="esa"
          style={logoStyle(sizes.Silver)}
        />
      </div>
    </section>
    </>
  }
  </section>
};
