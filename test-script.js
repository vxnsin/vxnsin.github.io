const fs = require('fs');

// Laden der JSON-Datei
function loadJSON(callback) {   
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) throw err;
        callback(JSON.parse(data));
    });
}

// Speichern der Daten in der JSON-Datei
function saveJSON(data, callback) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) throw err;
        callback();
    });
}

// Testskript zum Aktualisieren der Daten
function testUpdateData() {
    loadJSON(function(data) {
        // Aktualisieren der Werte für den Test
        data.codingExperience += 1;
        data.techExperience += 1;

        // Speichern der aktualisierten Daten
        saveJSON(data, function() {
            console.log('Test: Daten wurden erfolgreich aktualisiert und gespeichert.');
        });
    });
}

testUpdateData();
