import React, {useState, useEffect} from 'react';

import {Routes, Route, Link, useLocation, useNavigate} from "react-router-dom"

import {AppShell, Table} from './components';
import navigationMenu from './constants/NAVIGATION';

const App = () => {
  const [currentService, setCurrentService] = useState("EC2")
  const currentServicedRoutes = navigationMenu[currentService]

  return (
    <>
      <AppShell 
      
        child={
          <Routes>            

            {Object.keys(currentServicedRoutes).map((rt, ind) => {
              if (currentServicedRoutes[rt].type == "non-collapsible"){
                return(
                  <Route 
                    key={ind} 
                    path={currentServicedRoutes[rt].route} 
                    element={currentServicedRoutes[rt].component}/>
                )
              }

              return(
                <Route key="key" path={currentServicedRoutes[rt].route}>

                    {Object.keys(currentServicedRoutes[rt]).map((label, ind) => {
                      
                      if (label == "type" || label == "route") return                      

                      return(
                        <Route key={ind} path={currentServicedRoutes[rt][label].route}>
                          <Route index element={currentServicedRoutes[rt][label].component}/>
                          
                          {currentServicedRoutes[rt][label].childRoutes &&
                            Object.keys(currentServicedRoutes[rt][label].childRoutes).map((cr,id) => {
                              return(
                                <Route 
                                  key={id}
                                  path={currentServicedRoutes[rt][label].childRoutes[cr].route} 
                                  element={currentServicedRoutes[rt][label].childRoutes[cr].component}/>
                              )
                            })}
                            
                        </Route>                                                             
                      )

                    })}
                </Route>
              )})}                          
          </Routes>}
        
        currentService={currentService}
      />      
    </>
    );
};

export default App