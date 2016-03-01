<?php
/**
 * @author Joas Schilling <nickvergessen@owncloud.com>
 *
 * @copyright Copyright (c) 2015, ownCloud, Inc.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

OCP\Backgroundjob::registerJob('OCA\user_ldap\lib\Jobs');
OCP\Backgroundjob::registerJob('\OCA\User_LDAP\Jobs\CleanUp');

$installedVersion = \OC::$server->getConfig()->getAppValue('user_ldap', 'installed_version');
if (
	version_compare($installedVersion, '0.5.2', '<') || // stable8
	(version_compare($installedVersion, '0.5.99', '>') && version_compare($installedVersion, '0.6.1.1', '<')) // stable8.1
) {
	\OC::$server->getConfig()->setAppValue('user_ldap', 'enforce_home_folder_naming_rule', false);
}