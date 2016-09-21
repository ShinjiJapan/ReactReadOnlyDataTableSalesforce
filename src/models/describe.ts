export class DescribeSObject {
	activateable: boolean;
	compactLayoutable: boolean;
	createable: boolean;
	custom: boolean;
	customSetting: boolean;
	deletable: boolean;
	deprecatedAndHidden: boolean;
	feedEnabled: boolean;
	idEnabled: boolean;
	layoutable: boolean;
	mergeable: boolean;
	mruEnabled: boolean;
	queryable: boolean;
	replicateable: boolean;
	retrieveable: boolean;
	searchLayoutable: boolean;
	searchable: boolean;
	triggerable: boolean;
	undeletable: boolean;
	updateable: boolean;
	name: string;
	keyPrefix: string;
	label: string;
	labelPlural: string;
	urlDetail: string;
	urlEdit: string;
	urlNew: string;
	childRelationships: Array<any>;
	fields: Array<Field>;
	recordTypeInfos: Array<any>;
	supportedScopes: Array<any>;
}


export class Field {
	autoNumber: string
	byteLength: string
	calculated: string
	caseSensitive: string
	createable: string
	custom: string
	defaultedOnCreate: string
	deprecatedAndHidden: string
	digits: string
	filterable: string
	groupable: string
	idLookup: string
	label: string
	length: string
	name: string
	nameField: string
	namePointing: string
	nillable: string
	permissionable: string
	precision: string
	queryByDistance: string
	restrictedPicklist: string
	scale: string
	soapType: string
	sortable: string
	type: string
	unique: string
	updateable: string
	referenceTo: any
	relationshipName: string
	extraTypeInfo: string
	Picklistvalues: Picklistvalue[]
	htmlFormatted: string
	inlineHelpText: string
	calculatedFormula: string
	defaultValueFormula: string
	mask: string
	maskType: string
	controllerName: string
	dependentPicklist: string
}

export class Picklistvalue {
	active: string
	defaultValue: string
	label: string
	value: string
	validFor: string
}