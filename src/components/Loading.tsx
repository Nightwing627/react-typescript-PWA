import * as React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading = () => {
    return (
        // <div
        //     style={{
        //         height: window.innerHeight - 250,
        //         width: '100%',
        //         paddingLeft: '45%',
        //         paddingTop: '30%'
        //     }}>
        //     <CircularProgress style={{ color: '#48a89c' }} />
        // </div>
        <div className="loader-main">
            <div className="hourglass"></div>
        </div>
    )
}
export const NotFoundError = () => {
    return (
        <div 
            style={{
            height: window.innerHeight - 500,
            width: '100%',
            paddingTop: '30%',
            fontWeight: 'bold',
            fontSize: '30px',
            color: '#48a89c',
            textAlign: 'center',
            }}> 
            Sorry! We could not found any products
        </div>
    )
}
