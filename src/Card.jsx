import './Card.css'

export default function Card({ card, flipped, matched, onClick }) {
  return (
    <div
      className={`card-container ${flipped ? 'flipped' : ''} ${matched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-back">
          <div className="pokeball-icon">
            <div className="pb-top" />
            <div className="pb-band" />
            <div className="pb-bottom" />
            <div className="pb-btn" />
          </div>
        </div>
        <div className="card-front">
          <img src={card.image} alt={card.name} draggable={false} />
          <span className="pokemon-name">{card.name}</span>
        </div>
      </div>
    </div>
  )
}
