'use strict';

angular.module('userSessionHandlerApp').factory('UserSessionFactory', ['$sessionStorage', function ($sessionStorage) {

    /**
     * This variable helps to decouple each function below that uses $sesionStorage
     * For unit testing we don't have to mock up $sessionStorage
     * We just mock up any obj with the $sessionStorage structure
     */
    var sessionStorage = $sessionStorage;

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Function for checking if a property is nested or not.
     * Nested means it's within one or more onjects. e.g. obj1.obj2.property
     * Not nested means it's at the top level of the main object. e.g. property
     * Returns true if the property is nested, false if it's not nested.
     * 
     * @param {string} property, the property to evaluate.
     * @returns {boolean} that tells whether the property is nested or not.
     */
    function validateIfPropertyIsNested(property) {
        var nestedProperty = true;

        if (property.indexOf(".") === -1) {
            nestedProperty = false;
        }

        return nestedProperty;
    }

    /**
     * Function for getting any property from the userSession variable.
     * 
     * @param {string} propToGet, the name of the property to get 
     * @returns {string | object} that tells the actual value of the property
     */
    function getUserSessionProperty(propToGet) {
        try {
            return sessionStorage.userSession[propToGet];
        } catch (error) {
            return undefined;
        }
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Function for helping getUserSessionNestedProperty();
     * If the obj is undefined get the top level object from $sessionStorage.userSession object.
     * If the obj is not undefined, use the partial view of the $sessionStorage.userSession object received in the obj parameter.
     * 
     * @param {*} obj, an object containing a partial view of the $sessionStorage.userSession object 
     * @param {*} prop, the specific property name we want to get from the $sessionStorage.userSession object
     * @returns {string | object} it can return whatever the app needs; a single string, a boolean, or even an object  
     */
    function getNestedProperty(obj, prop) {
        var property;

        if (obj === undefined) {
            property = getUserSessionProperty(prop);
        } else {
            property = obj[prop];
        }

        return property;
    }

    /**
     * Function that iterates through the propToGet which is a nested property until reaching the bottom of it
     * For loop breaks when value is undefined for not taking the inner property of another object with same name 
     *   e.g. searchMatters.matterDetail might get matterDetail.view due to matterDetail word
     *
     * @param {string} propToGet, is a string that represents an object within $sessionStorage.userSession
     * @returns {string | object} it can return a string or an object, depends on what's at the bottom of the object. 
     */
    function getUserSessionNestedProperty(propToGet) {
        var value, index;
        var arrayOfProperties = propToGet.split(".");

        for (index = 0; index < arrayOfProperties.length; index++) {
            value = getNestedProperty(value, arrayOfProperties[index]);

            if (value === undefined) {
                break;
            }
        }

        return value;
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Function for setting any property with a value to the $sessionStorage.userSession object.
     * 
     * @param {string} propToSet, name of the property to set 
     * @param {string | object} value, is the value to set to the property 
     */
    function setUserSessionProperty(propToSet, value) {
        sessionStorage.userSession[propToSet] = value;
    }

    /**
     * If param obj is undefined, means that the top level partial view of the object must be returned.
     * If param obj is defined, means one of two things:
     *   - If the property to search in the obj partial view is undefined; create the property and assign the value
     *   - If the property to search in the obj partial view is defined; return a partial view of that level of the object
     * 
     * @param {object} obj, a partial view of the level of the object we will search in 
     * @param {string} property, the property to search in the object 
     * @param {string | object} value, the value that will update a specific property
     * @returns {object} that represents a partial view of each level of the object 
     */
    function createNewProperty(obj, property, value) {
        var objToReturn;

        if (obj === undefined) {
            objToReturn = getUserSessionProperty(property);
        } else {
            if (obj[property] === undefined) {
                obj[property] = value;
            } else {
                objToReturn = obj[property];
            }
        }

        return objToReturn;
    }

    /**
     * If param obj is undefined there are two options:
     *   - If the param property to search at top level is undefined; the object will begin to be created from top level.
     *   - If the param property to search at top level is defined; a picture of that object level wil be returned.
     * If param obj is defined there are two options:
     *   - If param value is undefined there are two options:
     *     - If the param property doesn't exist in the obj; create the property holding an empty object within it {}
     *     - If the param property exists in the obj, return a picture of that level of the object.
     *   - If param value is defined; create the property in the obj and assign the value received.
     * 
     * @param {object} obj, a partial view of the level of the object we will search in 
     * @param {string} property, the property to search in the object 
     * @param {string | object} value, the value that will update a specific property
     * @returns {object} that represents a partial view of each level of the object 
     */
    function createNewObject(obj, property, value) {
        var objToReturn;

        if (obj === undefined) {
            if (sessionStorage.userSession[property] === undefined) {
                setUserSessionProperty(property, {});
            }

            objToReturn = getUserSessionProperty(property);
        } else {
            if (value === undefined) {
                if (obj[property] === undefined) {
                    obj[property] = {};
                }

                objToReturn = obj[property];
            } else {
                obj[property] = value;
            }
        }

        return objToReturn;
    }

    /**
     * If obj is undefined, means that we need a picture of the whole object at first level for a specific property.
     * If obj isn't undefined, means that we already have a partial view of the object within obj parameter.
     *   If value param is undefined, means that we need to still get another low level partial view of the object.
     *   If value param isn't undefined, means that we reached the last level of the object in the path given.
     *     So we set the value to the existing found property. We do an update.
     * Basically we were iterating through each level of the whole object, 'til reaching the bottom of it.
     * The last property name to update must be unique in the whole path of the obj.
     * If we have one property name repeated in the same path of the object, it's a bad practice of structure.
     * 
     * @param {object} obj, a partial view of the level of the object we will search in 
     * @param {string} property, the property to search in the object 
     * @param {string | object} value, the value that will update a specific property
     * @returns {object} that represents a partial view of each level of the object 
     */
    function updateProperty(obj, property, value) {
        var objToReturn;

        if (obj === undefined) {
            objToReturn = getUserSessionProperty(property);
        } else {
            if (value === undefined) {
                objToReturn = obj[property];
            } else {
                obj[property] = value;
            }
        }

        return objToReturn;
    }

    /**
     * Function helper for callbacks in charge of createNewProperty, createNewObject, or updateProperty.
     * Iterates through an array of properties representing an object in a human readable way.
     * Will use the calback received and send each property one by one; the callback will know what to do.
     * 
     * @param {array} arrayOfProperties, Representing an object e.g. ['obj1','obj2','prop1'] = obj1: {obj2: {prop1: }}
     * @param {string | object} value, The value to set, can be a string ('hello') or an object (e.g. '"obj1": {"prop1: "hello""}') 
     * @param {function} callback, the function to call 
     */
    function iterator(arrayOfProperties, value, callback) {
        var obj;
        var propertyValue;

        arrayOfProperties.forEach(function (property, index) {
            if (index === arrayOfProperties.length - 1) {
                propertyValue = value;
            }

            obj = callback(obj, property, propertyValue);
        });
    }

    /**
     * Function that toggles among createNewProperty, updateProperty, or createNewObject.
     * Does the above by sweeping through the propToSet (which is an object represented as a string).
     * Variables inLastIndex and propertyDefined are the ones that help to know where to redirect the functionality.
     * inLastIndex && propertyDefined    === createNestedNewProperty
     * inLastIndex && propertyNotDefined === updateNestedProperty
     * notInLastIndex && propertyDefined === createNestedNewObject
     * 
     * @param {string} objectAsString, is an object represented as a string 'obj1.obj2.property1'
     * @param {string | object} value, can be a string or an object that will be set to the propToSet
     */
    function setUserSessionNestedProperty(objectAsString, value) {
        var index;
        var callback;
        var inLastIndex;
        var propertyDefined;
        var propToGet = '';
        var arrayOfProperties = objectAsString.split('.');

        for (index = 0; index < arrayOfProperties.length; index++) {
            propToGet += arrayOfProperties[index]; // Will be composing the representation of the object in each round
            inLastIndex = (index === arrayOfProperties.length - 1) ? true : false;
            propertyDefined = getUserSessionNestedProperty(propToGet) === undefined ? true : false;

            if (inLastIndex) {
                if (propertyDefined) {
                    callback = createNewProperty;
                } else {
                    callback = updateProperty;
                }

                iterator(arrayOfProperties, value, callback);
            } else {
                if (propertyDefined) {
                    iterator(arrayOfProperties, value, createNewObject);
                    break;
                }
            }

            propToGet += '.'; // Helps to compose the representation of the object in each round
        }
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Function that holds the actual 'delete' for supporting the deletion of any property within an object.
     * 'delete' encapsulated, since it's call in at least two places so far.
     *
     * @param {object} object, the object holding the property to delete
     * @param {string} propertyToDelete, the name of the property within the object to delete
     */
    function deleteUserSessionProperty(object, propertyToDelete) {
        delete object[propertyToDelete];
    }

    /**
     * Function for iterating through an object and deleting the last member of it.
     * Iterates until before reaching the actual last member of the object.
     * Does not need the value of the last member, but the actual instance of for deleting it.
     *
     * @param {string} objectAsString, representation of an object in a string e.g. 'object1.property1'
     */
    function deleteUserSessionNestedProperty(objectAsString) {
        var index;
        var value;
        var propertyName;
        var arrayOfProperties = objectAsString.split('.');
        var propertyToDelete = arrayOfProperties[arrayOfProperties.length - 1]; // Get last member of the object

        for (index = 0; index < arrayOfProperties.length - 1; index++) {
            propertyName = arrayOfProperties[index];

            value = getNestedProperty(value, propertyName);
        }

        deleteUserSessionProperty(value, propertyToDelete);
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Function for knowing whether the property desired is in a nested or not nested object.
     * Once it is known it's a nested or nor nested property, a specific function is called.
     * Will return the property desired.
     * If propToGet === undefined; return undefined. 
     *
     * @param {string} propToGet, the name of the property to get. 
     * @returns {string | object} the value of the property.
     */
    var getUserSession = function (propToGet) {
        var property;

        if (propToGet !== undefined) {
            var nestedProperty = validateIfPropertyIsNested(propToGet);

            if (nestedProperty) {
                property = getUserSessionNestedProperty(propToGet);
            } else {
                property = getUserSessionProperty(propToGet);
            }
        }

        return property;
    };

    /**
     * Function for knowing whether the property desired to set is a nested or not nested object.
     * Once it is known it's a nested or nor nested property, a specific function is called.
     * 
     * @param {string} propToSet, the property name desired to set. e.g. 'property1' or 'obj1.obj2.property1' 
     * @param {string | object} value, the value to set to the property. e.g. 'generic text' or 'obj1: {obj2: { status: true }}'
     */
    var setUserSession = function (propToSet, value) {
        var nestedProperty = validateIfPropertyIsNested(propToSet);

        if (nestedProperty) {
            setUserSessionNestedProperty(propToSet, value);
        } else {
            setUserSessionProperty(propToSet, value);
        }
    };

    /**
     * Function for checcking if a property is defined or not, exists or not.
     * 
     * @param {string} propertyToCheck, the name of the property we want to see if is defined or not.
     * @returns {boolean} that tells whether the property is defined or not.
     */
    function validateIfPropertyIsDefined(propertyToCheck) {
        var isDefined = false;
        var property = getUserSession(propertyToCheck);

        if (property !== undefined) {
            isDefined = true;
        }

        return isDefined;
    }

    /**
     * Function for deleting any property. Nested and Not Nested.
     * Not Nested e.g. 'property1'
     * Nested e.g. 'object1.objectWithin1.property1'
     * Vallidate if the property is defined (exists) before attempting to delete it
     *
     * @param {string} propertyToDelete, the name of the property to delete 
     */
    var deleteUserSession = function (propertyToDelete) {
        var isPropertyDefined = validateIfPropertyIsDefined(propertyToDelete);

        if (isPropertyDefined) {
            var nestedProperty = validateIfPropertyIsNested(propertyToDelete);

            if (nestedProperty) {
                deleteUserSessionNestedProperty(propertyToDelete);
            } else {
                deleteUserSessionProperty(sessionStorage.userSession, propertyToDelete);
            }
        }
    };

    /**
     * Clears any property within the object userSession, it's reset.
     */
    var clearUserSession = function () {
        sessionStorage.userSession = {};
    };  

    // ------------------------------------------------------------------------------------------------------------

    return {
        getUserSession    : getUserSession,
        setUserSession    : setUserSession,
        deleteUserSession : deleteUserSession,
        clearUserSession  : clearUserSession
    };

}]);