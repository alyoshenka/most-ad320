import React, { useState } from 'react'
import axios from 'axios'
import jwt from 'jwt-decode'

const AuthContext = React.createContext(null)

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)

    const login = async (email, password, callback) => { 
        console.log("[Login]")
        try{
            const authResponse = await axios.post(
                'http://localhost:8000/auth/login', 
                { email: email, password: password  }, 
                { 'content-type': 'application/json' }
            )
            const decoded = jwt(authResponse.data.token)
            setAuth({ token: authResponse.data.token, user: decoded.user })
            callback()
        } catch (err) {
            console.log(`Login error ${err}`)
            alert('Login error, try again')
            callback()
        }
    }

    const register = async (email, password, firstName, lastName, callback) => { 
        console.log("[Register]")     
        try{
            const regResponse = await axios.post(
                'http://localhost:8000/auth/register', 
                { email: email, password: password, firstName: firstName, lastName: lastName }, 
                { 'content-type': 'application/json' }
            )
            callback(null)
        } catch (err) {
            console.log(`Registration error ${err}`)  
            alert('Registration error, try again')           
            callback('/register')
        }
    }

    const authCtx = {
        auth: auth,
        login: login,
        register: register
    }

    return (
        <AuthContext.Provider value={authCtx}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const authContext = React.useContext(AuthContext)
    return authContext
}

export default AuthProvider