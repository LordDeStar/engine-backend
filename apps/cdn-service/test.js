import SDK from './engine.js';
import {scene} from './saved_scene.js';
async function createRenderer(parsedRenderer) {
    let renderer;
    const color = [Number(parsedRenderer.color[0]), Number(parsedRenderer.color[1]), Number(parsedRenderer.color[2]), Number(parsedRenderer.color[3])]
    renderer = new SDK.Renderer(parsedRenderer.geometryUrl, parsedRenderer.materialUrl, false, parsedRenderer.textureUrl, color);
    return renderer;
}

async function createObjectsFromJson(object) {
    const obj = new SDK.GameObject(object.tag);
    const transform = await SDK.Transform.fromJson(object.transform);

    const components = await Promise.all(
        object.components.map(async (componentString) => {
            const parsed = JSON.parse(componentString);
            switch (parsed.name) {
                case 'renderer':
                    return await createRenderer(parsed);
            }
        })

    );

    obj.transform = transform;
    components.forEach(component => {
        obj.AddComponent(component)
    })
    return obj;
}
let world = new SDK.Engine("100%", "100%");
world.init("main");

let objects = await Promise.all(scene.map(async (obj) => {
    return await createObjectsFromJson(JSON.parse(obj));
}));
world._objects = objects;

world.start('light');
