const express = require('express');
const app = express();
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const docsPath = './docsify'; // 指定你的文档库目录路径
const sidebarPath = path.join('./', '_sidebar.md');
let server = null;

app.use(express.static(__dirname));

function startServer() {
    server = app.listen(10501, () => {
        console.log('Server started on port 10501');
    });
}

function restartServer() {
    if (server) {
        server.close(() => {
            console.log('Server stopped');
            startServer();
        });
    } else {
        startServer();
    }
}

function generateSidebar(dirPath, sidebarPath) {
    const sidebarContent = generateSidebarContent(dirPath, '');
    fs.writeFileSync(sidebarPath, sidebarContent);
    console.log('_sidebar.md generated successfully!');
}

function generateSidebarContent(dirPath, indent) {
    let sidebarContent = '';

    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (shouldIgnoreFile(file)) {
            return;
        }

        if (stat.isDirectory()) {
            const folderName = getFolderName(file);
            sidebarContent += `${indent}* ${folderName}\n`;
            const nestedSidebarContent = generateSidebarContent(filePath, `${indent}  `);
            sidebarContent += nestedSidebarContent;
        } else if (path.extname(file) === '.md') {
            const fileName = getFileName(file);
            const fileLink = getFileLink(filePath);
            sidebarContent += `${indent}* [${fileName}](${fileLink})\n`;
        }
    });

    return sidebarContent;
}

function shouldIgnoreFile(file) {
    const ignoredFolders = ['node_modules', '.git', 'assets', 'res', 'images', 'assets', 'img20220216'];
    const ignoredFiles = ['README.md', '_sidebar.md', 'index.html'];

    if (ignoredFolders.includes(file)) {
        return true;
    }

    if (ignoredFiles.includes(file)) {
        return true;
    }

    return false;
}

function getFolderName(folder) {
    return folder.replace(/_/g, ' '); // 替换下划线为空格
}

function getFileName(file) {
    return path.basename(file, '.md');
}

function getFileLink(filePath) {
    return `/${filePath.replace(/\\/g, '/').replace('.md', '')}`; // 将反斜杠替换为正斜杠
}

// 监视文档库目录中的 Markdown 文件变化
chokidar.watch(docsPath).on('all', (event, filePath) => {
    if (path.extname(filePath) === '.md' && filePath !== 'docs/_sidebar.md') {
        console.log(`File ${event}: ${filePath}`);
        generateSidebar(docsPath, sidebarPath);
        restartServer();
    }
});

startServer();
