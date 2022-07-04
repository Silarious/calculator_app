"use strict"; //! JS Scrict Mode
//* Import JS Files
import { load_JSON } from "./loadData.js";

//*Global Variables
var date = new Date();
var slots = ["SLOT1","SLOT2","SLOT3","SLOT4","SLOT5","SLOT6","SLOT7","SLOT8"];
var targetSelection = document.getElementById('targetSelection');
var monsterSelection = document.getElementById('monsterSelection');
var helmetSelection = document.getElementById('helmetSelection');
var shieldSelection = document.getElementById('shieldSelection');
const weapons = PRO_Weapons[0].Rows;
const Tuning = PRO_Tuning[0].Rows;
const Sense = AI_SenseTrigger_DT[0].Rows;
//* Filter Real Weapons
//Not all objects in PRO_Tuning are usable/real weapons, filtering and creating variables for real weapons is done here.
const weaponCodeNameList = [];

for (let key in weapons) { // Only show objects that pass the filter for the weapon name.
    let m_weaponName = weapons[key].m_weaponName;
    (m_weaponName.hasOwnProperty('Key') === true // Ternary Operator
    && key.startsWith('WP') 
    && !key.includes('02') 
    && !key.includes('Exotic') 
    && !key.includes('LMG_Needle') 
    && !key.includes('Leaf') 
    && !key.includes('scrappy') 
    ? weaponCodeNameList.push(key)
    : null);

} //TODO: replace all includes/filters with REGEX.

//! MUST FIND DYNAMIC WAY TO EXECUTE THE FOLLOWING
// Object Deconstructing all the correct weapon entries from PRO_Tuning and storing in variable of the same weapon name.

const {WP_G_Pistol_Energy_01, WP_G_SMG_Needle_01, WP_A_AR_Bullet_01, WP_G_AR_Energy_01, WP_D_AR_Bullet_01, WP_D_Sniper_Gauss_01, WP_A_BR_Bullet_01, WP_D_SMG_Energy_01, WP_D_SGun_Shard_01, WP_A_HVY_Shell_01, WP_A_Launch_MSL_01, WP_G_HVY_Beam_01, WP_A_Pistol_Bullet_01, WP_D_Pistol_Bullet_01, WP_E_Pistol_Bullet_01, WP_E_BR_Bullet_01, WP_E_SMG_Bullet_01, WP_D_HVY_Exotic_01, WP_G_Sniper_Energy_01, WP_A_Sniper_Gauss_01, WP_D_BR_Shard_01, WP_G_AR_Beam_01, WP_E_Launch_Nade_01, WP_A_SGun_Energy_01, WP_G_AR_Needle_01, WP_A_SMG_Shard_01, WP_A_LMG_Needle_01, WP_D_LMG_Energy_01, WP_E_AR_Energy_01, WP_E_SGun_Bullet_01, WP_E_Sniper_Bullet_01} = Tuning
//TODO: The above is a static way and will be obsolete to changes in the data.


for (let i = 0; i < weaponCodeNameList.length; i++) {
//*Weapon Tags & Slots Import
    eval(weaponCodeNameList[i]+".m_weaponTags" + "=" + "weapons" + "." + weaponCodeNameList[i] + ".m_weaponTags;");
    eval(weaponCodeNameList[i]+".m_modSlots" + "=" + "weapons" + "." + weaponCodeNameList[i] + ".m_modSlots;");
//Appending vanity/human friendly names to the weapon variables.
    eval(weaponCodeNameList[i]+'.m_weaponName' + '='+ 'weapons' + '.' + weaponCodeNameList[i] + '.m_weaponName.Key;');
    eval(weaponCodeNameList[i]+'.m_transportName' + '=' + 'weapons' + '.' + weaponCodeNameList[i] + '.m_transportDataTableRow.RowName;');
//Detection range import
    let m_AISenseTriggeredOnFire = eval(weaponCodeNameList[i] + '.m_AISenseTriggeredOnFire.RowName');
    eval(weaponCodeNameList[i]+'.m_detectionRange = AI_SenseTrigger_DT[0].Rows.' + m_AISenseTriggeredOnFire + '.m_maxRange/100;');
    if (eval(weaponCodeNameList[i]+'.m_AISenseTriggeredOnFire.RowName') === "Weapon_Silent"){
        eval(weaponCodeNameList[i]+'.m_isSilenced' + '='+ '1');
    } else {eval(weaponCodeNameList[i]+'.m_isSilenced' + '='+ '0');}
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
    eval(weaponCodeNameList[i]+'.m_initialProjectileSpeed' + '='+ 'transport' + '.' + transportName + '.m_projectileData.m_initialProjectileSpeed / 100;');
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
    if (key.startsWith('Mod')  === true){
        for (let i = 0; i < ST_Mods.length; i++) {
            if (mods[key].m_name.Key === ST_Mods[i].Key) {
                mods[key].vanityName = ST_Mods[i].SourceString;
            }
        }
        modCodeNameList.push(mods[key].m_rowName); 
    }
} 
for (let key in mods) {
    if (key.startsWith('Mod')  === true){
        mods[key].attributeMods = mods[key].m_defaultModInstanceData.m_attributeMods;
        if (mods[key].m_perHandlePropertyDefinition.length != 0 && mods[key].m_perHandlePropertyDefinition[0].m_attributeMods.length != 0) {
            for (let i = 0; i < mods[key].m_perHandlePropertyDefinition.length; i++) {
                mods[key].attributeMods.push(mods[key].m_perHandlePropertyDefinition[i].m_attributeMods[0])
            }
        }
        
    }
}

//* Complex Weapon Stats
// Calculating and appending stats that require equation using other stats from the weapons variables.
// Total Damage Calculation, Weakspot/Headshot Calculation, Movement Speed Calculation

for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_movementSpeed = (' + weaponCodeNameList[i]+'.m_movementSpeedMultiplier * 3.57).toFixed(2)');
    eval(weaponCodeNameList[i]+'.m_rangeMultiplier = 1');
    eval(weaponCodeNameList[i]+'.m_piercing = 0');
    eval(weaponCodeNameList[i]+'.m_weaponTargetingFOV = null');
}

//* Create Selection Boxes
//Populate weapon selection list
let weaponSelection = document.getElementById('weaponSelection');
weaponSelection.size = weaponCodeNameList.length;
for (let i = 0; i < weaponCodeNameList.length; i++) {
    let option = document.createElement("option");
    //option.text = eval(weaponCodeNameList[i] + '.m_rowName').replace("_01","") //Debug Mode
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
    for (let i = 0; i < slots.length; i++) {
        let modSlot = document.getElementById(slots[i]);
        clearSelection(modSlot,"None","Mod_None")
        document.getElementById(slots[i]).selectedIndex = '0';
}
    for (let key in mods) {
        for (let i = 0; i < mods[key].m_modCompatibilityTags.length; i++) {
            if (eval("("+weaponSelection.options[weaponSelection.selectedIndex].id + ".m_weaponTags).includes('"+mods[key].m_modCompatibilityTags[i]+"')")) {
                let slotSwitch;
                switch(mods[key].m_modType){
                    case "EYModificationSlotType::Magazine": slotSwitch = 0; break;
                    case "EYModificationSlotType::AmmoConverter": slotSwitch = 1; break;
                    case "EYModificationSlotType::Muzzle": slotSwitch = 2; break;
                    case "EYModificationSlotType::Optics": slotSwitch = 3; break;
                    case "EYModificationSlotType::Stock": slotSwitch = 4; break;
                    default: slotSwitch = 7; break;
                } 
                    let option = document.createElement("option");
                    //option.text = key; //Debug Mode
                    option.text = mods[key].vanityName + mods[key].m_rarity.replace("EYItemRarityType::"," ");
                    option.id = key;
                    document.getElementById(slots[slotSwitch]).add(option);
            } 
        }
    }
}

function clearSelection(target,text,id) {
    while (target.options.length) {target.remove(0);}	
    let option = document.createElement("option");
    option.text = text;
    option.id = id;
    option.value = "none";
    target.add(option);
}

function parameterAdjustment(w_parameterValue, w_modifierType, w_modifierValue){
    var result;
    switch (w_modifierType) {
      case 'Additive':
        result = Number(w_parameterValue + w_modifierValue);
        break;
      case 'Multiplicitive_PreAdd':
        result = Number(w_parameterValue * w_modifierValue);
        break;
      case 'Multiplicitive_PostAdd':
        result = Number(w_parameterValue * w_modifierValue);
        break;
      case 'Override':
        result = Number(w_modifierValue);
    }
    return result;
  }


//Add each weapon attribute to array, this array is used for dyanamic varible declaration
var attributes = [];
for (let key in WP_A_AR_Bullet_01){
    attributes.push(key);
};

//Array of attributes that there is a table cell for in index.html
var visAttributes = ["m_directDamage","m_radialDamage","m_directDamageFalloffMultiplier", "m_penetration",
"m_directDamageFalloffStartRange","m_directDamageFalloffEndRange","m_ammoInClip","m_movementSpeed","m_spinupTime","m_refireTime",
"m_reloadTime","m_equipTime","m_targetingTime","m_detectionRange","m_initialProjectileSpeed"];
//Same as visAttributes but for "Detailed Stats" section
var calcAttributes = ["totalDamage","headshotDamage","DPS","RPM","damagePerMag","shotsToKill","TTK"];


function calculateWeaponStats(Modded,Init){
    let wep = eval(weaponSelection.options[weaponSelection.selectedIndex].id);

    //Query user input and declare them.
    let accuracy = parseFloat(document.getElementById('accuracySlider').value/100);
    let headshotAccuracy = parseFloat(document.getElementById('headshotAccuracySlider').value/100);
    let headshotaccuracy2 = accuracy * headshotAccuracy;
    let accuracy2 = accuracy - headshotaccuracy2;
    let targetRange = parseFloat(document.getElementById('distanceSlider').value);
    let tt = document.getElementById("targetSelection");
    let targetType = tt.options[tt.selectedIndex].getAttribute('id');
    let health = parseInt(document.getElementById('healthSlider').value);
    let armor = parseInt(document.getElementById('armorSlider').value);
    
    let monsterType = monsterSelection.options[monsterSelection.selectedIndex].getAttribute('id');

    //Declaring values for chain reaction variables to bypass errors with empty values when displaying stats.
    let m_chainReactionRadius = 0.0;
    let m_chainReactionDamageReduction = 1.0;
    let m_applyChainReaction = 0;

    for (let i = 0; i < attributes.length; i++) {
        window[attributes[i]] = eval("wep." + attributes[i]);
    };
    if (Modded === true) {
        for (let i = 0; i < slots.length; i++) {
            let mod = eval("document.querySelector('#"+slots[i]+"').selectedOptions[0].id");

            if (mod === "Mod_None"){}else{
            let modAttributes = eval("mods."+ mod + ".m_defaultModInstanceData.m_attributeMods");
            modAttributes.forEach(function(mod) {
                let attribute = mod.m_attribute.split(":")[2];
                let type = mod.m_modifierType.split(":")[2];
                let value = mod.m_modifierValue;

                if(attribute === "None"){}else{
                switch(attribute){
                    // Damage Variables
                    case "DamageScalingDealtAgainstPlayers": attribute = "m_directDamagePlayerMultiplier" ; break;
                    case "DamageScalingDealtAgainstAI": attribute = "m_directDamageEnemyMultiplier" ; break;   
                    case "DamageEnemyMultiplier": attribute = "m_directDamageEnemyMultiplier" ; break;             
                    case "WeaponDamageDirect": attribute = "m_directDamage" ; break;
                    case "WeaponDamage": attribute = "m_directDamage" ; break;
                    case "WeaponPenetration": attribute = "m_penetration" ; break;
                    case "WeaponDamageRadial": attribute = "m_radialDamage" ; break;
                    case "RadialStartFalloffRange": attribute = "m_radialDamageFalloffStartRange" ; break;
                    case "RadialFalloffMultiplier": attribute = "m_radialDamageFalloffMultiplier" ; break;
                    case "WeaponRadialDamageImpulse": attribute = "m_radialDamageImpulse" ; break;
                    case "WeaponRadialDamageSelfImpulseMultiplier": attribute = "m_damageSelfMultiplier"; break;
                    case "WeaponAmountOfShots": attribute = "m_amountOfImmediateFires" ; break;
                    case "WeakAreaDamageScaling": attribute = "m_weakAreaDamageMultiplier" ; break;
                    case "WeaponClipSize": attribute = "m_ammoInClip"; break;
                    // Speed Variables
                    case "WeaponBurstInterval": attribute = "m_burstInterval"; break;
                    case "WeaponBurstCount": attribute = "m_amountOfBurst"; break;
                    case "WeaponRefireTime": attribute = "m_refireTime"; break;
                    case "TargetingTime": attribute = "m_targetingTime"; break;
                    case "WeaponEquipTime": attribute = "m_equipTime"; break;
                    case "WeaponReloadTime": attribute = "m_reloadTime"; break;
                    case "SpinupDuration": attribute = "m_spinupTime"; break;
                    case "OverallMovementSpeed": attribute = "m_movementSpeed"; break;
                    case "MaxSpeed": attribute = "m_movementSpeed"; break;
                    case "WeaponIsLooping": attribute = "m_isLooping"; break;
                    // Projectile Variables
                    case "WeaponIsSilenced": attribute = "m_isSilenced"; break;
                    case "ProjectileMaxSpeed": attribute = "null"; break;
                    case "ProjectileInitialSpeed": attribute = "m_initialProjectileSpeed"; break;
                    // Range Variables
                    case "WeaponDamageFalloffMultiplier": attribute = "m_directDamageFalloffMultiplier"; break;
                    case "WeaponDamageRange": attribute = "m_rangeMultiplier"; break;
                    case "DamageRadius": attribute = "m_radialDamageRadius"; break;
                    // Accuracy Variables
                    case "WeaponSpreadUnaimed": attribute = "m_defaultWeaponSpread"; break;
                    case "WeaponSpreadMax" : attribute = "m_weaponSpreadMax"; break;
                    case "WeaponSpreadIncreaseRate" : attribute = "m_weaponSpreadIncreaseSpeed"; break;
                    case "WeaponTargetingSpreadMultiplier": attribute = "m_targetingSpreadDefault"; break;
                    case "WeaponTargetingRecoil": attribute = "m_targetingRecoil"; break;
                    case "WeaponRecoilIncreaseRate": attribute = "m_weaponSpreadIncreaseSpeed"; break;
                    case "WeaponTargetingFOV": attribute = "m_weaponTargetingFOV"; break;
                    //Piercing
                    case "Piercing": attribute = "m_piercing"; break;
                    //Chain Reaction
                    case "ChainReactionActive": attribute = "m_applyChainReaction"; break;
                    case "ChainReactionRadius": attribute = "m_chainReactionRadius"; break;
                    case "ChainReactionDamagePercentReduction": attribute = "m_chainReactionDamageReduction"; break;
                    //Ignored Variables
                    case "WeaponRefireAnimationRateScaleMultiplier": attribute = "null"; break;
                    case "WeaponScaleOffset": attribute = "null"; break;
                    case "WeaponMaxTraceRange": attribute = "null"; break;
                    case "WeaponSpreadDecreaseRate": attribute = "null"; break;
                    case "WeaponRecoilCompenstationSpeedY": attribute = "null"; break;
                    case "WeaponRecoilVertical": attribute = "null"; break;
                    //TODO Add these projectile stats to calculator
                    case "ProjectileAccelerationMovementSpeed": attribute = "null"; break;
                    case "ProjectileAccelerationDelay": attribute = "null"; break;
                    case "ProjectileAcceleration": attribute = "null"; break;
                    case "ProjectileGravityScale": attribute = "null"; break;
                    case "ProjectileLifeSpan": attribute = "null"; break;
                    case "ProjectileArmingTime": attribute = "null"; break;
                }
                if(attribute === "null"){}else{eval(attribute + " = Number(parameterAdjustment(eval(attribute),type,value).toFixed(3))");}
                };
                /* if (m_isSilenced = 1) {
                    m_detectionRange = AI_SenseTrigger_DT[0].Rows.Weapon_Silent.m_maxRange/100;
                } */
            });
            };
        };
    };
    
    let m_effectiveHealthPerArmorConstant;
    if (targetType === "Monster") {
        m_effectiveHealthPerArmorConstant = eval("Ai_Tuning_DT[0].Rows."+monsterType.replace("AI_","")+".m_effectiveHealthPerArmorConstant")
    } else {
        m_effectiveHealthPerArmorConstant = 0.025
    }  
 
    let remainder = m_penetration - armor;
    let penMulti = health/(health + Math.abs(remainder) * m_effectiveHealthPerArmorConstant * health);
    let damageScale;
    if (remainder > 0) {
        damageScale = 2 - penMulti;
    } else if (penMulti > 2){
        damageScale = 2;
    } else if (penMulti < 0.3){
        damageScale = 0.3;
    } else {
        damageScale = penMulti;
    }
    m_directDamage *= damageScale;

    if (m_rangeMultiplier < 10){
        m_directDamageFalloffStartRange = ((m_directDamageFalloffStartRange * m_rangeMultiplier)/100).toFixed(0);
        m_directDamageFalloffEndRange = ((m_directDamageFalloffEndRange * m_rangeMultiplier)/100).toFixed(0);
    } else {
        m_directDamageFalloffStartRange = ((m_directDamageFalloffStartRange + m_rangeMultiplier)/100).toFixed(0);
        m_directDamageFalloffEndRange = ((m_directDamageFalloffEndRange + m_rangeMultiplier)/100).toFixed(0);
    }
    let targetMulti = 1 - (1 - m_directDamageFalloffMultiplier) * ((targetRange - m_directDamageFalloffStartRange) / (m_directDamageFalloffEndRange - m_directDamageFalloffStartRange));

    let rangeMulti;
    if (targetRange > m_directDamageFalloffEndRange) {
        rangeMulti = m_directDamageFalloffMultiplier;
    } else if (targetRange < m_directDamageFalloffStartRange) {
        rangeMulti = 1;
    } else {
        rangeMulti = targetMulti;
    } 
    switch(targetType) {
        case "Monster": m_directDamage = ((m_directDamage * rangeMulti) * m_directDamageEnemyMultiplier).toFixed(3); break;
        default: m_directDamage = ((m_directDamage * rangeMulti) * m_directDamagePlayerMultiplier).toFixed(3); break;
    }

    let totalDamage = (((m_directDamage * rangeMulti) + m_radialDamage) * m_amountOfImmediateFires).toFixed(1);
    let headshotDamage = ((((m_directDamage * rangeMulti) + m_radialDamage) * m_amountOfImmediateFires) * m_weakAreaDamageMultiplier).toFixed(1);
    
    m_ammoInClip = Math.round(m_ammoInClip);
    
        let singleShotDamage = (m_directDamage * rangeMulti) * m_amountOfImmediateFires;
    let singleShotDamageCrit = (((m_directDamage * rangeMulti) * m_weakAreaDamageMultiplier) * m_amountOfImmediateFires)
    if (Number(m_amountOfBurst) > Number(0)) {
        var DPS = (((1 / (m_refireTime + (m_burstInterval * (m_amountOfBurst + 1))) * accuracy) * (singleShotDamage + m_radialDamage) * accuracy2 + (singleShotDamageCrit + m_radialDamage) * headshotaccuracy2) * (m_amountOfBurst + 1)).toFixed(2);
    } else {
        var DPS = (((1 / m_refireTime) * accuracy) * ((singleShotDamage + m_radialDamage) * accuracy2 + (singleShotDamageCrit + m_radialDamage) * headshotaccuracy2)).toFixed(2);
    }
    let RPM = ((60/m_refireTime)*accuracy).toFixed(0);
    let shotsToKill = (Math.ceil(health / ((singleShotDamage + m_radialDamage) * accuracy2 + (singleShotDamageCrit + m_radialDamage) * headshotaccuracy2))).toFixed(0);

    if (Number(m_amountOfBurst) > Number(0)) {
        var shootingTime = ((Math.ceil(shotsToKill / (m_amountOfBurst + 1)) * m_refireTime) + (Math.ceil(shotsToKill / (m_amountOfBurst + 1)) * (m_amountOfBurst + 1)) * m_burstInterval);
    } else {
        var shootingTime = Math.abs(shotsToKill * m_refireTime);
    }

    let numOfReload = Math.floor(shotsToKill / (m_ammoInClip + 1));
    let reloadTime = Math.abs(numOfReload * m_reloadTime);
    let spinupTime = Math.abs((numOfReload + 1) * m_spinupTime);
    let TTK = (shootingTime + reloadTime + spinupTime).toFixed(3);
    let damagePerMag = (((singleShotDamage + m_radialDamage) * accuracy2 + (singleShotDamageCrit + m_radialDamage) * headshotaccuracy2) * m_ammoInClip).toFixed(0);

    document.getElementById("wpName").innerHTML = wep.m_vanityName;

    document.getElementById("t-m_transportType").innerHTML = m_transportType;
    //*Populate Table with unmodded stats
    for (let i = 0; i < visAttributes.length; i++) {
        if (Modded === true) {}else{eval("document.querySelector('#t-" + visAttributes[i] + " .default').innerHTML = " + visAttributes[i] + ";");};
        eval("document.querySelector('#t-" + visAttributes[i] + " .mod').innerHTML = " + visAttributes[i] + ";");
        eval("document.querySelector('#t-" + visAttributes[i] + " .diff').innerHTML = Number(document.querySelector('#t-" + visAttributes[i] + " .mod').innerHTML - document.querySelector('#t-" + visAttributes[i] + " .default').innerHTML).toFixed(3);");
    };
    for (let i = 0; i < calcAttributes.length; i++) {
        if (Modded === true) {}else{eval("document.querySelector('#t-" + calcAttributes[i] + " .default').innerHTML =" + calcAttributes[i] + ";");};
        eval("document.querySelector('#t-" + calcAttributes[i] + " .mod').innerHTML =" + calcAttributes[i] + ";");
        eval("document.querySelector('#t-" + calcAttributes[i] + " .diff').innerHTML = Number(document.querySelector('#t-" + calcAttributes[i] + " .mod').innerHTML - document.querySelector('#t-" + calcAttributes[i] + " .default').innerHTML).toFixed(3);");
    };

    var highAttributes = ["m_directDamage","totalDamage","m_penetration","m_radialDamage","m_directDamageFalloffMultiplier",
    "m_directDamageFalloffStartRange","m_directDamageFalloffEndRange","m_ammoInClip","m_movementSpeed",
    "m_initialProjectileSpeed","DPS","RPM","damagePerMag","headshotDamage"];
    var lowAttributes = ["m_detectionRange","m_spinupTime","m_refireTime","m_reloadTime","m_equipTime","m_targetingTime","shotsToKill","TTK"];

    for (let i = 0; i < highAttributes.length; i++) {
        markTopValues(highAttributes[i],true);
    };
    for (let i = 0; i < lowAttributes.length; i++) {
        markTopValues(lowAttributes[i],false);
    };
    //rememberSelection(true)
} 

function setSliderBox(ID,value){
    document.getElementById(`${ID}Box`).value = value;
    document.getElementById(`${ID}Slider`).value = value
}

function markTopValues(attr,highBest){
    let def = document.querySelector(`#t-${attr} .default`);
    let mod = document.querySelector(`#t-${attr} .mod`);
    let diff = def.innerHTML - mod.innerHTML;
    let higher;
    let lower;

    switch (highBest) {
        case true : 
        higher = "rgb(92, 232, 92)"
        lower = "rgba(255, 80, 80, 0.96)"; break;
        case false : 
        higher = "rgba(255, 80, 80, 0.96)"
        lower = "rgb(92, 232, 92)"; break;
    }
    if (diff > 0) {
        mod.style.color = lower;
        def.style.color = higher;
    } else if (diff < 0) {
        mod.style.color = higher;
        def.style.color = lower;
    } else {
        mod.style.color = null;
        def.style.color = null;
    }

};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

//Populates the table with data from first option when the selection box has loaded.
function initLoad() {
    document.getElementById('weaponSelection').selectedIndex = "0"; //TODO: Change this to cached version of selection, ex. upon refresh selection stays the same.
    updateWeaponSelection ();
    calculateWeaponStats ();
}
weaponSelection.addEventListener("load", initLoad());

//Used to populate table with data every time selection changes.
function populateWeaponStats() {
    //rememberSelection ();
    updateWeaponSelection ();
    calculateWeaponStats ();
}
weaponSelection.addEventListener('change', populateWeaponStats);

modSelection.addEventListener("change", calculateWeaponStats(true));

//Listens for any input change and recalculates stats
let lastInput = 0;
document.querySelectorAll('.weaponStatInput').forEach(item => {
    item.addEventListener('input', event => {
        if(Date.now() - lastInput > 40) {
            calculateWeaponStats ();
            calculateWeaponStats(true);
            lastInput = Date.now();
        } 
    })
});

let lastEhpInput = 0;
document.querySelectorAll('.ehpStatInput').forEach(item => {
    item.addEventListener('input', event => {
        if(Date.now() - lastEhpInput > 40) {
            targetSelection.value = 2;
            helmetSelection.value = "none";
            shieldSelection.value = "none";
            calculateWeaponStats ();
            calculateWeaponStats(true);
            lastEhpInput = Date.now();
        } 
    })
});
/* let lastArmorStatInput = 0;
document.querySelectorAll('.armorStatInput').forEach(item => {
    item.addEventListener('input', event => {
        if(Date.now() - lastHpStatInput > 40) {
            targetSelection.value = 3;
            monsterSelection.value = "custom";
            calculateWeaponStats ();
            calculateWeaponStats(true);
            lastEhpInput = Date.now();
        } 
    })
}); */

targetSelection.addEventListener('change', event => {
    if(targetSelection.options[targetSelection.selectedIndex].value === "1") {
        monsterSelection.value = "AI_Strider";

        let m_maxHealth = eval("PRO_Health[0].Rows.AI_Strider.m_maxHealth");
        setSliderBox("health",m_maxHealth);
        
        let m_defaultArmor = eval("Ai_Tuning_DT[0].Rows.Strider.m_defaultArmor");
        setSliderBox("armor",m_defaultArmor);
        calculateWeaponStats ();
        calculateWeaponStats(true);
    }
})

monsterSelection.addEventListener('change', event => {
    if(monsterSelection.options[monsterSelection.selectedIndex].value !== "none") {
        targetSelection.value = 1;
        helmetSelection.value = "none";
        shieldSelection.value = "none";

        let monsterSelection = monsterSelection;
        let monsterType = monsterSelection.options[monsterSelection.selectedIndex].getAttribute('id');
        let monsterTuning = monsterType.slice(3); 
        
        let m_maxHealth = eval("PRO_Health[0].Rows."+monsterType+".m_maxHealth");
        setSliderBox("health",m_maxHealth);
        
        let m_defaultArmor = eval("Ai_Tuning_DT[0].Rows."+monsterTuning+".m_defaultArmor");
        setSliderBox("armor",m_defaultArmor);
        calculateWeaponStats ();
        calculateWeaponStats(true);
    } else {
        targetSelection.value = 0;
        calculateWeaponStats ();
        calculateWeaponStats(true);
    }
})
helmetSelection.addEventListener('change', event => {
    if(helmetSelection.options[helmetSelection.selectedIndex].value !== "none") {
        targetSelection.value = 0;
        monsterSelection.value = "none";

        let helmetType = helmetSelection.options[helmetSelection.selectedIndex].getAttribute('id');
        let shieldType = shieldSelection.options[shieldSelection.selectedIndex].getAttribute('id');

        let helmetArmor = 0;
        let shieldArmor = 0;

        console.log(helmetType)
        helmetArmor = eval("PRO_Helmets[0].Rows."+helmetType+".m_armorAmount")
        if (shieldType !== "Shield_None"){shieldArmor = eval("PRO_PlayerShield[0].Rows."+shieldType+".m_armorAmount")}
        let totalArmor = helmetArmor + shieldArmor;
        setSliderBox("armor",totalArmor);
        calculateWeaponStats ();
        calculateWeaponStats(true);
    } else {
        calculateWeaponStats ();
        calculateWeaponStats(true);
    }
});
shieldSelection.addEventListener('change', event => {
    if(shieldSelection.options[shieldSelection.selectedIndex].value !== "none") {
        targetSelection.value = 0;
        monsterSelection.value = "none";

        let helmetType = helmetSelection.options[helmetSelection.selectedIndex].getAttribute('id');
        let shieldType = shieldSelection.options[shieldSelection.selectedIndex].getAttribute('id');

        let helmetArmor = 0;
        let shieldArmor = 0;

        console.log(helmetType)
        if (helmetType !== "Helmet_None"){helmetArmor = eval("PRO_Helmets[0].Rows."+helmetType+".m_armorAmount")}
        shieldArmor = eval("PRO_PlayerShield[0].Rows."+shieldType+".m_armorAmount")
        let totalArmor = helmetArmor + shieldArmor;
        setSliderBox("armor",totalArmor);

        calculateWeaponStats ();
        calculateWeaponStats(true);
    }
})

/* function rememberSelection(mods){
    document.cookie = 'weaponSelection=' + document.getElementById('weaponSelection').selectedIndex + '; ' + 'expires=' + date.setDate(date.getDate() + 1); + '; path=/';

    for (let i = 0; i < slots.length; i++) { 
        document.cookie = slots[i] + "=" + (mods ? document.getElementById(slots[i]).selectedIndex : '0'); + '; ' + 'expires=' + date.setDate(date.getDate() + 1); + '; path=/';
        console.log(getCookie(slots[i]));
    }
}; */

//Debugging
console.log(mods);
console.log(mods.Mod_Optic_2x_01);
console.log(WP_D_AR_Bullet_01);
