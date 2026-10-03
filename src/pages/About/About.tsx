import { AboutIntro } from '../../components/Intro/Intro';
export function About() {
    return (
        <>
            <div className="page-intro">
                <p className="eyebrow">About</p>
                <h1>A developer, still learning.</h1>
                <p>
                    I started with Python scripts and Discord bots. Now I build
                    web applications and learn about the systems behind them.
                </p>
            </div>
            <section className="section split-section">
                <h2>My story</h2>
                <AboutIntro />
            </section>
            <section className="section split-section">
                <h2>Tools & direction</h2>
                <div className="prose">
                    <p>
                        I like code that’s easy to follow and interfaces that
                        stay out of the way. My current learning is focused on
                        Linux, containers, deployment workflows and application
                        security.
                    </p>
                    <dl className="tool-list">
                        <div>
                            <dt>Development</dt>
                            <dd>
                                TypeScript · Node.js · Python · React · APIs
                            </dd>
                        </div>
                        <div>
                            <dt>Data</dt>
                            <dd>MongoDB · MySQL · PostgreSQL · Prisma</dd>
                        </div>
                        <div>
                            <dt>Infrastructure & learning</dt>
                            <dd>
                                Linux · Docker · Kubernetes · CI/CD · GitHub
                                Actions · DevSecOps · Application security
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>
            <section className="section split-section">
                <h2>Education</h2>
                <div className="education">
                    <article>
                        <p className="meta">2025 · 2028</p>
                        <h3>Professional Baccalauréat MELEC</h3>
                        <p>Saint-Joseph La Salle High School</p>
                        <p className="muted">
                            Electrical and Connected Systems
                        </p>
                    </article>
                    <article>
                        <p className="meta">2022 · 2025</p>
                        <h3>National Diploma of the Brevet</h3>
                        <p>Middle School · General studies</p>
                    </article>
                </div>
            </section>
        </>
    );
}
