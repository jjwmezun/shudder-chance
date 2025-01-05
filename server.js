const express = require( 'express' );
const fs = require( 'fs' );

const app = express();
const port = 3000;

app.get( '/', ( req, res ) => {
    const html = fs.readFileSync( './dist/index.html', 'utf8' );
    res.send( html );
} );

app.use( express.static( 'dist' ) );

app.listen( port, () => {
    console.log( `Server running on http://localhost:${port}` );
} );
