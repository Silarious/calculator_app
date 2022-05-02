"use strict"; //! JS Scrict Mode
//* Import JS Files
import { load_JSON } from "./loadData.js";

//* Filter Real Weapons
//Not all objects in PRO_Tuning are usable/real weapons, filtering and creating variables for real weapons is done here.
const weaponCodeNameList = [];
const weapons = PRO_Weapons[0].Rows;
for (let key in weapons) { // Only show objects that pass the filter for the weapon name.
    let m_weaponName = weapons[key].m_weaponName;
    (m_weaponName.hasOwnProperty('Key') === true // Ternary Operator
    && key.startsWith('WP') 
    && !key.includes('02') 
    && !key.includes('Exotic') 
    && !key.includes('LMG_Needle') 
    && !key.includes('Leaf') 
    ? weaponCodeNameList.push(key)
    : null);

} //TODO: replace all includes/filters with REGEX.

//! MUST FIND DYNAMIC WAY TO EXECUTE THE FOLLOWING
// Object Deconstructing all the correct weapon entries from PRO_Tuning and storing in variable of the same weapon name.
const Tuning = PRO_Tuning[0].Rows;
const {WP_G_Pistol_Energy_01, WP_G_SMG_Needle_01, WP_A_AR_Bullet_01, WP_G_AR_Energy_01, WP_D_AR_Bullet_01, WP_D_Sniper_Gauss_01, WP_A_BR_Bullet_01, WP_D_SMG_Energy_01, WP_D_SGun_Shard_01, WP_A_HVY_Shell_01, WP_A_Launch_MSL_01, WP_G_HVY_Beam_01, WP_A_Pistol_Bullet_01, WP_D_Pistol_Bullet_01, WP_E_Pistol_Bullet_01, WP_E_BR_Bullet_01, WP_E_SMG_Bullet_01, WP_D_HVY_Exotic_01, WP_G_Sniper_Energy_01, WP_A_Sniper_Gauss_01, WP_D_BR_Shard_01, WP_G_AR_Beam_01, WP_E_Launch_Nade_01, WP_A_SGun_Energy_01, WP_G_AR_Needle_01, WP_A_SMG_Shard_01, WP_A_LMG_Needle_01, WP_D_LMG_Energy_01, WP_E_AR_Energy_01, WP_E_SGun_Bullet_01} = Tuning
//TODO: The above is a static way and will be obsolete to changes in the data.

//* Weapon Vanity Names Import
//Appending vanity/human friendly names to the weapon variables.
for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_weaponName' + '='+ 'weapons' + '.' + weaponCodeNameList[i] + '.m_weaponName.Key;');
    eval(weaponCodeNameList[i]+'.m_transportName' + '='+ 'weapons' + '.' + weaponCodeNameList[i] + '.m_transportDataTableRow.RowName;');
} 

const weaponVanityName = ST_Weapons.filter(function(weapon) {
    return weapon.Key.includes('Name') 
    && weapon.Key.includes('WP') 
    && !weapon.Key.includes('02') 
    && !weapon.Key.includes('Exotic') 
    && !weapon.Key.includes('LMG_Needle') 
    && !weapon.Key.includes('Leaf')
    && !weapon.Key.includes('Event');
}); //TODO: replace all includes/filters with REGEX. 

for (let y = 0; y < weaponVanityName.length; y++) {
    for (let x = 0; x < weaponCodeNameList.length; x++) {
        if (weaponVanityName[y].Key.includes(weaponCodeNameList[x])){
            eval(weaponCodeNameList[x]+'.m_vanityName =' + 'weaponVanityName[y].SourceString')
        }
    }
}


//* Weapons Protectile Import
//Appending useful information from PRO_Transport to weapon variables.
const transport = PRO_Transport[0].Rows //transport is used in all evals below, do not delete cause its "Unused"
for (let i = 0; i < weaponCodeNameList.length; i++) {
    let transportName = eval( weaponCodeNameList[i] + '.m_transportName');
    eval(weaponCodeNameList[i]+".m_transportType" + "=" + "transport" + "." + transportName + ".m_transportType.replace('EYWeaponTransportType::','');");
    eval(weaponCodeNameList[i]+'.m_maxTraceDistance' + '='+ 'transport' + '.' + transportName + '.m_hitscanData.m_maxTraceDistance;');
    eval(weaponCodeNameList[i]+'.m_initialProjectileSpeed' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_initialProjectileSpeed;');
    eval(weaponCodeNameList[i]+'.m_acceleration' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_acceleration;');
    eval(weaponCodeNameList[i]+'.m_accelerationApplyDelayTime' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_accelerationApplyDelayTime;');
    eval(weaponCodeNameList[i]+'.m_gravityScale' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_gravityScale;');
    eval(weaponCodeNameList[i]+'.m_collisionRadius' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_collisionRadius;');
    eval(weaponCodeNameList[i]+'.m_bounce' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_bounce;');
} 

//* Weapon Mods Import
const mods = PRO_Mods[0].Rows;
const modPerks = PRO_ModPerks[0].Rows;
const modCodeNameList = [];
for (let key in mods) { // Only show objects that pass the filter for the weapon name.
    if (key.startsWith('MOD')  === true && !key.includes('Kit')){
        mods[key].weaponName = key.replace('MOD',"WP").split('__')[0];
        mods[key].slot = key.split('__')[1].split('_')[0];
        let perkRowHandle = mods[key].m_perkRowHandle.DataTable;
         if (perkRowHandle !== null && perkRowHandle.ObjectPath === "Prospect/Content/DataTables/PRO_ModPerks.0"){
            let modName = mods[key].m_perkRowHandle.RowName;
            mods[key].m_attributeMods = eval("modPerks."+modName+".m_attributeModifiers")
        }
        mods[key].vanityName = ST_Mods.filter(function(weapon) {
            return weapon.Key.includes(mods[key].m_modName.Key) && !weapon.SourceString.includes('NOT IMPLEMENTED')
        });
        

        modCodeNameList.push(mods[key].m_rowName); 
    }
}
console.log(mods);
console.log(WP_A_AR_Bullet_01);


//* Complex Weapon Stats
// Calculating and appending stats that require equation using other stats from the weapons variables.
// Total Damage Calculation, Weakspot/Headshot Calculation, Movement Speed Calculation

for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_totalDamage' + '=('
     + weaponCodeNameList[i]+'.m_directDamage ' + '+'
     + weaponCodeNameList[i]+'.m_radialDamage) ' + '*'
     + weaponCodeNameList[i]+'.m_amountOfImmediateFires;');
    eval(weaponCodeNameList[i]+'.m_headshotDamage' + '=((('
     + weaponCodeNameList[i]+'.m_directDamage ' + '+'
     + weaponCodeNameList[i]+'.m_radialDamage) ' + '*'
     + weaponCodeNameList[i]+'.m_weakAreaDamageMultiplier)'+ '*'
     + weaponCodeNameList[i]+'.m_amountOfImmediateFires).toFixed(0)');
    eval(weaponCodeNameList[i]+'.m_movementSpeed =' + weaponCodeNameList[i]+'.m_movementSpeedMultiplier * 3.91')
}

//* Create Selection Boxes
//Populate weapon selection list
let weaponSelection = document.getElementById('weaponSelection');
weaponSelection.size = weaponCodeNameList.length;
for (let i = 0; i < weaponCodeNameList.length; i++) {
    let option = document.createElement("option");
    option.text = eval(weaponCodeNameList[i] + '.m_vanityName');
    option.id = weaponCodeNameList[i];
    weaponSelection.add(option);
}

//Sort selection alphabetically
 function sortSelection(ID){
  let sel = document.getElementById(ID);
  let ary = (function(nl) {
    let a = [];
    for (let i = 0, len = nl.length; i < len; i++)
      a.push(nl.item(i));
    return a;
  })(sel.options);
  ary.sort(function(a,b){
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });
  for (let i = 0, len = ary.length; i < len; i++)
    sel.remove(ary[i].index);
  for (let i = 0, len = ary.length; i < len; i++)
    sel.add(ary[i], null);
};
sortSelection('weaponSelection');

// Listen and execute function when new weapon is selected.
function updateWeaponSelection () {
    let slots = ["SLOT1","SLOT2","SLOT3","SLOT4"];
    for (let i = 0; i < slots.length; i++) {
        let modSlot = document.getElementById(slots[i]);

        //Clears mod options from each slot before repopulating with new options.
        while (modSlot.options.length) {modSlot.remove(0);}	
        let option = document.createElement("option");
        option.text = "None";
        option.id = "Default";
        option.setAttribute("value",0);
        option.setAttribute("m_krypto",0);
        modSlot.add(option);
        document.getElementById(slots[i]).selectedIndex = "0";

        for (let key in mods) {
            if (mods[key].slot === slots[i] && mods[key].weaponName === weaponSelection.options[weaponSelection.selectedIndex].id){
                let option = document.createElement("option");
                //option.text = mods[key].vanityName[0].SourceString;
                option.text = key;
                option.id = key;
                modSlot.add(option);
            }
        }
    }
}

function parameterAdjustment(w_parameterValue, w_modifierType, w_modifierValue){
    var result;
    switch (w_modifierType) {
      case 'Additive':
        result = w_parameterValue + w_modifierValue;
        break;
      case 'Multiplicitive_PreAdd':
        result = w_parameterValue * w_modifierValue;
        break;
      case 'Multiplicitive_PostAdd':
        result = w_parameterValue * w_modifierValue;
        break;
      case 'Override':
        result = w_modifierValue;
    }
    return result;
  }

//TODO: Move these arrays to global object at beginning of app.js
var visibleAttributes = ["m_directDamage","m_radialDamage","m_totalDamage","m_headshotDamage","m_directDamageFalloffMultiplier",
"m_directDamageFalloffStartRange","m_directDamageFalloffEndRange","m_ammoInClip","m_movementSpeed","m_spinupTime","m_refireTime",
"m_reloadTime","m_targetingTime","m_initialProjectileSpeed"];

var detailedAttributes = ["DPS","RPM","damagePerMag","shotsToKill","TTK"]

function recalculateWeaponStats(){
    let obj = eval(weaponSelection.options[weaponSelection.selectedIndex].id);

    let accuracy = parseFloat(document.getElementById('accuracySlider').value/100);
    let headshotAccuracy = parseFloat(document.getElementById('headshotAccuracySlider').value/100);
    let headshotaccuracy2 = accuracy * headshotAccuracy;
    let accuracy2 = accuracy - headshotaccuracy2;

    let health = parseInt(document.getElementById('healthSlider').value);

    let tt = document.getElementById("target_selection");
    let targetType = tt.options[tt.selectedIndex].getAttribute('id') ;
    let directDamage;
    switch(targetType) {
        case Monster: directDamage = obj.m_directDamage * m_directDamageEnemyMultiplier; break;
        case Other: directDamage = obj.m_directDamage; break;
        default: directDamage = obj.m_directDamage * obj.m_directDamagePlayerMultiplier; break;
    }

    let singleShotDamage = directDamage * obj.m_amountOfImmediateFires;
    let singleShotDamageCrit = ((directDamage * obj.m_weakAreaDamageMultiplier) * obj.m_amountOfImmediateFires)
    if (Number(obj.m_burstAmount) > Number(0)) {
        var DPS = (((1 / (obj.m_refireTime + (obj.m_burstInterval * (obj.m_burstAmount + 1))) * accuracy) * (singleShotDamage + obj.m_radialDamage) * accuracy2 + (singleShotDamageCrit + obj.m_radialDamage) * headshotaccuracy2) * (obj.m_burstAmount + 1)).toFixed(2);
    } else {
        var DPS = (((1 / obj.m_refireTime) * accuracy) * ((singleShotDamage + obj.m_radialDamage) * accuracy2 + (singleShotDamageCrit + obj.m_radialDamage) * headshotaccuracy2)).toFixed(2);
    }
    let RPM = ((60/obj.m_refireTime)*accuracy).toFixed(0);
    let shotsToKill = (Math.ceil(health / ((singleShotDamage + obj.m_radialDamage) * accuracy2 + (singleShotDamageCrit + obj.m_radialDamage) * headshotaccuracy2))).toFixed(0);

    if (Number(obj.m_burstAmount) > Number(0)) {
        var shootingTime = ((Math.ceil(shotsToKill / (obj.m_burstAmount + 1)) * obj.m_refireTime) + (Math.ceil(numberOfTotalShots / (obj.m_burstAmount + 1)) * (obj.m_burstAmount + 1)) * burstInterval);
    } else {
        var shootingTime = Math.abs(shotsToKill * obj.m_refireTime);
    }
    let numOfReload = Math.floor(shotsToKill / (obj.m_ammoInClip + 1));
    let reloadTime = Math.abs(numOfReload * obj.m_reloadTime);
    let spinupTime = Math.abs((numOfReload + 1) * obj.m_spinupTime);
    let TTK = (shootingTime + reloadTime + spinupTime).toFixed(3);
    let damagePerMag = (((singleShotDamage + obj.m_radialDamage) * accuracy2 + (singleShotDamageCrit + obj.m_radialDamage) * headshotaccuracy2) * obj.m_ammoInClip).toFixed(0);

    document.getElementById("wpName").innerHTML = obj.m_vanityName;

    /* 
    let slots = ["SLOT1","SLOT2","SLOT3","SLOT4"];
    for (let i = 0; i < slots.length; i++) {
        let obj = eval(slots[i] + ".options[" + slots[i] + ".selectedIndex].id");
        let attribute = eval("mods."+ obj + ".m_attributeMods[0].m_attribute").split(":")[2];
        let type = eval("mods."+ obj + ".m_attributeMods[0].m_modifierType").split(":")[2];
        let value = eval("mods."+ obj + ".m_attributeMods[0].m_modifierValue");

        switch(attribute){
            // Damage Variables
            case "DamageScalingDealtAgainstPlayers": playerMulti ; break;
            case "DamageScalingDealtAgainstAI": monsterMulti ; break;                
            case "WeaponDamageDirect": m_directDamage ; break;
            case "WeaponDamage": m_directDamage ; break;
            case "WeaponDamageRadial": m_radialDamage ; break;
            case "WeaponAmountOfShots": m_amountOfImmediateFires ; break;
            case "WeakAreaDamageScaling": m_weakAreaDamageMultiplier ; break;
            case "WeaponClipSize": 
            attribute = m_ammoInClip; 
            break;

            // Speed Variables
            case "WeaponBurstInterval": m_burstInterval; break;
            case "WeaponBurstCount": m_burstAmount; break;
            case "WeaponRefireTime": m_refireTime; break;
            case "TargetingTime": m_adsTime; break;
            case "WeaponEquipTime": m_equipTime; break;
            case "WeaponReloadTime": m_reloadSpeed; break;
            case "SpinupDuration": m_spinupSpeed; break;
            case "OverallMovementSpeed": m_movementSpeed; break;
            case "MaxSpeed": m_movementSpeed; break;
            // Projectile Variables
            case "ProjectileMaxSpeed": m_initialProjectileSpeed; break;
            // Range Variables
            case "WeaponDamageFalloffMultiplier": m_directDamageFalloffMultiplier; break;
            case "WeaponDamageRange":
            m_directDamageFalloffStartRange;
            m_directDamageFalloffEndRange;
            break;
        }
    } */

    //*Populate Table with unmodded and modded stats
    for (let i = 0; i < visibleAttributes.length; i++) {
        eval("document.querySelector('#" + visibleAttributes[i] + " .default').innerHTML = obj." + visibleAttributes[i] + ";")
    }
    for (let i = 0; i < detailedAttributes.length; i++) {
        eval("document.querySelector('#" + detailedAttributes[i] + " .default').innerHTML =" + detailedAttributes[i] + ";")
    }

} 
//Populates the table with data from first option when the selection box has loaded.
function initLoad() {
    document.getElementById('weaponSelection').selectedIndex = "0"; //TODO: Change this to cached version of selection, ex. upon refresh selection stays the same.
    updateWeaponSelection ();
    recalculateWeaponStats ();
}
weaponSelection.addEventListener("load", initLoad());

//Used to populate table with data every time selection changes.
function populateWeaponStats() {
    updateWeaponSelection ();
    recalculateWeaponStats ()
}
weaponSelection.addEventListener('change', populateWeaponStats);

modSelection.addEventListener("change", recalculateWeaponStats);

//Listens for any input change and only recalculates detailed stats
document.querySelectorAll('.weaponStatInput').forEach(item => {
    item.addEventListener('input', event => {
        recalculateWeaponStats ()
    })
})