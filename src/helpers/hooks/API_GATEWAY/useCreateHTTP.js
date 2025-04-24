import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import fx from '../../fx'

const useCreateHTTP_hooks = () => {
    const [active, setActive] = useState(0)
    // const [integrations, setIntegrations] = useState([])
    const navigate = useNavigate()
    const [configSummary, setConfigSummary] = useState({
        name: "",
        integrations: [],
        serviced_routes: []
    })
    const [integrationOptions, setIntegrationOptions] = useState([
        {
            group: "Instances", 
            items: [],
        },
        {   group: "LB Clusters", 
            items: []
        }
    ])

    const next = () => setActive(active+1)
    const back = () => setActive(active-1)

    const populateIntegrationOptions = async () => {
        const vi_options = await fx.api.list_vi_names()
        const lb_options = await fx.api.list_lb_names()

        setIntegrationOptions(prevState => {
            prevState[0].items = JSON.parse(vi_options)
            prevState[1].items = JSON.parse(lb_options)
            return prevState
         })
    }

    const handleFieldChange = (field, value) => {
        setConfigSummary({
            ...configSummary,
            [field] : value
        })
    }

    const handleSubmit = () => {
        navigate("/api-gateway/http/new", {
            state: {
                ...configSummary,
                name: `gw_${configSummary.name}`
            }
        })
    }

    return {
        active, 
        next, 
        back, 
        setActive,
        handleFieldChange,
        configSummary,
        populateIntegrationOptions, 
        integrationOptions, 
        setIntegrationOptions,
        handleSubmit
    }

}

export default useCreateHTTP_hooks