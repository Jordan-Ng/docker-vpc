# Docker VPC (Docker Virtual Private Cloud)

Mac GUI with UI identical to AWS EC2 console for creating, managing and orchestrating virtual nodes.

> ***NOTE:*** VMs (virtual machines) are not Containers. They are two different virtualization techniques. EC2 instances are virtualized using virtual machines (type 1 hypervisor) under the hood, while containers isolate work environments using user groups (cgroups) while sharing the underlying host OS. 
>
> Containerization was selected as a design choice for latency concerns, since the application is meant for a local development environment. Read more [here]()