---
title: 1.14
---

<Alert severity="info">
  This guide covers migrating from Emissary 1.14.X to Emissary 2.5. If
  this is not your <b>exact</b> situation, see the <a href="../../../../migration-matrix">migration
  matrix</a>.
</Alert>

<Alert severity="warning">
  This guide is written for upgrading an installation made without using Helm.
  If you originally installed with Helm, see the <a href="../../../helm/emissary-1.14/emissary-2.X">Helm-based
  upgrade instructions</a>.
</Alert>

We're pleased to introduce Emissary 2.5! The 2.X family introduces a number of
changes to allow Emissary to more gracefully handle larger installations (including
multitenant or multiorganizational installations), reduce memory footprint, and improve
performance. In keeping with [SemVer](https://semver.org), Emissary 2.X introduces
some changes that aren't backward-compatible with 1.X. These changes are detailed in
[Major Changes in Emissary 2.X](../../../../../../about/changes-2.x/).

## Migration Overview

<Alert severity="warning">
  <b>Read the migration instructions below</b> before making any changes to your
  cluster!
</Alert>

The recommended strategy for migration is to run Emissary 1.14 and Emissary
2.5 side-by-side in the same cluster. This gives Emissary $versionTwoX$
and Emissary 1.14 access to all the same configuration resources, with some
important caveats:

1. **Emissary 1.14 will not see any `getambassador.io/v3alpha1` resources.**

   This is intentional; it provides a way to apply configuration only to
   Emissary 2.5, while not interfering with the operation of your
   Emissary 1.14 installation.

2. **If needed, you can use labels to further isolate configurations.**

   If you need to prevent your Emissary 2.5 installation from
   seeing a particular bit of Emissary 1.14 configuration, you can apply
   a Kubernetes label to the configuration resources that should be seen by
   your Emissary 2.5 installation, then set its
   `AMBASSADOR_LABEL_SELECTOR` environment variable to restrict its configuration
   to only the labelled resources.

   For example, you could apply a `version-two: true` label to all resources
   that should be visible to Emissary 2.5, then set
   `AMBASSADOR_LABEL_SELECTOR=version-two=true` in its Deployment.

3. **Be careful about label selectors on Kubernetes Services!**

   If you have services in Emissary 1.14 that use selectors that will match
   Pods from Emissary 2.5, traffic will be erroneously split between
   Emissary 1.14 and Emissary 2.5. The labels used by Emissary
   2.5 include:

   ```yaml
   app.kubernetes.io/name: emissary-ingress
   app.kubernetes.io/instance: emissary-ingress
   app.kubernetes.io/part-of: emissary-ingress
   app.kubernetes.io/managed-by: getambassador.io
   product: aes
   profile: main
   ```

4. **Be careful to only have one Emissary Agent running at a time.**

   The Emissary Agent is responsible for communications between
   Emissary and Ambassador Cloud. If multiple versions of the Agent are
   running simultaneously, Ambassador Cloud could see conflicting information
   about your cluster.

   The migration YAML used below to install Emissary 2.5 will not
   install a duplicate agent. If you are building your own YAML, make sure not
   to include a duplicate agent.

You can also migrate by [installing Emissary 2.5 in a separate cluster](../../../../migrate-to-2-alternate).
This permits absolute certainty that your Emissary 1.14 configuration will not be
affected by changes meant for Emissary 2.5, and it eliminates concerns about
ACME, but it is more effort.

## Side-by-Side Migration Steps

Migration is a seven-step process:

1. **Make sure that older configuration resources are not present.**

   Emissary 2.X does not support `getambassador.io/v0` or `getambassador.io/v1`
   resources, and Kubernetes will not permit removing support for CRD versions that are
   still in use for stored resources. To verify that no resources older than
   `getambassador.io/v2` are active, run

   ```
   kubectl get crds -o 'go-template={{range .items}}{{.metadata.name}}={{.status.storedVersions}}{{"\n"}}{{end}}' | fgrep getambassador.io
   ```

   If `v1` is present in the output, **do not begin migration.** The old resources must be
   converted to `getambassador.io/v2` and the `storedVersion` information in the cluster
   must be updated. If necessary, contact Ambassador Labs on [Slack](http://a8r.io/slack)
   for more information.

2. **Install new CRDs.**

   Before installing Emissary 2.5 itself, you must configure your
   Kubernetes cluster to support its new `getambassador.io/v3alpha1` configuration
   resources. Note that `getambassador.io/v2` resources are still supported, but **you
   must install support for `getambassador.io/v3alpha1`** to run Emissary 2.5,
   even if you intend to continue using only `getambassador.io/v2` resources for some
   time.

   ```
   kubectl apply -f https://app.getambassador.io/yaml/emissary/2.5/emissary-crds.yaml
   kubectl wait --timeout=90s --for=condition=available deployment emissary-apiext -n emissary-system
   ```

   <Alert severity="info">
     Emissary 2.5 includes a Deployment in the `emissary-system` namespace
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

3. **Install Emissary 2.5.**

   After installing the new CRDs, you need to install Emissary 2.5 itself
   **in the same namespace as your existing Emissary 1.14 installation**. It's important
   to use the same namespace so that the two installations can see the same secrets, etc.

   We publish two manifests for different namespaces. Use only the one that
   matches the namespace into which you installed Emissary 1.14:

   - [`emissary-emissaryns.yaml`] for the `emissary` namespace; or
   - [`emissary-defaultns.yaml`] for the `default` namespace.

   If you installed Emissary 1.14 into some other namespace, you'll need to
   download one of the files and edit it to match your namespace.

   [`emissary-emissaryns.yaml`]: https://app.getambassador.io/yaml/emissary/2.5/emissary-emissaryns.yaml
   [`emissary-defaultns.yaml`]: https://app.getambassador.io/yaml/emissary/2.5/emissary-defaultns.yaml

   **If you need to set `AMBASSADOR_LABEL_SELECTOR`**, you'll need to download
   your chosen file and and edit it to do so.

   Assuming that you're using the `default` namespace:

   ```
   kubectl apply -f https://app.getambassador.io/yaml/emissary/2.5/emissary-defaultns.yaml && \
   kubectl rollout status -n default deployment/edge-stack -w
   ```

   <Alert severity="info">
     Emissary 2.5 includes a Deployment in the $productNamespace$ namespace
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

4. **Install `Listener`s and `Host`s as needed.**

   An important difference between Emissary 1.14 and Emissary 2.5 is the
   new **mandatory** `Listener` CRD. Also, when running both installations side by side,
   you will need to make sure that a `Host` is present for the new Emissary 2.5
   Service. For example:

   ```bash
   kubectl apply -f - <<EOF
   ---
   apiVersion: getambassador.io/v3alpha1
   kind: Listener
   metadata:
     name: ambassador-http-listener
   spec:
     port: 8080
     protocol: HTTPS
     securityModel: XFP
     hostBinding:
       namespace:
         from: ALL
   ---
   apiVersion: getambassador.io/v3alpha1
   kind: Listener
   metadata:
     name: ambassador-https-listener
   spec:
     port: 8443
     protocol: HTTPS
     securityModel: XFP
     hostBinding:
       namespace:
         from: ALL
   ---
   apiVersion: getambassador.io/v3alpha1
   kind: Host
   metadata:
     name: emissary-host
   spec:
     hostname: $EMISSARY_HOSTNAME
     tlsSecret:
       name: $EMISSARY_TLS_SECRET
   EOF
   ```

   This example requires that you know the hostname for the Emissary Service (`$EMISSARY_HOSTNAME`)
   and that you have created a TLS Secret for it in `$EMISSARY_TLS_SECRET`.

5. **Test!**

   Your Emissary 2.5 installation can support the `getambassador.io/v2`
   configuration resources used by Emissary 1.14, but you may need to make some
   changes to the configuration, as detailed in the documentation on
   [configuring Emissary Communications](../../../../../../howtos/configure-communications)
   and [updating CRDs to `getambassador.io/v3alpha1`](../../../../convert-to-v3alpha1).

   <Alert severity="info">
    Kubernetes will not allow you to have a <code>getambassador.io/v3alpha1</code> resource
    with the same name as a <code>getambassador.io/v2</code> resource or vice versa: only
    one version can be stored at a time.<br/>
    <br/>
    If you find that your Emissary 2.5 installation and your Emissary 1.14
    installation absolutely must have resources that are only seen by one version or the
    other way, see overview section 2, "If needed, you can use labels to further isolate configurations".
   </Alert>

   **If you find that you need to roll back**, just reinstall your 1.14 CRDs and delete your
   installation of Emissary 2.5.

6. **When ready, switch over to Emissary 2.5.**

   You can run Emissary 1.14 and Emissary 2.5 side-by-side as long as you care
   to. However, taking full advantage of Emissary 2.X's capabilities **requires**
   [updating your configuration to use `getambassador.io/v3alpha1` configuration resources](../../../../convert-to-v3alpha1),
   since some useful features in Emissary 2.5 are only available using
   `getambassador.io/v3alpha1` resources.

   When you're ready to have Emissary 2.5 handle traffic on its own, switch
   your original Emissary 1.14 Service to point to Emissary 2.5. Use
   `kubectl edit service ambassador` and change the `selectors` to:

   ```
   app.kubernetes.io/instance: emissary-ingress
   app.kubernetes.io/name: emissary-ingress
   profile: main
   ```

   Repeat using `kubectl edit service ambassador-admin` for the `ambassador-admin`
   Service.


Congratulations! At this point, Emissary 2.5 is fully running and it's safe to remove the `ambassador` and `ambassador-agent` Deployments:

```
kubectl delete deployment/ambassador deployment/ambassador-agent
```

Once Emissary 1.14 is no longer running, you may [convert](../../../../convert-to-v3alpha1)
any remaining `getambassador.io/v2` resources to `getambassador.io/v3alpha1`.
You may also want to redirect DNS to the `edge-stack` Service and remove the
`ambassador` Service.
