"use strict";

/* Get or create the application global variable */
var App = App || {};

var ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    // data container
    var data = [];

    var points;

    // scene graph group for the particle system
    var sceneObject = new THREE.Group();
    var scene2Object = new THREE.Group();
    // bounds of the data
    var bounds = {};

    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    self.drawContainment = function() {

        // get the radius and height based on the data bounds
        var radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        var height = (bounds.maxY - bounds.minY) + 1;

        // create a cylinder to contain the particle system
        var geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
        var cylinder = new THREE.Mesh( geometry, material );

        // add the containment to the scene
        // scene2Object.add(cylinder);
    };

    // creates the particle system
    self.createParticleSystem = function() {

        // use self.data to create the particle system
        var points;
        var particles = data.length;
        var geometry = new THREE.BufferGeometry();
        var positions = [];
        var colors = [];
        var color = new THREE.Color();
        var localPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 0.9 );
        // var another = [];

        var n = 100, n2 = n /2; // particles spread in the cube

        // console.log(data[2].X);
        for ( var i = 0; i < particles; i ++ ) {

            // positions

            var x = data[i].X;
            var y = data[i].Y;
            var z = data[i].Z;
            colors.push(data[i].concentration);
            positions.push( x, y, z );

        }

        // console.log(another);
        // console.log(colors);
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 1 ) );

        geometry.computeBoundingSphere();

        //
        var material = new THREE.PointsMaterial( { size: 0.6, vertexColors: THREE.VertexColors });
        var material2 = new THREE.PointsMaterial( { size: 0.6, vertexColors: THREE.VertexColors, 
            clippingPlanes: [ localPlane ],
            clipShadows: true 
        } );

        // gui controls
        var gui = new dat.GUI(),
                    folderLocal = gui.addFolder( "Local Clipping" ),
                    propsLocal = {
                        get 'Plane'() { return localPlane.constant; },
                        set 'Plane'( v ) { localPlane.constant = v }
                    };

                folderLocal.add( propsLocal, 'Plane', -5, 5 );

        points = new THREE.Points( geometry, material );
        var points2 = new THREE.Points( geometry, material2 );
        // points.rotation.x = - Math.PI / 2;
        sceneObject.add( points );
        
        scene2Object.add( points2 );
    };

    // data loading function
    self.loadData = function(file){

        // read the csv file
        d3.csv(file)
        // iterate over the rows of the csv file
            .row(function(d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
                bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
                bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

                // add the element to the data collection
                data.push({
                    // concentration density
                    concentration: Number(d.concentration),
                    // Position
                    X: Number(d.Points0),
                    Y: Number(d.Points2),
                    Z: Number(d.Points1),
                    // Velocity
                    U: Number(d.velocity0),
                    V: Number(d.velocity2),
                    W: Number(d.velocity1)
                });
                // console.log(data);
                // console.log(bounds);
            })
            // when done loading
            .get(function() {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
                self.drawContainment();

                // create the particle system
                self.createParticleSystem();
            });
    };

    // publicly available functions
    var publiclyAvailable = {

        // load the data and setup the system
        initialize: function(file){
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystems : function() {
            return sceneObject;
        },

        // accessor for 2D particles
        get2DView : function() {
            return scene2Object;
        }
    };

    return publiclyAvailable;

};