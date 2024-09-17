import React from 'react'
import {EC2Dashboard, Volumes, InstanceTypes, CreateInstance, NewInstanceProvision} from '../pages'

const type = {
    collapsible: "collapsible",
    nonCollapsible: "non-collapsible"
}

const navigationMenu = {
    "EC2" : {
        "EC2 Dashboard" : {
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
                        route: ":instance_name",
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
        "Volumes": {
            type: type.nonCollapsible,
            route: "/volumes",
            component: <Volumes />
        }
    }
}

export default navigationMenu