import * as t from "three";

export const height = 10;
const width = 1;
const indices = [0, 1, 2, 1, 3, 2];
const indicesReverse = [0, 2, 1, 1, 2, 3];
const innerMaterial = new t.MeshBasicMaterial({ color: 0x5c8a68 });
const outerMaterial = new t.MeshBasicMaterial({ color: 0x43e66f });
const coverMaterial = new t.MeshBasicMaterial({ color: 0x2e030f });

export default class wall {
    group;
    innerStart: t.Vector3;
    outerStart: t.Vector3;
    innerEnd: t.Vector3;
    outerEnd: t.Vector3;
    constructor(start: t.Vector3, end: t.Vector3) {
        const normal = start
            .clone()
            .sub(end)
            .normalize()
            .applyAxisAngle(new t.Vector3(0, 1, 0), t.MathUtils.degToRad(90));
        const wallDelta = start
            .clone()
            .sub(end)
            .normalize()
            .multiplyScalar(width / 2);

        const innerWallOffset = normal.clone().multiplyScalar(width / 2);
        const outerWallOffset = normal.clone().multiplyScalar(-width / 2);

        this.innerStart = start.clone().add(innerWallOffset).sub(wallDelta);
        this.outerStart = start.clone().add(outerWallOffset).add(wallDelta);
        this.innerEnd = end.clone().add(innerWallOffset.add(wallDelta));
        this.outerEnd = end.clone().add(outerWallOffset).sub(wallDelta);

        const innerMesh = this.wallMesh(
            [this.innerStart, this.innerEnd],
            indices,
            innerMaterial,
        );
        const outerMesh = this.wallMesh(
            [this.outerStart, this.outerEnd],
            indicesReverse,
            outerMaterial,
        );

        const coverMeshes = wall.cover(
            [this.outerStart, this.outerEnd, this.innerStart, this.innerEnd]
        );
        this.group = new t.Group();
        this.group.add(innerMesh);
        this.group.add(outerMesh);
        for (let i = 0; i < coverMeshes.length; i++) {
            this.group.add(coverMeshes[i]);
        }
    }

    wallMesh(points: Array<t.Vector3>, indices: Array<number>, material: t.Material) {
        const geometry = new t.BufferGeometry();
        const vertices = new Float32Array(points.length * 2 * 3);

        for (let i = 0; i < points.length; i++) {
            vertices[i * 3 + 0] = points[i].x;
            vertices[i * 3 + 1] = 0;
            vertices[i * 3 + 2] = points[i].z;

            vertices[(i + 2) * 3 + 0] = points[i].x;
            vertices[(i + 2) * 3 + 1] = height;
            vertices[(i + 2) * 3 + 2] = points[i].z;
        }

        geometry.setAttribute("position", new t.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        return new t.Mesh(geometry, material);
    }

    static cover(points: Array<t.Vector3>) {
        const bottomVertices = new Float32Array(points.length * 3);
        const topVertices = new Float32Array(points.length * 3);
        const leftVertices = new Float32Array(points.length * 3);
        const rightVertices = new Float32Array(points.length * 3);

        for (let i = 0; i < points.length; i++) {
            bottomVertices[i * 3 + 0] = points[i].x;
            bottomVertices[i * 3 + 1] = 0;
            bottomVertices[i * 3 + 2] = points[i].z;

            topVertices[i * 3 + 0] = points[i].x;
            topVertices[i * 3 + 1] = height;
            topVertices[i * 3 + 2] = points[i].z;
        }

        for (let i = 0; i < points.length; i += 2) {
            leftVertices[i * 3 + 0] = points[i].x;
            leftVertices[i * 3 + 1] = 0;
            leftVertices[i * 3 + 2] = points[i].z;

            leftVertices[(i + 1) * 3 + 0] = points[i].x;
            leftVertices[(i + 1) * 3 + 1] = height;
            leftVertices[(i + 1) * 3 + 2] = points[i].z;
        }

        for (let i = 1; i < points.length; i += 2) {
            rightVertices[i * 3 + 0] = points[i].x;
            rightVertices[i * 3 + 1] = 0;
            rightVertices[i * 3 + 2] = points[i].z;

            rightVertices[(i - 1) * 3 + 0] = points[i].x;
            rightVertices[(i - 1) * 3 + 1] = height;
            rightVertices[(i - 1) * 3 + 2] = points[i].z;
        }

        const topGeometry = new t.BufferGeometry();
        const bottomGeometry = new t.BufferGeometry();
        const leftGeometry = new t.BufferGeometry();
        const rightGeometry = new t.BufferGeometry();
        topGeometry.setAttribute(
            "position",
            new t.BufferAttribute(topVertices, 3),
        );
        bottomGeometry.setAttribute(
            "position",
            new t.BufferAttribute(bottomVertices, 3),
        );
        leftGeometry.setAttribute(
            "position",
            new t.BufferAttribute(leftVertices, 3),
        );
        rightGeometry.setAttribute(
            "position",
            new t.BufferAttribute(rightVertices, 3),
        );
        topGeometry.setIndex(indicesReverse);
        bottomGeometry.setIndex(indices);
        leftGeometry.setIndex(indices);
        rightGeometry.setIndex(indicesReverse);
        const topMesh = new t.Mesh(topGeometry, coverMaterial);
        const bottomMesh = new t.Mesh(bottomGeometry, coverMaterial);
        const leftMesh = new t.Mesh(leftGeometry, innerMaterial);
        const rightMesh = new t.Mesh(rightGeometry, innerMaterial);
        return [topMesh, bottomMesh, leftMesh, rightMesh];
    }
}
