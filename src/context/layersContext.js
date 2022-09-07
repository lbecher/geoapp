import React, {createContext, useContext, useEffect, useState} from 'react'

import { connectionContext } from './connectionContext'

const layersContext = createContext({})

const LayersContextProvider = ({children}) => {
  const { connection } = useContext(connectionContext)

  const [layers, setLayers] = useState([])
  const [geojson, setGeojson] = useState([])
  const [tables, setTables] = useState([])

  const [loading, setLoading] = useState(false)
  const [getThisTable, setGetThisTable] = useState('')
  const [error, setError] = useState()
  const [errorModalVisibility, setErrorModalVisibility] = useState(false)

  const addLayer = (_name, _geojson) => {
    const newLayer = {
      id: geojson.length,
      name: _name,
      geojson: _geojson,
      changebility: true,
      visibility: true
    }
    setLayers([...layers, newLayer])
    //setGeojson([...geojson, _geojson])
  }

  const removeLayer = (index) => {
    let _layers = layers
    //let _geojson = geojson
    _layers.splice(index)
    //_geojson.splice(layers[index].id)
    setLayers(_layers)
    //setGeojson(_geojson)
  }

  const setLayerVisibility = (index, value) => {
    let _layers = layers
    _layers[index].visibility = value
    setLayers(_layers)
  }

  const setLayerChangebility = (index, value) => {
    let _layers = layers
    _layers[index].changebility = value
    setLayers(_layers)
  }

  const getTables = async () => {
    setLoading(true)
    try {
      const response = await fetch(connection.middleware + '/listtables', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            server: connection.server,
            database: connection.database,
            username: connection.username,
            password: connection.password
          })
        })
      const json = await response.json()
      setTables(json.tables)
    } catch (error) {
      setError(error)
      setErrorModalVisibility(true)
    }
    setLoading(false)
  }

  const getGeojson = async () => {
    setLoading(true)
    try {
      const response = await fetch(connection.middleware + '/getgeojson', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conn: {
            server: connection.server,
            database: connection.database,
            username: connection.username,
            password: connection.password
          },
          table: getThisTable,
        })
      })
      const json = await response.json()
      addLayer(getThisTable, json.geojson)
    } catch (error) {
      setError(error)
      setErrorModalVisibility(true)
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!(getThisTable === '')) {
      getGeojson()
    }
  }, [getThisTable])

  return (
    <layersContext.Provider
      value={{
        layers,
        geojson,
        tables,
        loading,
        error,
        errorModalVisibility,
        setLayerChangebility,
        setLayerVisibility,
        removeLayer,
        getTables,
        getGeojson,
        setGetThisTable
      }}
    >
      {children}
    </layersContext.Provider>
  )
}

export {layersContext, LayersContextProvider}