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
    { icon: <IconPdf size={22} color="var(--brand)" />, text: "PDF Notes: Download for quick revision" },
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

/* ── 3D Particle Globe ── */
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
        let cachedRect=null, rectTimer=0;
        const N=400;
        const dots = Array.from({length:N},(_,i)=>{
            const phi=Math.acos(1-2*(i+0.5)/N);
            const theta=Math.PI*(1+Math.sqrt(5))*i;
            return {sp:Math.sin(phi),cp:Math.cos(phi),theta,r:155+Math.random()*55,spd:0.0003+Math.random()*0.0002};
        });

        const resize=()=>{w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight;cachedRect=null;};
        resize();
        window.addEventListener("resize",resize);

        const getRect=()=>{if(!cachedRect){cachedRect=section.getBoundingClientRect();}return cachedRect;};

        let mouseRaf=0;
        const onMouse=(e)=>{
            if(mouseRaf) return;
            mouseRaf=requestAnimationFrame(()=>{
                mouseRaf=0;
                const rect=getRect();
                const pad=80;
                isNear=e.clientX>=rect.left-pad&&e.clientX<=rect.right+pad&&e.clientY>=rect.top-pad&&e.clientY<=rect.bottom+pad;
                if(isNear){
                    targetRY=((e.clientX-rect.left)/rect.width-0.5)*4.5;
                    targetRX=((e.clientY-rect.top)/rect.height-0.5)*3.0;
                }
            });
        };
        window.addEventListener("mousemove",onMouse,{passive:true});

        const onScroll=()=>{cachedRect=null;};
        window.addEventListener("scroll",onScroll,{passive:true});

        const onLeave=()=>{isNear=false;targetRX=0;targetRY=0;};
        section.addEventListener("mouseleave",onLeave);

        const onVis=()=>{paused=document.hidden;};
        document.addEventListener("visibilitychange",onVis);

        const colors=[[99,102,241],[139,92,246],[34,211,238]];
        const colorCache=colors.map(c=>{
            const arr=[];
            for(let a=0;a<=10;a++){arr.push(`rgba(${c[0]},${c[1]},${c[2]},${(a/10).toFixed(2)})`);}
            return arr;
        });

        const render=()=>{
            if(!paused){
                t++;
                if(++rectTimer>60){rectTimer=0;cachedRect=null;}

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
                    const th=d.theta+t*d.spd;
                    const st=Math.sin(th),ct=Math.cos(th);
                    let px=d.r*d.sp*ct, py=d.r*d.sp*st, pz=d.r*d.cp;
                    let tx=px*aC-pz*aS, tz=px*aS+pz*aC; px=tx;pz=tz;
                    tx=px*cRY-pz*sRY; tz=px*sRY+pz*cRY; px=tx;pz=tz;
                    let ty=py*cRX-pz*sRX; tz=py*sRX+pz*cRX; py=ty;pz=tz;

                    const sc=(pz+d.r)/(2*d.r);
                    const aIdx=Math.min(10,(sc*10+0.7)|0);
                    const sz=0.5+sc*3.0;

                    ctx.beginPath();
                    ctx.arc(cx+px,cy+py*0.45,sz,0,6.28);
                    ctx.fillStyle=colorCache[i%3][aIdx];
                    ctx.fill();
                }
            }
            raf=requestAnimationFrame(render);
        };
        render();

        return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("mousemove",onMouse);window.removeEventListener("scroll",onScroll);section.removeEventListener("mouseleave",onLeave);document.removeEventListener("visibilitychange",onVis);};
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
    return <div ref={ref} className={className} style={{opacity:0,transform:init,transition:"opacity 0.65s ease, transform 0.65s ease",transformStyle:"preserve-3d"}}>{children}</div>;
}

/* ── 3D Parallax Section ── */
function Parallax3D({children,className=""}){
    const ref=useRef(null);
    useEffect(()=>{
        const el=ref.current; if(!el) return;
        let ticking=false;
        const onScroll=()=>{
            if(ticking) return;
            ticking=true;
            requestAnimationFrame(()=>{
                const rect=el.getBoundingClientRect();
                const center=rect.top+rect.height/2;
                const vh=window.innerHeight;
                const ratio=(center-vh/2)/vh;
                el.style.transform=`perspective(1000px) rotateX(${ratio*3}deg) translateY(${ratio*-8}px)`;
                ticking=false;
            });
        };
        window.addEventListener("scroll",onScroll,{passive:true});
        onScroll();
        return()=>window.removeEventListener("scroll",onScroll);
    },[]);
    return <div ref={ref} className={className} style={{transition:"transform 0.1s linear",transformStyle:"preserve-3d"}}>{children}</div>;
}

/* ── 3D Scale on scroll ── */
function ScaleReveal({children,className=""}){
    const ref=useRef(null);
    useEffect(()=>{
        const el=ref.current; if(!el) return;
        let ticking=false;
        const onScroll=()=>{
            if(ticking) return;
            ticking=true;
            requestAnimationFrame(()=>{
                const rect=el.getBoundingClientRect();
                const vh=window.innerHeight;
                const progress=Math.max(0,Math.min(1,(vh-rect.top)/(vh*0.6)));
                const sc=0.92+progress*0.08;
                const op=Math.max(0,Math.min(1,progress*1.5));
                el.style.transform=`scale3d(${sc},${sc},1)`;
                el.style.opacity=op;
                ticking=false;
            });
        };
        window.addEventListener("scroll",onScroll,{passive:true});
        onScroll();
        return()=>window.removeEventListener("scroll",onScroll);
    },[]);
    return <div ref={ref} className={className} style={{transformOrigin:"center center",transition:"transform 0.05s linear, opacity 0.05s linear"}}>{children}</div>;
}

/* ── Main ── */
export default function LandingPageClient({courses}){
    return (
        <div style={{perspective:"1200px",background:"var(--bg)",color:"var(--ink)",transition:"background 0.3s,color 0.3s"}}>
            <VisitTracker />

            {/* HERO */}
            <section className="relative overflow-hidden" style={{background:"linear-gradient(135deg,var(--hero-from),var(--hero-via),var(--hero-to))",borderBottom:"1px solid var(--line)",transition:"background 0.3s"}}>
                <HeroGlobe />
                <div className="relative mx-auto max-w-[1100px] px-[4vw] py-16 md:py-28">
                    <div className="max-w-2xl space-y-5" style={{transformStyle:"preserve-3d"}}>
                        <span className="hero-animate inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{border:"1px solid var(--line)",background:"var(--paper)",color:"var(--brand)",backdropFilter:"blur(8px)"}}>
                            <IconSparkle size={14} /> 100% Free Learning Platform
                        </span>
                        <h1 className="hero-animate-d1 text-3xl font-black leading-tight md:text-5xl" style={{color:"var(--ink)"}}>
                            Learn 100% Free <span style={{background:"linear-gradient(to right, var(--brand), var(--accent))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Computer Courses</span>
                        </h1>
                        <p className="hero-animate-d2 md:text-lg leading-relaxed" style={{color:"var(--text-muted)"}}>
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="hero-animate-d2 flex flex-wrap gap-3 pt-1">
                            <a href="#course-grid" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:scale-100" style={{background:"linear-gradient(to right, var(--brand), var(--accent))"}}>
                                <IconRocket size={16} color="#fff" /> Start Learning
                            </a>
                            <a href="#categories" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-100" style={{border:"1px solid var(--line)",background:"var(--paper)",color:"var(--brand)",backdropFilter:"blur(8px)"}}>
                                <IconBook size={16} /> Explore Categories
                            </a>
                        </div>
                        <p className="hero-animate-d3 flex items-center gap-3 flex-wrap text-sm" style={{color:"var(--text-muted)"}}>
                            <span className="inline-flex items-center gap-1"><IconComputer size={14} /> Computer Course</span>
                            <span className="inline-flex items-center gap-1"><IconPdf size={14} /> PDF Notes</span>
                            <span className="inline-flex items-center gap-1"><IconQuiz size={14} /> Quiz</span>
                            <span className="inline-flex items-center gap-1"><IconBolt size={14} /> Tricks</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <Parallax3D>
            <section id="categories" className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconBook size={14} /> Categories</p>
                    <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">What do you want to learn?</h2>
                </Reveal>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((c,i)=>(
                        <Reveal key={c.title} delay={i*80}>
                            <Tilt3D className="cursor-pointer rounded-xl p-5 shadow-sm transition-shadow hover:shadow-xl" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                {c.icon}
                                <h3 className="mt-3 text-base font-bold" style={{color:"var(--ink)"}}>{c.title}</h3>
                                <p className="mt-1 text-sm" style={{color:"var(--text-muted)"}}>{c.subtitle}</p>
                            </Tilt3D>
                        </Reveal>
                    ))}
                </div>
            </section>
            </Parallax3D>

            {/* COURSES */}
            <ScaleReveal>
            <section id="course-grid" className="py-10 md:py-14" style={{background:"var(--bg-alt)",transition:"background 0.3s"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconGrad size={14} /> Free Computer Courses</p>
                        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Basic to Advanced, job-ready skills</h2>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {courses.map((course,i)=>(
                            <Reveal key={course.id} delay={i*60}>
                                <Tilt3D intensity={7} className="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-xl" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold" style={{border:"1px solid var(--badge-green-border)",background:"var(--badge-green-bg)",color:"var(--badge-green-text)"}}><IconTarget size={12} /> {course.level}</span>
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold" style={{border:"1px solid var(--badge-blue-border)",background:"var(--badge-blue-bg)",color:"var(--badge-blue-text)"}}><IconClock size={12} /> {course.duration}</span>
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold" style={{border:"1px solid var(--badge-violet-border)",background:"var(--badge-violet-bg)",color:"var(--badge-violet-text)"}}><IconVideo size={12} /> {course.classType}</span>
                                    </div>
                                    <h3 className="text-lg font-bold" style={{color:"var(--ink)"}}>{course.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed" style={{color:"var(--text-muted)"}}>{course.shortDescription}</p>
                                    <div className="mt-3">
                                        <p className="flex items-center gap-1 text-xs font-bold" style={{color:"var(--success)"}}><IconEdit size={12} /> Course Highlights</p>
                                        <ul className="mt-1 space-y-0.5 text-sm" style={{color:"var(--text-muted)"}}>
                                            {splitLines(course.syllabusTopics).slice(0,4).map((item)=>(
                                                <li key={`${course.id}-${item}`}><span style={{color:"var(--accent)"}}>&#8226;</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="text-lg font-extrabold" style={{color:"var(--success)"}}>INR {course.offerPrice.toFixed(0)}</span>
                                        <span className="text-sm line-through" style={{color:"var(--text-muted)"}}>INR {course.originalPrice.toFixed(0)}</span>
                                        <span className="rounded-full px-3 py-0.5 text-xs font-bold text-white" style={{background:"linear-gradient(to right, var(--brand), var(--accent))"}}>FREE</span>
                                    </div>
                                    <Link href={`/courses/${course.slug}`} className="mt-4 inline-flex rounded-full px-5 py-2 text-sm font-semibold transition hover:scale-105 active:scale-100" style={{border:"1px solid var(--line)",color:"var(--brand)"}}>
                                        View Details &rarr;
                                    </Link>
                                </Tilt3D>
                            </Reveal>
                        ))}
                        {courses.length===0 && (
                            <div className="col-span-full rounded-xl border border-dashed p-8 text-center" style={{borderColor:"var(--line)",background:"var(--paper)",color:"var(--text-muted)"}}>
                                <IconBox size={20} /> No active courses yet. Add from admin panel.
                            </div>
                        )}
                    </div>
                    <Reveal><Link href="/courses" className="mt-6 inline-block text-sm font-semibold hover:underline" style={{color:"var(--brand)"}}>View all courses &rarr;</Link></Reveal>
                </div>
            </section>
            </ScaleReveal>

            {/* STATS */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <div className="rounded-2xl p-6 md:p-8" style={{border:"1px solid var(--line)",background:"var(--brand-soft)",transformStyle:"preserve-3d",transition:"background 0.3s"}}>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconTrophy size={14} /> Trusted by Students</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl" style={{color:"var(--ink)"}}>Real learners, real outcomes</h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((s)=>(
                                <Tilt3D key={s.label} intensity={12} className="rounded-xl p-4 text-center shadow-sm" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                    {s.icon}
                                    <p className="mt-1 text-xl font-extrabold" style={{color:"var(--brand)"}}>{s.value}</p>
                                    <p className="text-xs" style={{color:"var(--text-muted)"}}>{s.label}</p>
                                </Tilt3D>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* REVIEWS */}
            <Parallax3D>
            <section className="py-10 md:py-14" style={{background:"var(--bg-alt)",transition:"background 0.3s"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconMsg size={14} /> Student Reviews</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real feedback from learners</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm" style={{color:"var(--text-muted)"}}><IconStar size={14} /> 4.7 / 5 (21,255 reviews)</p>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {reviewItems.map((r,i)=>(
                            <Reveal key={r.name} delay={i*80}>
                                <Tilt3D intensity={8} className="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-lg" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{background:"var(--brand-soft)",color:"var(--brand)"}}>{r.initial}</div>
                                        <div>
                                            <p className="text-sm font-bold" style={{color:"var(--ink)"}}>{r.name}</p>
                                            <p className="text-xs" style={{color:"var(--text-muted)"}}>Computer Course Student</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-0.5">{Array.from({length:r.rating}).map((_,j)=><IconStar key={j} size={14} />)}</div>
                                    <p className="mt-1 text-sm leading-relaxed" style={{color:"var(--text-muted)"}}>{r.text}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
            </Parallax3D>

            {/* WHY US */}
            <ScaleReveal>
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Reveal>
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconSparkle size={14} /> Why Choose Us</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Simple, secure, student-friendly</h3>
                    </Reveal>
                    <div className="grid gap-3">
                        {whyUs.map((item,i)=>(
                            <Reveal key={item.text} delay={i*60} direction="left">
                                <Tilt3D intensity={6} className="flex cursor-pointer items-center gap-3 rounded-lg p-3.5 text-sm shadow-sm transition-shadow hover:shadow-md" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                    {item.icon}
                                    <span style={{color:"var(--ink-secondary)"}}>{item.text}</span>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
            </ScaleReveal>

            {/* FAQ */}
            <section className="py-10 md:py-14" style={{background:"var(--bg-alt)",transition:"background 0.3s"}}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:"var(--brand)"}}><IconQuiz size={14} /> FAQ</p></Reveal>
                    <div className="mt-4 grid gap-3">
                        {faqs.map((f,i)=>(
                            <Reveal key={f.q} delay={i*80}>
                                <Tilt3D intensity={4} className="rounded-lg p-4 shadow-sm cursor-pointer" style={{border:"1px solid var(--line)",background:"var(--paper)"}}>
                                    <h4 className="font-bold" style={{color:"var(--ink)"}}>{f.q}</h4>
                                    <p className="mt-1 text-sm" style={{color:"var(--text-muted)"}}>{f.a}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10" style={{borderTop:"1px solid var(--line)",background:"var(--bg-alt)",transition:"background 0.3s"}}>
                <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-[4vw] md:grid-cols-3">
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-bold" style={{color:"var(--brand)"}}><LogoMark size={24} /> LearnSphere</h4>
                        <p className="mt-1 text-sm" style={{color:"var(--text-muted)"}}>FOLLOW US</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{color:"var(--ink-secondary)"}}>Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{color:"var(--text-muted)"}}>
                            <li><Link href="/courses" className="hover:underline transition">Courses</Link></li>
                            <li className="cursor-pointer transition">Notes</li>
                            <li className="cursor-pointer transition">Quiz</li>
                            <li className="cursor-pointer transition">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{color:"var(--ink-secondary)"}}>Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{color:"var(--text-muted)"}}>
                            <li className="cursor-pointer transition">Privacy Policy</li>
                            <li><Link href="/contact" className="hover:underline transition">Contact Us</Link></li>
                            <li className="cursor-pointer transition">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs" style={{color:"var(--text-muted)"}}>Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
