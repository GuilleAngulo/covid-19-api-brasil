const State = require('../models/State');

module.exports = {
    "UF": ["AC", "AL", "AP" ,"AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", 
            "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"],
    "REGION": ["norte","nordeste", "sudeste", "centro-oeste", "sul"],

    totalPopulation() {
        State.aggregate(
            [
                { 
                    $group: {
                        _id: null, 
                        population:  { $sum: "$population" },
                    }   
                }
        ],
        (error, result) => {
            if (error) return;
            return result[0].population;
        });

    }
}