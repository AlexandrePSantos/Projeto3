import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  
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
      backgroundColor: '#BE6E31',
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