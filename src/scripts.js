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

// Fields per iot protocol
const KnownFields = [
    [
        {r: 10, s: 6, name: "Device type"},
        {r: 17, s: 4, name: "Serial number"},
        {r: 36, s: 1, name: "DC input power"},
        {r: 37, s: 1, name: "AC input power"},
        {r: 38, s: 1, name: "AC output power"},
        {r: 39, s: 1, name: "DC output power"},
        {r: 43, s: 1, name: "SOC"},
        {r: 70, s: 1, name: "AC output mode"},
        {r: 77, s: 1, name: "AC input voltage"},
        {r: 80, s: 1, name: "AC input frequency"},
        {r: 86, s: 1, name: "PV S1 voltage"},
        {r: 87, s: 1, name: "PV S1 power"},
        {r: 88, s: 1, name: "PV S1 current"},
        {r: 3007, s: 1, name: "AC control"},
        {r: 3008, s: 1, name: "DC control"},
        {r: 3034, s: 1, name: "LED mode"},
        {r: 3060, s: 1, name: "Power off"},
        {r: 3063, s: 1, name: "Eco control"},
        {r: 3064, s: 1, name: "Eco mode"},
        {r: 3065, s: 1, name: "Charging mode"},
        {r: 3066, s: 1, name: "Power lifting control"},
    ],
    [
        {r: 102, s: 1, name: "SOC"},
        {r: 104, s: 1, name: "Time remaining *"},
        {r: 110, s: 6, name: "Device type"},
        {r: 116, s: 4, name: "Serial number"},
        {r: 140, s: 1, name: "DC output power"},
        {r: 142, s: 1, name: "AC output power"},
        {r: 144, s: 1, name: "DC input power"},
        {r: 146, s: 1, name: "AC input power"},
        {r: 154, s: 1, name: "PV generated"},
        {r: 1212, s: 1, name: "PV S1 power"},
        {r: 1213, s: 1, name: "PV S1 voltage"},
        {r: 1214, s: 1, name: "PV S1 current"},
        {r: 1220, s: 1, name: "PV S2 power"},
        {r: 1221, s: 1, name: "PV S2 voltage"},
        {r: 1222, s: 1, name: "PV S2 current"},
        {r: 1228, s: 1, name: "SM P1 power"},
        {r: 1229, s: 1, name: "SM P1 voltage"},
        {r: 1230, s: 1, name: "SM P1 current"},
        {r: 1236, s: 1, name: "SM P2 power"},
        {r: 1237, s: 1, name: "SM P2 voltage"},
        {r: 1238, s: 1, name: "SM P2 current"},
        {r: 1244, s: 1, name: "SM P3 power"},
        {r: 1245, s: 1, name: "SM P3 voltage"},
        {r: 1246, s: 1, name: "SM P3 current"},
        {r: 1300, s: 1, name: "Grid frequency"},
        {r: 1313, s: 1, name: "Grid P1 power"},
        {r: 1314, s: 1, name: "Grid P1 voltage"},
        {r: 1315, s: 1, name: "Grid P1 current"},
        {r: 1319, s: 1, name: "Grid P2 power"},
        {r: 1320, s: 1, name: "Grid P2 voltage"},
        {r: 1321, s: 1, name: "Grid P2 current"},
        {r: 1325, s: 1, name: "Grid P3 power"},
        {r: 1326, s: 1, name: "Grid P3 voltage"},
        {r: 1327, s: 1, name: "Grid P3 current"},
        {r: 1500, s: 1, name: "AC output frequency"},
        {r: 1510, s: 1, name: "AC output P1 power"},
        {r: 1511, s: 1, name: "AC output P1 voltage"},
        {r: 1512, s: 1, name: "AC output P1 current"},
        {r: 1517, s: 1, name: "AC output P2 power"},
        {r: 1518, s: 1, name: "AC output P2 voltage"},
        {r: 1519, s: 1, name: "AC output P2 current"},
        {r: 1524, s: 1, name: "AC output P3 power"},
        {r: 1525, s: 1, name: "AC output P3 voltage"},
        {r: 1526, s: 1, name: "AC output P3 current"},
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
