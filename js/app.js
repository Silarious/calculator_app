"use strict"; //! JS Strict Mode

// Import JS Files
import { load_JSON } from "./loadData.js";
//const data = require('./DATA_JSON/PRO_Tuning.json');
//Global Variables
var date = new Date();
var slots = ["SLOT1","SLOT2","SLOT3","SLOT4","SLOT5","SLOT6","SLOT7","SLOT8"];
var rarities = ["Common","Uncommon","Rare","Epic","Exotic","Legendary"];
var highAttributes = ["m_directDamage","adjustedDamage","totalDamage","adjustedTotalDamage","m_penetration","m_amountOfImmediateFires","m_radialDamage","m_directDamageFalloffMultiplier",
    "m_directDamageFalloffStartRange","m_directDamageFalloffEndRange","m_ammoInClip","m_movementSpeed",
    "m_initialProjectileSpeed","DPS","RPM","damagePerMag","headshotDamage","m_weaponSpreadDecreaseSpeed"];
var lowAttributes = ["m_detectionRange","m_spinupTime","m_refireTime","m_reloadTime","m_equipTime","m_targetingTime","shotsToKill","TTK","ammoCost","CPS","totalCost","totalWeight","recoilVertical","m_weaponSpreadIncreaseSpeed","m_weaponSpreadMax","m_defaultWeaponSpread"];
var targetSelection = document.getElementById('targetSelection');
var monsterSelection = document.getElementById('monsterSelection');
var helmetSelection = document.getElementById('helmetSelection');
var shieldSelection = document.getElementById('shieldSelection');


const Weapons = PRO_Weapons[0].Rows;
const Tuning = PRO_Tuning[0].Rows;
const Sense = AI_SenseTrigger_DT[0].Rows;
const Mods = PRO_Mods[0].Rows;
const ModPerks = PRO_ModPerks[0].Rows;
const Transport = PRO_Transport[0].Rows;
const Materials = Materials_DT[0].Rows;

//Style Related Global Variable
const root = document.querySelector(":root");
// Filter Real Weapons
//Not all objects in PRO_Tuning are usable/real weapons, filtering and creating variables for real weapons is done here.
const weaponCodeNameList = [];

for (let key in Weapons) { // Only show objects that pass the filter for the weapon name.
    let m_weaponName = Weapons[key].m_weaponName;
    (m_weaponName.hasOwnProperty('Key') === true // Ternary Operator
    && key.includes('WP')
    && !key.includes('Exotic')
    && !key.includes('HVY_Shell')
    && !key.includes('Launch_Nade')
    && !key.includes('Event')
    ? weaponCodeNameList.push(key)
    : null);

} //TODO: replace all includes/filters with REGEX.

//! MUST FIND DYNAMIC WAY TO EXECUTE THE FOLLOWING
// Object De-constructing all the correct weapon entries from PRO_Tuning and storing in variable of the same weapon name.

const {WP_G_Pistol_Energy_01, WP_G_SMG_Needle_01, WP_A_AR_Bullet_01, WP_G_AR_Energy_01, WP_D_AR_Bullet_01, WP_D_Sniper_Gauss_01, WP_A_BR_Bullet_01, WP_D_SMG_Energy_01, WP_D_SGun_Shard_01, WP_A_Launch_MSL_01, WP_G_HVY_Beam_01, WP_A_Pistol_Bullet_01, WP_D_Pistol_Bullet_01, WP_E_Pistol_Bullet_01, WP_E_BR_Bullet_01, WP_E_SMG_Bullet_01, WP_D_HVY_Exotic_01, WP_G_Sniper_Energy_01, WP_A_Sniper_Gauss_01, WP_D_BR_Shard_01, WP_G_AR_Beam_01, WP_A_SGun_Energy_01, WP_G_AR_Needle_01, WP_A_SMG_Shard_01, WP_A_LMG_Needle_01, WP_D_LMG_Energy_01, WP_E_AR_Energy_01, WP_E_SGun_Bullet_01, WP_E_Sniper_Bullet_01,WP_E_Pistol_Bullet_01_scrappy,WP_E_SGun_Bullet_01_scrappy,WP_E_SMG_Bullet_01_scrappy,WP_E_AR_Energy_01_scrappy} = Tuning
//TODO: The above is a static way and will be obsolete to changes in the data.


for (let i = 0; i < weaponCodeNameList.length; i++) {
//Weapon Tags & Slots Import
    eval(weaponCodeNameList[i]+".m_weaponTags = Weapons." + weaponCodeNameList[i] + ".m_weaponTags;");
    eval(weaponCodeNameList[i]+".m_modSlots = Weapons." + weaponCodeNameList[i] + ".m_modSlots;");
    eval(weaponCodeNameList[i]+".itemWeight = Weapons." + weaponCodeNameList[i] + ".itemWeight;");
    eval(weaponCodeNameList[i]+".materials = {}");
    for (let x = 0; x < rarities.length; x++) {
        if (eval("Weapons." + weaponCodeNameList[i]+".m_itemShopsCraftingData[0]") != undefined && eval("Weapons." + weaponCodeNameList[i]+".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"']") != undefined) {
            eval(weaponCodeNameList[i]+".itemCost = Weapons." + weaponCodeNameList[i]+".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients[0].m_costAmount");
            let m_itemRecipeIngredients = eval("Weapons." + weaponCodeNameList[i]+".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients")
            if(m_itemRecipeIngredients.length > 1){
                for (let y = 1; y < m_itemRecipeIngredients.length; y++){
                    eval(weaponCodeNameList[i]+".materials." + m_itemRecipeIngredients[y].m_costType.RowName + "=" + m_itemRecipeIngredients[y].m_costAmount);
                }
            }
        }
    }
//Appending vanity/human friendly names to the weapon variables.
    eval(weaponCodeNameList[i]+'.m_weaponName' + '='+ 'Weapons' + '.' + weaponCodeNameList[i] + '.m_weaponName.Key;');
    eval(weaponCodeNameList[i]+'.m_transportName' + '=' + 'Weapons' + '.' + weaponCodeNameList[i] + '.m_transportDataTableRow.RowName;');
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
    && !weapon.Key.includes('Exotic')
    && !weapon.Key.includes('HVY_Shell')
    && !weapon.Key.includes('Launch_Nade')
    && !weapon.Key.includes('Event')
}); //TODO: replace all includes/filters with REGEX.

for (let y = 0; y < weaponVanityName.length; y++) {
    for (let x = 0; x < weaponCodeNameList.length; x++) {
        if (weaponVanityName[y].Key === `Weapons_${weaponCodeNameList[x]}_Name`){
            eval(weaponCodeNameList[x]+'.m_vanityName =' + 'weaponVanityName[y].SourceString')
        } else if (weaponVanityName[y].Key === `${weaponCodeNameList[x].replace("scrappy","Scrappy")}_Name`){
            eval(weaponCodeNameList[x]+'.m_vanityName =' + 'weaponVanityName[y].SourceString')
        }
    }
}

// Weapons Projectile Import
//Appending useful information from PRO_Transport to weapon variables.
for (let i = 0; i < weaponCodeNameList.length; i++) {
    let transportName = eval( weaponCodeNameList[i] + '.m_transportName');
    eval(weaponCodeNameList[i]+".m_transportType" + "=" + "Transport" + "." + transportName + ".m_transportType.replace('EYWeaponTransportType::','');");
    eval(weaponCodeNameList[i]+'.m_maxTraceDistance' + '='+ 'Transport' + '.' + transportName + '.m_hitscanData.m_maxTraceDistance;');
    eval(weaponCodeNameList[i]+'.m_initialProjectileSpeed' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_initialProjectileSpeed / 100;');
    eval(weaponCodeNameList[i]+'.m_acceleration' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_acceleration;');
    eval(weaponCodeNameList[i]+'.m_accelerationApplyDelayTime' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_accelerationApplyDelayTime;');
    eval(weaponCodeNameList[i]+'.m_gravityScale' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_gravityScale;');
    eval(weaponCodeNameList[i]+'.m_collisionRadius' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_collisionRadius;');
    eval(weaponCodeNameList[i]+'.m_bounce' + '='+ 'Transport' + '.' + transportName + '.m_projectileData.m_bounce;');
}

// Weapon Mods Import
const modCodeNameList = [];
for (let key in Mods) { // Only show objects that pass the filter for the weapon name.
    if (key.startsWith('Mod')  === true){
        for (let i = 0; i < ST_Mods.length; i++) {
            if (Mods[key].m_name.Key === ST_Mods[i].Key) {
                Mods[key].vanityName = ST_Mods[i].SourceString;
            }
        }
        modCodeNameList.push(Mods[key].m_rowName);
    }
}
for (let key in Mods) {
    if (key.startsWith('Mod')  === true){
        Mods[key].attributeMods = Mods[key].m_defaultModInstanceData.m_attributeMods;
        if (Mods[key].m_perHandlePropertyDefinition.length != 0 && Mods[key].m_perHandlePropertyDefinition[0].m_attributeMods.length != 0) {
            for (let i = 0; i < Mods[key].m_perHandlePropertyDefinition.length; i++) {
                Mods[key].attributeMods.push(Mods[key].m_perHandlePropertyDefinition[i].m_attributeMods[0])
            }
        }
    }
}

//Materials_DT Import
const materialCodeNameList = [];
for (let key in Materials){
    materialCodeNameList.push(key);
}

// Complex Weapon Stats
// Calculating and appending stats that require equation using other stats from the weapons variables.
// Total Damage Calculation, Weakspot/Headshot Calculation, Movement Speed Calculation

for (let i = 0; i < weaponCodeNameList.length; i++) {
    eval(weaponCodeNameList[i]+'.m_movementSpeed = (' + weaponCodeNameList[i]+'.m_movementSpeedMultiplier * 3.57).toFixed(2)');
    eval(weaponCodeNameList[i]+'.rangeMultiplier = 1');
    eval(weaponCodeNameList[i]+'.recoilVertical = 1');
    eval(weaponCodeNameList[i]+'.m_piercing = 0');
    eval(weaponCodeNameList[i]+'.m_weaponTargetingFOV = null');
}

// Create Selection Boxes
//Populate weapon selection list
let weaponSelection = document.getElementById('weaponSelection');
//weaponSelection.size = weaponCodeNameList.length;
for (let i = 0; i < weaponCodeNameList.length; i++) {
    let option = document.createElement("option");
    //option.text = eval(weaponCodeNameList[i] + '.m_rowName').replace("_01","") //Debug Mode
    option.text = eval(weaponCodeNameList[i] + '.m_vanityName');
    option.id = weaponCodeNameList[i];
    weaponSelection.add(option);
}

//Sort selection alphabetically
function sortSelection(ID) {
    let sel = document.getElementById(ID);
    let ary = (function (nl) {
        let a = [];
        for (let i = 0, len = nl.length; i < len; i++)
            a.push(nl.item(i));
        return a;
    })(sel.options);
    ary.sort(function (a, b) {
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
    let uiBig = eval("Weapons." + weaponSelection.options[weaponSelection.selectedIndex].id + ".m_uiData.m_textureUIBig.AssetPathName.split('.')[1]");
    uiBig = "https://thecycle.wiki/apps/calculator/imgs/weapons/" + uiBig + ".png";
    document.getElementById("wpLogo").src = uiBig;

    for (let i = 0; i < slots.length; i++) {
        let modSlot = document.getElementById(slots[i]);
        clearSelection(modSlot,"None","Mod_None")
        document.getElementById(slots[i]).selectedIndex = '0';
}
    for (let key in Mods) {
        for (let i = 0; i < Mods[key].m_modCompatibilityTags.length; i++) {
            if (eval("("+weaponSelection.options[weaponSelection.selectedIndex].id + ".m_weaponTags).includes('"+Mods[key].m_modCompatibilityTags[i]+"')")) {
                let slotSwitch;
                switch(Mods[key].m_modType){
                    case "EYModificationSlotType::Magazine": slotSwitch = 0; break;
                    case "EYModificationSlotType::AmmoConverter": slotSwitch = 1; break;
                    case "EYModificationSlotType::Muzzle": slotSwitch = 2; break;
                    case "EYModificationSlotType::Optics": slotSwitch = 3; break;
                    case "EYModificationSlotType::Stock": slotSwitch = 4; break;
                    default: slotSwitch = 7; break;
                }
                    let option = document.createElement("option");
                    //option.text = key; //Debug Mode
                    option.text = Mods[key].vanityName + Mods[key].m_rarity.replace("EYItemRarityType::"," ");
                    option.id = key;
                    document.getElementById(slots[slotSwitch]).add(option);
            }
        }
        if (Mods[key].m_modType.includes("Grip") && key !== "NoGrip") {
                let slotSwitch;
                switch(Mods[key].m_modType){
                    case "EYModificationSlotType::ForeGrip": slotSwitch = 5; break;
                    case "EYModificationSlotType::RearGrip": slotSwitch = 6; break;
                    case "EYModificationSlotType::Tactical": slotSwitch = 7; break;
                    default: slotSwitch = 7; break;
                }
                let option = document.createElement("option");
                //option.text = key; //Debug Mode
                option.text = Mods[key].vanityName + Mods[key].m_rarity.replace("EYItemRarityType::"," ");
                option.id = key;
                document.getElementById(slots[slotSwitch]).add(option);
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

function parameterAdjustment(w_parameterValue, w_modifierType, w_modifierValue) {
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
var visAttributes = ["m_directDamage","m_radialDamage","m_directDamageFalloffMultiplier", "m_penetration","m_amountOfImmediateFires",
"m_directDamageFalloffStartRange","m_directDamageFalloffEndRange","m_ammoInClip","m_movementSpeed","m_spinupTime","m_refireTime",
"m_reloadTime","m_equipTime","m_targetingTime","m_detectionRange","m_initialProjectileSpeed","m_defaultWeaponSpread","m_weaponSpreadMax",
"m_weaponSpreadIncreaseSpeed","m_weaponSpreadDecreaseSpeed","adjustedDamage","totalDamage","adjustedTotalDamage","headshotDamage","adjustedCritDamage",
"DPS","RPM","damagePerMag","shotsToKill","TTK","recoilVertical","ammoCost","totalCost"];
//Same as visAttributes but for "Detailed Stats" section
var newWeaponAttributes = ["totalWeight","CPS","CPP"];


function calculateWeaponStats(newWeapon,isModded){
    let wep = eval(weaponSelection.options[weaponSelection.selectedIndex].id);

    //Query user input and declare them.
    let accuracy = parseFloat(document.getElementById('accuracySlider').value/100);
    let headshotAccuracy = parseFloat(document.getElementById('headshotAccuracySlider').value/100);
    let headshotaccuracy2 = accuracy * headshotAccuracy;
    let accuracy2 = accuracy - headshotaccuracy2;
    let pelletsHit = wep.m_amountOfImmediateFires * accuracy;
    let targetRange = parseFloat(document.getElementById('distanceSlider').value);
    let tt = document.getElementById("targetSelection");
    let targetType = tt.options[tt.selectedIndex].getAttribute('id');
    let health = parseInt(document.getElementById('healthSlider').value);
    let healthRegen = document.getElementById('healthRegenSlider').value;
    let regenDelay = document.getElementById('regenDelaySlider').value;
    let helmetArmor = parseInt(document.getElementById('helmetArmorSlider').value);
    let armor = parseInt(document.getElementById('armorSlider').value);
    let armorConstant = document.getElementById('armorConstantSlider').value;
    let totalWeight = 0;

    let modCost = 0;
    let wepCost = wep.itemCost;
    let totalCost = 0;
    totalCost += wepCost;


    if (wep.m_maxTraceDistance > 10000) {
        document.getElementById('distanceSlider').max = wep.m_maxTraceDistance/1000;
    } else {
        document.getElementById('distanceSlider').max = wep.m_maxTraceDistance/100;
    }

    //Declaring values for chain reaction variables to bypass errors with empty values when displaying stats.
    let m_chainReactionRadius = 0.0;
    let m_chainReactionDamageReduction = 1.0;
    let m_applyChainReaction = 0;

    for (let i = 0; i < attributes.length; i++) {
        window[attributes[i]] = eval("wep." + attributes[i]);
    };
    if (isModded === true) {
        var modMaterials = {};
        for (let i = 0; i < slots.length; i++) {
            let mod = eval("document.querySelector('#"+slots[i]+"').selectedOptions[0].id");
            if (mod === "Mod_None"){}else{
            let modAttributes = eval("Mods."+ mod + ".m_defaultModInstanceData.m_attributeMods");
            totalWeight += eval("Mods."+ mod + ".itemWeight")
            for (let x = 0; x < rarities.length; x++) {
                if (eval("Mods." + mod +".m_itemShopsCraftingData[0]") != undefined && eval("Mods." + mod +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"']") != undefined) {
                    let m_itemRecipeIngredients = eval("Mods." + mod +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients")
                    eval("modCost +=" + m_itemRecipeIngredients[0].m_costAmount)
                    eval("totalCost +=" + m_itemRecipeIngredients[0].m_costAmount)
                    if(m_itemRecipeIngredients.length > 1){
                        for (let y = 1; y < m_itemRecipeIngredients.length; y++){
                            if (eval("modMaterials."+ m_itemRecipeIngredients[y].m_costType.RowName)){
                                eval("modMaterials."+ m_itemRecipeIngredients[y].m_costType.RowName +"+=" + m_itemRecipeIngredients[y].m_costAmount);
                            } else {
                                eval("modMaterials."+ m_itemRecipeIngredients[y].m_costType.RowName +"=" + m_itemRecipeIngredients[y].m_costAmount);
                            }
                        }
                    }
                }
            }
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
                    case "WeaponDamageRange": attribute = "rangeMultiplier"; break;
                    case "DamageRadius": attribute = "m_radialDamageRadius"; break;
                    // Accuracy Variables
                    case "WeaponSpreadUnaimed": attribute = "m_defaultWeaponSpread"; break;
                    case "WeaponSpreadMax" : attribute = "m_weaponSpreadMax"; break;
                    case "WeaponSpreadIncreaseRate" : attribute = "m_weaponSpreadIncreaseSpeed"; break;
                    case "WeaponSpreadDecreaseRate": attribute = "m_weaponSpreadDecreaseSpeed"; break;
                    case "WeaponTargetingSpreadMultiplier": attribute = "m_targetingSpreadDefault"; break;
                    case "WeaponTargetingRecoil": attribute = "m_targetingRecoil"; break;
                    case "WeaponRecoilVertical": attribute = "recoilVertical"; break;
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
                    case "WeaponRecoilCompenstationSpeedY": attribute = "null"; break;
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

    let remainder = m_penetration - armor;
    let penMulti = health/(health + Math.abs(remainder) * armorConstant * health);
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


    let remainder2 = m_penetration - helmetArmor;
    let penMulti2 = health/(health + Math.abs(remainder2) * armorConstant * health);
    let damageScale2;
    if (remainder2 > 0) {
        damageScale2 = 2 - penMulti2;
    } else if (penMulti2 > 2){
        damageScale2 = 2;
    } else if (penMulti2 < 0.3){
        damageScale2 = 0.3;
    } else {
        damageScale2 = penMulti2;
    }


    if (rangeMultiplier < 10){
        m_directDamageFalloffStartRange = ((m_directDamageFalloffStartRange * rangeMultiplier)/100).toFixed(0);
        m_directDamageFalloffEndRange = ((m_directDamageFalloffEndRange * rangeMultiplier)/100).toFixed(0);
    } else {
        m_directDamageFalloffStartRange = ((m_directDamageFalloffStartRange + rangeMultiplier)/100).toFixed(0);
        m_directDamageFalloffEndRange = ((m_directDamageFalloffEndRange + rangeMultiplier)/100).toFixed(0);
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
    let directDamage = (m_directDamage * rangeMulti).toFixed(3);

    switch(targetType) {
        case "Monster": m_directDamage = m_directDamage * m_directDamageEnemyMultiplier.toFixed(3); break;
        default: m_directDamage = m_directDamage * m_directDamagePlayerMultiplier.toFixed(3); break;
    }
    let adjustedDamage = (((directDamage * damageScale))+ m_radialDamage).toFixed(3);
    let totalDamage = ((m_directDamage + m_radialDamage) * m_amountOfImmediateFires).toFixed(1);
    let adjustedTotalDamage = (((directDamage * damageScale) + m_radialDamage) * m_amountOfImmediateFires).toFixed(1);
    let headshotDamage = ((m_directDamage * m_weakAreaDamageMultiplier)+ m_radialDamage).toFixed(1);
    let adjustedCritDamage = (((directDamage * damageScale2) * m_weakAreaDamageMultiplier)+ m_radialDamage).toFixed(1);

    m_ammoInClip = Math.round(m_ammoInClip);

    if (Number(m_amountOfBurst) > Number(0)) {
        var DPS = (((1 / (m_refireTime + (m_burstInterval * (m_amountOfBurst + 1))) * accuracy) * ((adjustedDamage * pelletsHit) + m_radialDamage) * accuracy2 + ((adjustedCritDamage * pelletsHit) + m_radialDamage) * headshotaccuracy2) * (m_amountOfBurst + 1)).toFixed(2);
    } else {
        var DPS = (((1 / m_refireTime) * accuracy) * (((adjustedDamage * pelletsHit) + m_radialDamage) * accuracy2 + ((adjustedCritDamage * pelletsHit) + m_radialDamage) * headshotaccuracy2)).toFixed(2);
    }
    let RPM = ((60/m_refireTime)*accuracy).toFixed(0);
    let shotsToKill = Math.ceil((health / ((adjustedDamage + m_radialDamage) * accuracy2 + (adjustedCritDamage + m_radialDamage) * headshotaccuracy2))/m_amountOfImmediateFires);

    let numOfReload = Math.floor(shotsToKill / (m_ammoInClip + 1));

    if (numOfReload > 0 && m_reloadTime > regenDelay && healthRegen > 0) {
        health += (m_reloadTime - regenDelay) * healthRegen;
        shotsToKill = ((Math.ceil(health / ((adjustedDamage + m_radialDamage) * accuracy2 + (adjustedCritDamage + m_radialDamage) * headshotaccuracy2)))).toFixed(0);
    }

    if (Number(m_amountOfBurst) > Number(0)) {
        var shootingTime = ((Math.ceil(shotsToKill / (m_amountOfBurst + 1)) * m_refireTime) + (Math.ceil(shotsToKill / (m_amountOfBurst + 1)) * (m_amountOfBurst + 1)) * m_burstInterval);
    } else {
        var shootingTime = Math.abs(shotsToKill * m_refireTime);
    }

    let reloadTime = Math.abs(numOfReload * m_reloadTime);
    let spinupTime = Math.abs((numOfReload + 1) * m_spinupTime);
    let TTK = (shootingTime + reloadTime + spinupTime).toFixed(3);
    let damagePerMag = ((((adjustedDamage * pelletsHit) + m_radialDamage) * accuracy2 + ((adjustedCritDamage * pelletsHit) + m_radialDamage) * headshotaccuracy2) * m_ammoInClip).toFixed(0);

    document.getElementById("wpName").innerHTML = wep.m_vanityName;

    document.getElementById("t-m_transportType").innerHTML = m_transportType;
    document.getElementById("t-wepCost").innerHTML = wepCost;

    //Recoil Stats
    if(recoilVertical != 0) {
        recoilVertical = (m_minRecoilY * recoilVertical).toFixed(2);
    }

    //Cost & Weight Calculations
    const PRO_AmmoCost = [
        {
            "Light": {
                "cost": 230,
                "amount": 125
            },
            "Medium": {
                "cost": 230,
                "amount": 75
            },
            "Heavy": {
                "cost": 1000,
                "amount": 20
            },
            "Shotgun": {
                "cost": 510,
                "amount": 20
            },
            "Special": {
                "cost": 760,
                "amount": 10
            },
        }
    ]

    let m_ammoType = wep.m_ammoTypeToUse.RowName;

    let ammoCost;
    let ammoAmount;
    eval("ammoCost = PRO_AmmoCost[0]."+m_ammoType+".cost");
    eval("ammoAmount = PRO_AmmoCost[0]."+m_ammoType+".amount");

    ammoCost = ((ammoCost / ammoAmount) * shotsToKill).toFixed(2);

    if (newWeapon === true || isModded === true){
    var CPS = ((ammoCost / ammoAmount) / m_refireTime).toFixed(2);
    totalWeight += wep.itemWeight;
    var CPP = (totalCost / totalWeight).toFixed(2);


    //Crafting Stats

    let table = document.getElementById("CraftingStats");
    function extend (target) {
        for(var i=1; i<arguments.length; ++i) {
            var from = arguments[i];
            if(typeof from !== 'object') continue;
            for(var j in from) {
                if(from.hasOwnProperty(j)) {
                    target[j] = typeof from[j]==='object'
                    ? extend({}, target[j], from[j])
                    : from[j];
                }
            }
        }
        return target;
    }

    let totalMaterials = extend({},wep.materials,modMaterials);

    const elements = document.getElementsByClassName("material");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    if (totalMaterials  !== '{}') {
        for (let i = 0; i < materialCodeNameList.length; i++) {
            if (eval("'"+materialCodeNameList[i]+"'") in totalMaterials) {
                let row = table.insertRow(-1);
                row.classList = "material";
                let cell1 = document.createElement("th");
                row.appendChild(cell1)
                let cell2 = row.insertCell(1);
                let materialCodeName = eval("Materials."+materialCodeNameList[i]+".m_uiWidgetData.m_title.Key")
                let uiBig = eval("Materials."+materialCodeNameList[i]+".m_hudIconBig.AssetPathName").split(".")[1]
                let matLogo = "https://thecycle.wiki/apps/calculator/imgs/materials/" + uiBig + ".png";
                cell1.innerHTML ="<img class='matLogo' src='" + matLogo + "'/>";
                for (let x = 0; x < ST_Materials.length; x++) {
                    if (materialCodeName === ST_Materials[x].Key) {
                        cell1.innerHTML += ST_Materials[x].SourceString;
                    }
                }
                //cell1.innerHTML = materialCodeNameList[i];
                cell2.innerHTML = eval("totalMaterials." + materialCodeNameList[i])
                cell2.colSpan = "3";
                cell2.style.textAlign = "center";
            }
        }
    }
    }
    //Populate Table with unmodded stats
    for (let i = 0; i < visAttributes.length; i++) {
        if (isModded === true) {}else{eval("document.querySelector('#t-" + visAttributes[i] + " .default').innerHTML = " + visAttributes[i] + ";");};
        eval("document.querySelector('#t-" + visAttributes[i] + " .mod').innerHTML = " + visAttributes[i] + ";");
        eval("document.querySelector('#t-" + visAttributes[i] + " .diff').innerHTML = Number(document.querySelector('#t-" + visAttributes[i] + " .mod').innerHTML - document.querySelector('#t-" + visAttributes[i] + " .default').innerHTML).toFixed(3);");
    };
    if(newWeapon === true){
    for (let i = 0; i < newWeaponAttributes.length; i++) {
        if (isModded === true) {}else{eval("document.querySelector('#t-" + newWeaponAttributes[i] + " .default').innerHTML =" + newWeaponAttributes[i] + ";");};
        eval("document.querySelector('#t-" + newWeaponAttributes[i] + " .mod').innerHTML =" + newWeaponAttributes[i] + ";");
        eval("document.querySelector('#t-" + newWeaponAttributes[i] + " .diff').innerHTML = Number(document.querySelector('#t-" + newWeaponAttributes[i] + " .mod').innerHTML - document.querySelector('#t-" + newWeaponAttributes[i] + " .default').innerHTML).toFixed(3);");
    };
    }

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
    document.getElementById(`${ID}Slider`).value = value;
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

function addToCompare(){
    let tableLength = document.getElementById('compareTable').tHead.children[0].children.length;
    let firstCol = document.getElementById('compareTable').tHead.children[0].children[1];
    let lastCol = document.getElementById('compareTable').tHead.children[0].children[tableLength - 1];
    let wepName = weaponSelection.options[weaponSelection.selectedIndex].value;

    let tr = document.getElementById('compareTable').tHead.children[0];
    let columns = document.getElementById('compareTable').tHead.children[0].children.length;
    let th = document.createElement('th');
    th.innerHTML = wepName;
    th.innerHTML += `<a href="#"class="del" >❌</a>`
    tr.appendChild(th);

    let compareTable = document.getElementById('compareTable').tBodies[0]
    for (let i = 0; i < compareTable.children.length; i++) {
        tr = compareTable.children[i];
        let td = document.createElement('td');
        let i2 = i + 2;
        td.innerHTML = document.getElementById('weaponStats').tBodies[0].children[i2].children[1].innerHTML;
        td.id = document.getElementById('weaponStats').tBodies[0].children[i2].id.replace("t-","compare-");
        tr.appendChild(td);
    }


    for (let x = 0; x < document.getElementById('compareTable').tBodies[0].children.length; x++) {
        let compareArr = [];
        let compareRow = compareTable.children[x];

        for (let i = 0; i < compareRow.children.length; i++) {
            compareRow.children[i].style.color = "var(--text-color)";
            if (i !== 0){
                let value;
                switch (compareRow.children[i].innerHTML) {
                    case "Projectile": value = 1; break;
                    case "Hitscan": value = 1;
                    compareRow.children[i].style.color = "rgb(92, 232, 92)"; break;
                    default: value = Number(compareRow.children[i].innerHTML);
                }
                compareArr.push(value)
            }
        }
        if (compareArr.length > 1) {
            if (compareArr.every( (val, i, arr) => val === arr[0] )){
            } else {
                const max = Math.max(...compareArr);
                const min = Math.min(...compareArr);
                const maxIndexes = [];
                const minIndexes = [];

                for (let index = 0; index < compareArr.length; index++) {
                    if (compareArr[index] === max) {
                        maxIndexes.push(index);
                    } else if (compareArr[index] === min) {
                        minIndexes.push(index);
                    }
                }

                for (let i = 0; i < maxIndexes.length; i++) {
                    let int = maxIndexes[i] + 1;
                    let statID = compareRow.children[int].id.replace("compare-", "");
                    const found = highAttributes.includes(statID);
                    if (found){
                        compareRow.children[int].style.color = "rgb(92, 232, 92)";
                    } else {
                        compareRow.children[int].style.color = "rgba(255, 80, 80, 0.96)"
                    }
                }

                for (let i = 0; i < minIndexes.length; i++) {
                    let int = minIndexes[i] + 1;
                    let statID = compareRow.children[int].id.replace("compare-", "");
                    const found = lowAttributes.includes(statID);
                    console.log(found)
                    if (found){
                        compareRow.children[int].style.color = "rgb(92, 232, 92)";
                    } else {
                        compareRow.children[int].style.color = "rgba(255, 80, 80, 0.96)"
                    }
                }

            }
        }
    }
}
// Source: https://stackoverflow.com/a/42763442
document.getElementById("compareTable").addEventListener("click", function(e) {
    const tgt = e.target.closest("a");

    if (tgt && tgt.classList.contains("del")) {
      const idx = tgt.parentElement.cellIndex;
      [...document.getElementById("compareTable").rows].forEach(row => row.cells[idx].remove());
    }
  })

//find javascript index of cell in table.
/* function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
} */

// Populates the table with data from first option when the selection box has loaded.
function initLoad() {
    document.getElementById('weaponSelection').selectedIndex = "0"; //TODO: Change this to cached version of selection, ex. upon refresh selection stays the same.
    document.querySelector('#t-CPHA').innerHTML = 0;
    document.querySelector('#t-CPBA').innerHTML = 0;
    document.querySelector('#t-helmetArmorCost').innerHTML = 0;
    document.querySelector('#t-shieldArmorCost').innerHTML = 0;
    document.querySelector('#t-armorTotalCost').innerHTML = 0;
    updateWeaponSelection ();
    calculateWeaponStats (true,false);
}
weaponSelection.addEventListener("load", initLoad());

//Used to populate table with data every time selection changes.
function populateWeaponStats() {
    //rememberSelection ();
    updateWeaponSelection();
    calculateWeaponStats(true,false);
}
weaponSelection.addEventListener('change', populateWeaponStats);

weaponModSelection.addEventListener("change", calculateWeaponStats(false,true));

//Listens for any input change and recalculates stats
let lastInput = 0;
document.querySelectorAll('.weaponStatInput').forEach(item => {
    item.addEventListener('input', event => {
        if(Date.now() - lastInput > 100) {
            calculateWeaponStats();
            calculateWeaponStats(false,true);
            lastInput = Date.now();
        } else {
            setTimeout(function() {
                calculateWeaponStats ();
                calculateWeaponStats(false,true);
            }, 100);
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
            calculateWeaponStats(false,true);
            lastEhpInput = Date.now();
        } else {
            setTimeout(function() {
                calculateWeaponStats ();
                calculateWeaponStats(false,true);
            }, 100);
        }
    })
});

targetSelection.addEventListener('change', event => {
    if(targetSelection.options[targetSelection.selectedIndex].value === "1") {
        monsterSelection.value = "AI_Strider";
        helmetSelection.value = "none";
        shieldSelection.value = "none";

        let m_maxHealth = eval("PRO_Health[0].Rows.AI_Strider.m_maxHealth");
        setSliderBox("health",m_maxHealth);

        let m_regenerationRate = eval("PRO_Health[0].Rows.AI_Strider.m_regenerationRate");
        setSliderBox("healthRegen",m_regenerationRate);

        let m_regenerationDelay = eval("PRO_Health[0].Rows.AI_Strider.m_regenerationDelay");
        setSliderBox("regenDelay",m_regenerationDelay);

        let m_defaultArmor = eval("Ai_Tuning_DT[0].Rows.Strider.m_defaultArmor");
        setSliderBox("armor",m_defaultArmor);

        let armorConstant = eval("Ai_Tuning_DT[0].Rows.Strider.m_effectiveHealthPerArmorConstant")
        setSliderBox("armorConstant",armorConstant);
    } else if (targetSelection.options[targetSelection.selectedIndex].value === "0") {
        monsterSelection.value = "none";
        setSliderBox("health",100);
        setSliderBox("armor",0);
        setSliderBox("armorConstant",0.025);
    }
    calculateWeaponStats ();
    calculateWeaponStats(false,true);
})

monsterSelection.addEventListener('change', event => {
    if(monsterSelection.options[monsterSelection.selectedIndex].value !== "none") {
        targetSelection.value = 1;
        helmetSelection.value = "none";
        shieldSelection.value = "none";

        let monsterType = monsterSelection.options[monsterSelection.selectedIndex].getAttribute('id');
        let monsterTuning = monsterType.slice(3);

        let m_maxHealth = eval("PRO_Health[0].Rows."+monsterType+".m_maxHealth");
        setSliderBox("health",m_maxHealth);

        let m_regenerationRate = eval("PRO_Health[0].Rows."+monsterType+".m_regenerationRate");
        setSliderBox("healthRegen",m_regenerationRate);

        let m_regenerationDelay = eval("PRO_Health[0].Rows."+monsterType+".m_regenerationDelay");
        setSliderBox("regenDelay",m_regenerationDelay);

        let bodyArmor;
        let headArmor;
        if (monsterType.includes("Crusher")){
        bodyArmor = eval("AiArmor_DT[0].Rows."+monsterTuning+".m_armorAmount");
        headArmor = eval("Ai_Tuning_DT[0].Rows."+monsterTuning+".m_defaultArmor");
        } else {
        bodyArmor = eval("Ai_Tuning_DT[0].Rows."+monsterTuning+".m_defaultArmor");

        }
        setSliderBox("armor",bodyArmor);
        setSliderBox("helmetArmor",headArmor);
        let armorConstant = eval("Ai_Tuning_DT[0].Rows."+monsterType.replace("AI_","")+".m_effectiveHealthPerArmorConstant")
        setSliderBox("armorConstant",armorConstant);

        document.querySelector('#t-CPBA').innerHTML = 0;
        document.querySelector('#t-CPHA').innerHTML = 0;
        document.querySelector('#t-helmetArmorCost').innerHTML = 0;
        document.querySelector('#t-shieldArmorCost').innerHTML = 0;
        document.querySelector('#t-armorTotalCost').innerHTML = 0;
    } else {
        targetSelection.value = 0;
    }
    calculateWeaponStats ();
    calculateWeaponStats(false,true);
})

document.querySelectorAll('.gearSelection').forEach(item => {
    item.addEventListener('change', event => {
        let helmetType = helmetSelection.options[helmetSelection.selectedIndex].getAttribute('id');
        let shieldType = shieldSelection.options[shieldSelection.selectedIndex].getAttribute('id');

        let helmetArmor = 0;
        let shieldArmor = 0;
        let helmetArmorCost = 0;
        let shieldArmorCost = 0;
        let armorTotalCost = 0;
        if(helmetSelection.options[helmetSelection.selectedIndex].value !== "none") {
            targetSelection.value = 0;
            monsterSelection.value = "none";
            helmetArmor = eval("PRO_Helmets[0].Rows."+helmetType+".m_armorAmount")
            for (let x = 0; x < rarities.length; x++) {
                if (eval("PRO_Helmets[0].Rows." + helmetType +".m_itemShopsCraftingData[0]") != undefined && eval("PRO_Helmets[0].Rows." + helmetType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"']") != undefined) {
                    eval("armorTotalCost += PRO_Helmets[0].Rows." + helmetType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients[0].m_costAmount")
                    eval("helmetArmorCost = PRO_Helmets[0].Rows." + helmetType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients[0].m_costAmount")
                }
            }
        }
        if(shieldSelection.options[shieldSelection.selectedIndex].value !== "none") {
            targetSelection.value = 0;
            monsterSelection.value = "none";
            shieldArmor = eval("PRO_PlayerShield[0].Rows."+shieldType+".m_armorAmount")
            for (let x = 0; x < rarities.length; x++) {
                if (eval("PRO_PlayerShield[0].Rows." + shieldType +".m_itemShopsCraftingData[0]") != undefined && eval("PRO_PlayerShield[0].Rows." + shieldType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"']") != undefined) {
                    eval("armorTotalCost += PRO_PlayerShield[0].Rows." + shieldType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients[0].m_costAmount")
                    eval("shieldArmorCost = PRO_PlayerShield[0].Rows." + shieldType +".m_itemShopsCraftingData[0].m_craftingPricesPerRarity['EYItemRarityType::"+rarities[x]+"'].m_itemRecipeIngredients[0].m_costAmount")
                }
            }
        }
        let totalArmor = helmetArmor + shieldArmor;
        setSliderBox("helmetArmor",helmetArmor);
        setSliderBox("armor",shieldArmor);

        document.querySelector('#t-armorTotalCost').innerHTML = armorTotalCost;
        let CPBA;
        if(shieldArmor !== 0){CPBA =shieldArmorCost/shieldArmor}else{CPBA = 0}
        document.querySelector('#t-shieldArmorCost').innerHTML = shieldArmorCost;
        document.querySelector('#t-CPBA').innerHTML = CPBA.toFixed(0);
        let CPHA;
        if(helmetArmor !== 0){CPHA =helmetArmorCost/helmetArmor}else{CPHA = 0}
        document.querySelector('#t-helmetArmorCost').innerHTML = helmetArmorCost;
        document.querySelector('#t-CPHA').innerHTML = CPHA.toFixed(0);

        calculateWeaponStats ();
        calculateWeaponStats(false,true);
    })
});

document.getElementById("addCompare").addEventListener("click", addToCompare);

/* function rememberSelection(mods){
    document.cookie = 'weaponSelection=' + document.getElementById('weaponSelection').selectedIndex + '; ' + 'expires=' + date.setDate(date.getDate() + 1); + '; path=/';

    for (let i = 0; i < slots.length; i++) {
        document.cookie = slots[i] + "=" + (mods ? document.getElementById(slots[i]).selectedIndex : '0'); + '; ' + 'expires=' + date.setDate(date.getDate() + 1); + '; path=/';
    }
}; */

//Cosmetic
let collapsible = document.getElementsByClassName("collapsible");

for (let i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
        if (content.style.display !== "none") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

let advancedMode = document.getElementById("advancedStatToggle");
advancedMode.addEventListener("click", function() {
    if(advancedMode.checked){
        root.style.setProperty("--advanced-mode", `table-row`);
    } else {
        root.style.setProperty("--advanced-mode", `none`);
    }

});

//Debugging
addToCompare()
/* console.log(Mods);
console.log(Mods.Mod_Optic_2x_01);
console.log(WP_A_Sniper_Gauss_01.materials); */

//TODO Global list
/*
Change calculateWeaponStats() to only include weapon stats, remove crafting, cost and other stats that change with sliders or mods.



*/