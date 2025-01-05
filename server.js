const React = require('react');
const { render } = require('./build/index.js');
const express = require( 'express' );
const fs = require( 'fs' );

const app = express();
const port = 3000;

app.get( '/', ( req, res ) => {
    res.send( render( `¡BAM! ¡LOOK @ THAT BACON SIZZLE!`) );
} );

app.get( `/poem/:id`, ( req, res ) => {
    const poemId = req.params.id;
    res.send( render( `Poem #${ poemId }` ) );
} );

app.use( express.static( 'public' ) );

app.listen( port, () => {
    console.log( `Server running on http://localhost:${port}` );
} );
