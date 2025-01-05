import * as React from 'react';

const App = props => {
    const { children } = props;
    return <html lang="en">
        <head>
            <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
            { children }
            <script src="/index.js"></script>
        </body>
    </html>;
};

export default App;
