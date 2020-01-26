window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    //canvas.height = 100;
    //canvas.width = 100;

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        //Adding a light
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -10), scene);
        light.intensity = 3;

        var camera = new BABYLON.ArcRotateCamera("Camera", 2 * Math.PI / 2, 3 * Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);

        camera.attachControl(canvas, true);

        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 35;

        camera.useBouncingBehavior = true;
        var assetsManager = new BABYLON.AssetsManager(scene);
        var meshTask = assetsManager.addMeshTask("skull task", "", "./earth/", "scene_final.glb");
        //var box = BABYLON.Mesh.CreateBox("box", 5.0, scene);
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3.Zero();
            //alert(task.loadedMeshes[0].position);
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
    };

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