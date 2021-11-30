//requires fetch
const fetch = require("node-fetch");

//EVENT OBJECT

//WEBHOOK OBJECT

//SPACES OBJECT

//RESOURCES OBJECT

//ESPACE API ACCESS OBJECT
var Espace = function () {
    //private vars
    var oauth = {};

    ///////////////
    //CONSTRUCTOR//
    ///////////////
    var constructor = function espace(client_id, client_secret, root) {
        // console.log("in constructor");
        oauth.config = {
            rootPath: "https://" + root + ".ministryplatform.com/ministryplatformapi",
            url: "https://" + root + ".ministryplatform.com/ministryplatformapi/oauth/connect/authorize",
            logoutUrl: "/ministryplatformapi/oauth/connect/endsession",
            clientId: client_id,
            clientSecret: client_secret,
            scope: "openid http://www.thinkministry.com/dataplatform/scopes/all",
        };
        
        ///////////////////
        //PRIVATE METHODS//
        ///////////////////
        const getAuth = function () {
            return new Promise(resolve => {
                request({
                    url: oauth.config.rootPath + "/oauth/connect/token",
                    method: 'POST',
                    form: {
                        'grant_type': 'client_credentials',
                        'client_id': oauth.config.clientId,
                        'client_secret': oauth.config.clientSecret,
                        'scope': 'http://www.thinkministry.com/dataplatform/scopes/all'
                    }
                }, function (err, res, body) {
                    //store token
                    var response = JSON.parse(body);
                    oauth.token = response.access_token;
                    // console.log(oauth.token);
                    //console.log(response);
                    resolve("authorized");
                });
            });
        };

        //Fetch GET request wrapper and error handling
        const get = async url => {
            try {
                const response = await fetch(url);
                const status = checkStatus(await response.status());
                const data = await response.json();
                console.log(status);
                console.log(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }

        //Fetch POST request wrapper and error handling
        const post = async url => {
            try {
                //this will be different for post
                const response = await fetch(url); 
                const status = checkStatus(await response.status());
                const data = await response.json();
                //debug
                console.log(status);
                console.log(data);
                //
                return data;
            } catch (error) {
                console.log(error);
            }
        }

        //Fetch response status error handling
        const checkStatus = status => {
            if (status >= 200 && res.status < 300) {
                return status;
            } else {
                let err = new Error(status.statusText);
                err.response = status;
                throw err
            }
        }

        //GETS
        const getEvent = (eventId, scheduleId) => {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event?eventId=' + eventId;

                if (typeof scheduleId === 'undefined') {
                    urlQ = urlQ + '&scheduleId=' + scheduleId;
                }

                resolve(get(urlQ));
            })
        }

        const getEventList = function (nextDays, eventName, startDate, endDate, categoryIds, locationIds, categoryNames, locCodes, topX, publicOnly) {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event/list'; //how to handle potential args??

                resolve(get(urlQ));
            });
        }

        const getEventOccureneces = function (nextDays, eventName, startDate, endDate, categoryIds, locationIds, categoryNames, locCodes, topX, publicOnly) {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event/occurences';
                resolve(get(urlQ));
            });
        }

        const getEventSpaces = function (eventID, scheduleID) {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event/spaces?eventID=' + eventID + '&scheduleID=' + scheduleID;
                resolve(get(urlQ));
            });
        }

        const getEventResources = function (eventID, scheduleID) {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event/resources?eventID=' + eventID + '&scheduleID=' + scheduleID;
                resolve(get(urlQ));
            });
        }

        const getEventServices = function (eventID, scheduleID) {
            return new Promise(resolve => {
                let urlQ = oauth.config.rootPath + '/api/v1/event/services?eventID=' + eventID + '&scheduleID=' + scheduleID;
                resolve(get(urlQ));
            });
        }

        const getItemList = function (itemType, itemId, locationIds) {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/item/list?';
                resolve(get(urlQ));
            });
        }

        const getMinistryCategories = function () {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/ministry/categories';
                resolve(get(urlQ));
            });
        }

        const getMinistryLocations = function () {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/ministry/locations';
                resolve(get(urlQ));
            });
        }

        const getMinistryEditors = function () {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/ministry/editors';
                resolve(get(urlQ));
            });
        }

        const getMinistryUsers = function (email) {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/ministry/users';
                resolve(get(urlQ));
            });
        }

        const getWebhookList = function (webhookId) {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/webhook/list?';
                resolve(get(urlQ));
            });
        }

        const getWebhookEvents = function () {
            return new Promise(resolve => {
                let urlq = oauth.config.rootPath + '/api/v1/webhook/webhookevents';
                resolve(get(urlQ));
            });
        }

        //POSTS
        const createEvent = function (event) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/create';
        }

        const addSpace = function (eventID, scheduleID, spaceIDs) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/spaces/add?eventID=' + eventID + '&scheduleID=' + scheduleID;
            let body = spaceIDs; //should be comma seperated list
        }

        const addResources = function (eventID, scheduleID, resources) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/resources/add?eventID=' + eventID + '&scheduleID=' + scheduleID;
            let body = resources; //array of resource objects
        }

        const addServices = function (eventID, scheduleID, services) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/services/add?eventID=' + eventID + '&scheduleID=' + scheduleID;
            let body = services; //not defined in api?
        }

        const createWebhook = function (webhook) {
            let urlQ = oauth.config.rootPath + '/api/v1/webhook/create';
            let body = webhook; //not clearly defined in api. will need to reverse engineer
        }



        //Puts
        const updateEvent = function (event) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/update';
            let body = event;
        }

        const updateEventPublicInfo = function (event) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/updatepublicinfo';
            let body = event; //not so sure about this method... seems redundent
        }

        const updateEventPublicLink = function (event) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/updatepubliclink';
            let body = event; //not so sure about this method... seems redundent
        }

        const submitEvent = function (eventId, scheduleId) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/submit?eventId=' + eventId + '&scheduleId=' + scheduleId;
        }

        const cancelEvent = function (eventId, scheduleId) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/cancel?eventId=' + eventId + '&scheduleId=' + scheduleId;
        }

        const editWebhook = function (webhook) {
            let urlQ = oauth.config.rootPath + '/api/v1/webhook/edit';
            let body = webhook; //not clearly definied in api
        }

        //Deletes
        const deleteEvent = function (eventId) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/delete?eventId=' + eventId;
        }

        const removeSpaces = function (eventId, scheduleId, spaces) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/spaces/delete?eventId=' + eventId + '&scheduleId=' + scheduleId;
            let body = spaces; //array of spaces to delete. Comma seperated
        }

        const deleteResources = function (eventId, scheduleId, resources) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/resources/delete?eventId=' + eventId + '&scheduleId=' + scheduleId;
            let body = resources; //array of spaces to delete. Comma seperated
        }

        const deleteServices = function (eventId, scheduleId, services) {
            let urlQ = oauth.config.rootPath + '/api/v1/event/services/delete?eventId=' + eventId + '&scheduleId=' + scheduleId;
            let body = services; //array of spaces to delete. Comma seperated
        }

        const deleteWebhook = function (webhookId) {
            let urlQ = oauth.config.rootPath + '/api/v1/webhook/delete?id=' + webhookId;
        }

        //////////////////
        //PUBLIC METHODS//
        //////////////////
        this.getEvent = async function (eventId, scheduleId) {
            //eventId required, scheduleId optional
            //validate required args
            if (typeof eventId === 'undefined') {
                let err = new Error('eventId undefined');
                throw err
            }

            //authenticate
            await getAuth();
            return await getEvent(eventId, scheduleId);
        }

        this.getEventList = async function () {
            //maybe consider passing optional vars as an object?
            await getAuth();
            return await getEventList();
        }

        this.getEventOccureneces = async () => {

            //authenticate
            await getAuth();
            return await getEventOccureneces();
        }

        this.getEventSpaces = async (eventId, scheduleId) => {
            //eventId and scheduleId required
            //validate required args
            if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
                let err = new Error('eventId or scheduleId undefined');
                throw err
            }

            //authenticate
            await getAuth();
            return await getEventSpaces(eventId, scheduleId);
        }

        this.getEventResources = async (eventId, scheduleId) => {
            //eventId and scheduleId required
            //validate required args
            if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
                let err = new Error('eventId or scheduleId undefined');
                throw err
            }

            //authenticate
            await getAuth();
            return await getEventResources(eventId, scheduleId);
        }

        this.getEventServices = async (eventId, scheduleId) => {
            //eventId and scheduleId required
            //validate required args
            if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
                let err = new Error('eventId or scheduleId undefined');
                throw err
            }

            //authenticate
            await getAuth();
            return await getEventServices(eventId, scheduleId);
        }

        this.getItemList = async params => {

            //authenticate
            await getAuth();
            return await getItemList(params);
        }

        this.getMinistryCategories = async () => {
            //authenticate
            await getAuth();
            return await getMinistryCategories();
        }

        this.getMinistryLocations = async () => {
            //authenticate
            await getAuth();
            return await getMinistryLocations();
        }

        this.getMinistryEditors = async () => {

            //authenticate
            await getAuth();
            return await getMinistryEditors();
        }

        this.getMinistryUsers = async () => {

            //authenticate
            await getAuth();
            return await getMinistryUsers();
        }

        this.getWebhookList = async webhookId => {
            //authenticate
            await getAuth();
            return await getWebhookList(webhookId);
        }

        this.getWebhookEvents = async () => {
            //authenticate
            await getAuth();
            return await getWebhookEvents();
        }
    };
    //end constructor

    //public static methods

    return constructor;
}();

module.exports = Espace;