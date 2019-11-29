// Test agains getting undefined or null values from the UserSession
// Test agains setting undefined. What should happen?
describe("UserSessionFactory Suite", function () {

    'use strict';

    var dpndncy = {}
    var NOT_EXISTING_PROPERTY = 'notExistingProp';
    var STRING_VALUE = 'String value.';
    var JS_OBJECT = { obj1: { obj2: { prop1: 'String value.' } } };

    beforeEach(function() {
        module('userSessionHandlerApp', function($provide) {
            $provide.value('$sessionStorage', { userSession: {} });
        });

        inject(function(_UserSessionFactory_, _UserSessionConstant_) {
            dpndncy.usrSessFcty  = _UserSessionFactory_;
            dpndncy.usrSessConst = _UserSessionConstant_;
        });
    });

    describe("Not Nested Properties Suite V1", function() {
        it("It must return undefined when getting non existing properties.", function() {
            var valueFromSession;
            
            valueFromSession= dpndncy.usrSessFcty.getUserSession(NOT_EXISTING_PROPERTY);
            expect(valueFromSession).toBeUndefined();
        });

        it("It must set a string in a property.", function() {
            var valueFromSession;

            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            expect(valueFromSession).toBeUndefined();

            dpndncy.usrSessFcty.setUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY, STRING_VALUE);
            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            
            expect(valueFromSession).toBeDefined();
            expect(valueFromSession).toEqual(STRING_VALUE);
        });
        
        it("It must set an object in a property.", function() {
            var valueFromSession;

            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            expect(valueFromSession).toBeUndefined();

            dpndncy.usrSessFcty.setUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY, JS_OBJECT);
            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            
            expect(valueFromSession).toBeDefined();
            expect(valueFromSession).toEqual(JS_OBJECT);
        });
        
        it("It must update an existing property.", function() {
            var valueFromSession;

            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            expect(valueFromSession).toBeUndefined();

            dpndncy.usrSessFcty.setUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY, STRING_VALUE);
            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            
            expect(valueFromSession).toBeDefined();
            expect(valueFromSession).toEqual(STRING_VALUE);

            dpndncy.usrSessFcty.setUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY, JS_OBJECT);
            valueFromSession = dpndncy.usrSessFcty.getUserSession(dpndncy.usrSessConst.NOT_NESTED_PROPERTY);
            
            expect(valueFromSession).toBeDefined();
            expect(valueFromSession).toEqual(JS_OBJECT);
        });
    });

    describe("Nested Properties Suite V2", function() {
        xit("It must return undefined when getting non existing properties.");
        xit("It must set a string in a property.");
        xit("It must set an objects in a property.");
        xit("It must update an existing property.");
    });

    describe("Delete Nested and Not Nested Properties Suite V2.1", function() {
        xit("It must return undefined when attempting to delete a non existing property.");
        xit("It must delete not nested existing properties.");
        xit("It must delete nested existing properties");
    });

    describe("Clear The $sessionStorage Object Suite V2.2", function() {
        xit("It must clear the $sessionStorage.");
    });

});