import { ContactIntro } from '../../components/Intro/Intro';
export function Contact() {
    return (
        <>
            <section className="page-intro contact-page">
                <p className="eyebrow">Contact</p>
                <h1>Get in touch.</h1>
                <ContactIntro />
            </section>
            <section className="section split-section">
                <h2>Elsewhere</h2>
                <div>
                    <p className="muted">A few other places you can find me.</p>
                    <div className="secondary-socials">
                        <a href="https://github.com/tristanjcb/tristanjcb/discussions">
                            GitHub Discussions
                        </a>
                        <a href="https://discord.com/users/705425854825496656">
                            Discord · juste_tristan
                        </a>
                        <a href="https://instagram.com/tristanjcb">Instagram</a>
                        <a href="https://x.com/Tristan__Jcb">
                            X · @Tristan__Jcb
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
