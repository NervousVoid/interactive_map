window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        //Adding a light
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 0), scene);

        //Adding an Arc Rotate Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);

        var assetsManager = new BABYLON.AssetsManager(scene);
        var meshTask = assetsManager.addMeshTask("skull task", "", "./earth/", "scene.gltf");
        //meshTask.scale = new BABYLON.Vector3(5, 5, 5);

        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        };

        // Move the light with the camera
        scene.registerBeforeRender(function () {
            light.position = camera.position;
        });

        assetsManager.onFinish = function (tasks) {
            engine.runRenderLoop(function () {
                scene.render();
            });
        };

        assetsManager.load();

        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
});