# React ReadOnly DataTable
This component is React ReadOnly DataTable for Salesforce.

## Install our dependencies

```sh
npm install
npm install -g typescript typings webpack
npm link typescript
typings install --global --save dt~react
typings install --global --save dt~react-dom
```

## Putting it all together

```sh
webpack
```

then zip "dist" directory and upload zip file to staticresource as "ReactTableResource"


## Visualforce Page

```javascript
<apex:page >
<head>
<script src="../../soap/ajax/37.0/connection.js" type="text/javascript"></script>
<script src="https://unpkg.com/react@15.3.1/dist/react.min.js"></script>
<script src="https://unpkg.com/react-dom@15.3.1/dist/react-dom.min.js"></script>
</head>

<div id="Component3ReactTableContent"></div>

<script>
	var COMPONENT_ID = "Component3";
	sforce.connection.sessionId = '{!GETSESSIONID()}';
	var SFORCE_AJAX = sforce;
	var REACT_TABLE_PARAMS = {};

	REACT_TABLE_PARAMS["Component3"] = {
		SOBJECT_NAME: "Account",
		RELATION_NAME: "",
		RELATION_FIELD_NAME: "ParentId",
		LIST_COLUMNS: "[Name, Website, LastActivityDate, LastModifiedDate, IsPartner, ParentId]",
		USE_PAGING: "true",
		RESULT_PER_PAGE: "20",
		USE_FIXED_HEADER: "false",
		HEIGHT: "",
		SHOW_FILTER: "true",
		IS_RELATION_TABLE: "false",
		RECORD_ID: ""
	}
</script>

<script src="{!URLFOR($Resource.ReactTableResource, 'dist/bundle.js')}"></script>
</apex:page>
```