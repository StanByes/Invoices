import {ReductionType} from "@models/Enums";

export const calculateTotal = (total: number, reduction?: number, reductionType?: ReductionType)=> {
    if (reduction) {
        if (reductionType == "PERCENTAGE") {
            total *= (1 - (reduction / 100));
        } else {
            total -= reduction;
        }
    }

    return total;
}
