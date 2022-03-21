import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Auth/AuthProvider'

const User = () => {
    const { auth } = useAuth()
    const [ data, setData] = useState(null)

    useEffect(() => {
        if (auth) {
            axios.get(`http://localhost:8000/users/${auth.user}`, { headers: { authorization: auth.token }}).then((response) => {
                setData(response.data)
            })
        } else {
            console.log('Error with authorization')
        }
    }, [auth]) 

    if (data) {      
        return (
            <span>
                <p>User ID: {data.id}</p>
                <p>Name: {data.firstName} {data.lastName}</p>
                <p>Decks:</p>
                <ul>
                {data.decks.map(function (deck) {
                    return <li key={deck.name}>{deck.name}</li>
                })}
                </ul>
            </span>)
    } else {
        return (<span><p>No user data found</p></span>)
    }
}

export default User