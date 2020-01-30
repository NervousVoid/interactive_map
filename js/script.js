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

let parsed_articles;

loadJSON(function(response) {
     parsed_articles = JSON.parse(response);
});

function show_info(scene){
    let selected = null;
    let infoBlock = document.getElementById('infoBlock');
    let mainBlock = document.getElementById('infoWindow');

    let articleTitle = document.getElementById('articleTitle');
    let articleImg = document.getElementById('articleImg');
    let articleP = document.getElementById('articleP');
    let articleWikiUrl = document.getElementById('articleWikiUrl');

    scene.onPointerObservable.add(function (evt) {
        if (selected) {
            selected.material.diffuseColor = BABYLON.Color3.White();
            selected = null;
        }
        if (evt.pickInfo.hit && evt.pickInfo.pickedMesh && evt.event.button === 0) {
            selected = evt.pickInfo.pickedMesh;
            //evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Black();
            if (evt.pickInfo.pickedMesh.name.includes('sphere')) {
                let title = document.getElementById('name');
                mainBlock.classList.add('closed');

                infoBlock.classList.remove('opened');
                infoBlock.classList.add('closed');

                setTimeout(function () {
                    let ind = evt.pickInfo.pickedMesh.name.match(/(\d+)/);
                    ind = Number(ind[0]);
                    articleTitle.innerHTML = parsed_articles[ind].title;
                    articleImg.setAttribute("src", parsed_articles[ind].imgurl);
                    articleP.innerHTML = parsed_articles[ind].text;
                    articleWikiUrl.setAttribute("href", parsed_articles[ind].wikiurl);
                    if (parsed_articles[ind].type == "radio") {
                        infoBlock.style.borderRight = "yellow 3px solid";
                        articleWikiUrl.style.border = "yellow 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Yellow();
                    } else if (parsed_articles[ind].type == "oil") {
                        infoBlock.style.borderRight = "purple 3px solid";
                        articleWikiUrl.style.border = "purple 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Purple();
                    } else if (parsed_articles[ind].type == "transport") {
                        infoBlock.style.borderRight = "green 3px solid";
                        articleWikiUrl.style.border = "green 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Green();
                    } else if (parsed_articles[ind].type == "explosion") {
                        infoBlock.style.borderRight = "red 3px solid";
                        articleWikiUrl.style.border = "red 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
                    } else if (parsed_articles[ind].type == "hydro") {
                        infoBlock.style.borderRight = "cyan 3px solid";
                        articleWikiUrl.style.border = "cyan 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Blue();
                    }

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
        let pins = [];
        for (let i = 0; i < 5; i++){
            pins[i] = BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
            pins[i].material = new BABYLON.StandardMaterial("pin_mat", scene);
            pins[i].position = new BABYLON.Vector3(0, 7, 7.2);
            scene.meshes[scene.meshes.length-1].name = 'sphere' + i.toString();
        }

        //let sphere0 = BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        //sphere0.material = new BABYLON.StandardMaterial("pin_mat", scene);
        //sphere0.position = new BABYLON.Vector3(0, 7, 7.2);
        //scene.meshes[scene.meshes.length-1].name = 'sphere0';

        let sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere1.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere1.position = new BABYLON.Vector3(0, 10, 0);
        scene.meshes[scene.meshes.length-1].name = 'sphere1';

        let sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere2.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere2.position = new BABYLON.Vector3(0, 5, 8.8);
        scene.meshes[scene.meshes.length-1].name = 'sphere2';

        let sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere3.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere3.position = new BABYLON.Vector3(-8.8, 5, 0);
        scene.meshes[scene.meshes.length-1].name = 'sphere3';

        let sphere4 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
        sphere4.material = new BABYLON.StandardMaterial("pin_mat", scene);
        sphere4.position = new BABYLON.Vector3(-5, 7, 5.2);
        scene.meshes[scene.meshes.length-1].name = 'sphere4';

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