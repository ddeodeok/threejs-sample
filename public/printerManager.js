// printerManager.js
export function printHierarchy(object, level = 0) {
    const indent = ' '.repeat(level * 2);  // 들여쓰기
    console.log(`${indent}${object.name || '(no name)'}`);

    object.children.forEach(child => {
        printHierarchy(child, level + 1);  // 자식 객체에 대해 재귀적으로 호출
    });
}



// // 씬의 모든 객체에 대해 계층 구조를 출력
// scene.traverse(function(object) {
//     if (object.parent) {
//         console.log(`Object: ${object.name || '(no name)'}`);
//         console.log(`  Parent: ${object.parent.name || '(no parent)'}`);
//     }
//     if (object.children.length > 0) {
//         console.log(`  Children: ${object.children.map(child => child.name || '(no name)').join(', ')}`);
//     }
// });

// // 전체 계층 구조 출력
// console.log('Scene Hierarchy:');
// scene.traverse(function(object) {
//     printHierarchy(object);
// });
