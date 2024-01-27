import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const buttonSize = Dimensions.get('window').width / 2 - 30; // 30 is the total horizontal padding (15 on each side)

const getStyles = (colorScheme) => StyleSheet.create({
  titles: {
    fontSize: 25,
    fontWeight: "bold",
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    textAlign: 'left',
  },
  outerContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  menuButton: {
    width: buttonSize,
    height: 100,
    padding: 10,
    backgroundColor: '#BE6E31',
    marginVertical: 10,
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
    color:'#ffffff',
  },
  header: {
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#e5e9ec',
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
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
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
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
  }
});

export default getStyles;