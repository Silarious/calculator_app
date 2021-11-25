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
    eval(weaponCodeNameList[i]+'.m_transportType' + '='+ 'transport' + '.' + transportName + '.m_transportType;');
    eval(weaponCodeNameList[i]+'.m_maxTraceDistance' + '='+ 'transport' + '.' + transportName + '.m_hitscanData.m_maxTraceDistance;');
    eval(weaponCodeNameList[i]+'.m_initialProjectileSpeed' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_initialProjectileSpeed;');
    eval(weaponCodeNameList[i]+'.m_acceleration' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_acceleration;');
    eval(weaponCodeNameList[i]+'.m_accelerationApplyDelayTime' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_accelerationApplyDelayTime;');
    eval(weaponCodeNameList[i]+'.m_gravityScale' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_gravityScale;');
    eval(weaponCodeNameList[i]+'.m_collisionRadius' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_collisionRadius;');
    eval(weaponCodeNameList[i]+'.m_bounce' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_bounce;');
} 

//* Complex Weapon Stats
// Calculating and appending stats that require equation using other stats from the weapons variables.
// Total Damage Calculation
for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_totalDamage' + '=('
     + weaponCodeNameList[i]+'.m_directDamage ' + '+'
     + weaponCodeNameList[i]+'.m_radialDamage) ' + '*'
     + weaponCodeNameList[i]+'.m_amountOfImmediateFires;');
}
// Weakspot/Headshot Calculation
for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_headshotDamage' + '=(('
     + weaponCodeNameList[i]+'.m_directDamage ' + '+'
     + weaponCodeNameList[i]+'.m_radialDamage) ' + '*'
     + weaponCodeNameList[i]+'.m_weakAreaDamageMultiplier)'+ '*'
     + weaponCodeNameList[i]+'.m_amountOfImmediateFires');
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


function clearWeaponStats(){
    document.getElementById("wpName").innerHTML = "&nbsp";
    for (let i = 0; i < document.querySelectorAll("#weaponStats td").length; i++) {
        document.querySelectorAll("#weaponStats td")[i].innerHTML = null;
    } 
}

// Listen and execute function when new weapon is selected.
weaponSelection.addEventListener('change', updateWeaponSelection);

function updateWeaponSelection () {
    clearWeaponStats();
    populateWeaponStats ()
}

function populateWeaponStats () {
    let obj = eval(weaponSelection.options[weaponSelection.selectedIndex].id);
    document.getElementById("wpName").innerHTML = obj.m_vanityName;
    document.querySelector("#m_directDamage .default").innerHTML = obj.m_directDamage;
    document.querySelector("#m_radialDamage .default").innerHTML = obj.m_radialDamage;
    document.querySelector("#m_totalDamage .default").innerHTML = obj.m_totalDamage;
    document.querySelector("#m_headshotDamage .default").innerHTML = obj.m_headshotDamage.toFixed(0);
    document.querySelector(`#m_directDamageFalloffMultiplier .default`).innerHTML = obj.m_directDamageFalloffMultiplier;
    document.querySelector(`#m_directDamageFalloffStartRange .default`).innerHTML = obj.m_directDamageFalloffStartRange;
    document.querySelector(`#m_directDamageFalloffEndRange .default`).innerHTML = obj.m_directDamageFalloffEndRange;
    document.querySelector(`#m_ammoInClip .default`).innerHTML = obj.m_ammoInClip;
    document.querySelector(`#m_movementSpeedMultiplier .default`).innerHTML = (obj.m_movementSpeedMultiplier * 3.91).toFixed(2);
    document.querySelector(`#m_spinupTime .default`).innerHTML = obj.m_spinupTime;
    document.querySelector(`#m_refireTime .default`).innerHTML = obj.m_refireTime;
    document.querySelector(`#m_reloadTime .default`).innerHTML = obj.m_reloadTime;
    document.querySelector(`#m_targetingTime .default`).innerHTML = obj.m_targetingTime;
    document.querySelector(`#m_transportType #ProjectileType`).innerHTML = obj.m_transportType.replace('EYWeaponTransportType::','');
    document.querySelector(`#m_initialProjectileSpeed .default`).innerHTML = obj.m_initialProjectileSpeed;
}


console.log(Tuning.WP_G_AR_Energy_01);