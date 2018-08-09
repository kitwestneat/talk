import React from 'react';
import { Dialog, TabBar, Tab, TabContent,TabPane } from 'plugin-api/beta/client/components/ui';
import styles from './Main.css';
import PropTypes from 'prop-types';
import SignIn from '../containers/SignIn';
import SignUp from '../containers/SignUp';
import ForgotPassword from '../containers/ForgotPassword';
import ResendEmailConfirmation from '../containers/ResendEmailConfirmation';
import * as views from '../enums/views';

const Main = ({ setView, view, onResetView }) => (
  <Dialog className={styles.dialog} id="signInDialog" open={true}>
    {view !== views.SIGN_IN && view !== views.SIGN_UP && (
      <span className={styles.close} onClick={onResetView}>
        ×
      </span>
    )}
    {(view == views.SIGN_IN || view == views.SIGN_UP) && (
        <div id="herpderp">
            <TabBar onTabClick={setView} activeTab={view}>
                <Tab tabId={views.SIGN_IN}>Sign In</Tab>
                <Tab tabId={views.SIGN_UP}>Sign Up</Tab>
            </TabBar>
            <TabContent activeTab={view}>
                <TabPane tabId={views.SIGN_IN}><SignIn /></TabPane>
                <TabPane tabId={views.SIGN_UP}><SignUp /></TabPane>
            </TabContent>
        </div>
    )}
    {view === views.FORGOT_PASSWORD && <ForgotPassword />}
    {view === views.RESEND_EMAIL_CONFIRMATION && <ResendEmailConfirmation />}
  </Dialog>
);

Main.propTypes = {
  view: PropTypes.string.isRequired,
  onResetView: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};

export default Main;
