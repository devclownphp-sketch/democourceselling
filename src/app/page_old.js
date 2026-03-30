'use client'
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    // --- HERO CANVAS ---
    const heroCanvas = document.getElementById('hero-canvas');
    let heroRequest;
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let W, H, particles = [];

      const resize = () => {
        W = heroCanvas.width = window.innerWidth;
        H = heroCanvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const N = 180;
      for (let i = 0; i < N; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / N);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        particles.push({ phi, theta, speed: 0.0003 + Math.random() * 0.0002, r: 200 + Math.random() * 80 });
      }

      let t = 0;
      const drawHero = () => {
        ctx.clearRect(0, 0, W, H);
        t += 1;
        const cx = W / 2, cy = H / 2;

        particles.forEach((p, i) => {
          const theta = p.theta + t * p.speed;
          const x = cx + p.r * Math.sin(p.phi) * Math.cos(theta);
          const y = cy + p.r * Math.sin(p.phi) * Math.sin(theta) * 0.4;
          const z = p.r * Math.cos(p.phi);
          const scale = (z + p.r) / (2 * p.r);
          const alpha = 0.1 + scale * 0.4;

          ctx.beginPath();
          ctx.arc(x, y, 1.2 * scale + 0.3, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? `rgba(94,234,212,${alpha})` : i % 3 === 1 ? `rgba(129,140,248,${alpha})` : `rgba(255,255,255,${alpha * 0.5})`;
          ctx.fill();
        });
        heroRequest = requestAnimationFrame(drawHero);
      };
      drawHero();
    }

    // --- FEATURED CANVAS ---
    const featCanvas = document.getElementById('featured-canvas');
    let featRequest;
    if (featCanvas) {
      const ctx = featCanvas.getContext('2d');
      let W, H;
      const nodes = [
        { x: 0.5, y: 0.5, label: 'App', color: '#5eead4' },
        { x: 0.2, y: 0.3, label: 'React', color: '#818cf8' },
        { x: 0.8, y: 0.3, label: 'Node', color: '#fb923c' },
        { x: 0.15, y: 0.7, label: 'DB', color: '#5eead4' },
        { x: 0.85, y: 0.7, label: 'API', color: '#818cf8' },
        { x: 0.5, y: 0.15, label: 'Cloud', color: '#fb923c' },
      ];
      const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [2, 5], [1, 3], [2, 4]];
      let t = 0;

      const drawFeat = () => {
        W = featCanvas.width = featCanvas.offsetWidth;
        H = featCanvas.height = featCanvas.offsetHeight;
        if (W === 0 || H === 0) return;
        ctx.clearRect(0, 0, W, H);
        t += 0.01;
        edges.forEach(([a, b]) => {
          const na = nodes[a], nb = nodes[b];
          const x1 = na.x * W, y1 = na.y * H, x2 = nb.x * W, y2 = nb.y * H;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = na.color + '33'; ctx.stroke();
        });
        nodes.forEach((n, i) => {
          const x = n.x * W, y = n.y * H;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = n.color; ctx.fill();
        });
        featRequest = requestAnimationFrame(drawFeat);
      };
      drawFeat();
    }

    // --- OBSERVERS ---
    const countUp = (el, target, suffix, duration) => {
      if (!el) return;
      let startTime = null;
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const val = Math.floor(progress * target);
        el.textContent = val >= 1000000 ? (val / 1000000).toFixed(1) + 'M+' : val >= 1000 ? (val / 1000).toFixed(0) + 'K+' : val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          countUp(document.getElementById('stat1'), 4000000, '', 2000);
          countUp(document.getElementById('stat2'), 120, '+', 1500);
          countUp(document.getElementById('stat3'), 48, '+', 1200);
          countUp(document.getElementById('stat4'), 92, '+', 1800);
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statObserver.observe(statsBar);

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Cleanup
    return () => {
      cancelAnimationFrame(heroRequest);
      cancelAnimationFrame(featRequest);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-[5%] h-16 flex items-center justify-between bg-black/72 backdrop-blur-[20px] border-b border-white/8">
        <div className="font-display text-2xl font-bold bg-gradient-to-r from-[#5eead4] to-[#818cf8] bg-clip-text text-transparent">LearnSphere</div>
        <ul className="flex gap-10 list-none">
          <li><a href="#courses" className="text-sm font-normal text-[#a1a1a6] no-underline transition-colors hover:text-white">Courses</a></li>
          <li><a href="#blog" className="text-sm font-normal text-[#a1a1a6] no-underline transition-colors hover:text-white">Blog</a></li>
          <li><a href="#about" className="text-sm font-normal text-[#a1a1a6] no-underline transition-colors hover:text-white">About</a></li>
        </ul>
        <button className="bg-white text-black border-none rounded-full px-5 py-2 text-sm font-medium transition-all hover:bg-[#5eead4] hover:scale-[1.04] cursor-pointer">Get Started</button>
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-20 px-[5%] relative overflow-hidden" id="home">
        <canvas id="hero-canvas" className="absolute inset-0 w-full h-full opacity-70"></canvas>

        <p className="text-xs font-medium uppercase text-[#5eead4] mb-6 opacity-0 relative z-10" style={{ letterSpacing: '0.2em', animation: 'fadeUp 0.8s 0.2s forwards' }}>Next-gen learning platform</p>
        <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 relative z-10" style={{ letterSpacing: '-0.03em', animation: 'fadeUp 0.8s 0.35s forwards' }}>
          Skills that<br />shape <em className="italic bg-gradient-to-r from-[#5eead4] to-[#818cf8] bg-clip-text text-transparent">tomorrow.</em>
        </h1>
        <p className="text-lg text-[#a1a1a6] max-w-xl leading-relaxed mb-10 opacity-0 relative z-10" style={{ animation: 'fadeUp 0.8s 0.5s forwards' }}>
          Expert-crafted courses in web development, design, cloud, and beyond — built for the way you think.
        </p>
        <div className="flex gap-4 items-center justify-center opacity-0 relative z-10" style={{ animation: 'fadeUp 0.8s 0.65s forwards' }}>
          <button className="bg-white text-black border-none rounded-full px-8 py-3.5 text-base font-medium transition-all hover:bg-[#5eead4] hover:scale-[1.04] cursor-pointer" style={{ letterSpacing: '-0.01em' }}>Explore Courses</button>
          <button className="text-white bg-transparent border border-white/8 rounded-full px-8 py-3.5 text-base font-normal transition-all flex items-center gap-2 backdrop-blur-[10px] hover:border-[#5eead4] hover:text-[#5eead4] hover:scale-[1.04] cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="0.8" />
              <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor" />
            </svg>
            Watch overview
          </button>
        </div>
        <div className="mt-20 border-t border-white/8 pt-10 flex gap-16 items-center justify-center opacity-0 relative z-10 flex-wrap" style={{ animation: 'fadeUp 0.8s 0.8s forwards' }}>
          <div className="text-center">
            <div className="font-display text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white/100 to-[#a1a1a6] bg-clip-text text-transparent" id="stat1">0</div>
            <div className="text-xs text-[#6e6e73] mt-1" style={{ letterSpacing: '0.05em' }}>Students enrolled</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white/100 to-[#a1a1a6] bg-clip-text text-transparent" id="stat2">0</div>
            <div className="text-xs text-[#6e6e73] mt-1" style={{ letterSpacing: '0.05em' }}>Courses & paths</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white/100 to-[#a1a1a6] bg-clip-text text-transparent" id="stat3">0</div>
            <div className="text-xs text-[#6e6e73] mt-1" style={{ letterSpacing: '0.05em' }}>Expert instructors</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white/100 to-[#a1a1a6] bg-clip-text text-transparent" id="stat4">0</div>
            <div className="text-xs text-[#6e6e73] mt-1" style={{ letterSpacing: '0.05em' }}>Countries reached</div>
          </div>
        </div>
      </section>

      <div className="py-4 overflow-hidden border-t border-b border-white/8">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }} id="marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Web Development</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>UI/UX Design</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Cloud Architecture</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Machine Learning</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>DevOps & CI/CD</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Cybersecurity</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Data Science</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Mobile Development</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>Blockchain & Web3</div>
              <div className="text-sm text-[#6e6e73] font-light uppercase flex items-center gap-6 flex-shrink-0" style={{ letterSpacing: '0.1em' }}><div className="w-1 h-1 rounded-full bg-[#5eead4] flex-shrink-0"></div>System Design</div>
            </div>
          ))}
        </div>
      </div>

      <section className="courses-section" id="courses">
        <div className="courses-header reveal">
          <div>
            <p className="section-eyebrow">Courses</p>
            <h2 className="section-title">Learn by building.</h2>
          </div>
          <div className="section-sub">
            From fundamentals to production-grade systems — every course ships a real project.
          </div>
        </div>

        <div className="courses-grid reveal">
          <div className="course-card course-card-featured">
            <div>
              <span className="card-badge badge-teal">⭐ Most Popular</span>
              <h3 className="card-title text-3xl">Full-Stack Web Development</h3>
              <p className="card-desc text-base">
                Go from zero to a deployed full-stack application. Master React, Node.js, PostgreSQL, Docker, and cloud deployment in one comprehensive path.
              </p>
              <div className="card-meta mb-6">
                <span className="card-duration">12 months · 240+ hours</span>
                <span className="card-price price-free">Free</span>
              </div>
              <button className="btn-primary">Start Learning →</button>
            </div>
            <div className="featured-visual">
              <canvas className="featured-canvas" id="featured-canvas"></canvas>
            </div>
          </div>

          <div className="course-card">
            <div className="card-icon icon-purple">🎨</div>
            <span className="card-badge badge-purple">Design</span>
            <h3 className="card-title">UI/UX & Product Design</h3>
            <p className="card-desc">Figma, design systems, user research, and prototyping. Build a pro-grade portfolio.</p>
            <div className="card-meta">
              <span className="card-duration">3 months</span>
              <span className="card-price price-free">Free</span>
            </div>
            <div className="card-arrow">Enroll now →</div>
          </div>

          <div className="course-card">
            <div className="card-icon icon-teal">☁️</div>
            <span className="card-badge badge-teal">Cloud</span>
            <h3 className="card-title">AWS & Cloud DevOps</h3>
            <p className="card-desc">EC2, Lambda, Kubernetes, Terraform, CI/CD pipelines. Prep for AWS Solutions Architect.</p>
            <div className="card-meta">
              <span className="card-duration">4 months</span>
              <span className="card-price text-accent-orange">₹2,499</span>
            </div>
            <div className="card-arrow">Enroll now →</div>
          </div>

          <div className="course-card">
            <div className="card-icon icon-orange">🤖</div>
            <span className="card-badge badge-orange">AI & ML</span>
            <h3 className="card-title">Machine Learning Mastery</h3>
            <p className="card-desc">Python, scikit-learn, PyTorch, LLMs, and real-world model deployment at scale.</p>
            <div className="card-meta">
              <span className="card-duration">6 months</span>
              <span className="card-price text-accent-purple">₹3,999</span>
            </div>
            <div className="card-arrow">Enroll now →</div>
          </div>

          <div className="course-card">
            <div className="card-icon icon-teal">🔐</div>
            <span className="card-badge badge-teal">Security</span>
            <h3 className="card-title">Ethical Hacking & Security</h3>
            <p className="card-desc">Penetration testing, OWASP Top 10, network security, and CEH exam prep.</p>
            <div className="card-meta">
              <span className="card-duration">5 months</span>
              <span className="card-price text-accent-purple">₹4,499</span>
            </div>
            <div className="card-arrow">Enroll now →</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-bg"></div>
        <div className="max-w-lg reveal">
          <p className="section-eyebrow">Why LearnSphere</p>
          <h2 className="section-title">Built different,<br />on purpose.</h2>
        </div>
        <div className="features-grid reveal">
          <div className="feature-item">
            <div className="feature-num">01</div>
            <h3 className="feature-title">Project-first curriculum</h3>
            <p className="feature-desc">Every module ends with a real deliverable. No passive video watching — you ship code.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">02</div>
            <h3 className="feature-title">Expert-reviewed paths</h3>
            <p className="feature-desc">Curriculum designed by engineers from Google, Stripe, Vercel, and top startups.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">03</div>
            <h3 className="feature-title">Lifetime access</h3>
            <p className="feature-desc">Pay once, own forever. Course content updates automatically as tech evolves.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">04</div>
            <h3 className="feature-title">Community & mentors</h3>
            <p className="feature-desc">Live office hours, Discord community, and 1:1 mentorship for premium tracks.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">05</div>
            <h3 className="feature-title">Verified certificates</h3>
            <p className="feature-desc">Blockchain-verified credentials employers trust. Share on LinkedIn in one click.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">06</div>
            <h3 className="feature-title">Mobile-first design</h3>
            <p className="feature-desc">Learn anywhere. Offline mode, micro-lessons, and progress sync across all devices.</p>
          </div>
        </div>
      </section>

      <section className="testimonial-section reveal">
        <blockquote className="testimonial-quote">
          "LearnSphere didn't just teach me to code — it taught me <strong>how engineers think.</strong> I landed my first backend role in 4 months."
        </blockquote>
        <p className="testimonial-author">— Rahul Sharma, Backend Engineer @ Razorpay</p>
      </section>

      <section className="blog-section" id="blog">
        <div className="reveal">
          <p className="section-eyebrow">The Sphere Blog</p>
          <h2 className="section-title">Ideas worth<br />your attention.</h2>
        </div>
        <div className="blog-grid reveal">
          <article className="blog-card">
            <p className="blog-tag">System Design</p>
            <h3 className="blog-title">How Stripe handles 500M transactions per day</h3>
            <p className="blog-excerpt">A deep dive into idempotency keys, distributed locks, and engineering decisions.</p>
            <div className="blog-meta">
              <div className="blog-avatar"></div>
              <span>Arjun Mehta</span>
              <span>·</span>
              <span>8 min read</span>
            </div>
          </article>
          <article className="blog-card">
            <p className="blog-tag">Web Development</p>
            <h3 className="blog-title">React Server Components: what actually changes</h3>
            <p className="blog-excerpt">Beyond the hype — a practical breakdown of RSC in Next.js 2026.</p>
            <div className="blog-meta">
              <div className="blog-avatar bg-linear-to-br from-accent-purple to-accent-orange"></div>
              <span>Priya Nair</span>
              <span>·</span>
              <span>6 min read</span>
            </div>
          </article>
          <article className="blog-card">
            <p className="blog-tag">DevOps</p>
            <h3 className="blog-title">The hidden cost of Kubernetes at small scale</h3>
            <p className="blog-excerpt">When K8s is overkill and when it's not — a clear-eyed look at operational complexity.</p>
            <div className="blog-meta">
              <div className="blog-avatar bg-linear-to-br from-accent-teal to-blue-500"></div>
              <span>Karan Verma</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </article>
        </div>
      </section>

      <div className="cta-section reveal" id="about">
        <p className="section-eyebrow">Start today</p>
        <h2 className="cta-title">Your future self<br />is waiting.</h2>
        <p className="cta-sub">Join 4 million learners who chose to build over browse.</p>
        <div className="cta-actions">
          <button className="btn-primary">Browse All Courses</button>
          <button className="btn-ghost">Read the Blog →</button>
        </div>
      </div>

      <footer>
        <div className="footer-logo">LearnSphere</div>
        <ul className="footer-links">
          <li><a href="#">Courses</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
        <p className="footer-copy">© 2026 LearnSphere. All rights reserved.</p>
      </footer>
    </>
  );
}