import {Promise} from 'es6-promise';
import Statics from "../Statics";
import QueryResult from "../models/QueryResult";
import {Field} from "../models/describe";
import FieldInfo from "../models/FieldInfo";
import OutputText from "../components/OutputField/OutputText";
import OutputCheckbox from "../components/OutputField/OutputCheckbox";
import OutputDate from "../components/OutputField/OutputDate";
import OutputDatetime from "../components/OutputField/OutputDatetime";
import OutputTextArea from "../components/OutputField/OutputTextArea";
import OutputRichText from "../components/OutputField/OutputRichText";
import OutputUrl from "../components/OutputField/OutputUrl";
import OutputMail from "../components/OutputField/OutputMail";
import Param from "../Params";

/**
 * レコードとdescribeを取得。両方の完了を待つ
 */
// export const getDescribeAndRecords = (q: string):Promise<Array<any>> => {
// 	return new Promise((resolve: any, reject: any) => {
// 		const tasks: Array<Promise<Array<any>>> = [getRecords(q), getDescribe()];

// 		Promise.all(tasks).then(results => {
// 			resolve(results[0]);
// 		}).catch(err => {
// 			console.log(JSON.stringify(err));
// 			reject(err);
// 		});
// 	});
// };

/**
 * レコードとdescribeを取得。両方の完了を待つ
 * レコードの取得にdescribe結果を使用するため直列で流す
 */
export const getDescribeAndRecords = () => {
    return new Promise((resolve: any, reject: any) => {

        getDescribe().then(describeResult => {
            //console.log(createSOQL());
            getRecords(createSOQL()).then(recordResult => {
                resolve({
                    records: (recordResult || []).map(record => { return convertLookUp(record) }),
                    columnMetaData: createColumnMetaData()

                });
            }).catch(recordErr => {
                console.log(JSON.stringify(recordErr));
            });
        }).catch(describeErr => {
            console.log(JSON.stringify(describeErr));
        });
    });
};

/**
 * LookUp項目をGridに表示できる形に変換
 */
const convertLookUp = (record: any) => {

    let result: any = {};
    Statics.ColmnInfo.forEach(column => {
        let columnsHierar = column.queryName.split(".");
        result[column.name] = (columnsHierar.length === 2)
            ? (record[columnsHierar[0]] || {})[columnsHierar[1]]
            : record[column.queryName];
    });

    return result;
};

/**
 * データ型によって表示するComponentを振り分ける
 */
const createColumnMetaData = (): Array<any> => {
    let columnMeta: Array<any> = [];
    Statics.ColmnInfo.forEach((column: FieldInfo, i: number) => {

        let meta: any = {
            "columnName": column.describe.name,
            "displayName": column.describe.label,
            "order": i,
        }

        switch (column.describe.type) {
            case "boolean":
                meta["customComponent"] = OutputCheckbox;
                break;
            case "date":
                meta["customComponent"] = OutputDate;
                break;
            case "datetime":
                meta["customComponent"] = OutputDatetime;
                break;
            case "textarea":
                if (column.describe.htmlFormatted) {
                    meta["customComponent"] = OutputRichText;//リッチテキスト以外でも数式項目でtrueの場合あり
                } else {
                    meta["customComponent"] = OutputTextArea;
                }
                break;
            case "url":
                meta["customComponent"] = OutputUrl;
                break;
            case "email":
                meta["customComponent"] = OutputMail;
                break;

            default:
                break;
        }

        columnMeta.push(meta);
    });

    return columnMeta;
}

/**
 * Studioで指定されたフィールド名からSOQLを組み立てる
 */
const createSOQL = () => {
    if (!Param.ListColumns || Param.ListColumns.length == 0 || !Param.SObjectName) return "";
    Statics.ColmnInfo = [];

    Param.ListColumns.forEach(column => {
        let describe = getFieldDescribe(column);
        if (describe) {
            Statics.ColmnInfo.push({
                name: column,
                queryName: getFieldName4Query(describe),
                describe: describe
            });
        }
    });

    return "SELECT " + Statics.ColmnInfo.map(x => { return x.queryName }).join(",") + " FROM " + Param.SObjectName + getWhereWord();
}

const getFieldName4Query = (describe: Field): string => {
    //reference項目以外はそのまま表示
    if (describe.type !== "reference") return describe.name;

    //参照先にnameFieldが存在しない場合はIDを表示
    if (NoNamefieldSObjects.some(x => x === describe.referenceTo)) return describe.name;

    const notNameFieldObj = NotNamefieldSObjects.filter(x => x.name === describe.referenceTo);

    //nameFieldのAPI参照名がNameでないSObjectはnameFieldを表示
    if (notNameFieldObj && notNameFieldObj.length > 0) return describe.relationshipName + "." + notNameFieldObj[0].nameField;

    //nameFieldのAPI参照名がNameであるSObjectはNameを表示
    return describe.relationshipName + ".Name";
}


const getWhereWord = () => {
    let conditions: Array<string> = [];

    if (Param.RelationFieldName && Param.IsRelationTable) {
        let describe = getFieldDescribe(Param.RelationFieldName);

        if (describe && Param.RecordId) {
            conditions.push(describe.relationshipName + ".Id = '" + Param.RecordId + "'");
        } else {
            conditions.push("Id = ''");//RelationFieldNameありでId指定なしなら子はゼロ件
        }
    }

    // インジェクション対策が必要なので見送り
    // if (Param.DefaultCondition && Param.DefaultCondition.trim()) {
    // 	conditions.push("(" + Param.DefaultCondition.trim() + ")");
    // }

    return (conditions.length === 0)
        ? ""
        : " WHERE " + conditions.join(" AND ");
}

const endsWith = (val: string, suffix: string) => {
    const sub = val.length - suffix.length;
    return (sub >= 0) && (val.lastIndexOf(suffix) === sub);
};

/**
 * Field名でdescribe.fieldsの該当データを取得
 */
const getFieldDescribe = (name: string): Field => {
    let describe = Statics.DescribeSObject.fields.filter((x: any) => x.name === name);
    if (describe && describe.length > 0) {
        return describe[0];
    }

    return null;
}


const toArray = (val: any) => {
    if (!val) return [];
    return val instanceof Array
        ? val
        : [val];
}

/**
 * 渡された文字列でクエリを実行しレコードを返す
 */
const getRecords = (q: string): Promise<Array<any>> => {
    return new Promise((resolve: any, reject: any) => {
        if (!Param.SForceAjax) {
            resolve([]);
        }

        Param.SForceAjax.connection.query(q,
            (result: QueryResult) => {
                let records: Array<any> = (result)
                    ? toArray(result.records)
                    : []

                resolve(records);
            }, (err: any) => {
                reject(err);
            });
    });
}

/**
 * describeSObjectを取得
 */
const getDescribe = (): Promise<Array<any>> => {
    return new Promise((resolve: any, reject: any) => {

        //ローカル実行時
        if (!Param.SForceAjax) {
            reject(["err!!!"]);
        }

        //取得済みの場合
        if (Statics.DescribeSObject) {
            resolve([]);
        }

        Param.SForceAjax.connection.describeSObject(Param.SObjectName,
            (result: any) => {
                Statics.DescribeSObject = result;
                resolve([result]);
            }, (err: any) => {
                console.log(JSON.stringify(err));
                reject(err);
            });
    });
}

/**
 * nameFieldをもたないSObject
 */
const NoNamefieldSObjects: Array<string> = [
    "AcceptedEventRelation", "AccountContactRole", "AccountFeed", "AccountPartner", "AccountShare", "AccountTeamMember", "ActionLinkTemplate", "AggregateResult", "Announcement", "ApexEmailNotification", "ApexLog", "ApexPageInfo", "ApexTestQueueItem", "ApexTestResult", "ApexTestResultLimits", "ApexTestRunResult", "ApexTestSuite", "AppMenuItem", "Approval", "AssetFeed", "AssignmentRule", "AsyncApexJob", "AuraDefinition", "AuthConfigProviders", "AuthSession", "CampaignFeed", "CampaignMember", "CampaignMemberStatus", "CampaignShare", "CaseArticle", "CaseComment", "CaseContactRole", "CaseFeed", "CaseShare", "CaseSolution", "CaseTeamMember", "CaseTeamTemplateMember", "CaseTeamTemplateRecord", "CategoryData", "CategoryNode", "CategoryNodeLocalization", "ChatterActivity", "ChatterAnswersActivity", "ChatterAnswersReputationLevel", "ChatterConversation", "ChatterConversationMember", "ChatterMessage", "ClientBrowser", "CollaborationGroupFeed", "CollaborationGroupMember", "CollaborationGroupMemberRequest", "CollaborationGroupRecord", "CollaborationInvitation", "CombinedAttachment", "ContactFeed", "ContactShare", "ContentDistributionView", "ContentDocumentFeed", "ContentDocumentLink", "ContentFolderItem", "ContentFolderMember", "ContractContactRole", "ContractFeed", "CronTrigger", "CustomBrand", "CustomBrandAsset", "CustomObjectUserLicenseMetrics", "CustomPermissionDependency", "DashboardComponentFeed", "DashboardFeed", "DataStatistics", "DataType", "DeclinedEventRelation", "DocumentAttachmentMap", "DomainSite", "EmailDomainKey", "EmailMessage", "EmailMessageRelation", "EmailStatus", "EntityDefinition", "EntityParticle", "EntitySubscription", "EventFeed", "EventLogFile", "EventRelation", "ExternalDataUserAuth", "FeedAttachment", "FeedComment", "FeedItem", "FeedLike", "FeedPollChoice", "FeedPollVote", "FeedRevision", "FeedTrackedChange", "FieldDefinition", "FieldPermissions", "FlexQueueItem", "FlowInterviewShare", "ForecastShare", "GrantedByLicense", "GroupMember", "IdeaComment", "KnowledgeArticle", "KnowledgeArticleViewStat", "KnowledgeArticleVoteStat", "KnowledgeableUser", "LeadFeed", "LeadShare", "LinkedArticleFeed", "ListViewChartInstance", "LoginGeo", "LoginIp", "MacroShare", "MatchingRuleItem", "NavigationMenuItem", "NavigationMenuItemLocalization", "NetworkMember", "NetworkMemberGroup", "NetworkModeration", "NetworkPageOverride", "NetworkSelfRegistration", "NoteAndAttachment", "OauthToken", "ObjectPermissions", "OpportunityCompetitor", "OpportunityContactRole", "OpportunityFeed", "OpportunityLineItemSchedule", "OpportunityPartner", "OpportunityShare", "OrderFeed", "OrderItemFeed", "OrderShare", "OrgWideEmailAddress", "PackageLicense", "Partner", "Period", "PermissionSetAssignment", "PermissionSetLicenseAssign", "PicklistValueInfo", "PlatformAction", "PlatformCachePartitionType", "ProcessInstance", "ProcessInstanceNode", "ProcessInstanceStep", "ProcessInstanceWorkitem", "Product2Feed", "Publisher", "PushTopic", "QuestionDataCategorySelection", "QueueSobject", "QuickTextShare", "QuoteFeed", "RecordTypeLocalization", "RelationshipDomain", "RelationshipInfo", "ReportFeed", "ReputationLevel", "ReputationLevelLocalization", "ReputationPointsRule", "ScontrolLocalization", "SearchLayout", "SearchPromotionRule", "SecureAgentPlugin", "SecureAgentPluginProperty", "SetupAuditTrail", "SetupEntityAccess", "SiteFeed", "SolutionFeed", "StreamingChannelShare", "TaskFeed", "TenantUsageEntitlement", "TestSuiteMembership", "ThirdPartyAccountLink", "TodayGoalShare", "TopicAssignment", "TopicFeed", "TopicLocalization", "UndecidedEventRelation", "UserAccountTeamMember", "UserAppMenuCustomization", "UserAppMenuCustomizationShare", "UserEntityAccess", "UserFeed", "UserFieldAccess", "UserListView", "UserListViewCriterion", "UserLogin", "UserPackageLicense", "UserPreference", "UserProvisioningRequestShare", "UserRecordAccess", "UserShare", "UserTeamMember", "Vote", "WebLinkLocalization", "WorkAccess", "WorkAccessShare", "WorkBadge", "WorkBadgeDefinitionFeed", "WorkBadgeDefinitionShare", "WorkThanks", "WorkThanksShare"
];


/**
 * nameFieldのAPI参照名がNameでないSObject
 */
const NotNamefieldSObjects: Array<any> = [
    { "name": "ActionLinkGroupTemplate", "nameField": "DeveloperName" }, { "name": "ActivityHistory", "nameField": "Subject" }, { "name": "AttachedContentDocument", "nameField": "Title" }, { "name": "AuraDefinitionBundle", "nameField": "DeveloperName" }, { "name": "AuthConfig", "nameField": "DeveloperName" }, { "name": "AuthProvider", "nameField": "FriendlyName" }, { "name": "Case", "nameField": "CaseNumber" }, { "name": "CaseStatus", "nameField": "ApiName" }, { "name": "ContentDocument", "nameField": "Title" }, { "name": "ContentVersion", "nameField": "Title" }, { "name": "ContractStatus", "nameField": "ApiName" }, { "name": "CorsWhitelistEntry", "nameField": "DeveloperName" }, { "name": "CustomPermission", "nameField": "DeveloperName" }, { "name": "Dashboard", "nameField": "Title" }, { "name": "Domain", "nameField": "Domain" }, { "name": "DuplicateRule", "nameField": "DeveloperName" }, { "name": "EmailServicesAddress", "nameField": "LocalPart" }, { "name": "EmailServicesFunction", "nameField": "FunctionName" }, { "name": "Event", "nameField": "Subject" }, { "name": "ExternalDataSource", "nameField": "DeveloperName" }, { "name": "FolderedContentDocument", "nameField": "Title" }, { "name": "Idea", "nameField": "Title" }, { "name": "KnowledgeArticleVersion", "nameField": "Title" }, { "name": "LeadStatus", "nameField": "ApiName" }, { "name": "ListViewChart", "nameField": "DeveloperName" }, { "name": "LookedUpFromActivity", "nameField": "Subject" }, { "name": "MatchingRule", "nameField": "DeveloperName" }, { "name": "NamedCredential", "nameField": "DeveloperName" }, { "name": "NavigationLinkSet", "nameField": "DeveloperName" }, { "name": "Note", "nameField": "Title" }, { "name": "OpenActivity", "nameField": "Subject" }, { "name": "OpportunityStage", "nameField": "ApiName" }, { "name": "Order", "nameField": "OrderNumber" }, { "name": "OrderItem", "nameField": "OrderItemNumber" }, { "name": "OwnedContentDocument", "nameField": "Title" }, { "name": "PartnerRole", "nameField": "ApiName" }, { "name": "PermissionSetLicense", "nameField": "DeveloperName" }, { "name": "PlatformCachePartition", "nameField": "DeveloperName" }, { "name": "Question", "nameField": "Title" }, { "name": "QuoteLineItem", "nameField": "LineNumber" }, { "name": "SamlSsoConfig", "nameField": "DeveloperName" }, { "name": "SecureAgent", "nameField": "DeveloperName" }, { "name": "SecureAgentsCluster", "nameField": "DeveloperName" }, { "name": "Solution", "nameField": "SolutionName" }, { "name": "SolutionStatus", "nameField": "ApiName" }, { "name": "Task", "nameField": "Subject" }, { "name": "TaskPriority", "nameField": "ApiName" }, { "name": "TaskStatus", "nameField": "ApiName" }, { "name": "UserAppMenuItem", "nameField": "Label" }, { "name": "UserProvisioningConfig", "nameField": "DeveloperName" }
];

