/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { SqlOpsDataClient, SqlOpsFeature } from 'dataprotocol-client';
import {
	ClientCapabilities,
	RPCMessageType,
	ServerCapabilities,
} from 'vscode-languageclient';

import * as UUID from 'vscode-languageclient/lib/utils/uuid';
import { Disposable } from 'vscode';

import * as contracts from './contracts';
import { ApiType, managerInstance } from './serviceApiManager';


export class SqlMigrationService extends SqlOpsFeature<undefined> implements contracts.ISqlMigrationService {

	private static readonly messagesTypes: RPCMessageType[] = [
		contracts.GetSqlMigrationAssessmentItemsRequest.type,
		contracts.GetSqlMigrationSkuRecommendationsRequest.type,
		contracts.SqlMigrationStartPerfDataCollectionRequest.type,
		contracts.SqlMigrationRefreshPerfDataCollectionRequest.type,
		contracts.SqlMigrationStopPerfDataCollectionRequest.type,
		contracts.StartLoginMigrationRequest.type,
		contracts.ValidateLoginMigrationRequest.type,
		contracts.MigrateLoginsRequest.type,
		contracts.EstablishUserMappingRequest.type,
		contracts.MigrateServerRolesAndSetPermissionsRequest.type
	];

	constructor(client: SqlOpsDataClient) {
		super(client, SqlMigrationService.messagesTypes);
	}
	public get providerId(): string {
		return this._client.providerId;
	}

	public initialize(capabilities: ServerCapabilities): void {
		this.register(this.messages, {
			id: UUID.generateUuid(),
			registerOptions: undefined
		});
	}

	protected registerProvider(options: undefined): Disposable {
		return managerInstance.registerApi<contracts.ISqlMigrationService>(ApiType.SqlMigrationProvider, this);
	}

	public fillClientCapabilities(capabilities: ClientCapabilities): void {
		// this isn't explicitly necessary
	}

	async getAssessments(connectionString: string, databases: string[], xEventsFilesFolderPath: string): Promise<contracts.AssessmentResult | undefined> {
		let params: contracts.SqlMigrationAssessmentParams = { connectionString: connectionString, databases: databases, xEventsFilesFolderPath: xEventsFilesFolderPath };
		try {
			return this._client.sendRequest(contracts.GetSqlMigrationAssessmentItemsRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.GetSqlMigrationAssessmentItemsRequest.type, e);
		}

		return undefined;
	}

	async getSkuRecommendations(
		dataFolder: string,
		perfQueryIntervalInSec: number,
		targetPlatforms: string[],
		targetSqlInstance: string,
		targetPercentile: number,
		scalingFactor: number,
		startTime: string,
		endTime: string,
		includePreviewSkus: boolean,
		databaseAllowList: string[]): Promise<contracts.SkuRecommendationResult | undefined> {
		let params: contracts.SqlMigrationSkuRecommendationsParams = {
			dataFolder,
			perfQueryIntervalInSec,
			targetPlatforms,
			targetSqlInstance,
			targetPercentile,
			scalingFactor,
			startTime,
			endTime,
			includePreviewSkus,
			databaseAllowList
		};

		try {
			return this._client.sendRequest(contracts.GetSqlMigrationSkuRecommendationsRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.GetSqlMigrationSkuRecommendationsRequest.type, e);
		}

		return undefined;
	}

	async startPerfDataCollection(
		connectionString: string,
		dataFolder: string,
		perfQueryIntervalInSec: number,
		staticQueryIntervalInSec: number,
		numberOfIterations: number): Promise<contracts.StartPerfDataCollectionResult | undefined> {
		let params: contracts.SqlMigrationStartPerfDataCollectionParams = {
			connectionString: connectionString,
			dataFolder,
			perfQueryIntervalInSec,
			staticQueryIntervalInSec,
			numberOfIterations
		};

		try {
			return this._client.sendRequest(contracts.SqlMigrationStartPerfDataCollectionRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.SqlMigrationStartPerfDataCollectionRequest.type, e);
		}

		return undefined;
	}

	async stopPerfDataCollection(): Promise<contracts.StopPerfDataCollectionResult | undefined> {
		let params: contracts.SqlMigrationStopPerfDataCollectionParams = {};

		try {
			return this._client.sendRequest(contracts.SqlMigrationStopPerfDataCollectionRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.SqlMigrationStopPerfDataCollectionRequest.type, e);
		}

		return undefined;
	}

	async refreshPerfDataCollection(lastRefreshedTime: Date): Promise<contracts.RefreshPerfDataCollectionResult | undefined> {
		let params: contracts.SqlMigrationStopPerfDataCollectionParams = {
			lastRefreshedTime
		};

		try {
			return this._client.sendRequest(contracts.SqlMigrationRefreshPerfDataCollectionRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.SqlMigrationRefreshPerfDataCollectionRequest.type, e);
		}

		return undefined;
	}

	async startLoginMigration(
		sourceConnectionString: string,
		targetConnectionString: string,
		loginList: string[],
		aadDomainName: string): Promise<contracts.StartLoginMigrationResult | undefined> {
		let params: contracts.StartLoginMigrationsParams = {
			sourceConnectionString,
			targetConnectionString,
			loginList,
			aadDomainName
		};

		try {
			return this._client.sendRequest(contracts.StartLoginMigrationRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.StartLoginMigrationRequest.type, e);
		}

		return undefined;
	}

	async validateLoginMigration(
		sourceConnectionString: string,
		targetConnectionString: string,
		loginList: string[],
		aadDomainName: string): Promise<contracts.StartLoginMigrationResult | undefined> {
		let params: contracts.StartLoginMigrationsParams = {
			sourceConnectionString,
			targetConnectionString,
			loginList,
			aadDomainName
		};

		try {
			return this._client.sendRequest(contracts.ValidateLoginMigrationRequest.type, params);

		}
		catch (e) {
			this._client.logFailedRequest(contracts.ValidateLoginMigrationRequest.type, e);
		}

		return undefined;
	}

	async migrateLogins(
		sourceConnectionString: string,
		targetConnectionString: string,
		loginList: string[],
		aadDomainName: string): Promise<contracts.StartLoginMigrationResult | undefined> {
		let params: contracts.StartLoginMigrationsParams = {
			sourceConnectionString,
			targetConnectionString,
			loginList,
			aadDomainName
		};

		try {
			return this._client.sendRequest(contracts.MigrateLoginsRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.MigrateLoginsRequest.type, e);
		}

		return undefined;
	}

	async establishUserMapping(
		sourceConnectionString: string,
		targetConnectionString: string,
		loginList: string[],
		aadDomainName: string): Promise<contracts.StartLoginMigrationResult | undefined> {
		let params: contracts.StartLoginMigrationsParams = {
			sourceConnectionString,
			targetConnectionString,
			loginList,
			aadDomainName
		};

		try {
			return this._client.sendRequest(contracts.EstablishUserMappingRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.EstablishUserMappingRequest.type, e);
		}

		return undefined;
	}

	async migrateServerRolesAndSetPermissions(
		sourceConnectionString: string,
		targetConnectionString: string,
		loginList: string[],
		aadDomainName: string): Promise<contracts.StartLoginMigrationResult | undefined> {
		let params: contracts.StartLoginMigrationsParams = {
			sourceConnectionString,
			targetConnectionString,
			loginList,
			aadDomainName
		};

		try {
			return this._client.sendRequest(contracts.MigrateServerRolesAndSetPermissionsRequest.type, params);
		}
		catch (e) {
			this._client.logFailedRequest(contracts.MigrateServerRolesAndSetPermissionsRequest.type, e);
		}

		return undefined;
	}
}