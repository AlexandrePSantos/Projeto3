import React, { useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../Context/AuthContext';


export default function Home({navigation}) {

  const {logout} = useContext(AuthContext);

  const entrar = () =>{
    navigation.navigate("Ecra2")
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Fatura")}>
          <Text style={styles.menuText}>Criar fatura</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton, styles.shadow]} onPress={() => {logout()}}>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e9ec',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e9ec',
    padding: 10,
  },
  menuButton: {
    padding: 10,
    backgroundColor: '#d0933f',
    marginVertical: 5,
    width: 190,
    height: 50,
    alignItems: "center",
    borderRadius: 7,
  },
  menuText: {
    fontSize: 20,
    fontWeight: "bold",
    color:'#ffffff',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "bold",
    color:'#ffffff',},
  header: {
    backgroundColor: '#e5e9ec',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
  },
  button: {
    marginTop: 50,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  paddingBottom: {
    paddingBottom: 5,
    paddingTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  }
});