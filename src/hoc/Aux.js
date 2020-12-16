import React from 'react';
import Container from 'react-bootstrap/Container';
import './Aux.css';

const aux = (props) => {
    let className = props.className ? props.className: "container";
    return(
        <Container bsPrefix={className}>   
            {props.children}
        </Container>
    )
};

export default aux;