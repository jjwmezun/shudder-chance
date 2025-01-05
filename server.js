const React = require('react');
const { renderHome, renderPoem } = require('./build/index.js');
const express = require( 'express' );
const fs = require( 'fs' );

const app = express();
const port = 3000;

const poems = JSON.parse( fs.readFileSync( `build/poems.json`, `utf-8` ) );

app.get( '/', ( req, res ) => {
    res.send( renderHome( `¡BAM! ¡LOOK @ THAT BACON SIZZLE!`) );
} );

app.get( `/poem/:id`, ( req, res ) => {
    const poemId = req.params.id;
    if ( !poems[ poemId ] ) {
        res.status( 404 ).send( `Poem not found` );
        return;
    }
    res.send( renderPoem( poems[ poemId ] ) );
} );

app.use( express.static( 'public' ) );

app.listen( port, () => {
    console.log( `Server running on http://localhost:${port}` );
} );
