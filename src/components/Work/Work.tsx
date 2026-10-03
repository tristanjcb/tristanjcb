import { Link } from 'react-router-dom';
import { EditorialProject } from './EditorialProject';
export function Work() {
    return (
        <section
            className="section work"
            aria-labelledby="work-heading"
            id="work"
        >
            <div className="section-heading">
                <h2 id="work-heading">Selected work</h2>
                <span className="meta">Current project</span>
            </div>
            <EditorialProject
                number="01"
                category="Community tooling"
                name="Kresov"
                description="A modular Discord bot for communities, with a companion web interface."
                technologies={[
                    'TypeScript',
                    'Node.js',
                    'Discord.js',
                    'MongoDB',
                ]}
                fullStack={[
                    'TypeScript',
                    'Node.js',
                    'Golang',
                    'Discord.js',
                    'React',
                    'SCSS',
                    'Next.js',
                    'MongoDB',
                    'PostgreSQL',
                ]}
                href="https://kresov.com"
            />
            <div className="section-end">
                <a
                    className="text-link"
                    href="https://github.com/tristanjcb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    More on GitHub <span aria-hidden="true">↗</span>
                </a>
                <Link className="quiet-link" to="/about">
                    About me <span aria-hidden="true">→</span>
                </Link>
            </div>
        </section>
    );
}
