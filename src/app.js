import * as React from 'react';

const Header = () => {
    return <header>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/poems">Poems</a></li>
            </ul>
        </nav>
    </header>;
};

const App = props => {
    const { children } = props;
    return <html lang="en">
        <head>
            <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
            <Header />
            { children }
            <script src="/index.js"></script>
        </body>
    </html>;
};

export default App;
