import React, { useEffect } from 'react';
import { AppShell as Appshell, Burger, Group, Image, Space, Text, NavLink, Collapse } from '@mantine/core';
import navigationMenu from '../constants/NAVIGATION';
import {Link} from "react-router-dom"
import Logo from "../assets/logo.png"
import { useDisclosure } from '@mantine/hooks';

const AppShell = ({child, currentService}) => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false); 

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
  >
    {/* use tbeme ! */}
    <Appshell.Header bg="#D0EBFF" >
      <Group h="100%" px="md" justify='space-between'>                
        <Image src={Logo} h={50}/> 
        <Group>
            <Text size="sm" >Local</Text>
            <Space w="sm" />
            <Text size="sm">User</Text>
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

      
        {desktopOpened ? Object.keys(navigationMenu[currentService]).map((label, index) => (
          
          navigationMenu[currentService][label].type == "non-collapsible" ? 
            <NavLink 
              // component='button'
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
                  // component='button'
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