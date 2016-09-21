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
<apex:page>
<head>
<script src="../../soap/ajax/37.0/connection.js" type="text/javascript"></script>
<script src="https://unpkg.com/react@15.3.1/dist/react.min.js"></script>
<script src="https://unpkg.com/react-dom@15.3.1/dist/react-dom.min.js"></script>
</head>

<apex:form id="sve_form1"   styleClass="sve_form1"   >

<div id="content"></div>

<script>
	sforce.connection.sessionId='{!GETSESSIONID()}';
	var SFORCE_AJAX = sforce;
	var SOBJECT_NAME = "Account";
	var IS_RELATION_TABLE = "False";
	var RELATION_NAME = "ChildAccounts";
	var RELATION_FIELD_NAME = "ParentId";
	var LIST_COLUMNS = "[Name, Website, LastActivityDate, LastModifiedDate, IsPartner, ParentId]";
	var USE_PAGING = "true";
	var RESULT_PER_PAGE = "20";
	var USE_FIXED_HEADER = "false";
	var HEIGHT = "";
	var SHOW_FILTER = "true";
	var RECORD_ID = "";
</script>

<script src="{!URLFOR($Resource.ReactTableResource, 'dist/bundle.js')}"></script>
</apex:form>
</apex:page>
```