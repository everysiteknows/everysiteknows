(function() {
    var el = document.getElementById("device");
    var browser = document.getElementById("browser");
    var os = document.getElementById("os");
    var parser = new UAParser();
    if (parser.getDevice() && parser.getDevice().name) {
        el.innerHTML += '<b>Device:</b> ' + JSON.stringify(parser.getDevice()) + '<br>';
    }
    if(navigator.platform === "iPhone"){
        el.innerHTML += "📱 You have a fancy iPhone"
    } else {
    el.innerHTML += '<b>CPU:</b><br> '+navigator.platform+', ';
    if (parser.getCPU() && parser.getCPU().name) {
        el.innerHTML += JSON.stringify(parser.getCPU()) + ' - ';
    }
    el.innerHTML += (navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' Cores' : '');}

    if(parser.getOS().name === "Android"){
        os.innerHTML = '<div class="os-info"> <img src="img/os/android.svg"/>' + parser.getOS().name + ' <span class="label">version: ' + parser.getOS().version + '</span></div>';
    }
    else if (parser.getOS().name === "Windows"){
        os.innerHTML = '<div class="os-info"> <img src="img/os/windows.svg"/>' + parser.getOS().name + ' <span class="label">version: ' + parser.getOS().version + '</span></div>';
    }
    else if(parser.getOS().name === "Mac OS"){
        os.innerHTML = '<div class="os-info"> <img src="img/os/os-system-apple.svg"/>' + parser.getOS().name + '<span class="label">version: ' + parser.getOS().version + '</span></div>';
    }
    else if(parser.getOS().name === "iOS"){
        os.innerHTML = '<div class="os-info"> <img src="img/os/os-system-apple.svg"/>' + parser.getOS().name + ' <span class="label">version: ' + parser.getOS().version + '</span></div>';
    }
    else{
        os.innerHTML = parser.getOS().name + ' ' + parser.getOS().version + '<br>';
    }
    
    if(parser.getBrowser().name == "Chrome"){
        browser.innerHTML += "<div class='browser-container'><img src='img/browser/chrome.png'/> Chrome  <span class='label'>version: " + parser.getBrowser().version + "</span></div>"
    } else if(parser.getBrowser().name == "Safari"){
        browser.innerHTML += "<div class='browser-container'><img src='img/browser/safari.png'/> Safari  <span class='label'>version: " + parser.getBrowser().version + "</span></div>"
    }  else if(parser.getBrowser().name == "Firefox"){
        browser.innerHTML += "<div class='browser-container'><img src='img/browser/firefox.png'/> Firefox  <span class='label'>version: " + parser.getBrowser().version + "</span></div>"
    }  
    else { browser.innerHTML += parser.getBrowser().name + ' ' + parser.getBrowser().version;}



    function updateBatteryStatus(battery) {
        document.querySelector('#charging').innerHTML = '<b>Battery</b><br>';
        if(parser.getOS().name === "iOS"){
            document.querySelector('#charging').innerHTML += "<p>The browser can't get any battery data on your iPhone</p>"
        } else {
            const batteryLevel = Math.round(battery.level * 10000) / 100
            if(battery.charging){
                {document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-charging.svg"/>'}
            }
            else if(batteryLevel < 10){document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-almost-full-1.svg"/>'}
            else if(batteryLevel < 20){document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-low.svg"/>'}
            else if(batteryLevel < 40){document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-medium-1.svg"/>'}
            else if(batteryLevel < 60){document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-medium-1.svg"/>'}
            else if(batteryLevel < 80){document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-almost-full-1.svg"/>'}
            else {document.querySelector('.power-icon').innerHTML = '<img class="mr2" src="img/battery/charging-battery-full-1.svg"/>'}
            document.querySelector('#charging').innerHTML += 'Charging: ' + (battery.charging ? 'charging' : 'not charging');
            document.querySelector('#level').textContent = 'Battery Level: ' + (Math.round(battery.level * 10000) / 100) + '%';
            if (!battery.charging) {
                document.querySelector('#dischargingTime').textContent = 'Time remaining: ' + (battery.dischargingTime === Infinity ? 'Infinity' : (Math.round(100 * battery.dischargingTime / 3600) / 100) + 'h');
            } else {
                document.querySelector('#dischargingTime').textContent = 'Charging Time: ' + (battery.chargingTime === Infinity ? 'Infinity' : (Math.round(100 * battery.chargingTime / 3600) / 100) + 'h');
            }
        }
    }

    navigator.getBattery().then(function(battery) {
        // Update the battery status initially when the promise resolves ...
        updateBatteryStatus(battery);

        // .. and for any subsequent updates.
        battery.onchargingchange = function() {
            updateBatteryStatus(battery);
        };

        battery.onlevelchange = function() {
            updateBatteryStatus(battery);
        };

        battery.ondischargingtimechange = function() {
            updateBatteryStatus(battery);
        };
    });
    window.addEventListener('devicelight', function(event) {
        document.getElementById('ambient').textContent = 'Ambient Light: ' + event.value;
    });


    /* GPU */
    var canvas = document.getElementById("glcanvas");
    var gpu = document.getElementById("gpu");
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (gl) {
        gpu.innerHTML = '<b>GPU:</b><br/>';
        var extension = gl.getExtension('WEBGL_debug_renderer_info');

        if (extension != undefined) {
            gpu.innerHTML += "Vendor: " + gl.getParameter(extension.UNMASKED_VENDOR_WEBGL) + '<br/>';
            gpu.innerHTML += "Renderer: " + gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) + '<br/>';
        } else {
            gpu.innerHTML += "Vendor: " + gl.getParameter(gl.VENDOR) + '<br/>';
            gpu.innerHTML += "Renderer: " + gl.getParameter(gl.RENDERER) + '<br/>';
        }
        // gpu.innerHTML += "Version: " + gl.getParameter(gl.VERSION) + '<br/>';
        // gpu.innerHTML += "Shading language: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + '<br/>';

        // gpu.innerHTML += "Extensions: " + gl.getSupportedExtensions();

    }
    gpu.innerHTML += 'Display: ' + window.screen.width + ' x ' + window.screen.height + ' - ' + window.screen.colorDepth + 'bits/pixel';
}())