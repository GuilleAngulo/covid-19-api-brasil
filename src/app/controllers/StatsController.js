const State = require('../models/State');

module.exports = {
    total(req, res) {
            State.aggregate(
                [
                    { 
                        $group: {
                            _id: null, 
                            confirmed:  { $sum: "$confirmed" },
                            deaths:   { $sum: "$deaths" },
                            officialUpdated:  { $first: "$officialUpdated" },
                        }   
                    }
                ],
                (error, result) => {
                    if (error) return res.status(400).send({ error: 'Error retrieving stats' });
                    result[0]._id = undefined;
                    return res.status(200).send( result[0] );
                }
            );
    },

}