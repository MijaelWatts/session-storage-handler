// Test agains getting undefined or null values from the UserSession
// Test agains setting undefined. What should happen?
describe("UserSessionFactory Suite", function () {

    'use strict';

    describe("Not Nested Properties Suite V1", function() {
        xit("It must return undefined when getting non existing properties.");
        xit("It must set a string in a property.");
        xit("It must set an objects in a property.");
        xit("It must update an existing property.");
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