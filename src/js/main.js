"use strict";

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    /* Entry point of the application */
    App.start = function()
    {
        // create a new scene
        App.scene = new Scene({container:"scene"});
        App.scene2 = new Scene({container:"scene2"});

        // initialize the particle system
        var particleSystem = new ParticleSystem();
        particleSystem.initialize('data/048.csv');

        //add the particle system to the scene
        App.scene.addObject( particleSystem.getParticleSystems());
        App.scene2.addObject(particleSystem.get2DView());
        // render the scene
        App.scene.render();
        App.scene2.render();
    };

}) ();