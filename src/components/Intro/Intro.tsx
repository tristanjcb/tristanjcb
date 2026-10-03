import { Link } from 'react-router-dom';
export function AboutIntro() {
    return (
        <div className="about-copy">
            <p className="lead">
                Self-taught.
                <br />
                Building since 2020.
            </p>
            <p>
                I’m Tristan Jacob, a self-taught developer based in France. I
                started programming in 2020 with small Python applications and
                Discord bots, then moved into web development and backend
                systems.
            </p>
            <p>
                I work with TypeScript, Node.js and Python. I’m also learning
                more about infrastructure and application security: how to
                deploy software, keep it running and make it safer.
            </p>
        </div>
    );
}
export function ContactIntro() {
    return (
        <>
            <p className="contact-copy">
                Want to work together or talk about a project? Send me an email.
            </p>
            <a className="email-link" href="mailto:tristan@kresov.com">
                tristan@kresov.com <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-links">
                <a
                    className="text-link"
                    href="https://github.com/tristanjcb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub <span aria-hidden="true">↗</span>
                </a>
                <a
                    className="text-link"
                    href="https://linkedin.com/in/tristanjacob21"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn <span aria-hidden="true">↗</span>
                </a>
            </div>
        </>
    );
}
export function AboutPreview() {
    return (
        <section
            className="section split-section"
            aria-labelledby="about-heading"
        >
            <h2 id="about-heading">A little about me</h2>
            <div>
                <AboutIntro />
                <Link className="text-link" to="/about">
                    More about me <span aria-hidden="true">→</span>
                </Link>
            </div>
        </section>
    );
}
