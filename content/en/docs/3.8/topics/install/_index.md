---
title: "Install"
description: "This section of the documentation provides installation instructions"
---

# Installing Emissary Ingress

## <img class="os-logo" src="../../images/helm-navy.png"/> Install with Helm

Helm, the package manager for Kubernetes, is the recommended way to install
Emissary Ingress. Full details are in the [Helm instructions.](helm/)

## <img class="os-logo" src="../../images/kubernetes.png"/> Install with Kubernetes YAML

Another way to install Emissary Ingress if you are unable to use Helm is to
directly apply Kubernetes YAML. See details in the
[manual YAML installation instructions.](yaml-install).

## <img class="os-logo" src="../../images/docker.png"/> Try the demo with Docker

The Docker install will let you try the Emissary Ingress locally in seconds,
but is not supported for production workloads. [Try Emissary Ingress on Docker.](docker/)

## Upgrade or migrate to a newer version

If you already have an existing installation of $AESproductName$ or
$OSSproductName$, you can upgrade your instance. The [migration matrix](migration-matrix/)
shows you how.

## Container Images

Although our installation guides will favor using the `docker.io` container registry,
we publish $AESproductName$ and $OSSproductName$ releases to multiple registries.

Starting with version 1.0.0, you can pull the emissary image from any of the following registries:

- `docker.io/emissaryingress/`
- `gcr.io/datawire/`

We want to give you flexibility and independence from a hosting platform's uptime to support
your production needs for $AESproductName$ or $OSSproductName$. Read more about
[Running Emissary Ingress in Production](../running).

# What’s Next?

Emissary Ingress has a comprehensive range of [features](/features/) to
support the requirements of any edge microservice. To learn more about how Emissary Ingress works, along with use cases, best practices, and more,
check out the [Welcome page](../../tutorials/getting-started) or read the [Emissary Ingress
Story](../../about/why-ambassador).
