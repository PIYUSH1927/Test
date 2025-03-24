import * as t from "three";
import wall from "./Wall";

const height = 10;

const roofMaterial = new t.MeshBasicMaterial({
    color: 0x03a9fc,
    transparent: true,
    opacity: 0.5,
    side: t.DoubleSide,
});

const floorMaterial = new t.MeshBasicMaterial({
    color: 0x945922,
    side: t.DoubleSide,
});

interface Point {
    x: number;
    z: number;
}

interface Vertex {
    position: t.Vector3;
    index: number;
}

export default class room {
    group;

    constructor(corners: Array<Point>) {
        const walls = [];
        for (let i = 0; i < corners.length; i++) {
            const vecA = new t.Vector3(corners[i].x, 0, corners[i].z);
            const j = (i + 1) % corners.length;
            const vecB = new t.Vector3(corners[j].x, 0, corners[j].z);
            walls.push(new wall(vecA, vecB));
        }

        this.group = new t.Group();
        for (let i = 0; i < walls.length; i++) {
            this.group.add(walls[i].group);
        }

        const coverMeshes = this.cover(corners);
        for (let i = 0; i < coverMeshes.length; i++) {
            this.group.add(coverMeshes[i]);
        }
    }


    cover(corners: Array<Point>) {
        const points: Array<Vertex> = [];
        for (let i = 0; i < corners.length; i++) {
            const pos: t.Vector3 = new t.Vector3(corners[i].x, 0, corners[i].z);
            points.push({ position: pos, index: i });
        }

        const roofVertices = new Float32Array(points.length * 3);
        const floorVertices = new Float32Array(points.length * 3);
        for (let i = 0; i < points.length; i++) {
            roofVertices[i * 3 + 0] = points[i].position.x;
            roofVertices[i * 3 + 1] = height - 0.01;
            roofVertices[i * 3 + 2] = points[i].position.z;

            floorVertices[i * 3 + 0] = points[i].position.x;
            floorVertices[i * 3 + 1] = 0.01;
            floorVertices[i * 3 + 2] = points[i].position.z;
        }

        const indices = [];
        const reverseIndices = [];
        while (points.length > 2) {
            let i = 0;
            let a = i % points.length;
            let b = (i + 1) % points.length;
            let c = (i + 2) % points.length;
            while (
                this.antiClockwise(
                    points[a].position
                        .clone()
                        .sub(points[b].position)
                        .normalize(),
                    points[b].position
                        .clone()
                        .sub(points[c].position)
                        .normalize(),
                ) ||
                this.pointInsideTriangle(
                    points[a].position,
                    points[b].position,
                    points[c].position,
                    points,
                )
            ) {
                i++;
                a = i % points.length;
                b = (i + 1) % points.length;
                c = (i + 2) % points.length;
            }

            indices.push(points[a].index);
            indices.push(points[b].index);
            indices.push(points[c].index);

            reverseIndices.push(points[c].index);
            reverseIndices.push(points[b].index);
            reverseIndices.push(points[a].index);

            points.splice(b, 1);
        }

        const floorGeometry = new t.BufferGeometry();
        const roofGeometry = new t.BufferGeometry();

        floorGeometry.setAttribute(
            "position",
            new t.BufferAttribute(floorVertices, 3),
        );
        roofGeometry.setAttribute(
            "position",
            new t.BufferAttribute(roofVertices, 3),
        );
        floorGeometry.setIndex(indices);
        roofGeometry.setIndex(reverseIndices);
        const roofMesh = new t.Mesh(roofGeometry, roofMaterial);
        const floorMesh = new t.Mesh(floorGeometry, floorMaterial);
        return [floorMesh, roofMesh];
    }

    antiClockwise(vecA: t.Vector3, vecB: t.Vector3) {
        const cross = vecA.cross(vecB);
        const vn = new t.Vector3(0, 1, 0);
        return vn.dot(cross) > 0;
    }

    pointInsideTriangle(vecA: t.Vector3, vecB: t.Vector3, vecC: t.Vector3, points: Array<Vertex>) {
        const area = this.area(vecA, vecB, vecC);
        for (let i = 0; i < points.length; i++) {
            if (
                points[i].position === vecA ||
                points[i].position === vecB ||
                points[i].position === vecC
            ) {
                continue;
            }
            const area0 = this.area(vecA, points[i].position, vecB);
            const area1 = this.area(vecB, points[i].position, vecC);
            const area2 = this.area(vecC, points[i].position, vecA);
            if (area === area0 + area1 + area2) return true;
        }
        return false;
    }

    area(vecA: t.Vector3, vecB: t.Vector3, vecC: t.Vector3) {
        return Math.abs(
            (vecA.x * (vecB.z - vecC.z) +
                vecB.x * (vecC.z - vecA.z) +
                vecC.x * (vecA.z - vecB.z)) /
            2.0,
        );
    }
}
