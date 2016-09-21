export default class Param {
	static SForceAjax: any = SFORCE_AJAX;
	static RecordId: string = REACT_TABLE_PARAMS[COMPONENT_ID].RECORD_ID;
	static ComponentId: string = COMPONENT_ID;

	static SObjectName: string = REACT_TABLE_PARAMS[COMPONENT_ID].SOBJECT_NAME;
	static RelationName: string = REACT_TABLE_PARAMS[COMPONENT_ID].RELATION_NAME;
	static RelationFieldName: string = REACT_TABLE_PARAMS[COMPONENT_ID].RELATION_FIELD_NAME;
	static EnableInfiniteScroll: boolean = (REACT_TABLE_PARAMS[COMPONENT_ID].USE_PAGING && REACT_TABLE_PARAMS[COMPONENT_ID].USE_PAGING.toLowerCase() !== "true");
	static ResultPerPage: number = +REACT_TABLE_PARAMS[COMPONENT_ID].RESULT_PER_PAGE;
	static UseFixedHeader: boolean = (REACT_TABLE_PARAMS[COMPONENT_ID].USE_FIXED_HEADER && REACT_TABLE_PARAMS[COMPONENT_ID].USE_FIXED_HEADER.toLowerCase() === "true");

	static Height: number = REACT_TABLE_PARAMS[COMPONENT_ID].HEIGHT
		? +REACT_TABLE_PARAMS[COMPONENT_ID].HEIGHT
		: 400;

	static ShowFilter: boolean = (REACT_TABLE_PARAMS[COMPONENT_ID].SHOW_FILTER && REACT_TABLE_PARAMS[COMPONENT_ID].SHOW_FILTER.toLowerCase() === "true");

	static ListColumns: Array<string> = JSON.parse(REACT_TABLE_PARAMS[COMPONENT_ID].LIST_COLUMNS
		.replace("[", "[\"")
		.replace(/, /g, "\", \"")
		.replace("]", "\"]")
	);

	static IsRelationTable: boolean = (REACT_TABLE_PARAMS[COMPONENT_ID].IS_RELATION_TABLE && REACT_TABLE_PARAMS[COMPONENT_ID].IS_RELATION_TABLE.toLowerCase() === "true");
}