import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import People from '../components/People';
import PropTypes from 'prop-types';
import { showBanUserDialog } from 'actions/banUserDialog';
import { showSuspendUserDialog } from 'actions/suspendUserDialog';
import { viewUserDetail } from '../../../actions/userDetail';
import {
  withUnbanUser,
  withUnsuspendUser,
  withSetUserRole,
} from 'coral-framework/graphql/mutations';
import { Spinner } from 'coral-ui';
import withQuery from 'coral-framework/hocs/withQuery';

class MostContainer extends React.Component {
  setUserRole = async (id, role) => {
    await this.props.setUserRole(id, role);
  };

  onSearchChange() {}
  loadMore() {}

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    let users = this.props.root.userMostComments || this.props.root.userMostKarma;

    return (
      <People
        onSearchChange={this.onSearchChange}
        viewUserDetail={this.props.viewUserDetail}
        setUserRole={this.setUserRole}
        showSuspendUserDialog={this.props.showSuspendUserDialog}
        showBanUserDialog={this.props.showBanUserDialog}
        unbanUser={this.props.unbanUser}
        unsuspendUser={this.props.unsuspendUser}
        data={this.props.data}
        root={this.props.root}
        users={users}
        loadMore={this.loadMore}
      />
    );
  }
}

MostContainer.propTypes = {
  setUserRole: PropTypes.func.isRequired,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewUserDetail,
      showSuspendUserDialog,
      showBanUserDialog,
    },
    dispatch
  );

function getQuery(name) {
  const ucFrag = `
            nodes {
              __typename
              id
              username
              role
              created_at
              profiles {
                id
                provider
              }
              state {
                status {
                  banned {
                    status
                  }
                  suspension {
                    until
                  }
                }
              }
            }`;
  return gql`
      query TalkAdmin_Community_${name} {
        user${name} {
        ${ucFrag}
        }
      }
    `;
};

function composeMost(name) {
  return compose(
    connect(null, mapDispatchToProps),
    withSetUserRole,
    withUnsuspendUser,
    withUnbanUser,
    withQuery(getQuery(name), {
      options: {
        fetchPolicy: 'network-only',
      },
    })
  )(MostContainer);
}


const MostComments = composeMost('MostComments');
const MostKarma = composeMost('MostKarma');

export { MostComments, MostKarma };
