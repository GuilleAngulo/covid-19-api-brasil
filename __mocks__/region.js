module.exports = {
    regionMock: {
        name: 'norte',
        description: 'Região Norte',
        states: [],
    },

    regionMock1: {
        name: 'norte',
        description: 'Região Norte',
        states: [
            { 
                name: 'State 1',
                code: 'SP',
                population: 999999,
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