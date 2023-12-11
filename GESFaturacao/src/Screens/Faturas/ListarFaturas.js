import React from 'react';
import { StyleSheet, Text, ScrollView,ToastAndroid,LogBox,TextInput,Modal } from 'react-native';


export default function ListarFaturas({navigation, route}) {
  
  return (
    <ScrollView>
      <Text style={styles.titleSelect}>Hello there!</Text>
    </ScrollView>
  );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e5e9ec',
      alignItems: 'center',
      justifyContent: 'flex-start',
      
    },
    touch: {
        flex:1,
        alignItems: 'center',
        marginTop:10,
        backgroundColor: '#d0933f',
    },
    button: {
      alignItems:'center',
      backgroundColor:'#d0933f',
      marginTop:16,
      marginBottom:5,
      width: 300,
      padding: 10,
    },
    icon: {
      position:'absolute',
      left:50,
    },
    textfont: {
      fontSize: 25,
      fontWeight: "bold",
      color:'#ffffff',
    },
    pickerComponent: {
      width: 350,
      
    },
    textSelect: {
      fontSize: 20,
      padding: 10,
      fontWeight: 'bold'
    },
    titleSelect: {
      fontSize: 20,
      margin: 10,
      fontWeight: "bold",
      color: "#5F5D5C"
    },
    borderMargin: {
      borderWidth: 1,
      borderColor: 'grey',
      marginLeft:10,
      marginRight:10,
      height:50,
      justifyContent: 'center',
    },
    dateComponent: {
        width: 350
    },
    touchableO: {
      width: 350,
      height: 55
    },
    textDate: {
      marginLeft:15,
      marginTop:15,
      fontSize: 16,
      color:"#000000"
    },
    marginTOPButton: {
      margin: 20
    },
    marginTOPButton2: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 7
    }
  });