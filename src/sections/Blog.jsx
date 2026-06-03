import { Link } from 'react-router-dom';
import { blogPosts } from '../constants/index.js';

const Blog = ({ isPage = false }) => {
  return (
    <section className={`c-space ${isPage ? 'min-h-screen pt-36' : 'my-24 scroll-mt-24'}`} id="blog">
      <div className="blog-shell editorial-blog-shell">
        <div className="flex flex-col gap-8 border-b border-zinc-800 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="section-pill blog-pill">
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
            <Link to="/blog" className="article-link group w-fit rounded-md border border-emerald-300/20 bg-emerald-400/[0.06] px-5 py-3 text-sm font-semibold text-emerald-100">
              View all articles
              <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
            </Link>
          )}
        </div>

        <div className="divide-y divide-zinc-800">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-row editorial-blog-row group">
              <Link to={post.href} className="blog-thumb">
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
                <Link to={post.href} className="article-link mt-6 inline-flex text-sm font-semibold text-emerald-300">
                  Read more <span>-&gt;</span>
                </Link>
              </div>

              <div className="flex shrink-0 flex-wrap items-end justify-start gap-2 md:max-w-44 md:justify-end">
                {post.tags.map((tag) => (
                  <span key={tag} className="editorial-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
