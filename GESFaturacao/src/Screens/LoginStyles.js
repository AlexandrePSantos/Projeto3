import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      },
      containerLogo: {
        justifyContent: 'center',
        marginBottom: 170,
        marginTop: 60,
        },
      container: {
        flex: 1,
        alignItems: 'center',
        width: '90%',
      },
      input: {
        backgroundColor: '#fff',
        width: '80%',
        marginBottom: 15,
        borderRadius: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#BE6E31',
      },
      btnSignIn: {
        backgroundColor: '#BE6E31',
        borderRadius: 7,
        marginBottom: 15,
        marginTop: 15,
      },
      signIn: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
        color:'#ffffff',
      },
      inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        position: 'relative',
      },
      showPasswordButton: {
        position: 'absolute',
        right: 10,
        top: '27%',

      },
    });