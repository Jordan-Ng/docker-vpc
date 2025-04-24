import React from 'react'
import { Box, LoadingOverlay, Text, Loader, Space, Kbd, Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

const SSHOverlay = ({message, isVisible}) => 
(<LoadingOverlay visible={!isVisible} overlayProps={{blur: 30}} loaderProps={{children: 
    <div>
        <Text fw={500}><Loader size="xs" mr="sm"/> 
        Temporarily blocked. Please interact with spawned terminal
        </Text>
        <Text size="sm">When you are ready to end the shell session, hit &nbsp; <Kbd>⌘</Kbd> + <Kbd>Q</Kbd> &nbsp; on the terminal to resume on the main window</Text>
        
        <Text size="xs" mt="xs" c="teal">* Please allow up to 5 seconds for cleanup process to trigger (due to polling)</Text>

        <Space h="xl"/>
        <Text size="sm" fw={500} c="blue" ta="center">Status: {message}</Text>
        <Space h="xl"/>

        <Alert variant="light" color="yellow" title="Trying To Be Smart?" icon={<IconInfoCircle />} style={{width: "500px"}}>
            The spawned terminal is a new process instance of the Terminal application,
            with an automated connection to the container instance of your choice.
            As a fully operational shell, one may be tempted to <Kbd>exit</Kbd> the connection,
            and run something destructive like <Kbd>rm -rf /</Kbd>. Try it, it's your funeral. 
        </Alert>
    </div>
    }}/>)

export default SSHOverlay