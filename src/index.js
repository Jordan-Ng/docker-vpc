import React from "react";
import {createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import {MantineProvider} from "@mantine/core"
import {Notifications} from "@mantine/notifications"


const root = createRoot(document.getElementById("root"));


root.render(
    <BrowserRouter>
        <MantineProvider>
            <Notifications />
            <App />        
        </MantineProvider>
    </BrowserRouter>        
);