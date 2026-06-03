import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Info } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogPosts } from '../constants/index.js';

const tagClass = 'inline-flex min-h-7 items-center rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-400';
const articleTextClass = 'text-base leading-8 text-zinc-400';
const blockMotionClass = 'animate-[article-rise_0.45s_ease_both]';

const renderBlock = (block, index) => {
  const key = `${block.type || block.heading}-${index}`;

  if (!block.type && block.heading) {
    return (
      <section key={key} className={blockMotionClass}>
        <h2 className="mt-5 text-2xl font-bold leading-tight text-zinc-100">{block.heading}</h2>
        <p className={articleTextClass}>{block.body}</p>
      </section>
    );
  }

  switch (block.type) {
    case 'heading':
      return <h2 key={key} className={`${blockMotionClass} mt-5 text-2xl font-bold leading-tight text-zinc-100`}>{block.heading}</h2>;
    case 'paragraph':
      return <p key={key} className={`${blockMotionClass} ${articleTextClass}`}>{block.body}</p>;
    case 'image':
      return (
        <figure key={key} className={`${blockMotionClass} my-5 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/70`}>
          <img src={block.src} alt={block.alt || ''} className="block max-h-96 w-full object-cover" />
          {block.caption && <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-zinc-400">{block.caption}</figcaption>}
        </figure>
      );
    case 'code':
      return (
        <div key={key} className={`${blockMotionClass} overflow-hidden rounded-md border border-zinc-800 bg-[#11151f]`}>
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#171b25] px-4 py-2.5 text-xs font-bold uppercase text-teal-200">
            <span>{block.language || 'code'}</span>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <SyntaxHighlighter
            language={block.language || 'text'}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#11151f',
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
            {block.code}
          </SyntaxHighlighter>
        </div>
      );
    case 'quote':
      return <blockquote key={key} className={`${blockMotionClass} border-l-4 border-teal-300/70 bg-zinc-900/70 px-4 py-3 text-base font-semibold leading-7 text-zinc-300`}>{block.body}</blockquote>;
    case 'list':
      return (
        <ul key={key} className={`${blockMotionClass} grid list-disc gap-3 pl-5 text-base leading-7 text-zinc-400 marker:text-teal-300`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <aside key={key} className={`${blockMotionClass} grid grid-cols-[auto_1fr] items-start gap-3 rounded-md border border-teal-300/20 bg-teal-400/[0.06] p-4`}>
          <span className="flex h-6 w-6 items-center justify-center rounded bg-teal-400/15 text-teal-200" aria-hidden="true"><Info className="h-4 w-4" /></span>
          <p className="leading-7 text-zinc-300">{block.body}</p>
        </aside>
      );
    default:
      return null;
  }
};

const BlogArticle = () => {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0];

  return (
    <section className="c-space min-h-screen bg-[#010101] pt-36 pb-24">
      <article className="mx-auto max-w-4xl border-y border-zinc-800/70 bg-black py-6 shadow-[0_26px_90px_rgba(0,0,0,0.24)]">
        <Link to="/blog" className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
          All articles
        </Link>

        <header className="mt-9 border-b border-zinc-800 pb-10">
          <div className="section-pill cool-pill">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            Article
          </div>
          <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight text-zinc-100 sm:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span>{post.date}</span>
            <span>/</span>
            <span>{post.readTime}</span>
            {post.tags.map((tag) => (
              <span key={tag} className={tagClass}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
          <img src={post.image} alt={post.title} className="block max-h-[28rem] w-full object-cover" />
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5">
          {post.content.map(renderBlock)}

          <div className="grid grid-cols-[auto_1fr] items-start gap-3 rounded-md border border-teal-300/20 bg-teal-400/[0.06] p-4">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-teal-400/15 text-teal-200" aria-hidden="true"><Info className="h-4 w-4" /></span>
            <p className="leading-7 text-zinc-300">
              This page can now render headings, paragraphs, images, code snippets, quotes, lists, and callouts from the blog content data.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default BlogArticle;
