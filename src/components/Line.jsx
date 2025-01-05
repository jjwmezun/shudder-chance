import React from 'react';

export default function( props ) {
    const { children } = props;
    return <div className="poem__ln">{ children }</div>;
};