import React from 'react';
import { createRoot } from 'react-dom/client';
import TestButton from './TestButton';

document.addEventListener( `DOMContentLoaded`, () => {
    const button = document.getElementById( `test-button` );
    createRoot( button ).render( <TestButton /> );
} );