import React from 'react';
import PropTypes from 'prop-types';
import styles from './External.css';
import { Slot } from 'plugin-api/beta/client/components';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import { t } from 'plugin-api/beta/client/services';

const External = ({ slot, sep }) => (
  <IfSlotIsNotEmpty slot={slot}>
    <div>
      <div className={styles.external}>
        <Slot fill={slot} className={styles.slot} />
      </div>
      <div className={styles.separator}>
        <h1>{sep}</h1>
      </div>
    </div>
  </IfSlotIsNotEmpty>
);

External.propTypes = {
  slot: PropTypes.string.isRequired,
  sep: PropTypes.string,
};

export default External;
