module.exports = {
    stateMock1: {
        "name": "State 1",
        "code": "SP",
        "population": 99999999,
        "region": "5e7699d89575540a5828ab09",
    },

    stateMock2: {
        name: 'sul',
        description: 'Região Sul',
        states: [
            { 
                name: 'State 2',
                code: 'S2',
                population: 999999,
            },
        ],
    },

    stateUpdateMock: {
        name: 'norte',
        description: 'Região Norte Updated',
        states: [
            { 
                name: 'State 1 Updated',
                code: 'S1',
                population: 999999,
            },
        ],
    }
}