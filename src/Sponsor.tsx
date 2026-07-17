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
  ><h1 style={{
    margin: 0,
    paddingTop: '4vh',
    fontSize: '4.5vw'
  }}
  >{type} Sponsors</h1>
  <section style={{
    marginTop: '4vh',
    width: '70vw',
    height: `${isSilver ? 30 : 80}vh`,
    display: 'flex',
    alignItems: 'center',
  }}>
    <div>
    {sponsors[type].map((sponsor) => (
      <img
        key={sponsor}
        src={`https://regional.rubykaigi.org/kansai09/sponsors/${sponsor}`}
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
  {
    isSilver && <>
    <h1  style={{
    margin: 0,
    paddingTop: '4vh',
    fontSize: '4.5vw'
  }}>Tool Sponsor</h1>
    <section style={{
    marginTop: '4vh',
    width: '70vw',
    height: `${isSilver ? 30 : 80}vh`,
    display: 'flex',
    alignItems: 'center',
  }}>
      <div>
        <img
          src={'https://regional.rubykaigi.org/kansai09/sponsors/esa.png'}
          alt="esa"
          style={{
            padding: '0.5vw',
            backgroundColor: 'white',
            width: `9vw`,
            height: `9vw`,
            objectFit: 'contain',
            margin: `1vw 3vw`,
            borderRadius: '1vw',
          }}
        />
      </div>
    </section>
    </>
  }
  </section>
};
