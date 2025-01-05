import React, { useState } from 'react';

const TestButton = () => {
    const [ count, setCount ] = useState( 0 );
    return <button onClick={ () => setCount( prevCount => prevCount + 1 ) }>{ count }</button>;
};

export default TestButton;