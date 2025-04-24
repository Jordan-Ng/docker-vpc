import React, { useState, useEffect } from 'react';
import { AppShell as Appshell, Burger, Group, Image, Space, Text, NavLink, Menu, Button } from '@mantine/core';

import navigationMenu from '../../constants/NAVIGATION';
import {Link} from "react-router-dom"
import Logo from "../../assets/logo.png"
import { useDisclosure } from '@mantine/hooks';
import { IconCaretDownFilled } from '@tabler/icons-react';
import fx from "../../helpers/fx"

const AppShell = ({child, currentService, setCurrentService}) => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false); 
  const [user, setUser] = useState("User")

  const getUser = async () => {
    const user = await fx.base.exec("whoami")
    setUser(user.out)
  }
  useEffect(() => {    
    getUser()
  }, [])

  return (
    <Appshell
    header={{ height: 60}} 
    navbar={{
      width: desktopOpened ? 300 : 60,
      breakpoint: 'sm'    
    }} 
    aside = {{
        width: 60
    }}   
    padding="md"
    style={{position: "relative"}}
  >
    {/* use tbeme ! */}
    <Appshell.Header bg="#D0EBFF" >
      <Group h="100%" px="md" justify='space-between'>
        <Group>
          <Image src={Logo} h={45}/> 
          <Menu position="bottom-start" width={350}>
            <Menu.Target>
              <Button variant="transparent" color="gray" rightSection={<IconCaretDownFilled size={15}/>}>                
                {currentService}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Services</Menu.Label>
              <Menu.Divider />
                
                {Object.keys(navigationMenu).map((service, ind) => (
                <Menu.Item key={ind}>
                  
                  <Text c={currentService==service ? "blue" : ""} size='sm' onClick={() => {
                    localStorage.setItem("current-service", service)
                    setCurrentService(service)
                    }}>

                  {navigationMenu[service]["Name"]}
                  </Text>
                </Menu.Item>))}
            </Menu.Dropdown>
          </Menu>
        </Group>                

        <Group>            
            <Text size="sm">{user}</Text>
            <Space w="sm" />
        </Group>
      </Group>
    </Appshell.Header>

    <Appshell.Navbar p="md" >

        <Burger 
          opened={desktopOpened} 
          onClick={toggleDesktop} 
          size="sm"  
          style={{
            width: "100%", 
            display: "flex", 
            justifyContent: desktopOpened ? "right" : "center", 
            alignItems: "center"}}/>

      
        {desktopOpened ? Object.keys(navigationMenu[currentService]).filter(key => key != "Name").map((label, index) => (
          
          navigationMenu[currentService][label].type == "non-collapsible" ? 
            <NavLink               
              component={Link}
              to={navigationMenu[currentService][label].route}
              key={index}
              label={label}
            />
               : 
            <NavLink
              component="button"
              key={index}
              label={label}
            >
              {Object.keys(navigationMenu[currentService][label]).map((sublabel, ind) => {
                if (sublabel == "type" || sublabel == "route") return

                return(<NavLink                   
                  component={Link}
                  to={navigationMenu[currentService][label].route +  "/" + navigationMenu[currentService][label][sublabel].route}
                  key={ind}
                  label={sublabel}
                />)

              })}
            </NavLink>
        )) : ""

        }
    </Appshell.Navbar>
        
    <Appshell.Main bg="whitesmoke">{child}</Appshell.Main>

    <Appshell.Aside></Appshell.Aside>
    
  </Appshell>
  )
}

export default AppShell