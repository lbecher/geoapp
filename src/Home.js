import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Modal, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FAB, Text, Button } from 'react-native-paper'
import MapView, { Marker, Polygon, Polyline, Geojson } from "react-native-maps"
import Toast from 'react-native-simple-toast'
import * as Location from "expo-location"
import * as Turf from '@turf/turf'
import Icon from 'react-native-vector-icons/FontAwesome'

import { connectionContext } from './contexts/ConnectionContext'
import { layersContext } from './contexts/LayersContext'

import LayersModal from './components/LayersModal'
import TablesModal from './components/TablesModal'

const Home = ({ navigation }) => {
  // contextos da aplicação
  const { connection } = useContext(connectionContext)
  const {
    layers,
    geojson,
    tables,
    loading,
    error,
    errorModalVisibility,
    getTables
  } = useContext(layersContext)

  // controles do FAB.Group
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  // controle de visibilidade de modais
  const [layersModalVisibility, setLayersModalVisibility] = useState(false)
  const [tablesModalVisibility, setTablesModalVisibility] = useState(false)

  // controle de visibilidade de componentes
  const [floatingBar, setFloatingBar] = useState(false)

  // 
  const [location, setLocation] = useState(null)

  useEffect(() => {
    (async () => {
      let { status } =
        await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Toast.show('Sem acesso à localização do dispositivo!')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  const [markers, setMarkers] = useState([])
  const [coordArray, setCoordArray] = useState([])

  useEffect(() => {
    if (calculateArea === true || calculateDistance === true) {
      updateCalc()
    }
  }, [coordArray])

  const [markersEnabled, setMarkersEnabled] = useState(false)
  const [calculateDistance, setCalculateDistance] = useState(false)
  const [calculateArea, setCalculateArea] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState(0)

  const handleNewMarker = (coord) => {
    const { latitude, longitude } = coord
    setMarkers([...markers, coord])
    setCoordArray([...coordArray, [latitude, longitude]])
  }

  const updateCalc = () => {
    if (calculateArea === true && coordArray.length > 2) {
      const poly = Turf.polygon([[...coordArray, coordArray[0]]])
      setCalculatedValue((Turf.area(poly)/1000.0).toFixed(6))
    }
    if (calculateDistance === true && coordArray.length > 1) {
      const line = Turf.lineString(coordArray)
      setCalculatedValue(Turf.length(line, {units: 'kilometers'}).toFixed(6))
    }
  }

  const stopCalculate = () => {
    setCalculateArea(false)
    setCalculateDistance(false)
    setMarkersEnabled(false)
    setCalculatedValue(0)
    setMarkers([])
    setCoordArray([])
    setFloatingBar(false)
  }

  const startCalculateDistance = () => {
    stopCalculate()
    setCalculateDistance(true)
    setMarkersEnabled(true)
    setFloatingBar(true)
  }

  const startCalculateArea = () => {
    stopCalculate()
    setCalculateArea(true)
    setMarkersEnabled(true)
    setFloatingBar(true)
  }

  const changeCoordinate = (coord, index) => {
    const { latitude, longitude } = coord
    let _markers = [...markers]
    let _coordArray = [...coordArray]
    _markers[index]= coord
    _coordArray[index] = [latitude, longitude]
    setMarkers(_markers)
    setCoordArray(_coordArray)
  }

  // elementos da página página
  return (
    <SafeAreaView style={styles.container} >
      <LayersModal
        layersModalVisibility={layersModalVisibility}
        setLayersModalVisibility={setLayersModalVisibility}
      />
      <TablesModal
        tablesModalVisibility={tablesModalVisibility}
        setTablesModalVisibility={setTablesModalVisibility}
      />
      { floatingBar && 
        <View style={styles.floatingBar} >
          <Text style={styles.calc}>{calculatedValue} km{calculateArea && '²'}</Text>
          <Pressable style={styles.group} >
            <Button
              mode="outlined"
              onPress={() => {
                stopCalculate()
              }}
            >
              Sair
            </Button>
          </Pressable>
        </View>
      }
      { loading && 
        <View style={styles.floatingBar} >
          <Text style={styles.calc}>Carregando...</Text>
        </View>
      }
      <View style={styles.container} >
        <MapView
          onPress={(e) => {
            if (markersEnabled === true) {
              handleNewMarker(e.nativeEvent.coordinate)
            }
          }}
          style={styles.map}
          initialRegion={{
            latitude: 40.589871,
            longitude: -73.936985,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          loadingEnabled
        >
          { markers.length > 0 &&
            markers.map((coord, index) => {
              return (
                <Marker
                  draggable
                  coordinate={coord}
                  key={Math.random().toString()}
                  onDragEnd={(e) => changeCoordinate(e.nativeEvent.coordinate, index)}
                />
              )
            })
          }
          { layers.length > 0 &&
            layers.map((layer) => {
              if (layer.visibility === true) {
                return (
                  <Geojson
                    geojson={layer.geojson}
                    zIndex={layer.id + 10}
                    key={Math.random().toString()}
                    strokeWidth={3}
                    strokeColor='rgba(32, 64, 255, 1.0)'
                    fillColor='rgba(32, 64, 255, 0.2)'
                  />
                )
              }
            })
          }
          { calculateArea && markers.length > 2 &&
            <Polygon
              coordinates={markers}
              strokeWidth={3}
              strokeColor='rgba(32, 64, 255, 1.0)'
              fillColor='rgba(32, 64, 255, 0.2)'
            />
          }
          { calculateDistance && markers.length > 1 &&
            <Polyline
              coordinates={markers}
              strokeWidth={3}
              strokeColor='rgba(32, 64, 255, 1.0)'
            />
          }
        </MapView>
      </View>
      <FAB.Group
        open={open}
        icon={open ? 'close' : 'menu'}
        actions={[
          {
            icon: 'ruler',
            label: 'Medir distância',
            onPress: () => startCalculateDistance(),
          },
          {
            icon: 'ruler-square',
            label: 'Medir área',
            onPress: () => startCalculateArea(),
          },
          {
            icon: 'menu',
            label: 'Camadas',
            onPress: () => {
              setLayersModalVisibility(true)
            },
          },
          {
            icon: 'menu',
            label: 'Adicionar camadas',
            onPress: () => {
              getTables()
              setTablesModalVisibility(true)
            },
          }
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  floatingBar: {
    width: '80%',
    position: 'absolute',
    marginTop: '10%',
    marginLeft: '10%',
    marginRight: 10,
    padding: 10,
    zIndex: 5,
    borderRadius: 5,
    opacity: 0.8,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  calc: {
    marginTop: 8,
    fontSize: 18,
  },
  group: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  underView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginBottom: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContainer: {
    marginTop: 0,
  },
  modalItem: {
    flex: 2,
    padding: 15,
    flexDirection: 'row',
  },
  modalTitle: {
    fontSize: 18,
  },
  modalIconsGroup: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalIcons: {
    paddingHorizontal: 5,
  }
})

export default Home