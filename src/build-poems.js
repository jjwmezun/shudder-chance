import { readdirSync, readFile, writeFile } from 'fs';
import path from 'path';
import parse from './parse-mdx.js';

const poems = readdirSync( `src/poems` );

Promise.all( poems.map(
	async filename => new Promise( async ( resolve, reject ) => {
		readFile( `src/poems/${ filename }`, `utf-8`, ( err, data ) => {
			if ( err ) {
				reject();
				throw err;
			}
			const poem = parse( data );
			resolve({
				...poem,
				slug: path.parse( filename ).name,
			});
		} );
	} )
) ).then( poemData => {
	const poemList = {};
	poemData.forEach( poem => {
		poemList[ poem.slug ] = poem;
	} );
	
	writeFile( `build/poems.json`, JSON.stringify( poemList, null, 4 ), `utf-8`, err => {
		if ( err ) {
			throw err;
		}
		console.log( `¡Poems build!` );
	} );
});