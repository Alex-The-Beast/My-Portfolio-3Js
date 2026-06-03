import { ArrowRight } from 'lucide-react';

const contributionRows = [
  [1, 3, 2, 0, 4, 2, 1, 3, 5, 2, 0, 4, 3, 2, 5, 1, 4, 2, 3, 5, 4, 2, 1, 3],
  [3, 2, 0, 4, 2, 1, 5, 3, 0, 4, 2, 3, 5, 4, 1, 3, 2, 5, 4, 2, 3, 1, 4, 5],
  [4, 1, 3, 2, 5, 4, 2, 0, 3, 5, 1, 4, 2, 5, 3, 4, 1, 2, 5, 3, 4, 2, 5, 1],
  [2, 4, 1, 3, 5, 0, 4, 2, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 4, 2, 3],
  [5, 3, 4, 1, 2, 5, 3, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 2, 4, 1, 3, 5, 4, 2],
  [3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4],
];

const techStack = [
  { name: 'React', src: '/assets/react.svg' },
  { name: 'JavaScript', src: '/assets/js.png' },
  { name: 'TypeScript', src: '/assets/typescript.png' },
  { name: 'Tailwind', src: '/assets/tailwindcss.png' },
  { name: 'Framer', src: '/assets/framer.png' },
  { name: 'Node', src: '/assets/node.jpeg' },
];

const Dashboard = () => {
  return (
    <section className="c-space my-24 scroll-mt-24" id="dashboard">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="section-pill cool-pill">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(251,146,60,0.9)]" />
            Dashboard
          </div>
          <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            A compact view of how I build, learn, and ship.
          </h2>
        </div>
        <p className="max-w-lg text-base leading-8 text-white-600">
          A cool blue themed workspace snapshot with projects, habits, stack, and quick signals from my developer routine.
        </p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card map-card lg:row-span-2">
          <div className="dashboard-chip">Location</div>
          <div className="map-lines" aria-hidden="true" />
          <div className="map-pulse" aria-hidden="true" />
          <div className="relative z-10 mt-auto">
            <p className="text-3xl font-semibold text-white">Jammu</p>
            <p className="mt-2 text-sm text-cyan-100/70">Available for remote collaboration</p>
          </div>
        </article>

        <article className="dashboard-card breath-card lg:col-span-2">
          <div className="max-w-xs">
            <div className="dashboard-icon">B</div>
            <h3 className="mt-8 text-2xl font-semibold text-white">Build Breathing</h3>
            <p className="mt-4 text-base leading-7 text-white-600">
              Focused work blocks, calm interfaces, and steady iteration through every project sprint.
            </p>
          </div>
          <div className="phone-mock" aria-hidden="true">
            <div className="phone-screen">
              <span>9:41</span>
              <strong>Ship #6.10</strong>
              <p>Design, build, refine.</p>
            </div>
          </div>
        </article>

        <article className="dashboard-card music-card">
          <img src="/assets/grid1.png" alt="Latest project preview" className="h-28 w-28 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-semibold text-white-500">Last shipped</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Portfolio refresh</h3>
            <p className="mt-1 text-sm uppercase text-cyan-100/70">React / Tailwind</p>
          </div>
          <div className="ml-auto hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 text-cyan-200 sm:flex">
            +
          </div>
        </article>

        <article className="dashboard-card store-card lg:col-span-2">
          <div className="flex items-center gap-5">
            <div className="store-mark">A</div>
            <div>
              <p className="text-sm text-white-600">Available for</p>
              <h3 className="text-2xl font-semibold text-white">Frontend Projects</h3>
            </div>
          </div>
          <div className="store-cube" aria-hidden="true">+</div>
        </article>

        <article className="dashboard-card typing-card lg:row-span-2">
          <div className="dashboard-chip">Typing speed</div>
          <div className="relative mt-6">
            <span className="absolute -top-8 right-0 text-[9rem] font-black leading-none text-cyan-200/[0.05]">142</span>
            <p className="relative text-7xl font-semibold text-white">142<span className="ml-3 text-2xl">wpm</span></p>
          </div>
          <div className="mt-auto flex flex-wrap gap-5 text-sm font-semibold text-white-600">
            <span>15s</span>
            <span>100%</span>
            <span>EN</span>
          </div>
        </article>

        <a href="#projects" className="dashboard-card discover-card group lg:col-span-2">
          <span>Discover more projects</span>
          <ArrowRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </a>

        <article className="dashboard-card github-card lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="dashboard-chip">Github activity</div>
            <p className="font-semibold text-white">859 contributions in the last year</p>
          </div>
          <div className="mt-7 overflow-hidden">
            <div className="contribution-board">
              {contributionRows.flatMap((row, rowIndex) =>
                row.map((level, columnIndex) => (
                  <span key={`${rowIndex}-${columnIndex}`} className={`contribution-cell level-${level}`} />
                )),
              )}
            </div>
            <div className="contribution-scroll" aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-semibold text-white-600">Last pushed on Friday, May 29th 2026</p>
        </article>

        <article className="dashboard-card stack-card lg:col-span-3">
          <div className="dashboard-chip">Tech stack</div>
          <div className="mt-10 grid grid-cols-3 gap-5 sm:grid-cols-6">
            {techStack.map((tech) => (
              <div key={tech.name} className="tech-badge" title={tech.name}>
                <img src={tech.src} alt={tech.name} />
              </div>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-white">Tech stacks I am familiar with</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white-600">
              Primarily focused on the JavaScript ecosystem, with a growing toolkit for expressive, animated, and production-ready web apps.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
