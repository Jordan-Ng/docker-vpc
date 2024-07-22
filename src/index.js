import React from "react";
import {createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import '@mantine/core/styles.css';
import {MantineProvider} from "@mantine/core"


const root = createRoot(document.getElementById("root"));

root.render(
    <MantineProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </MantineProvider>
);