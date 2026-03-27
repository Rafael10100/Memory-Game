import { useState, useEffect, useCallback } from 'react'
import Card from './Card'
import './App.css'

const TOTAL_PAIRS = 8
const MAX_POKEMON_ID = 151

function getRandomIds(count) {
  const ids = new Set()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1)
  }
  return Array.from(ids)
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [turns, setTurns] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [won, setWon] = useState(false)

  const fetchPokemons = useCallback(async () => {
    setLoading(true)
    setFlipped([])
    setMatched([])
    setTurns(0)
    setWon(false)
    setDisabled(false)

    const ids = getRandomIds(TOTAL_PAIRS)

    const results = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await res.json()
        return {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        }
      })
    )

    const duplicated = shuffleArray([
      ...results.map((p) => ({ ...p, uid: `${p.id}-a` })),
      ...results.map((p) => ({ ...p, uid: `${p.id}-b` })),
    ])

    setCards(duplicated)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPokemons()
  }, [fetchPokemons])

  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true)
      const [first, second] = flipped
      if (first.id === second.id) {
        setMatched((prev) => {
          const next = [...prev, first.id]
          if (next.length === TOTAL_PAIRS) setWon(true)
          return next
        })
        setFlipped([])
        setDisabled(false)
      } else {
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 900)
      }
      setTurns((t) => t + 1)
    }
  }, [flipped])

  function handleCardClick(card) {
    if (disabled) return
    if (matched.includes(card.id)) return
    if (flipped.find((c) => c.uid === card.uid)) return
    if (flipped.length === 1 && flipped[0].uid === card.uid) return
    setFlipped((prev) => [...prev, card])
  }

  function isFlipped(card) {
    return flipped.find((c) => c.uid === card.uid) || matched.includes(card.id)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span className="poke-red">Poké</span>
          <span className="poke-dark">Memory</span>
        </h1>
        <p className="subtitle">Encontre todos os pares!</p>
        <div className="stats">
          <div className="stat-badge">
            <span className="stat-label">Tentativas</span>
            <span className="stat-value">{turns}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Pares</span>
            <span className="stat-value">{matched.length} / {TOTAL_PAIRS}</span>
          </div>
        </div>
        <button className="new-game-btn" onClick={fetchPokemons} disabled={loading}>
          {loading ? 'Carregando...' : 'Novo Jogo'}
        </button>
      </header>

      {loading ? (
        <div className="loading">
          <div className="pokeball-spinner">
            <div className="pokeball">
              <div className="pokeball-top" />
              <div className="pokeball-band" />
              <div className="pokeball-bottom" />
              <div className="pokeball-button" />
            </div>
          </div>
          <p>Buscando Pokémons...</p>
        </div>
      ) : (
        <>
          {won && (
            <div className="win-banner">
              🎉 Parabéns! Você venceu em {turns} tentativas!
            </div>
          )}
          <div className="grid">
            {cards.map((card) => (
              <Card
                key={card.uid}
                card={card}
                flipped={!!isFlipped(card)}
                matched={matched.includes(card.id)}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
