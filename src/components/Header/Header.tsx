import { Link, NavLink } from 'react-router-dom';
export function Header() {
    return (
        <header className="site-header shell">
            <Link to="/" className="wordmark" aria-label="Tristan · home">
                Tristan<span aria-hidden="true">.</span>
            </Link>
            <nav aria-label="Main navigation">
                <NavLink to="/projects">Work</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
            </nav>
        </header>
    );
}
