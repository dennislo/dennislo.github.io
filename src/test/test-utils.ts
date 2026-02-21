export function mockDate(hours: number, minutes: number) {
  const mockDateInstance = {
    getHours: () => hours,
    getMinutes: () => minutes,
  };
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDateInstance as unknown as Date);
}
