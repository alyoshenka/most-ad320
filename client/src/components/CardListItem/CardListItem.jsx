import React from 'react'

function CardListItem(props) {
    return (
        <div className="card-list-item">
            <p>{props.text}</p>
        </div>
    )
}

export default CardListItem