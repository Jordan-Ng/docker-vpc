import React from "react";
import {createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { TerminalContextProvider } from "react-terminal";
import App from "./App";

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import {MantineProvider} from "@mantine/core"
import {Notifications} from "@mantine/notifications"


const root = createRoot(document.getElementById("root"));


root.render(
    <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>            
        <MantineProvider>
            <Notifications />            
                <App />                    
        </MantineProvider>        
    </BrowserRouter>        
);