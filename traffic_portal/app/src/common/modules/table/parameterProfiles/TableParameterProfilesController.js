/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var TableParameterProfilesController = function(parameter, parameterProfiles, $scope, $state, $uibModal, locationUtils, deliveryServiceService, profileParameterService, serverService) {

	$scope.parameter = parameter;

	$scope.parameterProfiles = parameterProfiles;

	$scope.addProfile = function() {
		alert('not hooked up yet: add profile to parameter');
	};

	var removeProfile = function(profileId) {
		profileParameterService.unlinkProfileParameter(profileId, parameter.id)
			.then(
				function() {
					$scope.refresh();
				}
			);
	};

	$scope.confirmRemoveProfile = function(profile) {
		if (profile.type == 'DS_PROFILE') { // if this is a ds profile, then it is used by delivery service(s) so we'll fetch the ds count...
			deliveryServiceService.getDeliveryServices({ profile: profile.id }).
				then(function(result) {
					var params = {
						title: 'Remove Parameter from Profile?',
						message: 'The ' + profile.name + ' profile is used by ' + result.length + ' delivery service(s). Are you sure you want to remove the ' + parameter.name + ' parameter from this profile?'
					};
					var modalInstance = $uibModal.open({
						templateUrl: 'common/modules/dialog/confirm/dialog.confirm.tpl.html',
						controller: 'DialogConfirmController',
						size: 'md',
						resolve: {
							params: function () {
								return params;
							}
						}
					});
					modalInstance.result.then(function() {
						removeProfile(profile.id);
					}, function () {
						// do nothing
					});
				});
		} else { // otherwise the profile is used by servers so we'll fetch the server count...
			serverService.getServers({ profileId: profile.id }).
				then(function(result) {
					var params = {
						title: 'Remove Parameter from Profile?',
						message: 'The ' + profile.name + ' profile is used by ' + result.length + ' server(s). Are you sure you want to remove the ' + parameter.name + ' parameter from this profile?'
					};
					var modalInstance = $uibModal.open({
						templateUrl: 'common/modules/dialog/confirm/dialog.confirm.tpl.html',
						controller: 'DialogConfirmController',
						size: 'md',
						resolve: {
							params: function () {
								return params;
							}
						}
					});
					modalInstance.result.then(function() {
						removeProfile(profile.id);
					}, function () {
						// do nothing
					});
				});
		}
	};


	$scope.refresh = function() {
		$state.reload(); // reloads all the resolves for the view
	};

	$scope.selectProfiles = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'common/modules/table/parameterProfiles/table.paramProfilesUnassigned.tpl.html',
			controller: 'TableParamProfilesUnassignedController',
			size: 'lg',
			resolve: {
				parameter: function() {
					return parameter;
				},
				allProfiles: function(profileService) {
					return profileService.getProfiles();
				},
				assignedProfiles: function() {
					return parameterProfiles;
				}
			}
		});
		modalInstance.result.then(function(selectedProfileIds) {
			profileParameterService.linkParamProfiles(parameter.id, selectedProfileIds)
				.then(
					function() {
						$scope.refresh(); // refresh the table
					}
				);
		}, function () {
			// do nothing
		});
	};


	$scope.navigateToPath = locationUtils.navigateToPath;

	angular.element(document).ready(function () {
		$('#parameterProfilesTable').dataTable({
			"aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
			"iDisplayLength": 25,
			"aaSorting": []
		});
	});

};

TableParameterProfilesController.$inject = ['parameter', 'parameterProfiles', '$scope', '$state', '$uibModal', 'locationUtils', 'deliveryServiceService', 'profileParameterService', 'serverService'];
module.exports = TableParameterProfilesController;
