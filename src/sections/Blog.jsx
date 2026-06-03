import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../constants/index.js';

const Blog = ({ isPage = false }) => {
  return (
    <section className={`c-space bg-[#010101] ${isPage ? 'min-h-screen pt-36 pb-24' : 'my-24 scroll-mt-24 py-10'}`} id="blog">
      <div className="mx-auto max-w-4xl border-y border-zinc-800/70 bg-black py-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-8 border-b border-zinc-800 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="section-pill border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Developer Blog
            </div>
            <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight text-zinc-50 sm:text-4xl">
              Notes from shipping, debugging, and sharpening the craft.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
              Insights from my developer journey: experiments, mistakes, decisions, and lessons I keep taking into new projects.
            </p>
          </div>

          {!isPage && (
            <Link to="/blog" className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-zinc-200 transition hover:text-white">
              View all articles
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="divide-y divide-zinc-800">
          {blogPosts.map((post) => (
            <article key={post.id} className="group grid gap-6 py-8 transition duration-300 hover:translate-x-0.5 hover:opacity-95 md:grid-cols-[minmax(9rem,11.5rem)_minmax(0,1fr)]">
              <Link to={post.href} className="h-52 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 md:h-32">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-sm tracking-wide text-zinc-500">
                  {post.date} <span className="mx-2">.</span> {post.readTime}
                </p>
                <Link to={post.href}>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-100 transition-colors group-hover:text-emerald-200 sm:text-xl">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex min-h-7 items-center rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={post.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 transition hover:text-white">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
