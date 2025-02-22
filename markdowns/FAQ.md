# FAQ

## Why did you build this?
This started off as an attempt to gain familiarity with both AWS and Docker over the summer (I was studying for my AWS certification, and wanted to learn docker). So I tinkered around with both the AWS console and docker functionalities, and quickly found some intersections between the two technologies. (i.e docker volumes can be used as EBS, docker bridge can act as the network between two container/instance, etc.)

One thing lead to another, and this project idea piqued a greater interest. I am now working on this project as my graduate capstone project, and will be sure to develop this further as I see fit.

## Isn't this essentially a wrapper over docker like docker desktop?
![wait! oh nevermind..](./assets/wait_nevermind.jpg)

And you would be right. My only rebuttal to that is that docker desktop aims to provide visibility over the docker environment within your machine. While DockerVPC is essentially doing the same thing, it provides information and a UI that abstracts the intricacies of docker from the developer. This allows for developer that are more familiar with the AWS console, to interact with docker on their machine.

## What is this supposed to solve?
There is an increasing reliance on cloud computing resources, and there are efforts to save on these costs. However, the tradeoffs come at the expense of developers. This project is aimed to save cloud computing costs for local developement workflow, as well as increase visibility and productivity of collaborating developers.

see presentation deck [here](https://docs.google.com/presentation/d/1CADa3ZWlphBf8DTE47WCMSbK0NzzuZHPC7tvvSbhMRo/edit?usp=sharing)


## How is this different from LocalStack? What do you mean by an "AWS-like" interface?
LocalStack is an open source project that has been developed at a much earlier time. It is more mature, and there are many great developers who have worked/are working on it. however, Localstack attempts to provide a 1-1 mapping of AWS console functionalities, and this includes features and functionalitied that may not be pertinent in a local development workflow (i.e IAM, region specific offerings)

DockerVPC attempts to provide a subset of Localstack's functionalities, by removing configurations that are not important in a local development (i.e security), therefore giving an "AWS-like" feel when interacting with the GUI, but with limited functionalities as compared to the actual AWS console.