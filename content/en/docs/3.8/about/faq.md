---
title: Frequently Asked Questions
---

## General

### Why Emissary-ingress?

Kubernetes shifts application architecture for microservices, as well as the
development workflow for a full-cycle development. Emissary-ingress is designed for
the Kubernetes world with:

* Sophisticated traffic management capabilities (thanks to its use of [Envoy Proxy](https://www.envoyproxy.io)), such as load balancing, circuit breakers, rate limits, and automatic retries.
* A declarative, self-service management model built on Kubernetes Custom Resource Definitions, enabling GitOps-style continuous delivery workflows.

We've written about [the history of Emissary-ingress](https://blog.getambassador.io/building-ambassador-an-open-source-api-gateway-on-kubernetes-and-envoy-ed01ed520844), [Why Emissary-ingress In Depth](../why-ambassador), [Features and Benefits](../features-and-benefits) and about the [evolution of API Gateways](../../topics/concepts/microservices-api-gateways/).

### How does Emissary-ingress use Envoy Proxy?

Emissary-ingress uses [Envoy Proxy](https://www.envoyproxy.io) as its core proxy. Envoy is an open-source, high-performance proxy originally written by Lyft. Envoy is now part of the Cloud Native Computing Foundation.

### Is Emissary-ingress production ready?

[//]: # (+FIX+ Check for OSS)

Yes. Thousands of organizations, large and small, run Emissary-ingress in production.
Public users include Chick-Fil-A, ADP, Microsoft, NVidia, and AppDirect, among others.

### What is the performance of Emissary-ingress?

There are many dimensions to performance. We published a benchmark of [Emissary-ingress performance on Kubernetes](/resources/envoyproxy-performance-on-k8s/). Our internal performance regressions cover many other scenarios; we expect to publish more data in the future.

### What's the difference between a service mesh (such as Istio) and Emissary-ingress?

[//]: # (+FIX+ Check for OSS)

Service meshes focus on routing internal traffic from service to service
("east-west"). Emissary-ingress focuses on traffic into your cluster ("north-south").
While both a service mesh and Emissary-ingress can route L7 traffic, the reality is that
these use cases are quite different. Many users will integrate Emissary-ingress with a
service mesh. Production customers of Emissary-ingress have integrated with Consul,
Istio, and Linkerd2.

## Common Configurations

### How do I disable the default Admin mappings?

See the [Protecting the Diagnostics Interface](../../howtos/protecting-diag-access) how-to.

## Troubleshooting

### How do I get help for Emissary-ingress?

We have an online [Slack community](http://a8r.io/slack) with thousands of
users. We try to help out as often as possible, although we can't promise a
particular response time. If you need a guaranteed SLA, we also have commercial
contracts. [Contact sales](/contact-us/) for more information.

### What do I do when I get the error `no healthy upstream`?

This error means that Emissary-ingress could not connect to your backend service.
Start by verifying that your backend service is actually available and
responding by sending an HTTP response directly to the pod. Then, verify that
Emissary-ingress is routing by deploying a test service and seeing if the mapping
works. Then, verify that your load balancer is properly routing requests to
Emissary-ingress. In general, verifying each network hop between your client and
backend service is critical to finding the source of the problem.
