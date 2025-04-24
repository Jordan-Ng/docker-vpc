import React from 'react'

import { EC2Dashboard, InstanceTypes, Volumes, LBDashboard, CreateLB, ProvisionLB, CreateInstance, ProvisionInstance } from '../pages'
import { CreateHTTP, ProvisionHTTP, APIGWDashboard } from '../pages/API_GATEWAY'

const type = {
    collapsible: "collapsible",
    nonCollapsible: "non-collapsible"
}

const navigationMenu = {
    "EC2" : {
        "Name": "Elastic Container Compute",
        "Dashboard" : {
            type: type.nonCollapsible,
            route: "/",            
            component : <EC2Dashboard />
        },
        "Instances" : {
            type: type.collapsible,
            route: "/instance",
            "Create Instances" : {
                type: type.nonCollapsible,
                route: "create",
                component: <CreateInstance />,
                childRoutes: {
                    "New Instance Provision" : {
                        type: type.nonCollapsible,                        
                        route: "new",
                        component : <ProvisionInstance />,
                    }
                }
            },            
            "Instance Types" : {
                type: type.nonCollapsible,
                route: "types",
                component: <InstanceTypes />
            }
        },
        "Load Balancer" : {
            type: type.collapsible,
            route: "/load-balancer",
            "Dashboard" : {
                type: type.nonCollapsible,
                route: "dashboard",
                component: <LBDashboard />
            },
            "Create Load Balancer" : {
                type: type.nonCollapsible,
                route: "create",
                component: <CreateLB />,                
                childRoutes: {
                    "New Load Balancer Provision" : {
                        type: type.nonCollapsible,
                        route: "new",
                        component: <ProvisionLB />
                    }
                }
            }
        },
        "Volumes": {
            type: type.nonCollapsible,
            route: "/volumes",
            component: <Volumes />
        }
    },
    "API-GW" : {
        "Name" : "API Gateway",
        "Dashboard" : {
            type: type.nonCollapsible,
            route: "/",
            component: <APIGWDashboard />
        },
        "Create API Gateway" : {
            type: type.collapsible,
            route: "/api-gateway",
            "HTTP API": {
                type: type.nonCollapsible,
                route: "http",
                component: <CreateHTTP />,
                childRoutes: {
                    "New HTTP API-GW Provision" : {
                        type: type.nonCollapsible,
                        route: "new",
                        component: <ProvisionHTTP />
                    }
                }                
            },            
        }
    }
}

export default navigationMenu