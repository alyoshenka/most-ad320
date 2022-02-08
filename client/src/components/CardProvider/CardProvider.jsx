import React from 'react'

import Card from "../Card/Card"
import ButtonDisplay from '../ButtonDisplay/ButtonDisplay'

import './CardProvider.css'

function CardProvider() {
    return (
        <div className="card-provider">
            <Card />
            <ButtonDisplay />
        </div>
    )
}

export default CardProvider