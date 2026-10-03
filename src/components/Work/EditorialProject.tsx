interface EditorialProjectProps {
    number: string;
    category: string;
    name: string;
    description: string;
    technologies: string[];
    fullStack: string[];
    href: string;
}

export function EditorialProject({
    number,
    category,
    name,
    description,
    technologies,
    fullStack,
    href,
}: EditorialProjectProps) {
    return (
        <article className="project">
            <div className="project-body">
                <p className="eyebrow">
                    <span className="meta">{number}</span> · {category}
                </p>
                <h3>{name}</h3>
                <p>{description}</p>
                <p className="meta stack">{technologies.join(' · ')}</p>
                <a
                    className="text-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Explore ${name}`}
                >
                    Explore project <span aria-hidden="true">↗</span>
                </a>
                <details className="technical-details">
                    <summary>Full technology stack</summary>
                    <p>{fullStack.join(' · ')}</p>
                </details>
            </div>
        </article>
    );
}
