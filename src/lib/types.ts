export interface PopupComponent {
    open: () => void,
    close: () => void
}

export interface IFurnaceBase {
    name: string
    acceptedTemperatureOfBackupZone: number
    ashContentInCoke: number
    averageSizeOfPieceCharge: number
    blastConsumption: number
    blastHumidity: number
    blastPressure: number
    blastTemperature: number
    chugun_C: number
    chugun_MN: number
    chugun_P: number
    chugun_S: number
    chugun_SI: number
    coloshGasPressure: number
    coloshGasTemperature: number
    coloshGas_CO: number
    coloshGas_CO2: number
    coloshGas_H2: number
    dailyСapacityOfFurnace: number
    diameterOfColoshnik: number
    diameterOfHorn: number
    diameterOfRaspar: number
    establishedLevelOfEmbankment: number
    heatCapacityOfAgglomerate: number
    heatCapacityOfCoke: number
    heatCapacityOfPellets: number
    heightOfColoshnik: number
    heightOfHorn: number
    heightOfRaspar: number
    heightOfShaft: number
    heightOfTuyeres: number
    heightOfZaplechiks: number
    heatOfBurningOfNaturalGasOnFarms: number
    heatOfIncompleteBurningCarbonOfCoke: number
    temperatureOfCokeThatCameToTuyeres: number
    id: string
    furnaceId: string
    naturalGasConsumption: number
    numberOfFurnace: number
    numberOfTuyeres: number
    oxygenContentInBlast: number
    proportionOfHeatLossesOfLowerPart: number
    shareOfPelletsInCharge: number
    specificConsumptionOfCoke: number
    specificConsumptionOfZRM: number
    specificSlagYield: number
    sulfurContentInCoke: number
    usefulHeightOfFurnace: number
    usefulVolumeOfFurnace: number
    volatileContentInCoke: number
    saveDate: number
    day: string
}

export interface IFurnace {
    id: string
    numberOfFurnace: number
    usefulVolumeOfFurnace: number
    usefulHeightOfFurnace: number
    diameterOfColoshnik: number
    diameterOfRaspar: number
    diameterOfHorn: number
    heightOfHorn: number
    heightOfTuyeres: number
    heightOfZaplechiks: number
    heightOfRaspar: number
    heightOfShaft: number
    heightOfColoshnik: number
}

export interface IResult {
    amountOfCarbonOfCokeBurningAtTuyeres: number
    amountOfCokeCarbonCameIntoFurnace: number
    amountOfGorenjeGasesDuringCombustionOneKgOfCarbonCoke: number
    amountOfHeatEnteringLlowerZoneOfFurnaceWithCharge: number
    amountOfHeatFromGorenjeCoke: number
    averageHeatCapacityOfCharge: number
    averageSectionalAreaOfFurnaceShaft: number
    blastConsumptionForBurningOneMeterCoubOfNaturalGas: number
    calculatedGeneralizingParameter: number
    carbonConsumptionForIronReduction: number
    carbonConsumptionForMethaneFormation: number
    carbonСonsumptionForCastChugunReduction: number
    chargeFlowRatePassingThroughFurnaceShaft: number
    consumptionOfNaturalGasPerOneKgOfCarbonOfCoke: number
    consumptionOfNaturalGasPerOneKgOfOfCoke: number
    degreeOfDirectRecovery: number
    furnaceGasOutput: number
    gasFiltrationFurnaceShaftSpeed: number
    heatCapacityOfDiatomicGasesAtBlastTemperature: number
    heatCapacityOfGasAtTemperatureOfReserveZone: number
    heatCapacityOfWaterVaporAtBlastTemperature: number
    heatCostsForDirectIronRecovery: number
    heatLossesToEnvironmentThrough: number
    heatOfHeatedBlast: number
    heatOfNaturalGasConversion: number
    indexOfTheBottomOfTheFurnace: number
    indexOfTheFurnaceTop: number
    intermediateDenominator: number
    intermediateExhibitor: number
    intermediateNumerator: number
    intermediateRatio: number
    kinematicViscosityOfGrateGas: number
    numberOfFurnaceGasesAtConversionOfOneMeterCoubOfGas: number
    optimalHeatConsumptionForSmeltingOneTonOfCastIron: number
    resultDate: number
    specificBlastConsumption: number
    thermalConductivityOfGrateGas: number
    trueHeatCapacityOfGrateGas: number
    usefulArrivalOfHeatInLowerZoneOfTheFurnace: number
    valueOfHeatLossesInLowerZoneOfFurnace: number
    volumetricHeatTransferCoefficient: number
    blastConsumptionRequiredForBurningOneKgOfCarbonCoke: number
    blastConsumptionForConversionOfOneMeterCoubOfNaturalGas: number
    outputOfTheTuyereGasBurningAtTheTuyeres: number
    outputOfTuyereGasOfNaturalGasDuringСonversion: number
    heatCapacityOfDiatomicGasesAtHotBlastTemperature: number
    heatCapacityOfWaterVaporAtHotBlastTemperature: number
    heatContentOfHotBlast: number
    heatContentOfCarbonOfCokeToTuyeres: number
    naturalGasConsumptionPerOneKgOfCoke: number
    heatContentOfFurnaceGases: number
    theoreticalBurningTemperatureOfCarbonCoke: number
}

export interface IFullResult {
    input: IFurnaceBase
    result: IResult
}

export interface IUnionFullResult {
    baseResult: IFullResult
    comparativeResult: IFullResult
}

export interface ICoefficients {
    ironMassFractionIncreaseInOreRash: number
    shareCrudeOreReductionCharge: number
    temperatureIncreaseInRangeOf800to900: number
    temperatureIncreaseInRangeOf901to1000: number
    temperatureIncreaseInRangeOf1001to1100: number
    temperatureIncreaseInRangeOf1101to1200: number
    increaseGasPressureUnderGrate: number
    reductionMassFractionOfSiliciumInChugun: number
    reductionMassFractionOfSeraInChugun: number
    increaseMassFractionOfPhosphorusInChugun: number
    increaseMassFractionOfManganeseInChugun: number
    increaseMassFractionOfTitanInChugun: number
    increaseBlastHumidity: number
    increaseNaturalGasCunsimption: number
    outputFromLimestoneCharge: number
    increaseVolumeFractionOxygenInBlast: number
    reductionMassFractionTrifles: number
    reductionMassFractionAshInCokeInRangeOf11to12Percent: number
    reductionMassFractionAshInCokeInRangeOf12to13Percent: number
    reductionMassFractionOfSera: number
}

export interface IReference {
    cokeCunsumptionReference: ICoefficients
    furnaceCapacityReference: ICoefficients
}

export interface IMaterial {
    id: string;
    name: string
    moisture: number
    fe2O3: number
    fe: number
    feO: number
    caO: number
    siO2: number
    mgO: number
    al2O3: number
    tiO2: number
    mnO: number
    p: number
    s: number
    zn: number
    mn: number
    cr: number
    fiveZero: number
    baseOne: number
}

export interface IModal {
    open: () => void,
    close: () => void,
    toggle: () => void
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLoginIp: string;
    lastLoginDate: string;
}

export interface IResponse {
    isSuccess: boolean
    errorMessage: string
    status: number
    successMessage: string
    result: any
}