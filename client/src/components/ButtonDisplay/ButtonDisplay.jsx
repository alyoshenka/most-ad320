import React from 'react'

import Button from '../Button/Button'

import './ButtonDisplay.css'

function ButtonDisplay() {
    return (
        <div className="button-display">
            <Button text="Back" />
            <Button text="Flip" />
            <Button text="Next" />
        </div>
    )
}

export default ButtonDisplay