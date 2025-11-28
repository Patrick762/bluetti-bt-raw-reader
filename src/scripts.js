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

// region Datasets

// Common fields per iot protocol
const KnownFields = [
    [
        {r: 10, s: 6, name: "Device Type"},
        {r: 17, s: 4, name: "Serial Number"},
        {r: 43, s: 1, name: "SOC"},
        {r: 36, s: 1, name: "DC input power"},
        {r: 37, s: 1, name: "AC input power"},
        {r: 38, s: 1, name: "AC output power"},
        {r: 39, s: 1, name: "DC output power"},
    ],
    [
        {r: 110, s: 6, name: "Device Type"},
        {r: 116, s: 4, name: "Serial Number"},
        {r: 102, s: 1, name: "SOC"},
    ],
];

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

    const known = KnownFields[obj.iotVersion - 1];

    filteredRegisters.forEach((reg, i) => {
        const found = known.find(item => item.r === i+1);

        if (reg === "0000" && !found)
        {
            return;
        }

        const row = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");

        td1.textContent = i + 1;
        td2.textContent = reg;

        let str = "";

        for (var j = 0; j < reg.length; j+=2)
        {
            str += String.fromCharCode(parseInt(reg.substring(j, j+2), 16));
        }

        td3.textContent = str;
        td4.textContent = parseInt(reg, 16);

        if (found)
        {
            td1.style.color = "green";
            td1.style.fontWeight = "bold";

            td5.textContent = found.name + " (" + found.s + " registers long)";
        }

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
        row.appendChild(td5);
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
