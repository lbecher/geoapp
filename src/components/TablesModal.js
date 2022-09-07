import React, { useContext, useState } from "react";
import { StyleSheet, FlatList, View, Modal, Pressable } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'

import { layersContext } from '../context/layersContext'

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

const Item = ({item}) => {
  const { setGetThisTable } = useContext(layersContext)
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.iconsGroup}>
        <Pressable
          onPress={() => {
            setGetThisTable(item.name)
          }}
        >
          <Icon name='download' size={20} style={styles.icons} />
        </Pressable>
      </View>
    </View>
  )
}

const List = () => {
  const { tables } = useContext(layersContext)

  const renderItem = ({item}) => <Item item={item} key={Math.random().toString()} />

  return (
    <View style={styles.container}>
      <FlatList data={tables} renderItem={renderItem} />
    </View>
  )
}

const TablesModal = ({tablesModalVisibility, setTablesModalVisibility}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={tablesModalVisibility}
      onRequestClose={() => {
        setTablesModalVisibility(false)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setTablesModalVisibility(false)}
          >
            <Icon name="close" size={30} />
          </Pressable>
          <List />
        </View>
      </View>
    </Modal>
  )
}

export default TablesModal