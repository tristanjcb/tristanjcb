import { Work } from '../../components/Work/Work';
import { AboutPreview, ContactIntro } from '../../components/Intro/Intro';
export function Home() {
    return (
        <>
            <section className="hero" aria-labelledby="hero-heading">
                <p className="eyebrow">Independent developer · France</p>
                <h1 id="hero-heading">Tristan</h1>
                <p className="hero-role">
                    Developer <span aria-hidden="true">·</span> DevSecOps
                </p>
                <p className="hero-description">
                    I build web applications and backend tools, and learn how to
                    run them securely.
                </p>
                <div className="hero-actions">
                    <a className="button" href="#work">
                        View my work <span aria-hidden="true">↓</span>
                    </a>
                    <a
                        className="text-link"
                        href="https://github.com/tristanjcb"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <p className="hero-footnote meta">
                    Self-taught · Building since 2020
                </p>
            </section>
            <Work />
            <AboutPreview />
            <section
                className="section contact-section"
                aria-labelledby="contact-heading"
            >
                <p className="eyebrow">Contact</p>
                <h2 id="contact-heading">Let’s talk.</h2>
                <ContactIntro />
            </section>
        </>
    );
}
