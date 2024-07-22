import React from 'react';
import {AppShell} from './components';
import Volumes from "./pages/Volumes"

const App = () => {
    
  return (<AppShell child={<Volumes />} />);
};

export default App
