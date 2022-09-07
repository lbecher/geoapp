import React, {createContext, useState} from 'react'

const connectionContext = createContext({})

const ConnectionContextProvider = ({children}) => {
  const [connection, setConnection] = useState({
    middleware: 'http://localhost:8080',
    server: 'localhost:5432',
    database: 'teste1',
    username: 'postgres',
    password: '123456'
  })

  return (
    <connectionContext.Provider value={{connection, setConnection}}>
      {children}
    </connectionContext.Provider>
  )
}

export {connectionContext, ConnectionContextProvider}