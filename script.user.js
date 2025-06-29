// ==UserScript==
// @name         sxyzzy
// @namespace    sxyzzy
// @version      2.4.1
// @author       vettel&fqy
// @description  山东省教师教育网2025互联网+
// @match        *://www.qlteacher.com/
// @match        *://yxjc.qlteacher.com/project/yey2025/*
// @match        *://yxjc.qlteacher.com/project/xx2025/*
// @match        *://yxjc.qlteacher.com/project/cz2025/*
// @match        *://yxjc.qlteacher.com/project/gz2025/*
// @match        *://player.qlteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/timvort/internet-/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/timvort/internet-/main/script.user.js
// ==/UserScript==
(function() {
    'use strict';

    // ========== 配置常量 ==========
    const TEST_KEYWORDS = ["题", "评估", "测试", "测验", "考核"];

    // ========== 工具函数 ==========

    // 显示加载成功提示
    function showLoadSuccessNotification(message = 'sxyzzy脚本加载成功！注意地址栏是否阻止弹出窗口了！！！') {
        if(!document.URL.includes('qlteacher') || !document.URL.includes('lesson')) {
            return;
        }

        if(document.getElementById('qlteacher-script-notification')) return;
        const notification = document.createElement('div');
        notification.id = 'qlteacher-script-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: #2196F3;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        notification.textContent = message + ` (版本: ${GM_info?.script?.version || '2.3.6'})`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // 安全点击元素
    function safeClick(selector, description) {
        try {
            const elements = document.querySelectorAll(selector);
            if(elements.length > 0) {
                elements[0].click();
                showLoadSuccessNotification(`成功点击: ${description}`);
                return true;
            }
        } catch(e) {
            console.error(`点击 ${description} 失败:`, e);
        }
        return false;
    }

    // ========== 核心功能函数 ==========

    // 课程页面处理
    function coursesPage() {
        if(document.URL.includes('yxjc.qlteacher.com/project/yey2025/lesson/learn') ||
           document.URL.includes('yxjc.qlteacher.com/project/xx2025/lesson/learn') ||
           document.URL.includes('yxjc.qlteacher.com/project/cz2025/lesson/learn') ||
           document.URL.includes('yxjc.qlteacher.com/project/gz2025/lesson/learn')){

            if(!document.hidden){
                setTimeout(() => console.log("mainpage waiting..."), 500);
                var buttons = document.getElementsByTagName("button");
                for(var i=0; i<buttons.length; i++){ // 遍历所有按钮
                    var spans = buttons[i].getElementsByTagName("span");
                    for(var j=0; j<spans.length; j++){
                        if(spans[j].innerText){
                            if(spans[j].innerText.includes("继续学习") ||
                               spans[j].innerText.includes("开始学习")){
                                // 在点击按钮前显示通知
                                showLoadSuccessNotification('检测到课程学习按钮，即将尝试点击...如果不出现新窗口说明浏览器阻止新窗口弹出了，请手动允许');
                                buttons[i].click();// 找到第一个符合条件的按钮就点击
                                return;// 点击后立即返回，不再检查其他按钮
                            }
                            else if(spans[j].innerText.includes("已完成学习")){
                                window.close();
                                return;// 关闭窗口后立即返回
                            }
                        }
                    }
                }
            }
        }
    }

    setInterval(coursesPage, 3000);

    // coursePage函数
    function coursePage(){
        var patt = /^https:\/\/player.qlteacher.com\/learning\/[^=]*/;
        if(patt.test(document.URL)){
            var buttons = document.getElementsByTagName("button");
            for(var i=0; i<buttons.length; i++){
                var spans = buttons[i].getElementsByTagName("span");
                for(var j=0; j<spans.length; j++){
                    if(spans[j].innerText){
                        if(spans[j].innerText.includes("继续学习") ||
                           spans[j].innerText.includes("开始学习")){
                            // 在点击按钮前显示通知
                            showLoadSuccessNotification('检测到课程学习按钮，即将尝试点击...如果不出现新窗口说明浏览器阻止新窗口弹出了，请手动允许');
                            buttons[i].click();// 找到第一个符合条件的按钮就点击
                            return;// 点击后立即返回，不再检查其他按钮
                        }
                        if(spans[j].innerText.includes("已完成学习")){
                            window.close();
                            return;// 关闭窗口后立即返回
                        }
                    }
                }
            }
        }
    }
    setInterval(coursePage, 1000);

    // play函数 - 简化版，不封装按钮点击逻辑
    function play(){
        var patt = /^https:\/\/player.qlteacher.com\/learning\/[^=]*/;
        if(patt.test(document.URL)){
            // 纯测试题的课程 - 增强版
            function handleTestPage() {
                var elements = document.getElementsByClassName("segmented-text-ellipsis mr-16");
                if(elements.length === 0) {
                    elements = document.getElementsByClassName("segmented-text-ellipsis");
                }

                if(elements.length > 0 && elements[0].innerText.includes("题")||elements[0].innerText.includes("评估")) {
                    // 找到测试题页面
                    showLoadSuccessNotification('检测到测试题页面，即将开始答题操作...');

                    var tests = document.getElementsByClassName("mb-16 ng-star-inserted");
                    for(var t=0; t<tests.length; t++){
                        var labels = tests[t].querySelectorAll("label");
                        if(labels.length > 0) {
                            labels[0].click();
                        }
                    }
                    return true;
                }
                return false;
            }

            // 主检测函数
            function checkTestPage() {
                if(handleTestPage()) {
                    return;
                }
                setTimeout(checkTestPage, 500);
            }

            // 初始检查
            checkTestPage();

            // 监听DOM变化
            if(typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function(mutations) {
                    if(handleTestPage()) {
                        // observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            // ========== 直接写出提交按钮处理逻辑 ==========
            // 提交答案 - 直接查找按钮并点击
            var buttons = document.querySelectorAll("button");
            for(var k=0; k<buttons.length; k++){
                var innerTextElement = buttons[k].getElementsByClassName("ng-star-inserted");
                if(innerTextElement.length > 0 &&
                   innerTextElement[0].innerText == "提交"){
                    // 在点击提交按钮前显示通知
                    showLoadSuccessNotification('检测到"提交"按钮，即将点击...');
                    buttons[k].click();
                    break;
                }
                // 增加对"提交答案"文本的匹配
                else if(innerTextElement.length > 0 &&
                       innerTextElement[0].innerText == "提交答案"){
                    showLoadSuccessNotification('检测到"提交答案"按钮，即将点击...');
                    buttons[k].click();
                    break;
                }
            }

            // 确定提交 - 直接查找按钮并点击
            buttons = document.querySelectorAll("button");
            for(k=0; k<buttons.length; k++){
                var innerTextElement = buttons[k].getElementsByClassName("ng-star-inserted");
                if(innerTextElement.length > 0 &&
                   innerTextElement[0].innerText == "确定"){
                    // 在点击确定按钮前显示通知
                    showLoadSuccessNotification('检测到"确定"按钮，即将点击...');
                    buttons[k].click();
                    break;
                }
                // 增加对"确认"文本的匹配
                else if(innerTextElement.length > 0 &&
                       innerTextElement[0].innerText == "确认"){
                    showLoadSuccessNotification('检测到"确认"按钮，即将点击...');
                    buttons[k].click();
                    break;
                }
            }

            // 如果状态为已完成，则关闭窗口
            var countDownElements = document.getElementsByClassName('count-down ng-star-inserted');
            if(countDownElements.length > 0 && countDownElements[0].innerText=="已完成"){
                window.close();
            }

            // 弹出的多选题窗口
            if(document.getElementsByClassName("ant-checkbox").length > 0){
                if(document.getElementsByTagName('video')[0]?.paused){
                    var items1 = document.getElementsByClassName("ant-checkbox");
                    var cnt = 0;
                    for(var i=0; i<items1.length; i++){
                        var randomZeroOrOne = Math.floor(Math.random() * 2 + 0.5);
                        if(randomZeroOrOne == 1) {
                            cnt++;
                            items1[i].click();
                        }
                    }
                    if(cnt > 0){
                        // 点击提交按钮
                        var submitButtons = document.getElementsByClassName("ant-btn radius-4 px-lg py0 ant-btn-primary");
                        if(submitButtons.length > 0) {
                            submitButtons[0].click();
                        }
                    }
                }
            }

            // 弹出的单选题窗口
            if(document.getElementsByClassName("ant-radio-input").length > 0){
                if(document.getElementsByTagName('video')[0]?.paused){
                    // 执行单选题操作
                    var options = document.getElementsByClassName("ant-radio-input");
                    if(options.length > 0) {
                        var randomIndex = Math.floor(Math.random() * options.length);
                        options[randomIndex].click();
                        // 点击提交按钮
                        var submitButtons = document.getElementsByClassName("ant-btn radius-4 px-lg py0 ant-btn-primary");
                        if(submitButtons.length > 0) {
                            submitButtons[0].click();
                        }
                    }
                }
            }

            // 播放视频
            if(document.getElementsByTagName('video').length > 0 &&
               document.getElementsByTagName('video')[0].paused){
                var video = document.getElementsByTagName('video')[0];
                video.muted = true;
                video.play();
            }

            // 如果完成，则退出
            var countDownElements = document.getElementsByClassName('count-down ng-star-inserted');
            if(countDownElements.length > 0 && countDownElements[0].innerText=="已完成"){
                window.close();
            }
        }
    }
    setInterval(play, 1000);
})();
