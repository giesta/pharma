import parseDate from "../services/parseDate.service";

describe('Addition', () => {
    it('knows that 2 and 2 make 4', () => {
      expect(2 + 2).toBe(4);
    });
  });

  

  test('get date format', ()=>{
    var d = "2021-04-11T07:08:46.000000Z";
    const formatDate = parseDate.getParsedDate(d);

    expect(formatDate).toBe('2021-04-11 10:08');
  });