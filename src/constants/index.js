const navLinks = [
    {
      id: 1,
      name: "Experiences",
      type: "finder",
    },
    {
      id: 3,
      name: "Contact",
      type: "contact",
    },
    {
      id: 4,
      name: "Resume",
      type: "resume",
    },
  ];
  
  const navIcons = [
    {
      id: 1,
      img: "/icons/wifi.svg",
      type: "wifi",
    },
    {
      id: 2,
      img: "/icons/search.svg",
      type: "spotlight",
    },
    {
      id: 3,
      img: "/icons/user.svg",
      type: "profile",
    },
    {
      id: 4,
      img: "/icons/mode.svg",
      type: "mode",
    },
  ];

  const wifiNetworks = {
    personalHotspots: [
      {
        id: "manan-hotspot",
        name: "Manan's Hotspot",
        kind: "hotspot",
        signal: 3,
        cellular: "5G",
        battery: 0.9,
      },
    ],
    knownNetworks: [
      {
        id: "arpita-iphone",
        name: "404 Network Not Found",
        kind: "wifi",
        locked: true,
        signal: 3,
      },
      {
        id: "ghosla-guest",
        name: "FBI Surveillance Van 4",
        kind: "wifi",
        locked: true,
        signal: 2,
      },
      {
        id: "coffee-shop",
        name: "Wu Tang LAN",
        kind: "wifi",
        locked: true,
        signal: 2,
      },
    ],
  };
  
  const dockApps = [
    {
      id: "finder",
      name: "Portfolio", // was "Finder"
      icon: "finder.png",
      canOpen: true,
    },
    {
      id: "safari",
      name: "Articles", // was "Safari"
      icon: "safari.png",
      canOpen: true,
    },
    {
      id: "photos",
      name: "Gallery", // was "Photos"
      icon: "photos.png",
      canOpen: true,
    },
    {
      id: "contact",
      name: "Contact", // or "Get in touch"
      icon: "contact.png",
      canOpen: true,
    },
    {
      id: "terminal",
      name: "Skills", // was "Terminal"
      icon: "terminal.png",
      canOpen: true,
    },
    {
      id: "trash",
      name: "Archive", // was "Trash"
      icon: "trash.png",
      canOpen: false,
    },
  ];
  
  const blogPosts = [
    {
      id: 1,
      date: "Sep 2, 2025",
      title:
        "TypeScript Explained: What It Is, Why It Matters, and How to Master It",
      image: "/images/blog1.png",
      link: "https://jsmastery.com/blog/typescript-explained-what-it-is-why-it-matters-and-how-to-master-it",
    },
    {
      id: 2,
      date: "Aug 28, 2025",
      title: "The Ultimate Guide to Mastering Three.js for 3D Development",
      image: "/images/blog2.png",
      link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-three-js-for-3d-development",
    },
    {
      id: 3,
      date: "Aug 15, 2025",
      title: "The Ultimate Guide to Mastering GSAP Animations",
      image: "/images/blog3.png",
      link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-gsap-animations",
    },
  ];
  
  const techStack = [
    {
      category: "Frontend",
      items: ["React.js", "Next.js", "TypeScript"],
    },
    {
      category: "Mobile",
      items: ["React Native", "Expo"],
    },
    {
      category: "Styling",
      items: ["Tailwind CSS", "Sass", "CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "NestJS", "Hono"],
    },
    {
      category: "Database",
      items: ["MongoDB", "PostgreSQL"],
    },
    {
      category: "Dev Tools",
      items: ["Git", "GitHub", "Docker"],
    },
  ];
  
  const socials = [
    {
      id: 1,
      text: "Github",
      icon: "/icons/github.svg",
      bg: "#f4656b",
      link: "https://github.com/Mag548/",
    },
    {
      id: 2,
      text: "Photography",
      icon: "/icons/atom.svg",
      bg: "#4bcb63",
      link: "https://google.com/",
    },
    {
      id: 3,
      text: "Instagram",
      icon: "/icons/twitter.svg",
      bg: "#ff866b",
      link: "https://www.instagram.com/manan_548/?hl=en",
    },  
    {
      id: 4,
      text: "LinkedIn",
      icon: "/icons/linkedin.svg",
      bg: "#05b6f6",
      link: "https://www.linkedin.com/in/manan-goswami-684b5595/",
    },
  ];
  
  const photosLinks = [
    {
      id: 1,
      icon: "/icons/gicon1.svg",
      title: "Library",
      photos: [
        { id: 1, name: "Photo 1", imageUrl: "/images/gal1.png" },
        { id: 2, name: "Photo 2", imageUrl: "/images/gal2.png" },
        { id: 3, name: "Photo 3", imageUrl: "/images/gal3.png" },
        { id: 4, name: "Photo 4", imageUrl: "/images/gal4.png" },
      ],
    },
    {
      id: 2,
      icon: "/icons/gicon2.svg",
      title: "Memories",
      photos: [],
    },
    {
      id: 3,
      icon: "/icons/file.svg",
      title: "Places",
      photos: [],
    },
    {
      id: 4,
      icon: "/icons/gicon4.svg",
      title: "People",
      photos: [],
    },
    {
      id: 5,
      icon: "/icons/gicon5.svg",
      title: "Favorites",
      photos: [],
    },
  ];
  
  export {
    navLinks,
    navIcons,
    wifiNetworks,
    dockApps,
    blogPosts,
    techStack,
    socials,
    photosLinks,
  };
  
  const EXPERIENCES_LOCATION = {
    id: 1,
    type: "experiences",
    name: "Experiences",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
      // ▶ JA Canada
      {
        id: 5,
        name: "VP of Technology — JA Canada",
        icon: "/images/folder.png",
        kind: "folder",
        position: "top-10 left-5",
        windowPosition: "top-[5vh] left-5",
        children: [
          {
            id: 1,
            name: "JA Canada Experience.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-6 left-6",
            subtitle: "Vice President of Technology · Internship",
            description: [
              "JA Canada · Nov 2025 – Jul 2026 · 9 mos · Burlington, Ontario · Hybrid",
              "Elected Vice President of Technology for a student-run startup of 25 students after pitching the product concept that was ultimately selected from over 25 competing ideas. Led the company's technological initiatives, including website development, digital marketing, product technology integration, and cross-functional collaboration with marketing, finance, and operations teams.",
              "• Developed and launched the company website, creating a centralized platform for brand awareness, product information, and customer engagement.",
              "• Led content creation, video editing, and digital marketing initiatives that helped QuickFix become the first JA Ontario company to reach 300, 500, and 800 Instagram followers.",
              "• Proposed and helped implement NFC technology within the product, creating an interactive user experience and strengthening the product's value proposition.",
              "• Utilized CAD software to create product prototypes that demonstrated feasibility, supported product selection, and guided design decisions throughout development.",
              "• Awarded the Leadership in Technology Award for innovation, technical leadership, and contributions to company growth.",
              "Key Skills: Technology Leadership, Web Development, Digital Marketing, Content Creation, CAD Design, Product Development, Team Leadership, Entrepreneurship, Social Media Strategy",
            ],
          },
          {
            id: 2,
            name: "ja-canada.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-8 left-52",
            imageUrl: "/images/ja-canada.webp",
          },
          {
            id: 3,
            name: "QuickFix.glb",
            icon: "/images/plain.png",
            kind: "file",
            fileType: "glb",
            position: "top-6 right-10",
            modelUrl: "/models/ja-canada.glb",
            placeholderSrc: "/images/project-1.png",
          },
          {
            id: 4,
            name: "Our-Team.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-48 left-10",
            imageUrl: "/images/our-team.jpg",
          },
          {
            id: 5,
            name: "the-product.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-52 left-56",
            imageUrl: "/images/the-product.jpg",
          },
          {
            id: 6,
            name: "quickfix.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-44 right-14",
            imageUrl: "/images/quickfix.png",
          },
        ],
      },

      // ▶ Volvo Cars
      {
        id: 6,
        name: "Assistant Technician — Volvo Cars",
        icon: "/images/folder.png",
        kind: "folder",
        position: "top-52 right-80",
        windowPosition: "top-[20vh] left-7",
        children: [
          {
            id: 1,
            name: "Volvo Cars Experience.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-6 left-6",
            subtitle: "Assistant Technician · Co-op",
            description: [
              "Volvo Cars · Jan 2026 – Jun 2026 · 6 mos · Oakville, Ontario · On-site",
              "Worked alongside Volvo service technicians to assist with vehicle maintenance and repairs. Performed oil changes, tire rotations, tire mounting and balancing, and general vehicle inspections while ensuring work was completed safely and efficiently.",
              "Gained hands-on experience with automotive engineering systems, shop equipment, and dealership service operations while developing strong mechanical, problem-solving, and teamwork skills in a professional environment.",
              "Key Skills: Automotive Service, Mechanical Skills, Problem Solving, Teamwork, Shop Operations",
            ],
          },
          {
            id: 2,
            name: "volvo-cars.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-8 left-52",
            imageUrl: "/images/volvo-cars.jpg",
          },
          {
            id: 3,
            name: "regular-service.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-48 left-10",
            imageUrl: "/images/xc90-repair.png",
          },
          {
            id: 4,
            name: "engine-repair.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-44 right-14",
            imageUrl: "/images/car_engine_repair.png",
          },

        ],
      },

      // ▶ FinNova Hacks
      {
        id: 7,
        name: "Head of Marketing — FinNova Hacks",
        icon: "/images/folder.png",
        kind: "folder",
        position: "top-10 left-80",
        windowPosition: "top-[33vh] left-7",
        children: [
          {
            id: 1,
            name: "FinNova Hacks Experience.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-6 left-6",
            subtitle: "Head of Marketing · Self-employed",
            description: [
              "FinNova Hacks · Jul 2025 – Mar 2026 · 9 mos · Mississauga, Ontario · Hybrid",
              "Led marketing efforts for FinNova Hacks, driving brand visibility and event engagement across digital channels.",
              "Focused on advertising, business marketing, and campaign coordination to grow audience reach and support hackathon recruitment and community building.",
              "Key Skills: Advertising, Business Marketing, Brand Strategy, Social Media, Event Promotion, Communication",
              "Instagram: https://www.instagram.com/finnovahacks/",
            ],
          },
          {
            id: 2,
            name: "finnova-hacks.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-8 left-52",
            imageUrl: "/images/gal2.jpeg",
          },

          {
            id: 3,
            name: "instagram.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-48 left-10",
            imageUrl: "/images/fh1.png",
          },

          {
            id: 4,
            name: "what-is-it?.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-44 right-14",
            imageUrl: "/images/fh2.png",
          },
        ],
      },

      // ▶ Big Brothers Big Sisters
      {
        id: 8,
        name: "Student Mentor — Big Brothers Big Sisters",
        icon: "/images/folder.png",
        kind: "folder",
        position: "top-60 left-20",
        windowPosition: "top-[40vh] left-10",
        children: [
          {
            id: 1,
            name: "BBBS Experience.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-8 left-10",
            subtitle: "Student Mentor · Permanent Part-time",
            description: [
              "Big Brothers Big Sisters of Canada · Sep 2022 – May 2025 · 2 yrs 9 mos · Oakville, Ontario · On-site",
              "Supported elementary and middle school students through weekly homework sessions, helping create a positive learning environment and encouraging academic confidence and independence.",
              "• Mentored students across multiple grade levels, helping improve homework completion and classroom preparedness through one-on-one academic support.",
              "• Facilitated engaging learning activities and study sessions that encouraged participation and strengthened problem-solving skills.",
              "• Built positive relationships with students and families by providing consistent guidance and encouragement throughout the school year.",
              "• Collaborated with fellow mentors and program coordinators to maintain a welcoming and inclusive environment for all participants.",
              "Key Skills: Mentorship, Communication, Leadership, Youth Development, Problem Solving, Teamwork",
            ],
          },
          {
            id: 2,
            name: "bbbs.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-40 right-16",
            imageUrl: "/images/gal1.jpg",
          },
        ],
      },
    ],
  };
  
  const ABOUT_LOCATION = {
    id: 2,
    type: "about",
    name: "About me",
    icon: "/icons/info.svg",
    kind: "folder",
    children: [
      {
        id: 1,
        name: "me.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        position: "top-10 left-5",
        imageUrl: "/images/manan.jpg",
      },
      {
        id: 2,
        name: "casual-me.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        position: "top-28 right-72",
        imageUrl: "/images/adrian-2.jpg",
      },
      {
        id: 3,
        name: "conference-me.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        position: "top-52 left-80",
        imageUrl: "/images/adrian-3.jpeg",
      },
      {
        id: 4,
        name: "about-me.txt",
        icon: "/images/txt.png",
        kind: "file",
        fileType: "txt",
        position: "top-60 left-5",
        subtitle: "Meet the Developer Behind the Site",
        image: "/images/manan.jpg",
        description: [
          "Hey! I'm Manan 👋",
          "I'm a Computer Science and Business student at Wilfrid Laurier University who loves turning ideas into real products. Whether it's developing web applications, exploring AI, or designing intuitive user experiences, I'm always looking for opportunities to learn and build.",
          "Outside of coding, you'll probably find me behind a camera capturing cars and landscapes, on the badminton court, or planning my next project. I enjoy solving problems, collaborating with others, and creating things that make a meaningful impact.",
          "I'm always excited to connect with people who are passionate about technology, entrepreneurship, and building something great together.",
        ],
      },
    ],
  };
  
  const RESUME_LOCATION = {
    id: 3,
    type: "resume",
    name: "Resume",
    icon: "/icons/file.svg",
    kind: "folder",
    children: [
      {
        id: 1,
        name: "Resume.pdf",
        icon: "/images/pdf.png",
        kind: "file",
        fileType: "pdf",
        // you can add `href` if you want to open a hosted resume
        // href: "/your/resume/path.pdf",
      },
    ],
  };
  
  const TRASH_LOCATION = {
    id: 4,
    type: "trash",
    name: "Trash",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: [
      {
        id: 1,
        name: "trash-player.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        position: "top-10 left-10",
        imageUrl: "/images/trash-player.jpeg",
      },
      {
        id: 2,
        name: "trash-artist.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        position: "top-40 left-80",
        imageUrl: "/images/trash-2.webp",
      },
    ],
  };
  
  export const locations = {
    experiences: EXPERIENCES_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
  };
  
  const INITIAL_Z_INDEX = 1000;
  
  const WINDOW_CONFIG = {
    finder: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    model3d: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  };
  
  export { INITIAL_Z_INDEX, WINDOW_CONFIG };