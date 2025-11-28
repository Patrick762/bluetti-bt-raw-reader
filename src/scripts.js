// region Elements

const fileInput = document.getElementById("file");

const dataOutputDiv = document.getElementById("dataOutput");
const macOutput = document.getElementById("mac");
const iotOutput = document.getElementById("iot");
const encOutput = document.getElementById("enc");
const tableOutput = document.getElementById("tbody");

// endregion

// region Types

/**
 * @typedef {Object} DeviceData
 * @property {string} mac
 * @property {number} iotVersion
 * @property {boolean} encryption
 * @property {Object} registers
 */

// endregion

/**
 * @param {string} hex
 */
function splitHex(hex) {
    const result = [];
    for (let i = 0; i < hex.length; i += 4) {
        result.push(hex.substring(i, i + 4));
    }
    return result;
}

/**
 * @param {DeviceData} obj 
 */
function displayData (obj)
{
    macOutput.textContent = obj.mac;
    iotOutput.textContent = obj.iotVersion;
    encOutput.textContent = obj.encryption ? "YES" : "NO";

    const registerKeys = Object.keys(obj.registers);

    let filteredRegisters = [];
    registerKeys.forEach(k => {
        if (obj.registers[k] !== "" && obj.registers[k] !== "00")
        {
            filteredRegisters.push(...splitHex(obj.registers[k]));
        }
        else
        {
            for (var i = 0; i < 50; i++)
            {
                filteredRegisters.push("0000");
            }
        }
    });
    
    console.log(filteredRegisters);

    // Clear table
    tableOutput.innerHTML = "";

    filteredRegisters.forEach((reg, i) => {
        if (reg === "0000")
        {
            return;
        }

        const row = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        td1.textContent = i + 1;
        td2.textContent = reg;

        let str = "";

        for (var j = 0; j < reg.length; j+=2)
        {
            str += String.fromCharCode(parseInt(reg.substring(j, j+2), 16));
        }

        td3.textContent = str;

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        tableOutput.appendChild(row);
    });

    // Show data fully loaded
    dataOutputDiv.style.display = "block";
}

document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();

    if(file.files.length)
    {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataURL = reader.result;
            const base64 = dataURL.slice(dataURL.indexOf(',')+1);
            const data = atob(base64);
            const obj = JSON.parse(data);
            displayData(obj);
        };

        reader.readAsDataURL(file.files[0]);
    }
});

dataOutputDiv.style.display = "none";
