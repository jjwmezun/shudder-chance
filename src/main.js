import * as React from 'react'
import * as Server from 'react-dom/server'
import App from './app'

export function renderHome( title ) {
	return `<!DOCTYPE html>${ Server.renderToString(
		<App>
			<h1>{ title }</h1>
            <div id="test-button">
                <button>0</button>
            </div>
		</App>
	) }`;
};

export function renderPoem( poem ) {
	return `<!DOCTYPE html>${ Server.renderToString(
		<App>
			<h1>{ poem.title }</h1>
			<div dangerouslySetInnerHTML={{ __html: poem.content }} />
		</App>
	) }`;
};

export function renderArchive( poems ) {
	return `<!DOCTYPE html>${ Server.renderToString(
		<App>
			<h1>Poems</h1>
			<ul>
				{ poems.map( ( poem, i ) => (
					<li key={ i }>
						<a href={ `/poem/${ poem.slug }` }>{ poem.title }</a>
					</li>
				) ) }
			</ul>
		</App>
	) }`;
};
