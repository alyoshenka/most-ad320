import React from 'react'

import CardDisplay from "../Card/Card"
import ButtonDisplay from '../ButtonDisplay/ButtonDisplay'

function CardProvider() {
    return (
        <div className="card-provider">
            <CardDisplay />
            <ButtonDisplay />
        </div>
    )
}

export default CardProvider