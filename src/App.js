import React from 'react';
import {AppShell} from './components';
import Volumes from "./pages/Volumes"
import CreateInstances from "./pages/CreateInstances"
import InstanceTypes from "./pages/InstanceTypes"
import EC2Dashboard from "./pages/EC2Dashboard"
import NewInstanceProvision from "./pages/NewInstanceProvision"

const App = () => {
    
  return (<AppShell 
    child={
      // <Volumes />
      // <InstanceTypes />
      <CreateInstances /> 
      // <NewInstanceProvision />
      // <EC2Dashboard />
    } 
    />);
};

export default App
