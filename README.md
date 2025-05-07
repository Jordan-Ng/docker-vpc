# Docker VPC (Docker Virtual Private Cloud)

Mac GUI for AWS-like console for creating, managing and orchestrating cloud services with docker.  

> ***NOTE:*** VMs (virtual machines) are not Containers. They are two different virtualization techniques. EC2 instances are virtualized using virtual machines (type 1 hypervisor) under the hood, while containers isolate work environments using user groups (cgroups) while sharing the underlying host OS. 
>
> Containerization was selected as a design choice for latency concerns, since the application is meant for a local development environment. Read more about the architecture [here](./markdowns/design_considerations.md)
> 
> For more information about the motivation behind this project, Read more [here](./markdowns/FAQ.md)
>
> Check the version history [here](./markdowns/version_history.md)


## Sample Usage
See DockerVPC in action [here!](https://jiaweing930113.wixsite.com/my-site-1/projects)


## Installation
This installation guide assumes that NodeJS runtime is available on the target machine.

> *** NOTE: *** The installation steps are to get the application running in development mode. Production mode to follow

```
$ git clone https://github.com/Jordan-Ng/docker-vpc.git               
$ cd docker-vpc                                     
$ chmod +x ./bin                         
$ sh ./bin/install.sh                                           // install docker + colima
$ npm install
$ npm run dev                           
```




    
