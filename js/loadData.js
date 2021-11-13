"use strict"; //! JS Scrict Mode

//* Loading JSON Files
const files_JSON = ["PRO_Tuning","PRO_Weapons","PRO_Mods","PRO_ModPerks","PRO_Perks","PRO_Transport","ST_Weapons"]; // Insert all JSONs to DATA_JSON folder then add file name to files_JSON array. 
const num_files = files_JSON.length - 1; // Find number of files in files_JSON - 1 to account for 0 based.

//* Vanilla JS Method
var DataTable = []; 
export function load_JSON(){
    for (var i = 0; i <= num_files; window[files_JSON[i]] = DataTable[i], i++) { // Iterate over each string in files_JSON to resolve local file path and assign to variable of the same name.
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
            {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        return DataTable[i] = JSON.parse(xhr.responseText);
                    } else {
                        console.error(xhr);
                    }
                }
            }
        xhr.open("GET", './DATA_JSON/' + files_JSON[i] + '.json', false);
        xhr.send();
    } 
}

//* JQuery Method
// TODO: Move the following jQuery methods to another file for late use.
/* var DataTable = [];
for (var i = 0; i <= num_files; window[files_JSON[i]] = DataTable[i][0].Rows, i++) {
    DataTable[i] = JSON.parse((function () {
            var json = null;
            return $.ajax({
                'async': false,
                'global': false,
                'url': '/DATA_JSON/' + files_JSON[i] + '.json',
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            }).responseText;
        })());
} */

load_JSON();