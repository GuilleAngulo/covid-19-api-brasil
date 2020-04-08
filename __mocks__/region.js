module.exports = {
    regionMock: {
        name: 'norte',
        description: 'Região Norte',
        states: [],
    },

    regionStatesMock: {
        name: 'norte',
        description: 'Região Norte',
        states: [
            { 
                name: 'State 1',
                code: 'SP',
                population: 1000,
                confirmed: 20,
                deaths: 10,
            },
            { 
                name: 'State 2',
                code: 'RJ',
                population: 900,
                confirmed: 10,
                deaths: 5,
            },

        ],
    },

    regionMock1: {
        name: 'norte',
        description: 'Região Norte',
        states: [
            { 
                name: 'State 1',
                code: 'SP',
                population: 999999,
                confirmed: 10,
            },
        ],
    },

    regionMock2: {
        name: 'sul',
        description: 'Região Sul',
        states: [
            { 
                name: 'State 2',
                code: 'RJ',
                population: 999999,
            },
        ],
    },

    regionUpdateMock: {
        name: 'norte',
        description: 'Região Norte Updated',
        states: [
            { 
                name: 'State 1 Updated',
                code: 'SP',
                population: 999999,
            },
        ],
    }
}