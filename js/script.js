function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'info/articles.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

let parsed_articles;
loadJSON(function (response) {
    parsed_articles = JSON.parse(response);
});

function show_info(scene) {
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
            }
        }
    }, BABYLON.PointerEventTypes.POINTERUP);
}

function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (this._loadingDiv) {
        return;
    }

    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "babylonjsLoadingDiv";
    this._loadingDiv.style.opacity = "0";
    this._loadingDiv.style.transition = "opacity 1.5s ease";
    this._loadingDiv.style.pointerEvents = "none";

    let style = document.createElement('style');
    style.type = 'text/css';
    let keyFrames = "@-webkit-keyframes spin1 { 0% { -webkit-transform: rotate(0deg);}\n100% { -webkit-transform: rotate(360deg);}\n}@keyframes spin1 {                    0% { transform: rotate(0deg);}\n                    100% { transform: rotate(360deg);}\n                }";
    style.innerHTML = keyFrames;
    document.getElementsByTagName('head')[0].appendChild(style);

    let imgBack = new Image();
    imgBack.src = "img/preloader.png";
    imgBack.style.position = "absolute";
    imgBack.style.left = "30%";
    imgBack.style.top = "20%";

    imgBack.style.animation = "spin1 2s infinite ";
    imgBack.style.transformOrigin = "50% 50%";
    this._loadingDiv.appendChild(imgBack);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    this._loadingDiv.style.backgroundColor = this._loadingDivBackgroundColor;
    document.body.appendChild(this._loadingDiv);
    this._loadingDiv.style.opacity = "1";
    //source: https://www.babylonjs-playground.com/#5Y2GIC#2
};

window.addEventListener('DOMContentLoaded', function () {
    /*
    pins.push(BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene));
        pins[5].material = new BABYLON.StandardMaterial("pin_mat", scene);
        pins[5].name = 'sphere' + '5'.toString();
        pins[5].position = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);});
     */

    let canvas = document.getElementById('renderCanvas');
    let engine = new BABYLON.Engine(canvas, true);
    let camera;
    let pins = [];
    let meshTask;

    let createScene = function () {
        let scene = new BABYLON.Scene(engine);
        let light1 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -20), scene);
        let light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 20), scene);
        camera = new BABYLON.ArcRotateCamera("Camera", 2 * Math.PI / 2, 3 * Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
        let assetsManager = new BABYLON.AssetsManager(scene);
        meshTask = assetsManager.addMeshTask("earth", "", "./earth/", "scene_final.glb");
        scene.clearColor = new BABYLON.Color3.Black();

        for (let i = 0; i < 6; i++) {
            pins[i] = BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
            pins[i].material = new BABYLON.StandardMaterial("pin_mat", scene);
            scene.meshes[scene.meshes.length - 1].name = 'sphere' + i.toString();
        }

        pins[0].position = new BABYLON.Vector3(0, 7, 7.2);
        pins[1].position = new BABYLON.Vector3(-5, 6, -6.3);
        pins[2].position = new BABYLON.Vector3(0, 5, 8.8);
        pins[3].position = new BABYLON.Vector3(-8.8, 5, 0);
        pins[4].position = new BABYLON.Vector3(-4.3, 8.2, 3.7);


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
    scene.registerBeforeRender(function () {
        /*
        let forward = new BABYLON.Vector3(0,0,1);
        forward = vecToLocal(forward, meshTask);

        let direction = forward.subtract(origin);
        direction = BABYLON.Vector3.Normalize(direction);
        let ray = new BABYLON.Ray(origin, direction, length);
        let hit = scene.pickWithRay(ray);
        console.log(hit.position);

         */
        //let camerapos = camera.getPositionExpressedInLocalSpace();
        //pins[5].setPositionWithLocalVector(camerapos);
        //console.log(pins[5].position);
    });

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});