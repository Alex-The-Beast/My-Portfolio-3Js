export const navLinks = [
    {
      id: 1,
      name: 'Home',
      href: '/',
      icon: 'home',
    },
    {
      id: 3,
      name: 'Work',
      href: '/work',
      icon: 'work',
    },
    {
      id: 4,
      name: 'Latest Updates',
      href: '/updates',
      icon: 'updates',
    },
    {
      id: 5,
      name: 'Blog',
      href: '/blog',
      icon: 'blog',
    },
    {
      id: 6,
      name: 'Contact',
      href: '/contact',
      icon: 'contact',
    },
  ];

  export const learningUpdates = [
    {
      id: 1,
      date: 'June 04, 2026',
      title: 'DSA revision: sliding window and two pointers',
      category: 'DSA',
      status: 'In progress',
      summary:
        'Revised fixed-size and variable-size window patterns, then compared them with two pointer problems where the answer depends on sorted input or a shrinking boundary.',
      notes: [
        'Sliding window works best when the active range is contiguous and the state can be updated in O(1).',
        'Two pointers are cleaner when movement is guided by an ordered condition, such as sum too small or too large.',
        'Revision target: solve 5 mixed problems without looking at hints, then write the pattern trigger for each one.',
      ],
      focus: ['arrays', 'patterns', 'revision'],
    },
    {
      id: 2,
      date: 'June 03, 2026',
      title: 'Cloud notes: IAM basics and least privilege',
      category: 'Cloud',
      status: 'Reviewed',
      summary:
        'Mapped users, groups, roles, and policies into a simple mental model for AWS access control. The key idea is to grant only the actions a service or person actually needs.',
      notes: [
        'Roles are better than long-lived access keys for services because credentials can be temporary.',
        'Policies should be read by action, resource, and condition instead of treated as a blob of JSON.',
        'Revision target: create examples for S3 read-only access and EC2 start/stop access.',
      ],
      focus: ['aws', 'iam', 'security'],
    },
    {
      id: 3,
      date: 'June 02, 2026',
      title: 'AI/ML: bias, variance, and model fit',
      category: 'AI/ML',
      status: 'Draft',
      summary:
        'Reviewed why high bias underfits, high variance overfits, and regularization helps control model complexity without manually removing every feature.',
      notes: [
        'Training error and validation error together tell a clearer story than accuracy alone.',
        'Regularization is a constraint on complexity, not a magic improvement button.',
        'Revision target: draw the error curves and explain them in plain language.',
      ],
      focus: ['ml-basics', 'regularization', 'metrics'],
    },
  ];

  export const blogPosts = [
    {
      id: 1,
      slug: 'customize-shadcn-tooltip-arrows',
      title: "Hacky Way to Customize Shadcn's Tooltip Arrows",
      excerpt:
        "A workaround for displaying a custom SVG arrow in shadcn's tooltip, inspired by Radix primitives and small CSS decisions.",
      date: 'December 15, 2024',
      readTime: '5 min read',
      image: '/assets/grid1.png',
      tags: ['react', 'css', 'shadcn'],
      href: '/blog/customize-shadcn-tooltip-arrows',
      content: [
        {
          type: 'paragraph',
          body:
            'Shadcn is a go-to copy-paste component system for React projects. The Tooltip component is built on top of Radix UI, which gives you solid behavior while still letting you own the styling.',
        },
        {
          type: 'heading',
          heading: 'Introduction',
        },
        {
          type: 'paragraph',
          body:
            'The problem starts when a default primitive solves behavior beautifully, but the visual language of your product needs one extra custom detail.',
        },
        {
          type: 'image',
          src: '/assets/grid1.png',
          alt: 'A dark interface card preview',
          caption: 'Keep the interaction primitive intact, then style the visible surface around it.',
        },
        {
          type: 'heading',
          heading: 'Adding Tooltip Arrows',
        },
        {
          type: 'paragraph',
          body:
            'The useful trick is to include the Radix Tooltip Arrow inside the tooltip content and then style it alongside your content surface. That keeps the arrow attached to the primitive instead of faking it with unrelated markup.',
        },
        {
          type: 'code',
          language: 'jsx',
          code: `<Tooltip.Content className="tooltip-content">
  Helpful context
  <Tooltip.Arrow className="tooltip-arrow" />
</Tooltip.Content>`,
        },
        {
          type: 'heading',
          heading: 'Custom SVG Arrow',
        },
        {
          type: 'paragraph',
          body:
            'When the default arrow is not enough, use a small SVG shape or a carefully positioned pseudo-element that shares the same fill and border tone as the tooltip. The result feels native to your theme without fighting the positioning logic.',
        },
        {
          type: 'callout',
          body: 'The best customization is usually the one that keeps accessibility and positioning owned by the original primitive.',
        },
      ],
    },
    {
      id: 2,
      slug: 'dark-ui-that-feels-sharp',
      title: 'Designing Dark UI That Feels Sharp, Not Heavy',
      excerpt:
        'A practical breakdown of spacing, glass layers, contrast, and motion choices for modern developer websites.',
      date: 'May 24, 2026',
      readTime: '4 min read',
      image: '/assets/grid3.png',
      tags: ['design', 'tailwind'],
      href: '/blog/dark-ui-that-feels-sharp',
      content: [
        {
          type: 'heading',
          heading: 'Contrast First',
        },
        {
          type: 'paragraph',
          body:
            'Dark interfaces work best when the hierarchy is built with contrast, spacing, and restrained borders instead of stacking many heavy panels.',
        },
        {
          type: 'list',
          items: [
            'Use one strong accent color for action and focus.',
            'Keep card backgrounds close to black so white text stays sharp.',
            'Let spacing create calm before adding more decoration.',
          ],
        },
        {
          type: 'image',
          src: '/assets/grid3.png',
          alt: 'Dark UI layout preview',
          caption: 'A quiet surface makes blue accents feel intentional instead of loud.',
        },
        {
          type: 'heading',
          heading: 'Motion With Purpose',
        },
        {
          type: 'paragraph',
          body:
            'Small hover states, subtle gradients, and focused reveal effects make the page feel alive while keeping the reading experience calm.',
        },
        {
          type: 'quote',
          body: 'Motion should clarify state, not compete with the content.',
        },
      ],
    },
    {
      id: 3,
      slug: 'idea-to-deployable-mern-product',
      title: 'From Idea to Deployable MERN Product',
      excerpt:
        'The checklist I use to move from rough feature ideas to reliable APIs, polished flows, and a clean launch.',
      date: 'May 10, 2026',
      readTime: '5 min read',
      image: '/assets/grid2.png',
      tags: ['mern', 'workflow'],
      href: '/blog/idea-to-deployable-mern-product',
      content: [
        {
          type: 'heading',
          heading: 'Start With the Flow',
        },
        {
          type: 'paragraph',
          body:
            'Before building the stack, define the core user journey, the data shape, and the smallest reliable release that proves the product idea.',
        },
        {
          type: 'code',
          language: 'js',
          code: `const releasePlan = [
  'define the core user flow',
  'shape the API contract',
  'ship the smallest reliable version',
];`,
        },
        {
          type: 'heading',
          heading: 'Ship the Boring Parts Well',
        },
        {
          type: 'paragraph',
          body:
            'Authentication, validation, loading states, and clear API errors are the details that make a MERN app feel dependable.',
        },
        {
          type: 'callout',
          body: 'A polished product is often a collection of small, dependable decisions repeated across every screen.',
        },
      ],
    },
  ];
  
  export const clientReviews = [
    {
      id: 1,
      name: 'Emily Johnson',
      position: 'Marketing Director at GreenLeaf',
      img: 'assets/review1.png',
      review:
        'Working with Gaurav was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
    },
    {
      id: 2,
      name: 'Mark Rogers',
      position: 'Founder of TechGear Shop',
      img: 'assets/review2.png',
      review:
        'Gaurav’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
    },
    {
      id: 3,
      name: 'John Dohsas',
      position: 'Project Manager at UrbanTech ',
      img: 'assets/review3.png',
      review:
        'I can’t say enough good things about Gaurav. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
    },
    {
      id: 4,
      name: 'Ether Smith',
      position: 'CEO of BrightStar Enterprises',
      img: 'assets/review4.png',
      review:
        'Gaurav was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
    },
  ];
  
  export const myProjects = [
    {
      title: "Arnav's Blog - A Chatting Platform",
      desc: "Arnav's Blog is a revolutionary Software-as-a-Service platform that transforms the way of chatting. With advanced AI-powered features like text-to-multiple-voices functionality, it allows creators to generate diverse voiceovers from a single text input.",
      subdesc:
        'Built as a unique Software-as-a-Service app with React.js, Tailwind CSS, JavaScript, Socket.io, Express, Mongodb, Arnavs Blog is designed for optimal performance and scalability.',
      href: 'https://github.com/Alex-The-Beast/mern-blog',
      texture: '/textures/project/project1.mp4',
      logo: '/assets/project-logo1.png',
      logoStyle: {
        backgroundColor: '#2A1816',
        border: '0.2px solid #36201D',
        boxShadow: '0px 0px 60px 0px #AA3C304D',
      },
      spotlight: '/assets/spotlight1.png',
      tags: [
        {
          id: 1,
          name: 'React.js',
          path: '/assets/react.svg',
        },
        {
          id: 2,
          name: 'TailwindCSS',
          path: 'assets/tailwindcss.png',
        },
        {
          id: 3,
          name: 'JavaScript',
          path: '/assets/js.png',
        },
        {
          id: 4,
          name: 'Node js',
          path: '/assets/node.jpeg',
        },
      ],
    },
    {
      title: 'Weather App - Real-Time Weather update of Different Location ',
      desc: 'Weather App is a powerful collaborative app that elevates the capabilities of real-time Weather information. As an enhanced version of weather app, It supports millions of collaborators simultaneously, ensuring that every change is captured instantly and accurately.',
      subdesc:
        'With Weather App, users can experience the future of collaboration, where multiple contributors work together in real time without any lag, by using Next.js and Liveblocks newest features.',
      href: 'https://github.com/Alex-The-Beast/mern-blog',
      texture: '/textures/project/project2.mp4',
      logo: '/assets/project-logo2.png',
      logoStyle: {
        backgroundColor: '#13202F',
        border: '0.2px solid #17293E',
        boxShadow: '0px 0px 60px 0px #2F6DB54D',
      },
      spotlight: '/assets/spotlight2.png',
      tags: [
        {
          id: 1,
          name: 'React.js',
          path: '/assets/react.svg',
        },
        {
          id: 2,
          name: 'TailwindCSS',
          path: 'assets/tailwindcss.png',
        },
        {
          id: 3,
          name: 'TypeScript',
          path: '/assets/typescript.png',
        },
        {
          id: 4,
          name: 'Framer Motion',
          path: '/assets/framer.png',
        },
      ],
    },
    {
      title: 'CarePulse - Health Management System',
      desc: 'An innovative healthcare platform designed to streamline essential medical processes. It simplifies patient registration, appointment scheduling, and medical record management, providing a seamless experience for both healthcare providers and patients.',
      subdesc:
        'With a focus on efficiency, CarePulse integrantes complex forms and SMS notifications, by using Next.js, Appwrite, Twillio and Sentry that enhance operational workflows.',
        href: 'https://github.com/Alex-The-Beast/mern-blog',
      texture: '/textures/project/project3.mp4',
      logo: '/assets/project-logo3.png',
      logoStyle: {
        backgroundColor: '#60f5a1',
        background:
          'linear-gradient(0deg, #60F5A150, #60F5A150), linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(208, 213, 221, 0.8) 100%)',
        border: '0.2px solid rgba(208, 213, 221, 1)',
        boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
      },
      spotlight: '/assets/spotlight3.png',
      tags: [
        {
          id: 1,
          name: 'React.js',
          path: '/assets/react.svg',
        },
        {
          id: 2,
          name: 'TailwindCSS',
          path: 'assets/tailwindcss.png',
        },
        {
          id: 3,
          name: 'TypeScript',
          path: '/assets/typescript.png',
        },
        {
          id: 4,
          name: 'Framer Motion',
          path: '/assets/framer.png',
        },
      ],
    },
    {
      title: 'Horizon - Online Banking Platform',
      desc: 'Horizon is a comprehensive online banking platform that offers users a centralized finance management dashboard. It allows users to connect multiple bank accounts, monitor real-time transactions, and seamlessly transfer money to other users.',
      subdesc:
        'Built with Next.js 14 Appwrite, Dwolla and Plaid, Horizon ensures a smooth and secure banking experience, tailored to meet the needs of modern consumers.',
        href: 'https://github.com/Alex-The-Beast/mern-blog',
      texture: '/textures/project/project4.mp4',
      logo: '/assets/project-logo4.png',
      logoStyle: {
        backgroundColor: '#0E1F38',
        border: '0.2px solid #0E2D58',
        boxShadow: '0px 0px 60px 0px #2F67B64D',
      },
      spotlight: '/assets/spotlight4.png',
      tags: [
        {
          id: 1,
          name: 'React.js',
          path: '/assets/react.svg',
        },
        {
          id: 2,
          name: 'TailwindCSS',
          path: 'assets/tailwindcss.png',
        },
        {
          id: 3,
          name: 'TypeScript',
          path: '/assets/typescript.png',
        },
        {
          id: 4,
          name: 'Framer Motion',
          path: '/assets/framer.png',
        },
      ],
    },
    {
      title: 'HealthCare Chatbot - AI Healthcare Chatbot',
      desc: 'An AI-powered healthcare chatbot designed to provide instant medical advice, answer health-related queries, schedule appointments, and offer personalized wellness recommendations.',
      subdesc:
        ' Built with NLP, machine learning, and healthcare APIs, the chatbot ensures real-time responses, secure data handling, and personalized interactions',
      href: 'https://github.com/Alex-The-Beast',
      texture: '/textures/project/project5.mp4',
      logo: '/assets/project-logo5.png',
      logoStyle: {
        backgroundColor: '#1C1A43',
        border: '0.2px solid #252262',
        boxShadow: '0px 0px 60px 0px #635BFF4D',
      },
      spotlight: '/assets/spotlight5.png',
      tags: [
        {
          id: 1,
          name: 'React.js',
          path: '/assets/react.svg',
        },
        {
          id: 2,
          name: 'TailwindCSS',
          path: 'assets/tailwindcss.png',
        },
        {
          id: 3,
          name: 'TypeScript',
          path: '/assets/typescript.png',
        },
        {
          id: 4,
          name: 'Framer Motion',
          path: '/assets/framer.png',
        },
      ],
    },
  ];
  
  export const calculateSizes = (isSmall, isMobile, isTablet) => {
    return {
      deskScale: isSmall ? 0.068 : isMobile ? 0.078 : isTablet ? 0.082 : 0.09,
      deskPosition: isSmall ? [0.2, -4.2, 0] : isMobile ? [0.35, -4.3, 0] : [0.1, -4.9, 0],
      cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
      reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
      ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
      targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
    };
  };
  
  export const workExperiences = [
    {
      id: 1,
      name: 'SMVDU Tech Community',
      pos: 'Junior Web Developer',
      duration: '2024 - Present',
      title: "Building the Future of the Web: A Junior Web Developer's Journey in SMVDU Tech Community, Crafting Responsive, Scalable, and User-Centric Solutions with Modern Web Technologies and Collaborative Innovation",
      icon: '/assets/framer.svg',
      animation: 'victory',
    },
    {
      id: 2,
      name: 'The Future Project',
      pos: 'Data Structure Analyst',
      duration: '2023 - April  2024',
      title: "Mastering Data Structures and Algorithms in Java: A Comprehensive Journey to Efficient Problem-Solving and Optimized Code Development",
      icon: '/assets/figma.svg',
      animation: 'clapping',
    },
    {
      id: 3,
      name: 'SMVDU',
      pos: 'Learner',
      duration: '2023',
      title: "SMVDU: Empowering Students with Holistic Learning, Cutting-Edge Technologies, and Opportunities for Personal and Professional Growth in a Dynamic Environment",
      icon: '/assets/notion.svg',
      animation: 'salute',
    },
  ];
