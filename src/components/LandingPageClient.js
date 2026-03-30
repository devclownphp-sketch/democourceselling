"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";
import { LogoMark, IconComputer, IconPdf, IconQuiz, IconBolt, IconGrad, IconCheck, IconStar, IconChart, IconFree, IconRocket, IconLock, IconPhone, IconTool, IconTrophy, IconMsg, IconTarget, IconClock, IconVideo, IconEdit, IconSparkle, IconBox, IconBook } from "@/components/Icons";

const categories = [
    { icon: <IconComputer size={36} />, title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { icon: <IconPdf size={36} />, title: "PDF Notes", subtitle: "Downloadable study material" },
    { icon: <IconQuiz size={36} />, title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { icon: <IconBolt size={36} />, title: "Computer Tricks", subtitle: "Tips, tricks and shortcuts" },
];
const reviewItems = [
    { name: "Abhijit Patgirri", initial: "A", rating: 5, text: "One of the best platforms to learn for free. Practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", initial: "S", rating: 5, text: "Very useful for students. Courses are full of practical knowledge and help with career growth." },
    { name: "Madhusudan Pal", initial: "M", rating: 5, text: "A true opportunity for students who cannot afford paid classes to build skills and confidence." },
];
const whyUs = [
    { icon: <IconFree size={22} />, text: "100% Free: No hidden costs ever" },
    { icon: <IconPdf size={22} color="#6366f1" />, text: "PDF Notes: Download for quick revision" },
    { icon: <IconRocket size={22} />, text: "No Login: Start learning instantly" },
    { icon: <IconLock size={22} />, text: "Secure: Privacy-first experience" },
    { icon: <IconPhone size={22} />, text: "Call Support: Mon-Sat 10AM-12PM" },
    { icon: <IconTool size={22} />, text: "Project-based Practice for real skills" },
];
const faqs = [
    { q: "LearnSphere kya hai?", a: "Ek online platform jo students ko 100% free computer courses deta hai." },
    { q: "Kya courses sach mein free hain?", a: "Haan, core learning completely free hai." },
    { q: "Course ki language?", a: "Simple Hindi + English style, taki beginners bhi easily follow kar saken." },
];
const stats = [
    { icon: <IconGrad size={28} />, value: "40,25,000+", label: "Students" },
    { icon: <IconCheck size={28} />, value: "Verified", label: "Platform" },
    { icon: <IconStar size={28} />, value: "4.7 / 5", label: "Rating" },
    { icon: <IconChart size={28} />, value: "150k+", label: "Monthly" },
];

function splitLines(t) { return String(t||"").split("\n").map(l=>l.trim()).filter(Boolean); }

/* ── 3D Particle Globe - hover only when cursor is NEAR the hero section ── */
function HeroGlobe() {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w=0, h=0, raf=0, t=0, paused=false;
        let targetRX=0, targetRY=0, rotX=0, rotY=0, isNear=false;
        const N=600;
        const dots = Array.from({length:N},(_,i)=>{
            const phi=Math.acos(1-2*(i+0.5)/N);
            const theta=Math.PI*(1+Math.sqrt(5))*i;
            return {phi,theta,r:155+Math.random()*55,spd:0.0003+Math.random()*0.0002};
        });

        const resize=()=>{w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight;};
        resize();
        window.addEventListener("resize",resize);

        // Only respond when cursor is inside or near the hero section
        const onMouse=(e)=>{
            const rect=section.getBoundingClientRect();
            const pad=80; // 80px proximity zone outside the section
            const inX=e.clientX>=rect.left-pad && e.clientX<=rect.right+pad;
            const inY=e.clientY>=rect.top-pad && e.clientY<=rect.bottom+pad;
            isNear=inX&&inY;
            if(isNear){
                const mx=(e.clientX-rect.left)/rect.width;
                const my=(e.clientY-rect.top)/rect.height;
                targetRY=(mx-0.5)*4.5;
                targetRX=(my-0.5)*3.0;
            }
        };
        window.addEventListener("mousemove",onMouse);

        const onLeave=()=>{isNear=false; targetRX=0; targetRY=0;};
        section.addEventListener("mouseleave",onLeave);

        const onVis=()=>{paused=document.hidden;};
        document.addEventListener("visibilitychange",onVis);

        // Theme colors: indigo / violet / cyan
        const c0=[99,102,241], c1=[139,92,246], c2=[34,211,238];

        const render=()=>{
            if(!paused){
                t++;
                // Lerp faster when near, slower drift back when far
                const spd=isNear?0.12:0.04;
                rotX+=(targetRX-rotX)*spd;
                rotY+=(targetRY-rotY)*spd;
                if(!isNear){targetRX*=0.98;targetRY*=0.98;}

                const sRX=Math.sin(rotX),cRX=Math.cos(rotX);
                const sRY=Math.sin(rotY),cRY=Math.cos(rotY);
                const aS=Math.sin(t*0.004),aC=Math.cos(t*0.004);

                ctx.clearRect(0,0,w,h);
                const cx=w*0.5,cy=h*0.5;

                for(let i=0;i<N;i++){
                    const d=dots[i];
                    const sp=Math.sin(d.phi),cp=Math.cos(d.phi);
                    const th=d.theta+t*d.spd;
                    let px=d.r*sp*Math.cos(th), py=d.r*sp*Math.sin(th), pz=d.r*cp;
                    // auto spin
                    let tx=px*aC-pz*aS, tz=px*aS+pz*aC; px=tx;pz=tz;
                    // mouse Y
                    tx=px*cRY-pz*sRY; tz=px*sRY+pz*cRY; px=tx;pz=tz;
                    // mouse X
                    let ty=py*cRX-pz*sRX; tz=py*sRX+pz*cRX; py=ty;pz=tz;

                    const sc=(pz+d.r)/(2*d.r);
                    const a=0.07+sc*0.7;
                    const sz=0.4+sc*3.2;
                    const col=i%3===0?c0:i%3===1?c1:c2;

                    // glow effect for front particles
                    if(sc>0.6){
                        ctx.shadowBlur=sz*3;
                        ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.3)`;
                    } else {
                        ctx.shadowBlur=0;
                    }

                    ctx.beginPath();
                    ctx.arc(cx+px,cy+py*0.45,sz,0,6.28);
                    ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${a})`;
                    ctx.fill();
                }
                ctx.shadowBlur=0;
            }
            raf=requestAnimationFrame(render);
        };
        render();

        return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("mousemove",onMouse);section.removeEventListener("mouseleave",onLeave);document.removeEventListener("visibilitychange",onVis);};
    },[]);

    return (
        <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
            <canvas ref={canvasRef} className="absolute right-0 top-0 h-full w-[55%] opacity-85 max-md:w-full max-md:opacity-30" />
        </div>
    );
}

/* ── 3D Tilt Card ── */
function Tilt3D({children,className="",intensity=10}){
    const ref=useRef(null);
    const onMove=useCallback((e)=>{
        const el=ref.current; if(!el) return;
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-0.5;
        const y=(e.clientY-r.top)/r.height-0.5;
        el.style.transform=`perspective(600px) rotateX(${-y*intensity}deg) rotateY(${x*intensity}deg) translateZ(8px) scale3d(1.03,1.03,1.03)`;
    },[intensity]);
    const onLeave=useCallback(()=>{
        if(ref.current) ref.current.style.transform="perspective(600px) rotateX(0) rotateY(0) translateZ(0) scale3d(1,1,1)";
    },[]);
    return <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{transition:"transform 0.18s ease-out",willChange:"transform",transformStyle:"preserve-3d"}}>{children}</div>;
}

/* ── Scroll Reveal ── */
function Reveal({children,className="",delay=0,direction="up"}){
    const ref=useRef(null);
    useEffect(()=>{
        const el=ref.current; if(!el) return;
        const obs=new IntersectionObserver(([e])=>{
            if(e.isIntersecting){setTimeout(()=>{el.style.opacity="1";el.style.transform="translate3d(0,0,0) rotateX(0) rotateY(0)";},delay);obs.unobserve(el);}
        },{threshold:0.08});
        obs.observe(el);
        return()=>obs.disconnect();
    },[delay]);
    const init=direction==="left"?"translate3d(-40px,0,0) rotateY(5deg)":direction==="right"?"translate3d(40px,0,0) rotateY(-5deg)":"translate3d(0,35px,-20px) rotateX(5deg)";
    return <div ref={ref} className={className} style={{opacity:0,transform:init,transition:"opacity 0.65s ease, transform 0.65s ease",willChange:"transform,opacity",transformStyle:"preserve-3d"}}>{children}</div>;
}

/* ── Main ── */
export default function LandingPageClient({courses}){
    return (
        <div className="text-indigo-950" style={{perspective:"1200px",background:"linear-gradient(180deg,#faf9ff 0%,#eef2ff 50%,#faf9ff 100%)"}}>
            <VisitTracker />

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-indigo-100" style={{background:"linear-gradient(135deg,#eef2ff 0%,#e0e7ff 40%,#ddd6fe 80%,#c4b5fd 100%)"}}>
                <HeroGlobe />
                <div className="relative mx-auto max-w-[1100px] px-[4vw] py-16 md:py-28">
                    <div className="max-w-2xl space-y-5" style={{transformStyle:"preserve-3d"}}>
                        <span className="hero-animate inline-flex items-center gap-1.5 rounded-full border border-indigo-300/50 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700">
                            <IconSparkle size={14} /> 100% Free Learning Platform
                        </span>
                        <h1 className="hero-animate-d1 text-3xl font-black leading-tight md:text-5xl text-indigo-950">
                            Learn 100% Free <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent">Computer Courses</span>
                        </h1>
                        <p className="hero-animate-d2 text-indigo-800/70 md:text-lg leading-relaxed">
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="hero-animate-d2 flex flex-wrap gap-3 pt-1">
                            <a href="#course-grid" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-300/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-indigo-400/50 hover:scale-105 active:scale-100">
                                <IconRocket size={16} color="#fff" /> Start Learning
                            </a>
                            <a href="#categories" className="inline-flex items-center gap-2 rounded-full border border-indigo-300/60 bg-white/50 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:bg-white/80 hover:scale-105 active:scale-100">
                                <IconBook size={16} color="#4f46e5" /> Explore Categories
                            </a>
                        </div>
                        <p className="hero-animate-d3 flex items-center gap-3 flex-wrap text-sm text-indigo-500/70">
                            <span className="inline-flex items-center gap-1"><IconComputer size={14} color="#6366f1" /> Computer Course</span>
                            <span className="inline-flex items-center gap-1"><IconPdf size={14} color="#8b5cf6" /> PDF Notes</span>
                            <span className="inline-flex items-center gap-1"><IconQuiz size={14} color="#a855f7" /> Quiz</span>
                            <span className="inline-flex items-center gap-1"><IconBolt size={14} /> Tricks</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500"><IconBook size={14} color="#6366f1" /> Categories</p>
                    <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">What do you want to learn?</h2>
                </Reveal>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((c,i)=>(
                        <Reveal key={c.title} delay={i*80}>
                            <Tilt3D className="cursor-pointer rounded-xl border border-indigo-100 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60">
                                {c.icon}
                                <h3 className="mt-3 text-base font-bold text-indigo-900">{c.title}</h3>
                                <p className="mt-1 text-sm text-indigo-500">{c.subtitle}</p>
                            </Tilt3D>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* COURSES */}
            <section id="course-grid" className="py-10 md:py-14" style={{background:"linear-gradient(180deg,#f5f3ff,#eef2ff)"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500"><IconGrad size={14} /> Free Computer Courses</p>
                        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Basic to Advanced, job-ready skills</h2>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {courses.map((course,i)=>(
                            <Reveal key={course.id} delay={i*60}>
                                <Tilt3D intensity={7} className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/50">
                                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700"><IconTarget size={12} /> {course.level}</span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700"><IconClock size={12} /> {course.duration}</span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 font-semibold text-violet-700"><IconVideo size={12} /> {course.classType}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-indigo-900">{course.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-indigo-500">{course.shortDescription}</p>
                                    <div className="mt-3">
                                        <p className="flex items-center gap-1 text-xs font-bold text-emerald-600"><IconEdit size={12} color="#059669" /> Course Highlights</p>
                                        <ul className="mt-1 space-y-0.5 text-sm text-indigo-500">
                                            {splitLines(course.syllabusTopics).slice(0,4).map((item)=>(
                                                <li key={`${course.id}-${item}`}><span className="text-violet-400">•</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="text-lg font-extrabold text-emerald-600">INR {course.offerPrice.toFixed(0)}</span>
                                        <span className="text-sm text-indigo-300 line-through">INR {course.originalPrice.toFixed(0)}</span>
                                        <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-0.5 text-xs font-bold text-white">FREE</span>
                                    </div>
                                    <Link href={`/courses/${course.slug}`} className="mt-4 inline-flex rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:scale-105 active:scale-100">
                                        View Details →
                                    </Link>
                                </Tilt3D>
                            </Reveal>
                        ))}
                        {courses.length===0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-indigo-200 bg-white p-8 text-center text-indigo-400">
                                <IconBox size={20} /> No active courses yet. Add from admin panel.
                            </div>
                        )}
                    </div>
                    <Reveal><Link href="/courses" className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:underline">View all courses →</Link></Reveal>
                </div>
            </section>

            {/* STATS */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <div className="rounded-2xl border border-indigo-200/60 p-6 md:p-8" style={{background:"linear-gradient(135deg,#eef2ff,#e0e7ff,#ddd6fe)",transformStyle:"preserve-3d"}}>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600"><IconTrophy size={14} /> Trusted by Students</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl text-indigo-950">Real learners, real outcomes</h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((s)=>(
                                <Tilt3D key={s.label} intensity={12} className="rounded-xl border border-white/60 bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                                    {s.icon}
                                    <p className="mt-1 text-xl font-extrabold text-indigo-600">{s.value}</p>
                                    <p className="text-xs text-indigo-400">{s.label}</p>
                                </Tilt3D>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* REVIEWS */}
            <section className="py-10 md:py-14" style={{background:"linear-gradient(180deg,#f5f3ff,#eef2ff)"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500"><IconMsg size={14} /> Student Reviews</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real feedback from learners</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-indigo-400"><IconStar size={14} /> 4.7 / 5 (21,255 reviews)</p>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {reviewItems.map((r,i)=>(
                            <Reveal key={r.name} delay={i*80}>
                                <Tilt3D intensity={8} className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-bold text-indigo-600">{r.initial}</div>
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900">{r.name}</p>
                                            <p className="text-xs text-indigo-400">Computer Course Student</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-0.5">{Array.from({length:r.rating}).map((_,j)=><IconStar key={j} size={14} />)}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-indigo-500">{r.text}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500"><IconSparkle size={14} /> Why Choose Us</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Simple, secure, student-friendly</h3>
                    </Reveal>
                    <div className="grid gap-3">
                        {whyUs.map((item,i)=>(
                            <Reveal key={item.text} delay={i*60} direction="left">
                                <Tilt3D intensity={6} className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-100 bg-white p-3.5 text-sm shadow-sm hover:border-violet-300 hover:shadow-md">
                                    {item.icon}
                                    <span className="text-indigo-700">{item.text}</span>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-10 md:py-14" style={{background:"linear-gradient(180deg,#f5f3ff,#eef2ff)"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500"><IconQuiz size={14} /> FAQ</p></Reveal>
                    <div className="mt-4 grid gap-3">
                        {faqs.map((f,i)=>(
                            <Reveal key={f.q} delay={i*80}>
                                <Tilt3D intensity={4} className="rounded-lg border border-indigo-100 bg-white p-4 shadow-sm cursor-pointer hover:border-violet-300">
                                    <h4 className="font-bold text-indigo-900">{f.q}</h4>
                                    <p className="mt-1 text-sm text-indigo-500">{f.a}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-indigo-100 py-10" style={{background:"#eef2ff"}}>
                <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-[4vw] md:grid-cols-3">
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-bold text-indigo-600"><LogoMark size={24} /> LearnSphere</h4>
                        <p className="mt-1 text-sm text-indigo-400">FOLLOW US</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-indigo-500">
                            <li className="cursor-pointer hover:text-indigo-700 transition">Courses</li>
                            <li className="cursor-pointer hover:text-indigo-700 transition">Notes</li>
                            <li className="cursor-pointer hover:text-indigo-700 transition">Quiz</li>
                            <li className="cursor-pointer hover:text-indigo-700 transition">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-indigo-500">
                            <li className="cursor-pointer hover:text-indigo-700 transition">Privacy Policy</li>
                            <li className="cursor-pointer hover:text-indigo-700 transition">Contact Us</li>
                            <li className="cursor-pointer hover:text-indigo-700 transition">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs text-indigo-400">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
