import React, { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './app'

export function render( title ) {
	return `<!DOCTYPE html>${ renderToString(
		<StrictMode>
			<App title={ title } />
		</StrictMode>
	) }`;
};