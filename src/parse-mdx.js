import React from 'react';
import { renderToString } from 'react-dom/server';
import Haiku from './components/Haiku.jsx';
import Line from './components/Line.jsx';
import Stanza from './components/Stanza.jsx';

const customTags = {
    Haiku,
    Line,
    Stanza,
};

const createReactElements = children => {
    return children.map( ( child, i ) => {
        if ( child.type === 'text' ) {
            return child.content;
        }
        const attributes = child.attributes.reduce( ( acc, cur ) => {
            acc[ cur.key ] = cur.value;
            return acc;
        }, { key: i } );
        return React.createElement( child.tag in customTags ? customTags[ child.tag ] : child.tag, attributes, createReactElements( child.children ) );
    } );
};

const scanTokens = text => {
    const frontmatter = {};
    const tokens = [];
    let start = 0;
    let current = 0;
    let line = 1;

    const isSpace = c => c === ` ` || c === `\t` || c === `\r`;

    const peek = () => isAtEnd() ? `\0` : text[ current ];

    const match = expected => {
        if ( isAtEnd() ) return false;
        if ( text[ current ] !== expected ) return false;
        current++;
        return true;
    };

    const addToken = ( type, value ) => tokens.push({ type, value, line });

    const isAtEnd = () => current >= text.length;

    const advance = () => text[ current++ ];

    const addTagStart = () => {
        const attributes = [];

        // Peek till we reach the end of the tag.
        while ( peek() !== `>` && !isSpace( peek() ) && !isAtEnd() ) {
            if ( peek() === `\n` ) line++;
            advance();
        }

        if ( isAtEnd() ) {
            console.error( `Unterminated tag end @ line ${ line }` );
            process.exit( 1 );
        }

        // Extract the tag name.
        const tag = text.substring( start + 1, current );

        let innerStart = current;

        if ( isSpace( peek() ) ) {
            // Extract the attributes.
            let key = ``;
            let value = ``;
            while ( peek() !== `>` && !isAtEnd() ) {
                if ( peek() === `=` ) {
                    key = text.substring( innerStart + 1, current );
                    advance();
                    if ( peek() === `"` ) {
                        advance();
                    }
                    innerStart = current;
                    while ( peek() !== `"` && !isAtEnd() ) {
                        if ( peek() === `\n` ) line++;
                        advance();
                    }
                    value = text.substring( innerStart, current );
                    attributes.push({ key, value });
                    innerStart = current + 1;
                }
                advance();
            }
        }

        // Consume the end character.
        advance();

        addToken( `tag_start`, { tag, attributes } );
    };

    const addTagEnd = () => {
        // Peek till we reach the end of the tag.
        while ( peek() !== `>` && !isAtEnd() ) {
            if ( peek() === `\n` ) line++;
            advance();
        }

        if ( isAtEnd() ) {
            console.error( `Unterminated tag end @ line ${ line }` );
            process.exit( 1 );
        }

        // Consume the `>`.
        advance();

        // Extract the tag name.
        const tagName = text.substring( start + 2, current - 1 );
        addToken( `tag_end`, tagName );
    };

    const addText = () => {
        while ( peek() !== `<` && !isAtEnd() ) {
            if ( peek() === `\n` ) line++;
            advance();
        }
        if ( start === current ) return;
        const content = text.substring( start, current ).trim();
        if ( content.length === 0 ) return;
        addToken( `text`, content );
    };

    const addFrontmatter = () => {
        if ( !match( '\n' ) ) {
            console.error( `Invalid frontmatter start @ line ${ line }` );
            process.exit( 1 );
        }

        let innerStart = current;
        let key = '';
        let value = '';
        while ( true ) {
            if ( match( '-' ) ) {
                if ( match( '-' ) ) {
                    if ( match( '-' ) ) {
                        return;
                    }
                }
            }

            if ( isAtEnd() ) {
                console.error( `Invalid frontmatter start @ line ${ line }` );
                process.exit( 1 );
            }

            if ( peek() === ':' ) {
                key = text.substring( innerStart, current ).trim();
                innerStart = current + 1;
            }
            else if ( peek() === '\n' ) {
                value = text.substring( innerStart, current ).trim();
                frontmatter[ key ] = value;
                innerStart = current + 1;
            }
            advance();
        }
    };

    const scanToken = () => {
        const c = advance();
        switch ( c ) {
            case ( `<` ):
                if ( match( `/` ) ) {
                    addTagEnd();
                } else {
                    addTagStart();
                }
            break;
            case ( '-' ):
                if ( match( '-' ) ) {
                    if ( match( '-' ) ) {
                        addFrontmatter();
                    }
                }
            break;
            default:
                addText();
            break;
        }
    };

    while ( !isAtEnd() ) {
        start = current;
        scanToken();
    }

    return {
        tokens,
        frontmatter
    };
};

export default function( data ) {
    const { tokens, frontmatter } = scanTokens( data );

    const root = {
        children: [],
    };

    let current = root;

    tokens.forEach( token => {
        switch ( token.type ) {
            case 'tag_start':
                const element = {
                    type: 'element',
                    tag: token.value.tag,
                    attributes: token.value.attributes,
                    children: [],
                };
                current.children.push( element );
                current = { ...element, parent: current };
            break;
            case 'tag_end':
                current = current.parent;
            break;
            case 'text':
                current.children.push({
                    type: 'text',
                    content: token.value,
                });
            break;
        }
    });

    const top = [];
    root.children.forEach( child => {
        if ( child.type === 'text' ) {
            const ps = child.content.split( '\n\n' ).map( p => p.trim() ).filter( p => p.length > 0 );
            top.push( ...ps.map( p => ( { type: 'element', tag: 'p', children: [ { type: 'text', content: p } ] } ) ) );
        } else {
            top.push( child );
        }
    } );

    root.children = top;

    const reactElements = createReactElements( root.children );

    return { ...frontmatter, content: renderToString( reactElements ) };
};