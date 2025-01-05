import React from 'react';

const App = props => {
    const { title } = props;
    return <html lang="en">
        <head>
            <link rel="stylesheet" href="index.css" />
        </head>
        <body>
            <h1>{ title }</h1>
            <div id="test-button">
                <button>0</button>
            </div>
            <script src="index.js"></script>
        </body>
    </html>;
};

export default App;
