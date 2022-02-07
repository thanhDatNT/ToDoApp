import React, { useEffect } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import GlobalFont from "../utils/GlobalFont";

export default function Splash({navigation}){
  useEffect(() =>{
    createChannel()
    setTimeout(()=>{
      navigation.replace('Home')
    }, 2000)
  }, [])

  const createChannel =() => {
    // Push notification
  }
  return(
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/images/logo.png')}
      />
      <Text style={[GlobalFont.CustomFont, styles.headerText]}>My To-do List App</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
  },
  logo:{
    width: 100,
    height: 100,
    margin: 20
  },
  headerText:{
    fontSize: 24,
    color: '#49E102'
  }
})