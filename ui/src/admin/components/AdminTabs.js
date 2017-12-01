import React, {PropTypes} from 'react'
import {Tab, Tabs, TabPanel, TabPanels, TabList} from 'shared/components/Tabs'
import UsersTable from 'src/admin/components/UsersTable'
import RolesTable from 'src/admin/components/RolesTable'
import QueriesPage from 'src/admin/containers/QueriesPage'
import DatabaseManagerPage from 'src/admin/containers/DatabaseManagerPage'
import {INFLUX_ENTERPRISE} from 'shared/constants'

const AdminTabs = ({
  users,
  roles,
  permissions,
  source,
  isEditingUsers,
  isEditingRoles,
  onClickCreate,
  onEditUser,
  onSaveUser,
  onCancelEditUser,
  onEditRole,
  onSaveRole,
  onCancelEditRole,
  onDeleteRole,
  onDeleteUser,
  onFilterRoles,
  onFilterUsers,
  onUpdateRoleUsers,
  onUpdateRolePermissions,
  onUpdateUserRoles,
  onUpdateUserPermissions,
  onUpdateUserPassword,
}) => {
  let tabs = [
    {
      type: 'Databases',
      component: <DatabaseManagerPage source={source} />,
    },
    {
      type: 'Users',
      component: (
        <UsersTable
          users={users}
          source={source}
          allRoles={roles}
          onSave={onSaveUser}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          onFilter={onFilterUsers}
          permissions={permissions}
          isEditing={isEditingUsers}
          onCancel={onCancelEditUser}
          onClickCreate={onClickCreate}
          onUpdateRoles={onUpdateUserRoles}
          onUpdatePassword={onUpdateUserPassword}
          onUpdatePermissions={onUpdateUserPermissions}
        />
      ),
    },
    {
      type: 'Roles',
      component: (
        <RolesTable
          roles={roles}
          allUsers={users}
          permissions={permissions}
          isEditing={isEditingRoles}
          onClickCreate={onClickCreate}
          onEdit={onEditRole}
          onSave={onSaveRole}
          onCancel={onCancelEditRole}
          onDelete={onDeleteRole}
          onFilter={onFilterRoles}
          onUpdateRoleUsers={onUpdateRoleUsers}
          onUpdateRolePermissions={onUpdateRolePermissions}
        />
      ),
    },
    {
      type: 'Queries',
      component: <QueriesPage source={source} />,
    },
  ]

  if (source.type === INFLUX_ENTERPRISE) {
    tabs = tabs.filter(t => t.type !== 'Roles')
  }

  return (
    <Tabs className="row">
      <TabList customClass="col-md-2 admin-tabs">
        {tabs.map((t, i) =>
          <Tab key={tabs[i].type}>
            {tabs[i].type}
          </Tab>
        )}
      </TabList>
      <TabPanels customClass="col-md-10 admin-tabs--content">
        {tabs.map((t, i) =>
          <TabPanel key={tabs[i].type}>
            {t.component}
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  )
}

const {arrayOf, bool, func, shape, string} = PropTypes

AdminTabs.propTypes = {
  users: arrayOf(
    shape({
      name: string.isRequired,
      roles: arrayOf(
        shape({
          name: string,
        })
      ),
    })
  ),
  roles: arrayOf(shape()),
  source: shape(),
  permissions: arrayOf(string),
  isEditingUsers: bool,
  isEditingRoles: bool,
  onClickCreate: func.isRequired,
  onEditUser: func.isRequired,
  onSaveUser: func.isRequired,
  onCancelEditUser: func.isRequired,
  onEditRole: func.isRequired,
  onSaveRole: func.isRequired,
  onCancelEditRole: func.isRequired,
  onDeleteRole: func.isRequired,
  onDeleteUser: func.isRequired,
  onFilterRoles: func.isRequired,
  onFilterUsers: func.isRequired,
  onUpdateRoleUsers: func.isRequired,
  onUpdateRolePermissions: func.isRequired,
  onUpdateUserPermissions: func,
  onUpdateUserRoles: func,
  onUpdateUserPassword: func,
}

export default AdminTabs
