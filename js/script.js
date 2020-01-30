/*
// let url = 'https://ru.wikipedia.org/w/index.php?title=Взрыв%20нефтяной%20платформы%20Deepwater%20Horizon&action=info'
//decodeURIComponent(JSON.parse(url));
let urlwiki = 'https://ru.wikipedia.org/w/index.php?title=Взрыв%20нефтяной%20платформы%20Deepwater%20Horizon&action=info';
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};
*/


function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'info/articles.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function show_info(scene){
    let selected = null;
    let infoBlock = document.getElementById('infoBlock');
    let mainBlock = document.getElementById('infoWindow');
    scene.onPointerObservable.add(function (evt) {
        if (selected) {
            selected.material.diffuseColor = BABYLON.Color3.White();
            selected = null;
        }
        if (evt.pickInfo.hit && evt.pickInfo.pickedMesh && evt.event.button === 0) {
            selected = evt.pickInfo.pickedMesh;
            evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Black();
            if (evt.pickInfo.pickedMesh.name.includes('sphere')) {
                let title = document.getElementById('name');
                mainBlock.classList.add('closed');

                infoBlock.classList.remove('opened');
                infoBlock.classList.add('closed');

                setTimeout(function () {
                    title.innerHTML = evt.pickInfo.pickedMesh.name;
                    infoBlock.classList.add('opened');
                }, 350);

                //console.log(evt.pickInfo.pickedMesh.uniqueId);
            }
        }
    }, BABYLON.PointerEventTypes.POINTERUP);
}

function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/*
//Creates a sphere but doesn`t add it to scene (or the scene doesn`t render it)
class Pin {
    constructor(position, scene) {
        this.position = position;
        //this.url = wiki_url;
        this.d = 0.5;
        this.scene = scene;
        this.sphere = 0;
    }

    draw() {
        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: this.d}, this.scene);
        this.sphere.material = new BABYLON.StandardMaterial("pin_mat", this.scene);
        this.sphere.position = new BABYLON.Vector3(this.position);
        this.sphere.material.diffuseColor = BABYLON.Color3.Red();
    }
}
//let a = new Pin(new BABYLON.Vector3(0, 10, 0), 'abc', scene);
//a.draw();
*/

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

window.addEventListener('DOMContentLoaded', function () {
    let canvas = document.getElementById('renderCanvas');
    let engine = new BABYLON.Engine(canvas, true);

    let createScene = function () {
        let scene = new BABYLON.Scene(engine);
        let light1 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -20), scene);
        let light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 20), scene);
        let camera = new BABYLON.ArcRotateCamera("Camera", 2 * Math.PI / 2, 3 * Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
        let assetsManager = new BABYLON.AssetsManager(scene);
        let meshTask = assetsManager.addMeshTask("earth", "", "./earth/", "scene_final.glb");
        scene.clearColor = new BABYLON.Color3.Black();

        loadJSON(function(response) {
            // Parse JSON string into object
            let parsed_articles = JSON.parse(response);
            console.log(parsed_articles);
        });

        /*
        for (let i = 0; i < 5; i++){
            let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
            sphere.material = new BABYLON.StandardMaterial("pin_mat", scene);
            sphere.position = new BABYLON.Vector3(rand(10), rand(10), rand(10));
            scene.meshes[scene.meshes.length-1].name = 'sphere' + i.toString();
        }
        console.log(scene.meshes);
        */

        // Pin creation example
        let sphere = BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere.position = new BABYLON.Vector3(0, 7, 7.2);
        scene.meshes[scene.meshes.length-1].name = 'sphere1';
        let sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere2.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere2.position = new BABYLON.Vector3(0, 10, 0);
        scene.meshes[scene.meshes.length-1].name = 'sphere2';

        //sphere.material.diffuseColor = BABYLON.Color4.FromHexString("#0095FFFF");
        //sphere.material.diffuseColor = BABYLON.Color3.White();


        camera.attachControl(canvas, true);
        camera.useBouncingBehavior = true;
        camera.wheelPrecision = 10;

        light1.intensity = 1;
        light2.intensity = 1;
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 35;

        show_info(scene);

        meshTask.onSuccess = (task) => task.loadedMeshes[0].position = new BABYLON.Vector3.Zero();

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