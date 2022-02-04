import React from 'react'

import CardListItem from '../CardListItem/CardListItem'

import './CardNav.css'

function CardNav() {
    return (
        <div className="card-nav">
            <h2>Card List</h2>
            <ul>
                <li><CardListItem /></li>
                <li><CardListItem /></li>
                <li><CardListItem /></li>
                <li><CardListItem /></li>
            </ul>
        </div>
    )
}

export default CardNav