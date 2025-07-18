---
title: 2.5
---

<Alert severity="info">
  This guide covers migrating from Emissary 2.5.Z to Emissary 3.10. If
  this is not your <b>exact</b> situation, see the <a href="../../../../migration-matrix">migration
  matrix</a>.
</Alert>

<Alert severity="warning">
  This guide is written for upgrading an installation made without using Helm.
  If you originally installed with Helm, see the <a href="../../../helm/emissary-2.5/emissary-3.X">Helm-based
  upgrade instructions</a>.
</Alert>

<Alert severity="warning">
  Make sure that you have updated any <code>AuthService</code>s, <code>LogService</code>s and <code>RateLimitService</code>s to use
  <code>protocol_version: "v3"</code> or else an error will be posted and a static response will be returned in 3.10.
</Alert>

Since Emissary's configuration is entirely stored in Kubernetes resources, upgrading
between versions is straightforward.

Emissary 3 is functionally compatible with Emissary 2.x, but with any major upgrade there are some changes to consider. Such as, Envoy removing support for V2 Transport Protocol features. Below we will outline some of these changes and things to consider when upgrading.

### Resources to check before migrating to 3.10.

Emissary 3.X has been upgraded from Envoy 1.17.X to Envoy 1.22 which removed support for the Envoy V2 Transport Protocol. This means all `AuthService`, `RatelimitService`, and `LogServices` must be updated to use the V3 Protocol. Additionally support for some of the runtime bootstrap flags has been removed.

You can refer to the [Major changes in Emissary 3.x](../../../../../../about/changes-3.y/) guide for an overview of the changes.

1. Emissary 3.2 fixed a bug with `Host.spec.selector\mappingSelector` and `Listener.spec.selector` not being properly enforced.
   In previous versions, if only a single label from the selector was present on the resource then they would be associated. Additionally, when associating `Hosts` with `Mappings`, if the `Mapping` configured a `hostname` that matched the `hostname` of the `Host` then they would be associated regardless of the configuration of the `selector\mappingSelector` on the `Host`.

   Before upgrading, review your Ambassador resources, and if you make use of the selectors, ensure that every other resource you want it to be associated with contains all the required labels.

   The environment variable `DISABLE_STRICT_LABEL_SELECTORS` can be set to `"true"` on the Emissary deployment to revert to the
   old incorrect behavior to help prevent any configuration issues after upgrading in the event that not all manifests making use of the selectors have been corrected yet.

   For more information on `DISABLE_STRICT_LABEL_SELECTORS` see the [Environment Variables page](../../../../../running/environment#disable_strict_label_selectors).

2. Check Transport Protocol usage on all resources before migrating.

    The `AuthService`, `RatelimitService`, and `LogServices` that use the `grpc` protocol will now need to explicilty set `protocol_version: "v3"`. If not set or set to `v2` then an error will be posted and a static response will be returned.

    `protocol_version` should be updated to `v3` for all of the above resources while still running Emissary $versionTwoX$. As of version `2.3.z`+, support for `protocol_version` `v2` and `v3` is supported in order to allow migration from `protocol_version` `v2` to `v3` before upgrading to Emissary 3.10 where support for `v2` is removed.

    Upgrading any application code for your own implementations of these services is very straightforward.

    The following imports simply need to be updated to switch from Envoy's Transport Protocol `v2` to `v3`, and then the configuration for these resources can be updated to add the `protocl_version: "v3"` when the updated service is deployed.

    `v2` Imports:
    ```golang
	    envoyCoreV2 "github.com/datawire/ambassador/pkg/api/envoy/api/v2/core"
	    envoyAuthV2 "github.com/datawire/ambassador/pkg/api/envoy/service/auth/v2"
	    envoyType "github.com/datawire/ambassador/pkg/api/envoy/type"
    ```

    `v3` Imports:
    ```golang
	    envoyCoreV3 "github.com/datawire/ambassador/v2/pkg/api/envoy/config/core/v3"
	    envoyAuthV3 "github.com/datawire/ambassador/v2/pkg/api/envoy/service/auth/v3"
	    envoyType "github.com/datawire/ambassador/v2/pkg/api/envoy/type/v3"
    ```

3. Check removed runtime changes

   ```yaml
   # No longer necessary because this was removed from Envoy
   # Emissary already was converted to use the compressor API
   # https://www.envoyproxy.io/docs/envoy/v1.22.0/configuration/http/http_filters/compressor_filter#config-http-filters-compressor
   "envoy.deprecated_features.allow_deprecated_gzip_http_filter": true,

   # Upgraded to v3, all support for V2 Transport Protocol removed
   "envoy.deprecated_features:envoy.api.v2.route.HeaderMatcher.regex_match": true,
   "envoy.deprecated_features:envoy.api.v2.route.RouteMatch.regex": true,

   # Developers will need to upgrade TracingService to V3 protocol which no longer supports HTTP_JSON_V1
   "envoy.deprecated_features:envoy.config.trace.v2.ZipkinConfig.HTTP_JSON_V1": true,

   # V2 protocol removed so flag no longer necessary
   "envoy.reloadable_features.enable_deprecated_v2_api": true,
   ```

4. Support for LightStep tracing driver removed

<Alert severity="warning">
  As of Emissary 3.4.Z, the <code>LightStep</code> tracing driver is no longer supported. To ensure you do not drop any tracing data, be sure to read before upgrading.
</Alert>

Emissary 3.4 is based on Envoy 1.24.1 which removed support for the `LightStep` tracing driver. The team at LightStep and the maintainers of Envoy-Proxy recommend that users instead leverage the OpenTelemetry Collector to send tracing information to LightStep. We have written a guide which can be found here <a href="/docs/emissary/latest/howtos/tracing-lightstep">Distributed Tracing with OpenTelemetry and Lightstep</a> that outlines how to set this up. **It is important that you follow this upgrade path prior to upgrading or you will drop tracing data.**

## Migration Steps

Migration is a two-step process:

1. **Install new CRDs.**

   After reviewing the changes in 3.x and confirming that you are ready to upgrade, the process is the same as upgrading minor versions
   in previous version of Emissary and does not require the complex migration steps that the migration from 1.x tto 2.x required.

   Before installing Emissary 3.10 itself, you need to update the CRDs in
   your cluster. This is mandatory during any upgrade of Emissary.

   ```bash
   kubectl apply -f https://app.getambassador.io/yaml/emissary/3.10/emissary-crds.yaml
   kubectl wait --timeout=90s --for=condition=available deployment emissary-apiext -n emissary-system
   ```

   <Alert severity="info">
     Emissary 3.10 includes a Deployment in the `emissary-system` namespace
     called <code>emissary-apiext</code>. This is the APIserver extension
     that supports converting Emissary CRDs between <code>getambassador.io/v2</code>
     and <code>getambassador.io/v3alpha1</code>. This Deployment needs to be running at
     all times.
   </Alert>

   <Alert severity="warning">
     If the <code>emissary-apiext</code> Deployment's Pods all stop running,
     you will not be able to use <code>getambassador.io/v3alpha1</code> CRDs until restarting
     the <code>emissary-apiext</code> Deployment.
   </Alert>

   <Alert severity="warning">
    There is a known issue with the <code>emissary-apiext</code> service that impacts all Emissary 2.x and 3.x users. Specifically, the TLS certificate used by apiext expires one year after creation and does not auto-renew. All users who are running Emissary/Ambassador Edge Stack 2.x or 3.x with the apiext service should proactively renew their certificate as soon as practical by running <code>kubectl delete --all secrets --namespace=emissary-system</code> to delete the existing certificate, and then restart the <code>emissary-apiext</code> deployment with <code>kubectl rollout restart deploy/emissary-apiext -n emissary-system</code>.
    This will create a new certificate with a one year expiration. We will issue a software patch to address this issue well before the one year expiration. Note that certificate renewal will not cause any downtime.
   </Alert>

2. **Install Emissary 3.10.**

   After installing the new CRDs, upgrade Emissary 3.10.

   <Alert severity="info">
     Our <a href="https://app.getambassador.io/yaml/emissary/3.10/emissary-emissaryns.yaml"><code>emissary-emissaryns.yaml</code></a> file
     uses the `emissary` namespace, since this is the default for Emissary.
     We also publish <a href="https://app.getambassador.io/yaml/emissary/3.10/emissary-defaultns.yaml"><code>emissary-defaultns.yaml</code></a> for the
     `default` namespace. For any other namespace, you should download one of these files and edit the namespaces manually.
   </Alert>

   ```bash
   kubectl apply -f https://app.getambassador.io/yaml/emissary/3.10/emissary-emissaryns.yaml && \
   kubectl rollout status  -n emissary deployment/emissary-ingress -w
   ```
