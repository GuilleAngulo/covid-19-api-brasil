
describe('update service', () => {


    test.skip('should reverse the date formar', () => {
        const { reverseDate } = require('../../src/app/utils/date');

        expect(reverseDate('04/08/2020')).toBe('2020/08/04');
        expect(reverseDate('14/12/2020')).toBe('2020/12/14');
    });

    test.skip('should format a date object to csv date format', () => {
        const { formatDate } = require('../../src/app/utils/date');

        expect(formatDate(new Date(2020,0,1))).toBe('01/01/2020');
        expect(formatDate(new Date(2020,11,25))).toBe('25/12/2020');
    });

    test.skip('should create a date object from a text paramater', () => {
        const { matchDateInText } = require('../../src/app/utils/date');
        const text = 'Última atualização 17:30 08/04/2020';
        const date = new Date(2020, 3, 8, 17, 30);
        expect(matchDateInText(text)).toStrictEqual(date);
    });
});