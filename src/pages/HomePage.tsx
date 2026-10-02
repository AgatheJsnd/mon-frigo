import { Link } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { formatExpiry, greetingForHour } from '../utils/helpers'
import { foodVisual } from '../utils/foodVisual'
import { TitleWave } from '../components/TitleWave'
import vegetablesImg from '../assets/home/vegetables.png'
import scanPhoneImg from '../assets/home/scan-phone.png'

export function HomePage() {
  const { foods, urgentFoods, filteredRecipes } = useFridge()
  const name = 'Agathe'

  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-hero__text">
          <p className="home-greeting">
            {greetingForHour()} <span className="home-greeting__name">{name}</span>
            <span className="home-greeting__marks" aria-hidden>
              <i /><i />
            </span>
          </p>
          <h1 className="home-title">
            Qu’est-ce qu’on mange
            <br />
            ce soir&nbsp;?
            <TitleWave className="home-title__wave" width={170} />
          </h1>
        </div>
        <div className="home-hero__art" aria-hidden>
          <img src={vegetablesImg} alt="" className="home-bowl-photo" />
        </div>
      </header>

      <section className="home-scan card card--mint">
        <div className="home-scan__row">
          <div className="home-scan__copy">
            <h2>Pas d’idée&nbsp;? Scannez votre frigo.</h2>
            <p>
              Une photo suffit : on reconnaît vos aliments et on vous propose des
              idées en quelques secondes.
            </p>
          </div>
          <div className="home-scan__illu" aria-hidden>
            <img src={scanPhoneImg} alt="" className="home-scan__phone" />
          </div>
        </div>
        <Link to="/scanner" className="btn btn--primary home-scan__btn">
          <CameraIcon />
          Scanner mon frigo
        </Link>
      </section>

      <section className="home-urgent card">
        <div className="home-urgent__head">
          <h2>À utiliser vite</h2>
          <span className="home-urgent__burst" aria-hidden>
            ✦
          </span>
        </div>

        {urgentFoods.length === 0 ? (
          <p className="home-urgent__empty">
            Aucun aliment n’expire dans les 3 prochains jours.
          </p>
        ) : (
          <ul className="home-urgent__list">
            {urgentFoods.slice(0, 3).map((f) => {
              const visual = foodVisual(f.name)
              return (
                <li key={f.id}>
                  <Link to="/frigo" className="home-urgent__item">
                    <span className="home-urgent__thumb" aria-hidden>
                      {visual.photo ? (
                        <img src={visual.photo} alt="" />
                      ) : (
                        <span style={{ background: visual.bg }}>{visual.emoji}</span>
                      )}
                    </span>
                    <span className="home-urgent__info">
                      <span className="home-urgent__name">
                        <span className="warn-icon" aria-hidden>
                          ▲
                        </span>
                        {f.name}
                      </span>
                      <span className="warn-text">{formatExpiry(f.expiresInDays)}</span>
                    </span>
                    <span className="home-urgent__chev" aria-hidden>
                      ›
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <Link to="/recettes" className="home-urgent__cta">
          <ChefIcon />
          Voir les suggestions
          <span aria-hidden>→</span>
        </Link>
      </section>

      <div className="home-stats">
        <div className="home-stat home-stat--green">
          <FridgeIcon />
          <strong>{foods.length}</strong>
          <span>aliments dans votre frigo</span>
        </div>
        <div className="home-stat home-stat--orange">
          <ClockIcon />
          <strong>{urgentFoods.length}</strong>
          <span>expirent dans les 3 jours</span>
        </div>
        <div className="home-stat home-stat--mint">
          <ChefIcon />
          <strong>{filteredRecipes.length}</strong>
          <span>recettes disponibles</span>
        </div>
      </div>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function ChefIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 14v6h8v-6" />
      <path d="M6 14h12" />
      <path d="M12 4a4 4 0 0 1 4 4c1.7 0 3 1 3 2.5S19.7 13 18 13H6c-1.7 0-3-1-3-2.5S4.3 8 6 8a4 4 0 0 1 6-4z" />
    </svg>
  )
}

function FridgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 10h12M10 6v2M10 13v3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  )
}
