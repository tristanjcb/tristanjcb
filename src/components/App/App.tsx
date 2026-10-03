import { useEffect } from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Home } from '../../pages/Home/Home';
import { Projects } from '../../pages/Projects/Projects';
import { About } from '../../pages/About/About';
import { Contact } from '../../pages/Contact/Contact';
import { NotFound } from '../../pages/NotFound/NotFound';
const metadata: Record<string, [string, string]> = {
    '/': [
        'Tristan · Developer · DevSecOps',
        'Tristan Jacob, a self-taught developer in France. Selected projects and a growing focus on infrastructure, DevSecOps and application security.',
    ],
    '/projects': [
        'Work · Tristan',
        'Explore Kresov, Tristan’s community tooling project built with TypeScript, Node.js, Golang and PostgreSQL.',
    ],
    '/about': [
        'About · Tristan',
        'Meet Tristan Jacob, a self-taught developer since 2020, exploring backend architecture, infrastructure and application security.',
    ],
    '/contact': [
        'Contact · Tristan',
        'Get in touch with Tristan Jacob for collaboration, open-source projects and technical conversations.',
    ],
};
function Site() {
    const { pathname } = useLocation();
    useEffect(() => {
        const [title, description] = metadata[pathname] ?? [
            'Page not found · Tristan',
            'This page could not be found. Explore Tristan’s work or get in touch.',
        ];
        document.title = title;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', description);
        for (const key of ['og:title', 'twitter:title'])
            document
                .querySelector(`meta[property="${key}"], meta[name="${key}"]`)
                ?.setAttribute('content', title);
        for (const key of ['og:description', 'twitter:description'])
            document
                .querySelector(`meta[property="${key}"], meta[name="${key}"]`)
                ?.setAttribute('content', description);
        const url = `https://www.tristan.kresov.com${pathname}`;
        document
            .querySelector('link[rel="canonical"]')
            ?.setAttribute('href', url);
        document
            .querySelector('meta[property="og:url"]')
            ?.setAttribute('content', url);
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Header />
            <main id="main" className="shell" tabIndex={-1}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/sponsors"
                        element={<Navigate to="/contact" replace />}
                    />
                    <Route
                        path="/partners"
                        element={<Navigate to="/contact" replace />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}
export default function App() {
    return (
        <BrowserRouter>
            <Site />
        </BrowserRouter>
    );
}
