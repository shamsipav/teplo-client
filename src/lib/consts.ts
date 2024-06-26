// @ts-ignore
import { env } from '$env/dynamic/public'

export const API_URL = env.PUBLIC_API_URL ?? "http://93.88.178.186:7701/api"

export const FURNACE_FIELDS =
[
    { name: 'numberOfFurnace', description: 'Номер доменной печи' },
    { name: 'usefulVolumeOfFurnace', description: 'Полезный объем печи, м3' },
    { name: 'usefulHeightOfFurnace', description: 'Полезная высота печи, мм' },
    { name: 'diameterOfColoshnik', description: 'Диаметр колошника, мм' },
    { name: 'diameterOfRaspar', description: 'Диаметр распара, мм' },
    { name: 'diameterOfHorn', description: 'Диаметр горна, мм' },
    { name: 'heightOfHorn', description: 'Высота горна, мм' },
    { name: 'heightOfTuyeres', description: 'Высота фурм, мм' },
    { name: 'heightOfZaplechiks', description: 'Высота заплечников, мм' },
    { name: 'heightOfRaspar', description: 'Высота распара, мм' },
    { name: 'heightOfShaft', description: 'Высота шахты, мм' },
    { name: 'heightOfColoshnik', description: 'Высота колошника, мм' },
    { name: 'establishedLevelOfEmbankment', description: 'Установленный уровень насыпи, мм' },
    { name: 'numberOfTuyeres', description: 'Число фурм, шт' },
    { name: 'dailyСapacityOfFurnace', description: 'Суточная производительность печи, т чугуна/сутки' },
    { name: 'specificConsumptionOfCoke', description: 'Удельный расход кокса, кг/т чугуна' },
    { name: 'specificConsumptionOfZRM', description: 'Удельный расход ЖРМ, кг/т чугуна' },
    { name: 'shareOfPelletsInCharge', description: 'Доля окатышей в шихте, доли ед.' },
    // ПАРАМЕТРЫ ДУТЬЯ
    { name: 'blastConsumption', description: 'Расход дутья, м3/мин' },
    { name: 'blastTemperature', description: 'Температура дутья, С' },
    { name: 'blastPressure', description: 'Давление дутья, ати' },
    { name: 'blastHumidity', description: 'Влажность дутья, г/м3' },
    { name: 'oxygenContentInBlast', description: 'Содержание кислорода в дутье, %' },
    { name: 'naturalGasConsumption', description: 'Расход природного газа, м3/т чугуна' },
    // ПАРАМЕТРЫ КОЛОШНИКОВОГО ГАЗА
    { name: 'coloshGasTemperature', description: 'Температура колошникового газа, С' },
    { name: 'coloshGasPressure', description: 'Давление колошникового газа, ати' },
    // СОСТАВ КОЛОШНИКОВОГО ГАЗА
    { name: 'coloshGas_CO', description: 'CO в колошниковом газе, %' },
    { name: 'coloshGas_CO2', description: 'CO2 в колошниковом газе, %' },
    { name: 'coloshGas_H2', description: 'H2 в колошниковом газе, %' },
    // СОСТАВ ЧУГУНА
    { name: 'chugun_SI', description: 'Содержание Si в чугуне, %' },
    { name: 'chugun_MN', description: 'Содержание Mn в чугуне, %' },
    { name: 'chugun_P', description: 'Содержание P в чугуне, %' },
    { name: 'chugun_S', description: 'Содержание S в чугуне, %' },
    { name: 'chugun_C', description: 'Содержание C в чугуне, %' },
    // СОСТАВ КОКСА
    { name: 'ashContentInCoke', description: 'Содержание золы в коксе, %' },
    { name: 'volatileContentInCoke', description: 'Содержание летучих в коксе, %' },
    { name: 'sulfurContentInCoke', description: 'Содержание серы в коксе, %' },
    { name: 'specificSlagYield', description: 'Удельный выход шлака (по данным тех. отчёта), кг/т чугуна' },
    { name: 'heatCapacityOfAgglomerate', description: 'Теплоёмкость агломерата, кДж/(кг * С)' },
    { name: 'heatCapacityOfPellets', description: 'Теплоёмкость окатышей, кДж/(кг * С)' },
    { name: 'heatCapacityOfCoke', description: 'Теплоёмкость кокса, кДж/(кг * С)' },
    { name: 'acceptedTemperatureOfBackupZone', description: 'Принятое значение температуры "резервной зоны", С' },
    { name: 'proportionOfHeatLossesOfLowerPart', description: 'Доля тепловых потерь через нижнюю часть печи, доли ед.' },
    { name: 'averageSizeOfPieceCharge', description: 'Средний размер куска шихты, м' },
    { name: 'heatOfBurningOfNaturalGasOnFarms', description: 'Теплота горения природного газа на фурмах, кДж/м3' },
    { name: 'heatOfIncompleteBurningCarbonOfCoke', description: 'Теплота неполного горения углерода кокса, кДж/кг' },
    { name: 'temperatureOfCokeThatCameToTuyeres', description: 'Температура кокса, пришедшего к фурмам, °C' }
]

export const RESULT_FIELDS =
[
    { name: 'averageSectionalAreaOfFurnaceShaft', description: 'Средняя площадь сечения шахты печи, м2' },
    { name: 'gasFiltrationFurnaceShaftSpeed', description: 'Скорость фильтрации газа через шахту печи, м/с' },
    { name: 'heatCapacityOfDiatomicGasesAtBlastTemperature', description: 'Теплоемкость двуатомных газов при температуре дутья, кДж/(м3*С)' },
    { name: 'heatCapacityOfWaterVaporAtBlastTemperature', description: 'Теплоемкость паров воды при температуре дутья, кДж/(м3*С)' },
    { name: 'degreeOfDirectRecovery', description: 'Степень прямого восстановления, доли ед.' },
    { name: 'amountOfCokeCarbonCameIntoFurnace', description: 'Количество пришедшего в печь углерода кокса, кг/т чугуна' },
    { name: 'carbonConsumptionForIronReduction', description: 'Расход углерода на прямое восстановление железа, кг/т чугуна' },
    { name: 'carbonСonsumptionForCastChugunReduction', description: 'Расход углерода на восстановление примесей чугуна, кг/т чугуна' },
    { name: 'carbonConsumptionForMethaneFormation', description: 'Расход углерода на образование метана, кг/т чугуна' },
    { name: 'amountOfCarbonOfCokeBurningAtTuyeres', description: 'Количество углерода кокса, сгорающего у фурм (Сф), кг/т чугуна' },
    { name: 'consumptionOfNaturalGasPerOneKgOfCarbonOfCoke', description: 'Расход природного газа на 1 кг углерода кокса, сгорающего у фурм, м3/кг*Сф' },
    { name: 'consumptionOfNaturalGasPerOneKgOfOfCoke', description: 'Расход дутья на сжигание 1 кг кокса, сгорающего у фурм, м3/кг*Сф' },
    { name: 'blastConsumptionForBurningOneMeterCoubOfNaturalGas', description: 'Расход дутья на сжигание 1 м3 природного газа, м3/м3' },
    { name: 'specificBlastConsumption', description: 'Удельный расход дутья, м3/т чугуна' },
    { name: 'amountOfGorenjeGasesDuringCombustionOneKgOfCarbonCoke', description: 'Количество горновых газов при горении 1 кг углерода кокса, сгорающего у фурм, м3/кг Сф' },
    { name: 'numberOfFurnaceGasesAtConversionOfOneMeterCoubOfGas', description: 'Количество горновых газов при конверсии 1 м3 газа, м3/м3' },
    { name: 'furnaceGasOutput', description: 'Выход горнового газа, м3/т чугуна' },
    { name: 'amountOfHeatFromGorenjeCoke', description: 'Количество тепла от горения кокса, кДж/кг чугуна' },
    { name: 'heatOfHeatedBlast', description: 'Тепло нагретого дутья, кДж/кг чугуна' },
    { name: 'heatOfNaturalGasConversion', description: 'Тепло конверсии природного газаа, кДж/кг чугуна' },
    { name: 'heatCapacityOfGasAtTemperatureOfReserveZone', description: 'Теплоемкость газа при температуре "резервной зоны", кДж/(м3*С)' },
    { name: 'usefulArrivalOfHeatInLowerZoneOfTheFurnace', description: '"Полезный" приход тепла в нижнюю зону печи, кДж/т чугуна' },
    { name: 'amountOfHeatEnteringLlowerZoneOfFurnaceWithCharge', description: 'Количество тепла, поступающего в нижнюю зону печи с шихтой при температуре "резервной зоны", кДж/т чугуна' },
    { name: 'heatCostsForDirectIronRecovery', description: 'Затраты тепла на прямое восстановление железа, кДж/т чугуна' },
    { name: 'heatLossesToEnvironmentThrough', description: 'Тепловые потери в окружающюю среду через фурменный пояс, распар и заплечики, кДж/т чугуна' },
    { name: 'calculatedGeneralizingParameter', description: 'Расчетный обобщающий параметр (Qp), [-]' },
    { name: 'optimalHeatConsumptionForSmeltingOneTonOfCastIron', description: 'Оптимальные затраты тепла на выплавку 1 тонны чугуна, кДж/т чугуна' },
    { name: 'indexOfTheBottomOfTheFurnace', description: 'Индекс низа' },
    { name: 'valueOfHeatLossesInLowerZoneOfFurnace', description: 'Значение доли тепловых потерь в нижней зоне печи при условии i=1,0' },
    { name: 'trueHeatCapacityOfGrateGas', description: 'Истинная теплоемкость колошникового газа, кДж/(м3*С)' },
    { name: 'thermalConductivityOfGrateGas', description: 'Теплопроводность колошникового газа, Вт/(м*С)' },
    { name: 'kinematicViscosityOfGrateGas', description: 'Кинематическая вязкость колошникового газа, м2/с' },
    { name: 'volumetricHeatTransferCoefficient', description: 'Объемный коэффициент теплообмена, кВт/(м3*°С)' },
    { name: 'chargeFlowRatePassingThroughFurnaceShaft', description: 'Расход шихты, проходящий через шахту печи, кг/с' },
    { name: 'averageHeatCapacityOfCharge', description: 'Средняя теплоемкость шихты, кДж/(кг*°С)' },
    // { name: 'intermediateNumerator', description: 'Промежуточные расчетные данные (числитель)' },
    // { name: 'intermediateDenominator', description: 'Промежуточные расчетные данные (знаменатель)' },
    // { name: 'intermediateRatio', description: 'Промежуточные расчетные данные (отношение)' },
    // { name: 'intermediateExhibitor', description: 'Промежуточные расчетные данные (экспонента)' },
    { name: 'indexOfTheFurnaceTop', description: 'Индекс верха печи' },
    { name: 'blastConsumptionRequiredForBurningOneKgOfCarbonCoke', description: 'Расход дутья, необходимый для сжигания 1 кг углерода кокса, м3/кг' },
    { name: 'blastConsumptionForConversionOfOneMeterCoubOfNaturalGas', description: 'Расход дутья, необходимый для конверсии 1 м3 природного газа, м3/м3' },
    { name: 'outputOfTheTuyereGasBurningAtTheTuyeres', description: 'Выход фурменного газа в расчёте на 1 кг углерода кокса, сгорающего у фурм, м3/кг' },
    { name: 'outputOfTuyereGasOfNaturalGasDuringСonversion', description: 'Выход фурменного газа из 1 м3 природного газа при его конверсии в фурменном очаге, м3/м3' },
    { name: 'heatCapacityOfDiatomicGasesAtHotBlastTemperature', description: 'Теплоёмкость двухатомных газов при температуре горячего дутья, кДж/(м3 * К)' },
    { name: 'heatCapacityOfWaterVaporAtHotBlastTemperature', description: 'Теплоёмкость паров воды при температуре горячего дутья, кДж/(м3 * К)' },
    { name: 'heatContentOfHotBlast', description: 'Теплосодержание горячего дутья за вычетом теплоты разложения влаги дутья, кДж/м3' },
    { name: 'heatContentOfCarbonOfCokeToTuyeres', description: 'Теплосодержание углерода кокса пришедшего к фурмам, кДж/кг' },
    { name: 'naturalGasConsumptionPerOneKgOfCoke', description: 'Расход природного газа в расчете на 1 кг кокса, приходящего к фурмам, м3/кг' },
    { name: 'heatContentOfFurnaceGases', description: 'Теплосодержание горновых газов, кДж/м3' },
    { name: 'theoreticalBurningTemperatureOfCarbonCoke', description: 'Теоретическая температура горения углерода кокса, °С' },
    { name: 'resultDate', description: 'Дата проведения расчёта' }
]

export const REFERENCE_FIELDS =
[
    { name: 'ironMassFractionIncreaseInOreRash', description: 'Увеличение массовой доли железа в рудной сыпи на 1 %' },
    { name: 'shareCrudeOreReductionCharge', description: 'Снижение доли сырой руды в шихте на 1 %' },
    { name: 'temperatureIncreaseInRangeOf800to900', description: 'Повышение температуры дутья на 10 градусов в пределах 800 - 900 ºC' },
    { name: 'temperatureIncreaseInRangeOf901to1000', description: 'Повышение температуры дутья на 10 градусов в пределах 901 - 1000 ºC' },
    { name: 'temperatureIncreaseInRangeOf1001to1100', description: 'Повышение температуры дутья на 10 градусов в пределах 1001 - 1100 ºC' },
    { name: 'temperatureIncreaseInRangeOf1101to1200', description: 'Повышение температуры дутья на 10 градусов в пределах 1101 - 1200 ºC' },
    { name: 'increaseGasPressureUnderGrate', description: 'Повышение давления газа под колошником на 0,1 кг/см2 (0,01 Мпа)' },
    { name: 'reductionMassFractionOfSiliciumInChugun', description: 'Снижение массовой доли кремния в чугуне на 0,1 %' },
    { name: 'reductionMassFractionOfSeraInChugun', description: 'Снижение массовой доли серы в чугуне на 0,1 %' },
    { name: 'increaseMassFractionOfPhosphorusInChugun', description: 'Увеличение массовой доли фосфора в чугуне на 0,1 %' },
    { name: 'increaseMassFractionOfManganeseInChugun', description: 'Увеличение массовой доли марганца в чугуне на 0,1 %' },
    //{ name: 'increaseMassFractionOfTitanInChugun', description: 'Увеличение массовой доли титана в чугуне на 0,1 % (???)' },
    { name: 'increaseBlastHumidity', description: 'Увеличение влажности дутья на 1 г/м3 (без увеличения температуры дутья)' },
    { name: 'increaseNaturalGasCunsimption', description: 'Увеличение расхода природного газа на 1 м3/т' },
    { name: 'outputFromLimestoneCharge', description: 'Вывод из шихты 10 кг/т известняка' },
    { name: 'increaseVolumeFractionOxygenInBlast', description: 'Увеличение объемной доли кислорода в дутье на 1 %' },
    { name: 'reductionMassFractionTrifles', description: 'Снижение массовой доли мелочи (фракции 0-5 мм) в рудной сыпи на 1 %' },
    { name: 'reductionMassFractionAshInCokeInRangeOf11to12Percent', description: 'Уменьшение массовой доли золы в коксе в пределах 11 - 12 %' },
    { name: 'reductionMassFractionAshInCokeInRangeOf12to13Percent', description: 'Уменьшение массовой доли золы в коксе в пределах 12 - 13 %' },
    { name: 'reductionMassFractionOfSera', description: 'Уменьшение массовой доли серы в коксе на 0,1 %' }
]

export const PROJECT_FIELDS =
[
    { name: 'blastTemperature', description: 'Температура дутья, ºC' },
    { name: 'blastHumidity', description: 'Влажность дутья, г/м3' },
    { name: 'oxygenContentInBlast', description: 'Содержание кислорода в дутье, %' },
    { name: 'naturalGasConsumption', description: 'Расход природного газа, м3/т чугуна' },
    { name: 'coloshGasPressure', description: 'Давление колошникового газа, ати' },
    { name: 'chugun_SI', description: 'Содержание Si в чугуне, %' },
    { name: 'chugun_MN', description: 'Содержание Mn в чугуне, %' },
    { name: 'chugun_P', description: 'Содержание P в чугуне, %' },
    { name: 'chugun_S', description: 'Содержание S в чугуне, %' },
    // { name: 'chugun_C', description: 'Содержание C в чугуне, %' },
    { name: 'ashContentInCoke', description: 'Содержание золы в коксе, %' },
    { name: 'sulfurContentInCoke', description: 'Содержание серы в коксе, %' },
    { name: 'specificConsumptionOfZRM', description: 'Удельный расход ЖРМ, кг/т чугуна' },
]

export const MATERIAL_FIELDS = [
    { name: 'name', description: 'Материал' },
    { name: 'moisture', description: 'Влага, %' },
    { name: 'fe2O3', description: 'Fe2O3, %' },
    { name: 'fe', description: 'Fe, %' },
    { name: 'feO', description: 'FeO, %' },
    { name: 'caO', description: 'CaO, %' },
    { name: 'siO2', description: 'SiO2, %' },
    { name: 'mgO', description: 'MgO, %' },
    { name: 'al2O3', description: 'Al2O3, %' },
    { name: 'tiO2', description: 'TiO2, %' },
    { name: 'mnO', description: 'MnO, %' },
    { name: 'p', description: 'P, %' },
    { name: 's', description: 'S, %' },
    { name: 'zn', description: 'Zn, %' },
    { name: 'mn', description: 'Mn, %' },
    { name: 'cr', description: 'Cr, %' },
    { name: 'fiveZero', description: '5-0мм, %' },
    { name: 'baseOne', description: 'Осн1, %' }
]