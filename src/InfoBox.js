import React from 'react'
import {
    Card,
    CardContent,
    Typography,
} from '@material-ui/core';



function InfoBox({ title, cases, total, active, isRed, ...props}) { // (1)
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--Red"}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__casesGreen"}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">{total}</Typography>
            </CardContent>  
        </Card>
    )
}

export default InfoBox


/* INDEX 
1. (destructuring) - a method for passing in multiple specific properties stored in object arrays. 
*/ 