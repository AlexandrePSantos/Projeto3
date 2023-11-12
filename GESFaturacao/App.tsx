import * as React from 'react';
import AppNav from './src/Navigation/AppNav';
import {AuthProvider} from './src/Context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      {/* Rest of your app code */}
      <AppNav />
    </AuthProvider>
  );
};


export default App;