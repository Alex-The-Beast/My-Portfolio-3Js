import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="c-space pb-36 pt-10">
      <div className="rounded-lg border border-cyan-300/15 bg-white/[0.025] px-5 py-6 backdrop-blur-xl sm:px-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Gaurav</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white-500">
              Building modern web products with MERN, motion, and interactive 3D details.
            </p>
          </div>

          <div className="flex gap-3">
            <a href="https://github.com/Alex-The-Beast" className="social-icon" aria-label="GitHub">
              <img src="/assets/github.svg" alt="" className="h-1/2 w-1/2" />
            </a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
              <img src="/assets/twitter.svg" alt="" className="h-1/2 w-1/2" />
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <img src="/assets/instagram.svg" alt="" className="h-1/2 w-1/2" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cyan-300/15 pt-5 text-sm text-white-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Gaurav. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/#home" className="transition hover:text-cyan-200">Home</Link>
            <Link to="/work" className="transition hover:text-cyan-200">Work</Link>
            <Link to="/updates" className="transition hover:text-cyan-200">Updates</Link>
            <Link to="/blog" className="transition hover:text-cyan-200">Blog</Link>
            <Link to="/contact" className="transition hover:text-cyan-200">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
