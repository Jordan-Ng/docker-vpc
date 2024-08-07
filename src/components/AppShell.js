import React from 'react';
import { AppShell as Appshell, Burger, Group, Skeleton, Image, Space, Text, alpha } from '@mantine/core';
import Logo from "../assets/logo.png"
import { useDisclosure } from '@mantine/hooks';

const AppShell = ({child}) => {
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

    <Appshell.Navbar p="md">

        <Burger opened={desktopOpened} onClick={toggleDesktop} size="sm"  style={{width: "100%", display: "flex", justifyContent: desktopOpened ? "right" : "center", alignItems: "center"}}/>

      {desktopOpened ? Array(15)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} mt="sm" animate={false} />
            
        )) : ""}
    </Appshell.Navbar>

    <Appshell.Main bg="whitesmoke">{child}</Appshell.Main>

    <Appshell.Aside></Appshell.Aside>
    
  </Appshell>
  )
}

export default AppShell