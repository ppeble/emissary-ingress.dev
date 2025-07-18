---
title: Why Emissary?
weight: 10
---

Emissary gives platform engineers a comprehensive, self-service edge stack for managing the boundary between end-users and Kubernetes. Built on the [Envoy Proxy](https://www.envoyproxy.io) and fully Kubernetes-native, Emissary is made to support multiple, independent teams that need to rapidly publish, monitor, and update services for end-users. A true edge stack, Emissary can also be used to handle the functions of an API Gateway, a Kubernetes ingress controller, and a layer 7 load balancer (for more, see [this blog post](https://blog.getambassador.io/kubernetes-ingress-nodeport-load-balancers-and-ingress-controllers-6e29f1c44f2d)).

## How Does Emissary work?

Emissary is an open-source, Kubernetes-native [microservices API gateway](../../topics/concepts/microservices-api-gateways) built on the [Envoy Proxy](https://www.envoyproxy.io). Emissary is built from the ground up to support multiple, independent teams that need to rapidly publish, monitor, and update services for end-users. Emissary can also be used to handle the functions of a Kubernetes ingress controller and load balancer (for more, see [this blog post](https://blog.getambassador.io/kubernetes-ingress-nodeport-load-balancers-and-ingress-controllers-6e29f1c44f2d)).

## Cloud-native applications today

Traditional cloud applications were built using a monolithic approach. These applications were designed, coded, and deployed as a single unit. Today's cloud-native applications, by contrast, consist of many individual (micro)services. This results in an architecture that is:

* __Heterogeneous__: Services are implemented using multiple (polyglot) languages, they are designed using multiple architecture styles, and they communicate with each other over multiple protocols.
* __Dynamic__: Services are frequently updated and released (often without coordination), which results in a constantly-changing application.
* __Decentralized__: Services are managed by independent product-focused teams, with different development workflows and release cadences.

### Heterogeneous services

Emissary is commonly used to route traffic to a wide variety of services. It supports:

* configuration on a *per-service* basis, enabling fine-grained control of timeouts, rate limiting, authentication policies, and more.
* a wide range of L7 protocols natively, including HTTP, HTTP/2, gRPC, gRPC-Web, and WebSockets.
* Can route raw TCP for services that use protocols not directly supported by Emissary.

### Dynamic services

Service updates result in a constantly changing application. The dynamic nature of cloud-native applications introduces new challenges around configuration updates, release, and testing. Emissary:

* Enables [progressive delivery](../../topics/concepts/progressive-delivery), with support for canary routing and traffic shadowing.
* Exposes high-resolution observability metrics, providing insight into service behavior.
* Uses a zero downtime configuration architecture, so configuration changes have no end-user impact.

### Decentralized workflows

Independent teams can create their own workflows for developing and releasing functionality that are optimized for their specific service(s). With Emissary, teams can:

* Leverage a [declarative configuration model](../../topics/concepts/gitops-continuous-delivery), making it easy to understand the canonical configuration and implement GitOps-style best practices.
* Independently configure different aspects of Emissary, eliminating the need to request configuration changes through a centralized operations team.

## Emissary is engineered for Kubernetes

Emissary takes full advantage of Kubernetes and Envoy Proxy.

* All of the state required for Emissary is stored directly in Kubernetes, eliminating the need for an additional database.
* The Emissary team has added extensive engineering efforts and integration testing to ensure optimal performance and scale of Envoy and Kubernetes.

## For more information

[Deploy Emissary today](../../tutorials/getting-started) and join the community [Slack Channel](http://a8r.io/slack).

Interested in learning more?

* [Why did we start building Emissary?](https://blog.getambassador.io/building-ambassador-an-open-source-api-gateway-on-kubernetes-and-envoy-ed01ed520844)
* [Emissary Architecture overview](../../topics/concepts/architecture)
