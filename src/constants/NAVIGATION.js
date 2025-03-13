import React from 'react'
import {EC2Dashboard, Volumes, InstanceTypes, CreateInstance, NewInstanceProvision} from '../pages'
import {CreateLB, ProvisionLB, LBDashboard} from "../pages"
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
            // component : (props) =>  <EC2Dashboard {...props}/>
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
                        // route: ":instance_name",
                        route: "new",
                        component : <NewInstanceProvision />,
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
    "API Gateway" : {
        "Name" : "API Gateway"
    }
}

export default navigationMenu