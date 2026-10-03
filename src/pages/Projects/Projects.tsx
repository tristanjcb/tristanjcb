import { Work } from '../../components/Work/Work';
export function Projects() {
    return (
        <>
            <div className="page-intro">
                <p className="eyebrow">Work</p>
                <h1>What I’m working on.</h1>
                <p>
                    My current focus is Kresov, a Discord bot and web interface
                    for communities.
                </p>
            </div>
            <Work />
        </>
    );
}
