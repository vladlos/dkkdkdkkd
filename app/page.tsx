"use client";

import { useState } from "react";

const categories = ["Усе", "IT та код", "Історія", "Кіно", "Наука", "Мікс"];
const modes = [
  { id: "ranked", label: "Рейтинговий", hint: "Знайти рівного суперника", icon: "01" },
  { id: "friends", label: "З друзями", hint: "Приватна кімната за кодом", icon: "02" },
  { id: "arena", label: "Турнірна арена", hint: "Сезон 04 · 128 учасників", icon: "03" },
] as const;

const questions = [
  {
    category: "IT та код",
    difficulty: "СЕРЕДНЯ",
    text: "Який метод масиву повертає новий масив, залишаючи лише елементи, що пройшли перевірку?",
    options: ["map()", "filter()", "reduce()", "slice()"],
    answer: 1,
  },
  {
    category: "Наука",
    difficulty: "ЛЕГКА",
    text: "Яка планета Сонячної системи має найбільшу кількість відомих супутників?",
    options: ["Юпітер", "Земля", "Марс", "Венера"],
    answer: 0,
  },
  {
    category: "Історія",
    difficulty: "СКЛАДНА",
    text: "У якому році було підписано Вестфальський мир?",
    options: ["1492", "1618", "1648", "1789"],
    answer: 2,
  },
];

const player = { name: "marta.dev", avatar: "М", rating: 1842, country: "UA" };
const opponent = { name: "pixel.pilot", avatar: "П", rating: 1827, country: "PL", winRate: "68%" };

type Screen = "lobby" | "battle" | "results";
type Mode = (typeof modes)[number]["id"];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [mode, setMode] = useState<Mode>("ranked");
  const [category, setCategory] = useState("Усе");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [matchFound, setMatchFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[questionIndex];
  const score = correctCount * 320;

  function startSearch() {
    if (mode === "friends") {
      setRoomOpen(true);
      return;
    }
    setSearching(true);
    window.setTimeout(() => {
      setSearching(false);
      setMatchFound(true);
    }, 1100);
  }

  function startBattle() {
    setMatchFound(false);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnsweredCount(0);
    setCorrectCount(0);
    setScreen("battle");
  }

  function submitAnswer(answerIndex: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setAnsweredCount((count) => count + 1);
    if (answerIndex === question.answer) setCorrectCount((count) => count + 1);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setScreen("results");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  function resetToLobby() {
    setScreen("lobby");
    setMatchFound(false);
    setRoomOpen(false);
    setReviewOpen(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#lobby" onClick={resetToLobby} aria-label="Duel — лобі">
          <span className="brand-mark">D</span>
          <span>DUEL<span className="brand-period">.</span></span>
        </a>
        <div className="season-label">СЕЗОН 04<span>·</span> 12 ДНІВ</div>
        <nav className="side-nav" aria-label="Екрани прототипу">
          <button className={screen === "lobby" ? "nav-link active" : "nav-link"} onClick={() => setScreen("lobby")}>
            <span className="nav-symbol">⌂</span> Лобі<span className="nav-count">01</span>
          </button>
          <button className={screen === "battle" ? "nav-link active" : "nav-link"} onClick={() => setScreen("battle")}>
            <span className="nav-symbol">↗</span> Арена <span className="nav-count">02</span>
          </button>
          <button className={screen === "results" ? "nav-link active" : "nav-link"} onClick={() => setScreen("results")}>
            <span className="nav-symbol">▤</span> Результати <span className="nav-count">03</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="online-note"><span className="online-dot" /> 2 481 гравців онлайн</div>
          <button className="profile-mini" onClick={() => setScreen("lobby")}>
            <span className="avatar avatar-player">{player.avatar}</span>
            <span className="profile-copy"><strong>{player.name}</strong><small>Діамантова ліга</small></span>
            <span className="profile-menu">···</span>
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumbs"><span>DUEL ARENA</span><i>/</i><strong>{screen === "lobby" ? "ЛОБІ" : screen === "battle" ? "БАТЛ" : "ПІДСУМКИ"}</strong></div>
          <div className="topbar-right">
            <button className="connection" onClick={() => setDisconnected(true)} aria-label="Показати стан з'єднання">
              <span className="online-dot" /> З&apos;єднання стабільне
            </button>
            <span className="top-divider" />
            <span className="currency"><span className="coin">✦</span> 2 450</span>
            <span className="energy"><span>ϟ</span> 8/10</span>
          </div>
        </header>

        {screen === "lobby" && (
          <div className="page-content lobby-page" id="lobby">
            <div className="page-kicker"><span className="kicker-line" /> МАЙДАНЧИК ЗМАГАНЬ <span className="kicker-index">№ 001</span></div>
            <div className="lobby-heading">
              <div><h1>Твій хід<span className="heading-period">.</span></h1><p>Обери режим. Перевір, на що здатен сьогодні.</p></div>
              <div className="rating-chip"><span className="rating-icon">✳</span><span><small>ПОТОЧНИЙ РЕЙТИНГ</small><strong>{player.rating.toLocaleString("uk-UA")} <em>+24</em></strong></span></div>
            </div>

            <section className="mode-section">
              <div className="section-heading"><h2>Обери формат</h2><span>01 <i>/</i> 03</span></div>
              <div className="mode-grid">
                {modes.map((item) => (
                  <button key={item.id} className={`mode-card ${mode === item.id ? "selected" : ""}`} onClick={() => setMode(item.id)}>
                    <span className="mode-number">{item.icon}</span>
                    <span className="mode-arrow">↗</span>
                    <strong>{item.label}</strong><small>{item.hint}</small>
                    <span className="mode-select" aria-hidden="true">{mode === item.id ? "✓" : "+"}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="category-section">
              <div className="section-heading"><h2>Тема раунду</h2><span>ОБЕРИ СВОЮ СИЛЬНУ СТОРОНУ</span></div>
              <div className="category-list" aria-label="Категорії запитань">
                {categories.map((item, index) => (
                  <button key={item} className={`category-chip ${category === item ? "chosen" : ""}`} onClick={() => setCategory(item)}>
                    {index === 0 && <span className="category-spark">✳</span>}{item}
                  </button>
                ))}
              </div>
            </section>

            <section className="queue-panel">
              <div className="queue-copy"><span className="queue-eyebrow"><span className="online-dot" /> ЧЕРГА ВІДКРИТА</span><h2>Знайдеться гідний?</h2><p>Середній час пошуку — менше 20 секунд.</p></div>
              <div className="queue-visual" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit-core">VS</span><span className="orbit-cross">+</span><span className="orbit-spark">✳</span></div>
              <div className="queue-action"><span className="queue-range">MMR <b>1 700 — 1 950</b></span><button className="primary-button" onClick={startSearch}>{mode === "friends" ? "Створити кімнату" : mode === "arena" ? "Увійти в турнір" : "Знайти суперника"}<span>↗</span></button></div>
            </section>

            <section className="lower-grid">
              <div className="recent-panel"><div className="panel-title"><h2>Останній бій</h2><span>28 хв тому</span></div><div className="recent-match"><span className="avatar avatar-opponent">І</span><div className="recent-versus"><strong>pixel.pilot</strong><small>Перемога <b>3 : 2</b></small></div><span className="recent-rating">+24 <small>MMR</small></span><span className="recent-arrow">↗</span></div></div>
              <div className="streak-panel"><div className="streak-flame">✳</div><div><small>НАЙКРАЩА СЕРІЯ</small><strong>4 <span>перемоги</span></strong></div><span className="streak-bars"><i /><i /><i /><i /><i /></span></div>
            </section>
          </div>
        )}

        {screen === "battle" && (
          <div className="page-content battle-page">
            <div className="battle-topline"><button className="text-button" onClick={resetToLobby}>← До лобі</button><div className="live-tag"><span /> LIVE MATCH</div><span className="match-code">ДУЕЛЬ № 8F2A</span></div>
            <section className="versus-board">
              <div className="combatant"><span className="avatar avatar-player">{player.avatar}</span><div className="combatant-info"><strong>{player.name}</strong><small>🇺🇦 <span>РІВЕНЬ 18</span></small></div><div className="combatant-score"><small>РАХУНОК</small><strong>{score}</strong></div></div>
              <div className="round-status"><span>РАУНД</span><strong>0{questionIndex + 1}<i>/</i>0{questions.length}</strong><div className="round-track">{questions.map((item, index) => <i key={item.category} className={index < questionIndex ? "done" : index === questionIndex ? "current" : ""} />)}</div></div>
              <div className="combatant opponent-combatant"><div className="combatant-score"><small>РАХУНОК</small><strong>{460 + questionIndex * 320}</strong></div><div className="combatant-info"><strong>{opponent.name}</strong><small>🇵🇱 <span>РІВЕНЬ 21</span></small></div><span className="avatar avatar-opponent">{opponent.avatar}</span></div>
            </section>
            <div className="question-meta"><span>{question.category}</span><span className="difficulty">{question.difficulty}</span><span className="question-timer"><i /> 00:12</span></div>
            <section className="question-card"><span className="question-number">ЗАПИТАННЯ 0{questionIndex + 1} <i>—</i> 03</span><h1>{question.text}</h1><div className="answer-grid">{question.options.map((option, index) => {
              const isCorrect = selectedAnswer !== null && index === question.answer;
              const isWrong = selectedAnswer === index && index !== question.answer;
              return <button key={option} className={`answer-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => submitAnswer(index)} disabled={selectedAnswer !== null}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span><span className="answer-mark">{isCorrect ? "✓" : isWrong ? "×" : "↗"}</span></button>;
            })}</div><div className="question-footer"><span>{selectedAnswer === null ? "Суперник думає над відповіддю…" : selectedAnswer === question.answer ? "Влучно! +320 очок" : `Правильна відповідь: ${question.options[question.answer]}`}<i className={selectedAnswer === null ? "thinking-dot" : ""} /></span><button className="primary-button next-question" onClick={nextQuestion} disabled={selectedAnswer === null}>{questionIndex === questions.length - 1 ? "До результатів" : "Наступне запитання"}<span>↗</span></button></div></section>
            <div className="battle-footnote"><span>✳ СЕРІЯ ВІДПОВІДЕЙ <b>{correctCount > 1 ? `×${(1 + correctCount / 10).toFixed(1)}` : "×1.0"}</b></span><span>Відповідь суперника зафіксовано <i className="online-dot" /></span></div>
          </div>
        )}

        {screen === "results" && (
          <div className="page-content results-page">
            <div className="page-kicker"><span className="kicker-line" /> МАТЧ ЗАВЕРШЕНО <span className="kicker-index">№ 8F2A</span></div>
            <div className="result-heading"><span className="result-overline">ГАРНО ЗІГРАНО</span><h1>{correctCount >= 2 ? "Це твоя арена" : "Ще буде реванш"}<span className="heading-period">.</span></h1><p>{correctCount >= 2 ? "Точність і холодна голова зробили своє." : "Кожен раунд — ще один шанс стати сильнішим."}</p></div>
            <section className="scoreboard"><div className="score-player"><span className="avatar avatar-player">{player.avatar}</span><strong>{player.name}</strong><small>🇺🇦 ТИ</small></div><div className="final-score"><span>{score.toLocaleString("uk-UA")}</span><i>:</i><span>1 100</span><small>ФІНАЛЬНИЙ РАХУНОК</small></div><div className="score-player rival"><span className="avatar avatar-opponent">{opponent.avatar}</span><strong>{opponent.name}</strong><small>🇵🇱 СУПЕРНИК</small></div></section>
            <section className="result-stats"><div><small>ТОЧНІСТЬ</small><strong>{answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0}<i>%</i></strong><span>{correctCount} з {answeredCount} відповідей</span></div><div><small>РЕЙТИНГ</small><strong className="rating-up">+24</strong><span>Тепер {player.rating + 24} MMR</span></div><div><small>ДОСВІД</small><strong>+180 <i>XP</i></strong><span>Ще 320 XP до рівня 19</span></div><div><small>НАГОРОДА</small><strong>+65 <i>✦</i></strong><span>Монети нараховано</span></div></section>
            <section className="result-actions"><button className="primary-button" onClick={startBattle}>Реванш<span>↗</span></button><button className="secondary-button" onClick={resetToLobby}>Наступний бій</button><button className="text-button review-button" onClick={() => setReviewOpen(true)}>Розбір запитань <span>↗</span></button></section>
            <div className="result-note"><span className="online-dot" /> Статистика збережена у твоїй історії матчів <span>·</span> 01:42</div>
          </div>
        )}

        <footer className="app-footer"><span>DUEL ARENA <i>©</i> 2026</span><span>ЗІГРАЙ РОЗУМНО. ЗІГРАЙ ЧЕСНО.</span><button onClick={() => setDisconnected(true)}>ПОТРІБНА ДОПОМОГА?</button></footer>
      </section>

      {(searching || matchFound || roomOpen) && <div className="modal-backdrop"><section className="match-modal" role="dialog" aria-modal="true" aria-labelledby="match-title"><button className="modal-close" onClick={() => { setSearching(false); setMatchFound(false); setRoomOpen(false); }}>×</button>{searching ? <><div className="search-radar"><span /><span /><b>VS</b></div><span className="modal-kicker">ПОШУК СУПЕРНИКА</span><h2 id="match-title">Підбираємо пару</h2><p>Шукаємо гравця поблизу твого рейтингу.</p><div className="search-progress"><i /></div><button className="secondary-button" onClick={() => setSearching(false)}>Скасувати пошук</button></> : roomOpen ? <><span className="modal-kicker">ПРИВАТНА КІМНАТА</span><h2 id="match-title">Твій код запрошення</h2><p>Поділись ним із другом, щоб почати дуель.</p><div className="room-code">DUEL-4821 <button onClick={(event) => { event.currentTarget.textContent = "✓"; }}>⧉</button></div><button className="primary-button modal-primary" onClick={startBattle}>Почати тестовий матч<span>↗</span></button></> : <><span className="modal-kicker">СУПЕРНИКА ЗНАЙДЕНО</span><h2 id="match-title">Час грати.</h2><p>Рейтингова дуель · {category === "Усе" ? "Загальний мікс" : category}</p><div className="matchup"><div><span className="avatar avatar-player">{player.avatar}</span><strong>{player.name}</strong><small>{player.rating} MMR</small></div><b>VS</b><div><span className="avatar avatar-opponent">{opponent.avatar}</span><strong>{opponent.name}</strong><small>{opponent.rating} MMR · win {opponent.winRate}</small></div></div><button className="primary-button modal-primary" onClick={startBattle}>На арену<span>↗</span></button></>}</section></div>}

      {reviewOpen && <div className="modal-backdrop"><section className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title"><button className="modal-close" onClick={() => setReviewOpen(false)}>×</button><span className="modal-kicker">ПІСЛЯМАТЧЕВИЙ РОЗБІР</span><h2 id="review-title">Що запам&apos;ятати</h2>{questions.map((item, index) => <div className="review-item" key={item.category}><span>0{index + 1}</span><div><small>{item.category}</small><strong>{item.text}</strong><p>Правильна відповідь: <b>{item.options[item.answer]}</b></p></div></div>)}<button className="secondary-button" onClick={() => setReviewOpen(false)}>Закрити розбір</button></section></div>}

      {disconnected && <div className="modal-backdrop"><section className="connection-modal" role="dialog" aria-modal="true" aria-labelledby="connection-title"><button className="modal-close" onClick={() => setDisconnected(false)}>×</button><span className="connection-warning">!</span><span className="modal-kicker">СТАН З&apos;ЄДНАННЯ</span><h2 id="connection-title">Зв&apos;язок стабільний</h2><p>Цей індикатор демонструє стан з&apos;єднання у прототипі. Ігровий сервер не підключено.</p><button className="primary-button modal-primary" onClick={() => setDisconnected(false)}>Зрозуміло<span>✓</span></button></section></div>}
    </main>
  );
}
