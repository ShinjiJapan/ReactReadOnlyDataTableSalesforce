export default class Param {
	static SForceAjax: any = SFORCE_AJAX;
	static RecordId: string = RECORD_ID;

	static SObjectName: string = SOBJECT_NAME;
	static RelationName: string = RELATION_NAME;
	static RelationFieldName: string = RELATION_FIELD_NAME;
	static EnableInfiniteScroll: boolean = (USE_PAGING && USE_PAGING.toLowerCase() !== "true");
	static ResultPerPage: number = +RESULT_PER_PAGE;
	static UseFixedHeader: boolean = (USE_FIXED_HEADER && USE_FIXED_HEADER.toLowerCase() === "true");

	static Height: number = HEIGHT
		? +HEIGHT
		: 400;
	//static Width: number = +WIDTH;

	static ShowFilter: boolean = (SHOW_FILTER && SHOW_FILTER.toLowerCase() === "true");

	static ListColumns: Array<string> = JSON.parse(LIST_COLUMNS
		.replace("[", "[\"")
		.replace(/, /g, "\", \"")
		.replace("]", "\"]")
	);

	static IsRelationTable: boolean = (IS_RELATION_TABLE && IS_RELATION_TABLE.toLowerCase() === "true");
}