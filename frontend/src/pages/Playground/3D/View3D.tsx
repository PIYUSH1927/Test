import * as t from "three";
import room from "./Room";
import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { initialFloorPlanData } from "../features/initialData";

interface Point {
    x: number;
    z: number;
}

interface Room {
    id: string;
    room_type: string;
    area: number;
    height: number;
    width: number;
    floor_polygon: Point[];
}

interface FloorPlanData {
    room_count: number;
    total_area: number;
    room_types: string[];
    rooms: Room[];
}

function getCenter(points: Array<Point>) {
    const center = new t.Vector3();
    for (let i = 0; i < points.length; i++) {
        center.x += points[i].x;
        center.z += points[i].z;
    }
    center.x /= points.length;
    center.z /= points.length;
    return center;
}

export default function View3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const scene = new t.Scene();
        scene.background = new t.Color(0xbfe3dd);

        const camera = new t.PerspectiveCamera(
            73,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.set(5, 5, 8);

        const renderer = new t.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;

        setRooms(initialFloorPlanData);

        function setRooms(data: FloorPlanData) {
            const points: Array<t.Vector3> = [];
            for (let i = 0; i < data.rooms.length; i++) {
                const rp = data.rooms[i].floor_polygon.map((pos: Point) => new t.Vector3(pos.x, 0, pos.z))
                const r = new room(rp);
                scene.add(r.group);
                points.push(...rp);
            }
            const center = getCenter(points);
            controls.target.set(center.x, center.y, center.z);
            controls.update();
        }


        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
        function animate() {
            controls.update();
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);
        containerRef.current?.appendChild(renderer.domElement);
    }, []);
    return (<div ref={containerRef} style={{
        width: "100vw",
        height: "100vh",
        zIndex: -1,
    }}
    />);
}

