---
title: Ambassador module defaults
weight: 4
---

If present, the `ambassador Module` can define a set of defaults that will automatically be applied to certain resources:

```yaml
apiVersion: getambassador.io/v3alpha1
kind:  Module
metadata:
  name:  ambassador
spec:
  config:
    defaults:
      class1:           # This is a class. Different resource types will look in different classes.
        key1: value1    # Within a class, you can set different keys.
        key2: value2
        ...
      class2:
        ...
      top_key1: value1  # If a key isn't found in a resource's class, the system will look in the
      top_key2: value2  # toplevel defaults dictionary for it.
```

### Mapping

Currently, only the `Mapping` resource uses the `defaults` mechanism. `Mapping` looks first for defaultable resources in the `httpmapping` class, including:

- [`add_request_headers`](../../using/headers/add-request-headers)
- [`add_response_headers`](../../using/headers/add-response-headers)
- [`remove_request_headers`](../../using/headers/remove-request-headers)
- [`remove_response_headers`](../../using/headers/remove-response-headers)
