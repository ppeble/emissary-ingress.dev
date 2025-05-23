import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import CodeBlock from '../../../../../src/components/CodeBlock';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar
        elevation={0}
        style={{
          background: 'transparent',
          color: 'black',
          borderBottom: '1px solid #e8e8e8',
        }}
        position="static"
      >
        <Tabs
          TabIndicatorProps={{ style: { background: '#AF5CF8' } }}
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            label="Helm 3"
            {...a11yProps(0)}
            style={{ minWidth: '10%', textTransform: 'none' }}
          />
          <Tab
            label="Helm 2"
            {...a11yProps(1)}
            style={{ minWidth: '10%', textTransform: 'none' }}
          />
          <Tab
            label="Kubernetes YAML"
            {...a11yProps(2)}
            style={{ minWidth: '10%', textTransform: 'none' }}
          />
          <Tab
            label="Edgectl"
            {...a11yProps(3)}
            style={{ minWidth: '10%', textTransform: 'none' }}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/*Helm 3 token install instructions*/}
        Log in to{' '}
        <a href="https://app.getambassador.io/cloud/clusters">Ambassador Cloud</a>.
        Click <b>Add Cluster:Namespace</b>, then{' '}
        <b>Generate a Cloud Token</b>. The slideout contains instructions with a
        unique <code>cloud-connect-token</code> that is used to connect your
        cluster to your Ambassador Cloud account. Click the button provided to copy the cloud connect token so it can be used with the following <code>helm install</code> command.
        <br />
        <CodeBlock>
          {'helm upgrade ambassador --namespace ambassador datawire/ambassador \\' +
            '\n' +
            '  --set agent.cloudConnectToken=$CLOUD_CONNECT_TOKEN && \\' +
            '\n' +
            'kubectl -n ambassador wait --for condition=available --timeout=90s deploy -lproduct=aes'}
        </CodeBlock>
      </TabPanel>

      <TabPanel value={value} index={1}>
        {/*Helm 2 token install instructions*/}
        Log in to{' '}
        <a href="https://app.getambassador.io/cloud/clusters">Ambassador Cloud</a>.
        Click <b>Add Cluster:Namespace</b>, then{' '}
        <b>Generate a Cloud Token</b>. The slideout contains instructions with a
        unique <code>cloud-connect-token</code> that is used to connect your
        cluster to your Ambassador Cloud account. Click the button provided to copy the cloud connect token so it can be used with the following <code>helm install</code> command.
        <br />
        <CodeBlock>
          {'helm upgrade --namespace ambassador ambassador datawire/ambassador \\' +
            '\n' +
            '  --set crds.create=false --set agent.cloudConnectToken=$CLOUD_CONNECT_TOKEN && \\' +
            '\n' +
            'kubectl -n ambassador wait --for condition=available --timeout=90s deploy -lproduct=aes'}
        </CodeBlock>
      </TabPanel>

      <TabPanel value={value} index={2}>
        {/*YAML token install instructions*/}
        Log in to{' '}
        <a href="https://app.getambassador.io/cloud/clusters">Ambassador Cloud</a>.
        Click <b>Add Cluster:Namespace</b>, then{' '}
        <b>Generate a Cloud Token</b>. The slideout contains instructions with a
        unique <code>cloud-connect-token</code> that is used to connect your
        cluster to your Ambassador Cloud account. Click the button provided to copy the cloud connect token so it can be used with the following <code>kubectl</code> command.
        <br />
        <CodeBlock>
          {'kubectl create configmap -n ambassador ambassador-agent-cloud-token \\' +
            '\n' +
            '  --from-literal=CLOUD_CONNECT_TOKEN=$CLOUD_CONNECT_TOKEN'}
        </CodeBlock>
      </TabPanel>

      <TabPanel value={value} index={3}>
        {/*edgectl token install instructions*/}
        Connecting $productName$ that was installed via <code>edgectl</code> is
        identical to the Kubernetes YAML procedure.
        <br />
        Log in to{' '}
        <a href="https://app.getambassador.io/cloud/clusters">Ambassador Cloud</a>.
        Click <b>Add Cluster:Namespace</b>, then{' '}
        <b>Generate a Cloud Token</b>. The slideout contains instructions with a
        unique <code>cloud-connect-token</code> that is used to connect your
        cluster to your Ambassador Cloud account. Click the button provided to copy the cloud connect token so it can be used with the following <code>kubectl</code> command.
        <br />
        <CodeBlock>
          {'kubectl create configmap -n ambassador ambassador-agent-cloud-token \\' +
            '\n' +
            '  --from-literal=CLOUD_CONNECT_TOKEN=$CLOUD_CONNECT_TOKEN'}
        </CodeBlock>
      </TabPanel>
    </div>
  );
}
