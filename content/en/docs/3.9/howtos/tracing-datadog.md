---
title: Distributed Tracing with Datadog
---

In this tutorial, we'll configure Emissary to initiate a trace on some sample requests, and use DataDog APM to visualize them.

## Before you get started

This tutorial assumes you have already followed Emissary [Getting Started](../../tutorials/getting-started) guide. If you haven't done that already, you should do that now.

After completing the Getting Started guide you will have a Kubernetes cluster running Emissary and the Quote service. Let's walk through adding tracing to this setup.

## 1. Configure the DataDog agent

You will need to configure the DataDog agent so that it uses a host-port and accepts non-local APM traffic, you can follow the DataDog [documentation](https://docs.datadoghq.com/agent/kubernetes/apm/?tab=daemonset) on how to do this.

## 2. Configure Envoy JSON logging

DataDog APM can [correlate traces with logs](https://docs.datadoghq.com/tracing/advanced/connect_logs_and_traces/) if you propagate the current span and trace IDs with your logs.

When using JSON logging with Envoy, Emissary will automatically append the `dd.trace_id` and `dd.span_id` properties to all logs so that correlation works:

```yaml
---
apiVersion: getambassador.io/v3alpha1
kind: Module
metadata:
  name: ambassador
spec:
  config:
    envoy_log_type: json
```

## 3. Configure the TracingService

Next we want to configure a TracingService that will write your traces using the DataDog tracing driver. If you haven't already, update the Emissary deployment to use the `${HOST_IP}` interpolation to get the host IP address from the Emissary containers environment.

Add the following to our environment variables in our Emissary deployment:
```yaml
  - name: HOST_IP
    valueFrom:
      fieldRef:
        fieldPath: status.hostIP
```

And then we can apply our Datadog TracingService.
```yaml
---
apiVersion: getambassador.io/v3alpha1
kind: TracingService
metadata:
  name: tracing
spec:
  service: "${HOST_IP}:8126"
  driver: datadog
  config:
    service_name: test
```

## 4. Generate some requests

Use `curl` to generate a few requests to an existing Emissary mapping. You may need to perform many requests, since only a subset of random requests are sampled and instrumented with traces.

```
$ curl -L $AMBASSADOR_IP/httpbin/ip
```

## 5. Test traces

Once you have made some requests you should be able to [view your traces](https://app.datadoghq.com/apm/traces) within a few minutes in the DataDog UI. If you would like more information on DataDog APM to learn about its features and benefits you can view the [documentation](https://docs.datadoghq.com/tracing/).

## More

For more details about configuring the external tracing service, read the documentation on [external tracing](../../topics/running/services/tracing-service).
