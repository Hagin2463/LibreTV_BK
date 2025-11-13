// 添加动画样式
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.6;
            }
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    `;
    document.head.appendChild(style);
})();

// 获取版本信息（仅本地）
async function fetchVersion(url, errorMessage, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(errorMessage);
    }
    return await response.text();
}

// 版本检查函数（仅显示当前版本，不对比更新）
async function checkCurrentVersion() {
    try {
        // 获取当前版本
        const currentVersion = await fetchVersion('/VERSION.txt', '获取当前版本失败', {
            cache: 'no-store'
        });

        console.log('当前版本:', currentVersion);

        // 清理版本字符串
        const cleanCurrentVersion = currentVersion.trim();

        // 返回版本信息
        return {
            current: cleanCurrentVersion,
            currentFormatted: formatVersion(cleanCurrentVersion)
        };
    } catch (error) {
        console.error('版本检测出错:', error);
        throw error;
    }
}

// 格式化版本号为可读形式 (yyyyMMddhhmm -> yyyy-MM-dd hh:mm)
function formatVersion(versionString) {
    if (!versionString) {
        return '未知版本';
    }
    
    const cleanedString = versionString.trim();
    
    if (cleanedString.length === 12) {
        const year = cleanedString.substring(0, 4);
        const month = cleanedString.substring(4, 6);
        const day = cleanedString.substring(6, 8);
        const hour = cleanedString.substring(8, 10);
        const minute = cleanedString.substring(10, 12);
        
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    
    return cleanedString;
}

// 创建错误版本信息元素
function createErrorVersionElement(errorMessage) {
    const errorElement = document.createElement('p');
    errorElement.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';
    errorElement.innerHTML = `版本: <span class="text-amber-500">检测失败</span>`;
    errorElement.title = errorMessage;
    return errorElement;
}

// 添加版本信息到页脚（仅显示当前版本）
function addVersionInfoToFooter() {
    checkCurrentVersion().then(result => {
        const versionElement = document.createElement('p');
        versionElement.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';
        
        versionElement.innerHTML = `版本: ${result.currentFormatted}`;
        
        displayVersionElement(versionElement);
    }).catch(error => {
        console.error('版本检测出错:', error);
        const errorElement = createErrorVersionElement(`错误信息: ${error.message}`);
        displayVersionElement(errorElement);
    });
}

// 在页脚显示版本元素的辅助函数
function displayVersionElement(element) {
    const footerElement = document.querySelector('.footer p.text-gray-500.text-sm');
    if (footerElement) {
        footerElement.insertAdjacentElement('afterend', element);
    } else {
        const footer = document.querySelector('.footer .container');
        if (footer) {
            footer.querySelector('div').appendChild(element);
        }
    }
}

// 页面加载完成后添加版本信息
document.addEventListener('DOMContentLoaded', addVersionInfoToFooter);
