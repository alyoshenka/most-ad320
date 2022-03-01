import React from 'react'

import CardListItem from '../CardListItem/CardListItem'

import './CardNav.css'

const cardListItems = [
    'card 1', 'card 2', 'card 3', 'card 4', 'card 5'
]

function CardNav() {
    return (
        <div className="card-nav">
            <h2>Card List</h2>
            <ul>
                {cardListItems.map((item) => {
                    return <li><CardListItem text={item} /></li>
                })}
            </ul>
        </div>
    )
}

export default CardNav