import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Button, Modal, Portal, Provider, Text, TextInput } from 'react-native-paper'

import { connectionContext } from './contexts/ConnectionContext'

export default function SignIn({navigation}) {
  const { connection, setConnection } = useContext(connectionContext)

  const [showPassword, setShowPassword] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const [middleware, setMiddleware] = useState('')
  const [server, setServer] = useState('')
  const [database, setDatabase] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (success === true) {
      setConnection({
        middleware: middleware,
        server: server,
        database: database,
        username: username,
        password: password
      })
    }
  }, [success])

  useEffect(() => {
    if (success === true) {
      setLoading(false)
      navigation.navigate('Home')
    }
  }, [connection])

  const getConnectionSuccess = async () => {
    try {
      const response = await fetch(middleware + '/connect', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          server: server,
          database: database,
          username: username,
          password: password
        })
      })
      const json = await response.json()
      setSuccess(json.success)
    } catch (error) {
      setShowErrorModal(true)
      setLoading(false)
    }
  }

  return (
    <Provider>
    <Portal>
      <Modal
        visible={showErrorModal}
        onDismiss={() => {setShowErrorModal(false)}}
        contentContainerStyle={styles.errorModal}
      >
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Erro ao acessar servidores!</Text>
        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 20}}>Verifique os dados de conexão e tente novamente.</Text>
        <Button
          style={{padding: 5, marginTop: 20}}
          mode='contained'
          onPress={() => {
            setShowErrorModal(false)
          }}
        >
          Fechar
        </Button>
      </Modal>
    </Portal>
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container} >
          <Text style={styles.login}>Acessar servidores</Text>

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Servidor Middleware'
            value={middleware}
            onChangeText={(text) => setMiddleware(text)}
            left={
              <TextInput.Icon
                name='server'
                size={25}
                color='black'
              />
            }
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Servidor PostgreSQL/PostGIS'
            value={server}
            onChangeText={(text) => setServer(text)}
            left={
              <TextInput.Icon
                name='server'
                size={25}
                color='black'
              />
            }
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Banco de Dados'
            value={database}
            onChangeText={(text) => setDatabase(text)}
            left={
              <TextInput.Icon
                name='database'
                size={25}
                color='black'
              />
            }
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Nome de usuário'
            value={username}
            onChangeText={(text) => setUsername(text)}
            left={
              <TextInput.Icon
                name='account'
                size={25}
                color='black'
              />
            }
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Senha'
            value={password}
            onChangeText={(text) => setPassword(text)}
            left={
              <TextInput.Icon
                name='lock'
                size={25}
                color='black'
              />
            }
            secureTextEntry={showPassword}
            right={
              showPassword ? (
                <TextInput.Icon
                  name='eye'
                  size={25}
                  color='black'
                  onPress={() => setShowPassword(!showPassword)}
                />
              ) : (
                <TextInput.Icon
                  name='eye-off'
                  size={25}
                  color='black'
                  onPress={() => setShowPassword(!showPassword)}
                />
              )
            }
          />

          <Button
            mode='contained'
            style={styles.loginButton}
            disabled={loading}
            loading={loading}
            onPress={() => {
              setLoading(true)
              getConnectionSuccess()
            }}
          >Acessar</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginTop: '20%',
    alignSelf: 'center'
  },
  login: {
    marginBottom: 24,
    fontSize: 40,
    fontWeight: 'bold'
  },
  textInput: {
    marginBottom: 10
  },
  loginButton: {
    marginTop: 30,
    marginBottom: '20%',
    padding: 5
  },
  errorModal: {
    width: '90%',
    padding: 20,
    alignSelf: 'center',
    borderRadius: 5,
    backgroundColor: '#FFF'
  }
})