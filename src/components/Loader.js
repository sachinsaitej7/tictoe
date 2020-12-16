import React from 'react';
import loaderImage from '../images/loader.gif';

const loader = (props) => {
    //this component will stretch to height and width of parent with position relative
    return(
        <div id="loader" style={{
            display:"block",
            backgroundImage:`url(${loaderImage})`,
            backgroundPosition:"center",
            backgroundRepeat:"no-repeat",
            minHeight:props.minHeight ||"200px",
            textAlign:"center",
            position:"absolute",
            width:"100%",
            height:"100%",
            verticalAlign:"center"}}>
        </div>
    )
}

export default loader;