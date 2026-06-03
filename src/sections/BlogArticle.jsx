import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../constants/index.js';

const renderBlock = (block, index) => {
  const key = `${block.type || block.heading}-${index}`;

  if (!block.type && block.heading) {
    return (
      <section key={key} className="article-block">
        <h2>{block.heading}</h2>
        <p>{block.body}</p>
      </section>
    );
  }

  switch (block.type) {
    case 'heading':
      return <h2 key={key} className="article-heading">{block.heading}</h2>;
    case 'paragraph':
      return <p key={key} className="article-paragraph">{block.body}</p>;
    case 'image':
      return (
        <figure key={key} className="article-figure">
          <img src={block.src} alt={block.alt || ''} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'code':
      return (
        <div key={key} className="article-code">
          <div className="article-codebar">
            <span>{block.language || 'code'}</span>
            <span>copy</span>
          </div>
          <pre>
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case 'quote':
      return <blockquote key={key} className="article-quote">{block.body}</blockquote>;
    case 'list':
      return (
        <ul key={key} className="article-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <aside key={key} className="article-callout">
          <span aria-hidden="true">!</span>
          <p>{block.body}</p>
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
    <section className="c-space min-h-screen pt-36 article-route">
      <article className="article-page editorial-page">
        <Link to="/blog" className="article-link rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-sm font-semibold text-sky-200">
          &lt;- All articles
        </Link>

        <header className="article-header">
          <div className="section-pill cool-pill">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            Article
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            <span>{post.date}</span>
            <span>/</span>
            <span>{post.readTime}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="editorial-tag">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="article-hero">
          <img src={post.image} alt={post.title} />
        </div>

        <div className="article-body">
          {post.content.map(renderBlock)}

          <div className="article-callout">
            <span aria-hidden="true">+</span>
            <p>
              This page can now render headings, paragraphs, images, code snippets, quotes, lists, and callouts from the blog content data.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default BlogArticle;
