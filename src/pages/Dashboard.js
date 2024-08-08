import {Container, Stack, Group } from "@mantine/core"
import {DonutChart} from '@mantine/charts'
import React, {useState, useEffect} from "react"

const Dashboard = () => {
    return(
        <Container>
            <Stack gap="xl" style={{height: "500px", border: "2px solid blue"}}>
                {/* <Group justify="space-evenly">
                    <DonutChart 
                    data={[
                        { name: 'USA', value: 400, color: 'red' },
                        { name: 'Other', value: 200, color: 'gray.6' },
                    ]}
                    size={166}
                    />

                    <DonutChart 
                    data={[
                        { name: 'USA', value: 400, color: 'red' },
                        { name: 'Other', value: 200, color: 'gray.6' },
                    ]}
                    size={166}
                    />

                    <DonutChart 
                    data={[
                        { name: 'USA', value: 400, color: 'red' },
                        { name: 'Other', value: 200, color: 'gray.6' },
                    ]}
                    size={166}
                    />
    
                </Group> */}

            </Stack>
        </Container>
    )
}

export default Dashboard