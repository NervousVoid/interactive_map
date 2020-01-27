window.addEventListener('DOMContentLoaded', function () {
    let canvas = document.getElementById('renderCanvas');
    let engine = new BABYLON.Engine(canvas, true);

    let createScene = function () {
        let scene = new BABYLON.Scene(engine);
        let light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -10), scene);
        let camera = new BABYLON.ArcRotateCamera("Camera", 2 * Math.PI / 2, 3 * Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
        let assetsManager = new BABYLON.AssetsManager(scene);
        let meshTask = assetsManager.addMeshTask("earth", "", "./earth/", "scene_final.glb");
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);

        camera.attachControl(canvas, true);
        camera.useBouncingBehavior = true;

        light.intensity = 3;
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 35;
        sphere.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere.position = new BABYLON.Vector3(0, 10, 0);

        let selected = null;
        scene.onPointerObservable.add(function (evt) {
            if (selected) {
                selected.material.diffuseColor = BABYLON.Color3.Gray();
                selected = null;
            }
            if (evt.pickInfo.hit && evt.pickInfo.pickedMesh && evt.event.button === 0) {
                selected = evt.pickInfo.pickedMesh;
                evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
            }
        }, BABYLON.PointerEventTypes.POINTERUP);

        meshTask.onSuccess = (task) => task.loadedMeshes[0].position = new BABYLON.Vector3.Zero();

        scene.registerBeforeRender(function () {
            light.position = camera.position;
        });

        assetsManager.onFinish = (tasks) => {
            engine.runRenderLoop(function () {
                scene.render();
            });
        };

        assetsManager.load();
        return scene;
    };

    let scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});