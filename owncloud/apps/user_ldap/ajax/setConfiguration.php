<?php
/**
 * @author Arthur Schiwon <blizzz@owncloud.com>
 * @author Christopher Schäpers <kondou@ts.unde.re>
 * @author Lukas Reschke <lukas@owncloud.com>
 * @author Morris Jobke <hey@morrisjobke.de>
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

// Check user and app status
OCP\JSON::checkAdminUser();
OCP\JSON::checkAppEnabled('user_ldap');
OCP\JSON::callCheck();

$prefix = (string)$_POST['ldap_serverconfig_chooser'];

// Checkboxes are not submitted, when they are unchecked. Set them manually.
// only legacy checkboxes (Advanced and Expert tab) need to be handled here,
// the Wizard-like tabs handle it on their own
$chkboxes = array('ldap_configuration_active', 'ldap_override_main_server',
				  'ldap_nocase', 'ldap_turn_off_cert_check');
foreach($chkboxes as $boxid) {
	if(!isset($_POST[$boxid])) {
		$_POST[$boxid] = 0;
	}
}

$ldapWrapper = new OCA\user_ldap\lib\LDAP();
$connection = new \OCA\user_ldap\lib\Connection($ldapWrapper, $prefix);
$connection->setConfiguration($_POST);
$connection->saveConfiguration();
OCP\JSON::success();
