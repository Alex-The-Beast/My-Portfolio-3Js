import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Link as LinkIcon,
  Search,
  ShieldCheck,
  Timer,
  Triangle,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { learningUpdates } from '../data/learningUpdates.js'

const categoryStyles = {
  Learning: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  DSA: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Cloud: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  'AI/ML': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
}

const getCategoryStyle = (category) =>
  categoryStyles[category] || 'border-zinc-500/40 bg-zinc-500/10 text-zinc-200'

const getUpdatePath = (update) => `/updates/${update.slug || update.id}`

const categoryIcons = {
  Learning: BookOpen,
  DSA: Code2,
  Cloud,
  'AI/ML': BrainCircuit,
  Security: ShieldCheck,
  Database,
}

const getCategoryIcon = (category) => categoryIcons[category] || Triangle

const getUpdateSummary = (update) =>
  update.summary ||
  update.blocks?.find((block) => block.type === 'paragraph')?.text ||
  update.blocks?.find((block) => block.type === 'code')?.text ||
  'Open the note to review the full content synced from Notion.'

const getReadTime = (update) => {
  const content = [
    update.title,
    update.summary,
    ...(update.notes || []),
    ...(update.blocks || []).map((block) => block.text || block.caption || ''),
  ].join(' ')
  const words = content.trim().split(/\s+/).filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 180))} min read`
}

const renderUpdateBlock = (block, index) => {
  const key = `${block.type}-${index}-${block.text || block.url || ''}`

  switch (block.type) {
    case 'heading':
      return <h4 key={key} className="update-detail-heading">{block.text}</h4>
    case 'paragraph':
      return <p key={key} className="update-detail-text">{block.text}</p>
    case 'note':
      return <li key={key}>{block.text}</li>
    case 'code':
      return (
        <div key={key} className="update-code">
          <div className="update-codebar">{block.language}</div>
          <SyntaxHighlighter
            language={block.language || 'text'}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#050505',
              fontSize: '0.9rem',
              lineHeight: 1.7,
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              },
            }}
            wrapLongLines
          >
            {block.text}
          </SyntaxHighlighter>
        </div>
      )
    case 'quote':
      return <blockquote key={key} className="update-quote">{block.text}</blockquote>
    case 'callout':
      return <aside key={key} className="update-callout">{block.text}</aside>
    case 'image':
      if (!block.url) return null

      return (
        <figure key={key} className="update-image">
          <img src={block.url} alt={block.caption || 'Learning update visual'} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'image_placeholder':
      return (
        <div key={key} className="update-media-placeholder">
          <span>Image not available</span>
          <p>{block.caption || block.reason || 'Upload a real image in Notion, then run npm run sync:notion again.'}</p>
          {block.notionMediaType && <small>Notion media type: {block.notionMediaType}</small>}
        </div>
      )
    case 'file':
      return (
        <a key={key} href={block.url} className="update-file-link" target="_blank" rel="noreferrer">
          {block.caption || 'Open attached file'}
        </a>
      )
    case 'file_placeholder':
      return (
        <div key={key} className="update-media-placeholder">
          <span>File not available</span>
          <p>{block.caption || block.reason || 'Attach a real file in Notion, then run npm run sync:notion again.'}</p>
          {block.notionMediaType && <small>Notion media type: {block.notionMediaType}</small>}
        </div>
      )
    case 'divider':
      return <hr key={key} className="update-divider" />
    default:
      return null
  }
}

const UpdateCard = ({ update }) => {
  const Icon = getCategoryIcon(update.category)

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return (
    <Link
      to={getUpdatePath(update)}
      className="update-spotlight-card group relative min-h-[31rem] overflow-hidden border border-zinc-800 bg-black p-10 transition duration-300 hover:border-zinc-600 sm:min-h-[34rem]"
      onPointerMove={handlePointerMove}
    >
      <div className="update-card-top relative z-10 flex items-start justify-between gap-5">
        <Icon className="h-12 w-12 text-zinc-100 md:h-14 md:w-14" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-sm font-medium text-zinc-400">{update.date}</span>
      </div>

      <div className="update-card-body relative z-10 mt-20">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`update-chip ${getCategoryStyle(update.category)}`}>{update.category}</span>
          <span className="rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-zinc-500">
            {update.status}
          </span>
        </div>

        <h3 className="mt-7 max-w-sm text-3xl font-semibold leading-tight text-white transition group-hover:text-zinc-100">
          {update.title}
        </h3>
        <p className="mt-5 line-clamp-7 max-w-sm text-base leading-7 text-zinc-500">
          {getUpdateSummary(update)}
        </p>
      </div>

      <div className="update-card-footer absolute inset-x-10 bottom-10 z-10 flex items-center justify-between gap-4">
        <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-300">
          {/* <span className="h-6 w-6 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900" />
          <span className="truncate">Gaurav</span> */}
        </span>
        <ArrowRight className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
      </div>
    </Link>
  )
}

const LatestUpdates = ({ isPage = false }) => {
  const [activeCategory, setActiveCategory] = useState('All Posts')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false)

  const categories = useMemo(
    () => ['All Posts', ...Array.from(new Set(learningUpdates.map((update) => update.category).filter(Boolean)))],
    [],
  )

  const filteredUpdates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return learningUpdates.filter((update) => {
      const matchesCategory = activeCategory === 'All Posts' || update.category === activeCategory
      const searchable = [update.title, update.summary, update.category, update.status, ...(update.notes || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch))
    })
  }, [activeCategory, searchTerm])

  if (!learningUpdates.length) {
    return (
      <section id="updates" className={`c-space bg-black ${isPage ? 'min-h-screen pt-36 pb-20' : 'my-24 scroll-mt-24 py-14'}`}>
        <div className="mx-auto max-w-4xl border border-zinc-800 bg-black p-8">
          <p className="text-zinc-400">No learning updates found yet.</p>
        </div>
      </section>
    )
  }

  const visibleUpdates = isPage ? filteredUpdates : filteredUpdates.slice(0, 3)

  const handleMobileCategorySelect = (category) => {
    setActiveCategory(category)
    setIsMobileCategoryOpen(false)
  }

  return (
    <section
      id="updates"
      className={`c-space bg-black ${isPage ? "updates-page min-h-screen pt-36 pb-24" : "my-24 scroll-mt-24 py-14"}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="updates-heading mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Latest Updates
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Learning Journal
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Synced from Notion and organized into readable notes for DSA, cloud,
              AI, ML, and engineering concepts.
            </p>
          </div>

          {!isPage && learningUpdates.length > 3 && (
            <div className="flex shrink-0 justify-start lg:justify-end">
              <Link
                to="/updates"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:text-white"
              >
                View all notes
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </div>

        <div className="updates-toolbar mb-8 flex flex-row gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="updates-mobile-select">
            <button
              type="button"
              className="updates-mobile-select-button"
              onClick={() => setIsMobileCategoryOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMobileCategoryOpen}
            >
              {activeCategory}
            </button>
          </div>

          {isMobileCategoryOpen && (
            <div
              className="updates-mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filter updates"
            >
              <button
                type="button"
                className="updates-mobile-drawer-backdrop"
                onClick={() => setIsMobileCategoryOpen(false)}
                aria-label="Close filter menu"
              />
              <div className="updates-mobile-drawer-panel">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "is-active" : ""}
                    onClick={() => handleMobileCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isPage && (
            <div className="updates-category-pills flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-200 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          {isPage && (
            <div className="updates-actions flex items-center gap-3">
              <label className="updates-search flex h-11 min-w-0 items-center gap-3 rounded-full border border-zinc-800 bg-black px-4 text-zinc-500 transition focus-within:border-zinc-600 sm:w-72">
                <Search className="h-4 w-4" aria-hidden="true" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search notes"
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 caret-white outline-none placeholder:text-zinc-500"
                />
              </label>
            </div>
          )}
        </div>

        {visibleUpdates.length > 0 ? (
          <div className="updates-vercel-grid">
            {visibleUpdates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        ) : (
          <div className="border border-zinc-800 px-8 py-16 text-center">
            <p className="text-lg font-semibold text-white">No notes found</p>
            <p className="mt-2 text-zinc-500">
              Try another category or search term.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export const UpdateDetail = () => {
  const { updateId } = useParams()
  const [copied, setCopied] = useState(false)
  const update = learningUpdates.find((item) => item.slug === updateId || item.id === updateId)

  const handleCopyUrl = async () => {
    const url = window.location.href

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  if (!update) {
    return (
      <section className="c-space min-h-screen bg-black pt-36 pb-20">
        <div className="mx-auto max-w-4xl border border-zinc-800 bg-black p-8">
          <Link to="/updates" className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-100">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            Back to updates
          </Link>
          <h1 className="mt-8 text-3xl font-semibold text-white">Note not found</h1>
          <p className="mt-3 text-zinc-400">This update may have been removed from Notion or synced with a new ID.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="c-space min-h-screen bg-black pt-28 pb-24">
      <article className="update-detail-page">
        <header className="update-detail-header">
          <Link to="/updates" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            All updates
          </Link>

          <p className="mt-16 text-center text-sm font-medium text-zinc-400">
            Learning / <span className="text-zinc-200">{update.category}</span>
          </p>
          <h1>{update.title}</h1>

          {/* <div className="mt-9 flex flex-col items-center gap-3 text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300">
                G
              </span>
              <span className="font-semibold text-white">Gaurav</span>
              <span className="text-zinc-400">Learning Notes</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300">
                N
              </span>
              <span className="font-semibold text-white">Notion</span>
              <span className="text-zinc-400">Synced source</span>
            </div>
          </div> */}

          <div className="mt-24 grid gap-5 text-sm text-zinc-400 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2">
                <Timer className="h-4 w-4" aria-hidden="true" />
                {getReadTime(update)}
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-2 font-semibold text-sky-400 transition hover:text-sky-300"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <LinkIcon className="h-4 w-4" aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy URL'}
              </button>
              {update.sourceUrl && (
                <a href={update.sourceUrl} className="group inline-flex items-center gap-2 font-semibold text-zinc-400 transition hover:text-zinc-100" target="_blank" rel="noreferrer">
                  Notion
                  <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              )}
            </div>
            <time className="text-zinc-300">{update.date}</time>
          </div>
        </header>

        <div className="update-detail-content">
          {/* {summary && <p className="update-detail-lead">{summary}</p>} */}

          {/* {update.notes?.length > 0 && (
            <ul className="update-notes">
              {update.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )} */}

          {update.blocks?.length > 0 && (
            <div className="update-detail ">
            {update.blocks.map((block, index) => {
              if (block.type !== 'note') return renderUpdateBlock(block, index)

              return null
            })}
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

export default LatestUpdates
