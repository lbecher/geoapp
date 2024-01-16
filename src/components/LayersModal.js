import React, { useContext } from "react";
import { StyleSheet, FlatList, View, Modal, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'

import { layersContext } from '../contexts/LayersContext'

const styles = StyleSheet.create({
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
  closeButton: {
    marginBottom: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  item: {
    flex: 2,
    padding: 15,
    flexDirection: 'row',
  },
  name: {
    fontSize: 18,
  },
  iconsGroup: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icons: {
    paddingHorizontal: 5,
  }
})

const Item = ({ item }) => {
  const { removeLayer, geojson } = useContext(layersContext)
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.iconsGroup}>
        <Pressable
          onPress={() => {
            
          }}
        >
          <Icon name={item.visibility ? 'eye' : 'eye-slash'} size={20} style={styles.icons} />
        </Pressable>
        <Pressable
          onPress={() => {
            
          }}
        >
          <Icon name={item.changebility ? 'lock' : 'unlock'} size={20} style={styles.icons} />
        </Pressable>
        <Pressable
          onPress={() => {
            removeLayer(item.id)
          }}
        >
          <Icon name='trash' size={20} style={styles.icons} />
        </Pressable>
      </View>
    </View>
  )
}

const List = () => {
  const { layers } = useContext(layersContext)
  const renderItem = ({item}) => <Item item={item} key={Math.random().toString()} />
  return (
    <View style={styles.container}>
      <FlatList data={layers} renderItem={renderItem} />
    </View>
  )
}

const LayersModal = ({layersModalVisibility, setLayersModalVisibility}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={layersModalVisibility}
      onRequestClose={() => {
        setLayersModalVisibility(false)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setLayersModalVisibility(false)}
          >
            <Icon name="close" size={30} />
          </Pressable>
          <List />
        </View>
      </View>
    </Modal>
  )
}

export default LayersModal