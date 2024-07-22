# Docker VPC (Docker Virtual Private Cloud)

Mac GUI with UI identical to AWS console for creating, managing and orchestrating cloud services with docker.  

> ***NOTE:*** VMs (virtual machines) are not Containers. They are two different virtualization techniques. EC2 instances are virtualized using virtual machines (type 1 hypervisor) under the hood, while containers isolate work environments using user groups (cgroups) while sharing the underlying host OS. 
>
> Containerization was selected as a design choice for latency concerns, since the application is meant for a local development environment. Read more [here]()
> 
> For more information about the motivation behind this project as well as pre-requisite knowledge on cloud computing, Read more [here]()


## Installation
To be Addressed

## Version History
### V1.0 - EC2 (Elastic Cloud Computing)
Features supported
* EC2 User Data (Bootstrap script)
* ELB (Elastic load balancer) - ALB specifically (application load balancer)
* AMI (private)

Unsupported
* ENI (elastic network interface)
* Multi AZ replication/failover
* Security groups 
* Placement groups


    