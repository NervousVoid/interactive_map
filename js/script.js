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

let legend = false;

function show_legend() {
    legend = true;
}

let infoBlock = document.getElementById('infoBlock');
let mainBlock = document.getElementById('infoWindow');

function show_info(scene, camera) {
    let selected = null;


    let articleTitle = document.getElementById('articleTitle');
    let articleImg = document.getElementById('articleImg');
    let articleP = document.getElementById('articleP');
    let articleWikiUrl = document.getElementById('articleWikiUrl');


    scene.onPointerObservable.add(function (evt) {
        if (selected) {
            //selected.material.diffuseColor = BABYLON.Color3.White();
            selected = null;
        }
        if (evt.pickInfo.hit && evt.pickInfo.pickedMesh && evt.event.button === 0) {
            selected = evt.pickInfo.pickedMesh;
            //evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Black();
            if (evt.pickInfo.pickedMesh.name.includes('sphere')) {
                //camera.setTarget(evt.pickInfo.pickedMesh.position);
                let camera_radius_prev = camera.radius;
                let easingFunction = new BABYLON.BackEase(.0);
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

                camera.setPosition(evt.pickInfo.pickedMesh.position);
                //BABYLON.Animation.CreateAndStartAnimation("anim", camera, "position", 60, 600, camera.position, camera.position = evt.pickInfo.pickedMesh.position, easingFunction);
                camera.radius = camera_radius_prev;


                let title = document.getElementById('name');
                mainBlock.classList.remove('opened');
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
                        infoBlock.style.borderRight = "#EFFF50 3px solid";
                        articleWikiUrl.style.border = "#EFFF50 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#EFFF50");
                    } else if (parsed_articles[ind].type == "oil") {
                        infoBlock.style.borderRight = "#F77EFF 3px solid";
                        articleWikiUrl.style.border = "#F77EFF 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#F77EFF");
                    } else if (parsed_articles[ind].type == "transport") {
                        infoBlock.style.borderRight = "#64FF77 3px solid";
                        articleWikiUrl.style.border = "#64FF77 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#64FF77");
                    } else if (parsed_articles[ind].type == "explosion") {
                        infoBlock.style.borderRight = "#FF5B37 3px solid";
                        articleWikiUrl.style.border = "#FF5B37 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#FF5B37");
                    } else if (parsed_articles[ind].type == "hydro") {
                        infoBlock.style.borderRight = "#73E1FF 3px solid";
                        articleWikiUrl.style.border = "#73E1FF 3px solid";
                        evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.FromHexString("#73E1FF");
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

//This func source: https://www.babylonjs-playground.com/#5Y2GIC#2
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
    let keyFrames = "@-webkit-keyframes spin1 { 0% { -webkit-transform: rotate(0deg);}\n100% { -webkit-transform: rotate(360deg);}\n}@keyframes spin1 { 0% { transform: rotate(0deg);}\n 100% { transform: rotate(360deg);}\n}";
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
};

window.addEventListener('DOMContentLoaded', function () {
    mainBlock.classList.add('opened');
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
        //camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 50, BABYLON.Vector3.Zero(), scene);
        let assetsManager = new BABYLON.AssetsManager(scene);
        meshTask = assetsManager.addMeshTask("earth", "", "./earth/", "scene_final.glb");
        scene.clearColor = new BABYLON.Color3.Black();

        for (let i = 0; i < 6; i++) {
            pins[i] = BABYLON.SphereBuilder.CreateSphere("sphere", {diameter: 0.5}, scene);
            pins[i].material = new BABYLON.StandardMaterial("pin_mat", scene);
            scene.meshes[scene.meshes.length - 1].name = 'sphere' + i.toString();
        }

        pins[0].position = new BABYLON.Vector3(8.8, 4.7, 1);
        pins[1].position = new BABYLON.Vector3(-5, 6, -6.3);
        pins[2].position = new BABYLON.Vector3(-5.8, 8.2, -0.5);
        pins[3].position = new BABYLON.Vector3(7.5, 6.2, 2.5);
        pins[4].position = new BABYLON.Vector3(-4.3, 8.2, 3.7);


        camera.attachControl(canvas, true);
        camera.useBouncingBehavior = true;
        camera.wheelPrecision = 10;

        light1.intensity = 1;
        light2.intensity = 1;
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 30;

        show_info(scene, camera);

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
            if (legend) {
                infoBlock.classList.remove('opened');
                infoBlock.classList.add('closed');
                mainBlock.classList.remove('closed');
                mainBlock.classList.add('opened');
                legend = false;
            }
        }
    );

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});

//История нашей планеты началась 4,5 миллиарда лет назад. Многовековая эволюция привела нас к тому, что мы сейчас имеем, но вместе с безграничными возможностями на нас ложится большая ответственность за Землю. C каждым днём количество техногенных катастроф на нашей планете растет, и именно мы ответственны за состояние и будущее Земли. <br><br>Создавая эту карту, мы хотели показать, как сильно человечество уже навердило нашей планете, и что нужно остановиться.