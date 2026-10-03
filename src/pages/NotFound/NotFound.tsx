import { Link } from 'react-router-dom';
export function NotFound() {
    return (
        <section className="page-intro not-found">
            <p className="eyebrow">404 · Page not found</p>
            <h1>Page not found.</h1>
            <p>
                The page you’re looking for doesn’t exist. You can head back to
                the homepage.
            </p>
            <Link className="button" to="/">
                Back to home <span aria-hidden="true">→</span>
            </Link>
        </section>
    );
}
