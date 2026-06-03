import { learningUpdates } from '../constants/index.js'

const categoryStyles = {
  DSA: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Cloud: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  'AI/ML': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
}

const LatestUpdates = ({ isPage = false }) => {
  const [latestUpdate, ...previousUpdates] = learningUpdates

  return (
    <section id="updates" className={`c-space ${isPage ? 'min-h-screen pt-36 pb-20' : 'my-24 scroll-mt-24'}`}>
      <div className="updates-shell">
        <div className="updates-header">
          <div>
            <div className="section-pill updates-pill">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Latest Updates
            </div>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Daily learning notes I can revise from later.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
              A calm log for DSA, cloud, AI, ML, and anything important enough to revisit. Each entry keeps the useful idea, the detail, and the next revision target in one place.
            </p>
          </div>

          <div className="updates-stats">
            <span>{learningUpdates.length}</span>
            <p>entries tracked</p>
          </div>
        </div>

        <article className="featured-update">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`update-chip ${categoryStyles[latestUpdate.category]}`}>{latestUpdate.category}</span>
            <span className="text-sm text-zinc-500">{latestUpdate.date}</span>
            <span className="rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-zinc-400">
              {latestUpdate.status}
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <h3 className="text-2xl font-semibold leading-tight text-zinc-50">{latestUpdate.title}</h3>
              <p className="mt-4 text-base leading-8 text-zinc-400">{latestUpdate.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {latestUpdate.focus.map((item) => (
                  <span key={item} className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-400">
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <ul className="update-notes">
              {latestUpdate.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="updates-timeline">
          {previousUpdates.map((update) => (
            <article key={update.id} className="timeline-row">
              <div className="timeline-date">{update.date}</div>
              <div className="timeline-card">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`update-chip ${categoryStyles[update.category]}`}>{update.category}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{update.status}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">{update.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{update.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestUpdates
